import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent store files
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const RSVP_FILE = path.join(DATA_DIR, 'rsvp.json');

// Empty initial data
const DEFAULT_WISHES: unknown[] = [];
const DEFAULT_RSVPS: unknown[] = [];

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if not present
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(DEFAULT_WISHES, null, 2), 'utf-8');
}
if (!fs.existsSync(RSVP_FILE)) {
  fs.writeFileSync(RSVP_FILE, JSON.stringify(DEFAULT_RSVPS, null, 2), 'utf-8');
}

function loadMessages() {
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading messages file:', err);
    return DEFAULT_WISHES;
  }
}

function saveMessages(messages: unknown[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing messages file:', err);
  }
}

interface RSVPRecord {
  id: string;
  name: string;
  status: 'attending' | 'declined';
  submittedAt: string;
}

function loadRSVPs(): RSVPRecord[] {
  try {
    const raw = fs.readFileSync(RSVP_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading rsvp file:', err);
    return [];
  }
}

function saveRSVPs(rsvps: RSVPRecord[]) {
  try {
    fs.writeFileSync(RSVP_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing rsvp file:', err);
  }
}

// SSE Clients for Real-time push notifications
interface SSEClient {
  id: number;
  type: 'messages' | 'rsvp';
  res: Response;
}

let clients: SSEClient[] = [];

function broadcastMessage(newMsg: unknown) {
  const payload = `data: ${JSON.stringify(newMsg)}\n\n`;
  clients
    .filter((c) => c.type === 'messages')
    .forEach((client) => {
      try {
        client.res.write(payload);
      } catch {
        // client disconnected
      }
    });
}

function broadcastRSVP(data: unknown) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients
    .filter((c) => c.type === 'rsvp')
    .forEach((client) => {
      try {
        client.res.write(payload);
      } catch {
        // client disconnected
      }
    });
}

// API Routes for Guestbook
app.get('/api/messages', (_req: Request, res: Response) => {
  const msgs = loadMessages();
  res.json(msgs);
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { author, relation, message, sparkleEmoji } = req.body;
  if (!author || !message) {
    return res.status(400).json({ error: 'Author and message are required' });
  }

  const newWish = {
    id: `wish-${Date.now()}`,
    author: String(author).trim(),
    relation: String(relation || 'Royal Guest').trim(),
    message: String(message).trim(),
    sparkleEmoji: sparkleEmoji || '✨',
    timestamp: 'Just now',
    createdAt: new Date().toISOString(),
  };

  const msgs = loadMessages();
  const updated = [newWish, ...msgs];
  saveMessages(updated);

  // Broadcast to all connected clients
  broadcastMessage(newWish);

  res.status(201).json(newWish);
});

// Server-Sent Events (SSE) endpoint for Messages
app.get('/api/messages/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const clientId = Date.now();
  const newClient: SSEClient = { id: clientId, type: 'messages', res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter((c) => c.id !== clientId);
  });
});

// Credentials for RSVP Admin
const ADMIN_USER = 'Zia';
const ADMIN_PASS = 'Zia@07';

function verifyAdmin(req: Request): boolean {
  const user = req.headers['x-admin-username'];
  const pass = req.headers['x-admin-password'];
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

// RSVP Public Endpoints
app.post('/api/rsvp', (req: Request, res: Response) => {
  const { name, status } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (status !== 'attending' && status !== 'declined') {
    return res.status(400).json({ error: 'Status must be either attending or declined' });
  }

  const trimmedName = name.trim();
  const rsvps = loadRSVPs();

  // Check if name already exists (case-insensitive update or new entry)
  const existingIndex = rsvps.findIndex(
    (r) => r.name.toLowerCase() === trimmedName.toLowerCase()
  );

  let newOrUpdatedRecord: RSVPRecord;
  if (existingIndex >= 0) {
    newOrUpdatedRecord = {
      ...rsvps[existingIndex],
      name: trimmedName,
      status,
      submittedAt: new Date().toISOString(),
    };
    rsvps[existingIndex] = newOrUpdatedRecord;
  } else {
    newOrUpdatedRecord = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      status,
      submittedAt: new Date().toISOString(),
    };
    rsvps.unshift(newOrUpdatedRecord);
  }

  saveRSVPs(rsvps);

  // Broadcast real-time update to RSVP dashboard
  broadcastRSVP({
    type: 'UPDATE',
    record: newOrUpdatedRecord,
    list: rsvps,
    summary: {
      total: rsvps.length,
      attending: rsvps.filter((r) => r.status === 'attending').length,
      declined: rsvps.filter((r) => r.status === 'declined').length,
    },
  });

  res.status(200).json({ success: true, record: newOrUpdatedRecord });
});

// RSVP Admin Auth Verification
app.post('/api/rsvp/auth', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// RSVP Admin List & Summary (Protected)
app.get('/api/rsvp/admin', (req: Request, res: Response) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const rsvps = loadRSVPs();
  res.json({
    list: rsvps,
    summary: {
      total: rsvps.length,
      attending: rsvps.filter((r) => r.status === 'attending').length,
      declined: rsvps.filter((r) => r.status === 'declined').length,
    },
  });
});

// RSVP Admin Delete Entry (Protected)
app.delete('/api/rsvp/admin/:id', (req: Request, res: Response) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const rsvps = loadRSVPs();
  const updated = rsvps.filter((r) => r.id !== id);
  saveRSVPs(updated);

  broadcastRSVP({
    type: 'DELETE',
    deletedId: id,
    list: updated,
    summary: {
      total: updated.length,
      attending: updated.filter((r) => r.status === 'attending').length,
      declined: updated.filter((r) => r.status === 'declined').length,
    },
  });

  res.json({ success: true });
});

// Server-Sent Events (SSE) endpoint for RSVP Dashboard
app.get('/api/rsvp/events', (req: Request, res: Response) => {
  const user = req.query.username;
  const pass = req.query.password;
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(401).end();
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const clientId = Date.now();
  const newClient: SSEClient = { id: clientId, type: 'rsvp', res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter((c) => c.id !== clientId);
  });
});


async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

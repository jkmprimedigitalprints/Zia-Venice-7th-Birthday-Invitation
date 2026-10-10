import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getStoredRSVPs,
  saveRSVPRecord,
  deleteRSVPRecord,
  getStoredMessages,
  saveMessageRecord,
  getDatabaseStatus,
  RSVPRecord,
  GuestWishRecord,
} from './api/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

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

// Credentials for RSVP Admin
const ADMIN_USER = process.env.ADMIN_USERNAME || 'Zia';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Zia@07';

function verifyAdmin(req: Request): boolean {
  const user = req.headers['x-admin-username'] as string | undefined;
  const pass = req.headers['x-admin-password'] as string | undefined;
  const isUser =
    typeof user === 'string' &&
    (user.trim() === ADMIN_USER || user.trim().toLowerCase() === ADMIN_USER.toLowerCase());
  const isPass = pass === ADMIN_PASS;
  return Boolean(isUser && isPass);
}

// API Routes for Guestbook
app.get('/api/messages', async (_req: Request, res: Response) => {
  try {
    const msgs = await getStoredMessages();
    res.json(msgs);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching messages';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/messages', async (req: Request, res: Response) => {
  const { author, relation, message, sparkleEmoji } = req.body;
  if (!author || !message) {
    return res.status(400).json({ error: 'Author and message are required' });
  }

  const newWish: GuestWishRecord = {
    id: `wish-${Date.now()}`,
    author: String(author).trim(),
    relation: String(relation || 'Royal Guest').trim(),
    message: String(message).trim(),
    sparkleEmoji: sparkleEmoji || '✨',
    timestamp: 'Just now',
    createdAt: new Date().toISOString(),
  };

  try {
    const saved = await saveMessageRecord(newWish);
    broadcastMessage(saved);
    res.status(201).json(saved);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error saving message';
    res.status(500).json({ error: msg });
  }
});

// SSE endpoint for Messages
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

// RSVP Public Endpoints
app.get('/api/rsvp', async (_req: Request, res: Response) => {
  try {
    const list = await getStoredRSVPs();
    const summary = {
      total: list.length,
      attending: list.filter((r) => r.status === 'attending').length,
      declined: list.filter((r) => r.status === 'declined').length,
    };
    res.json({ list, summary });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching RSVPs';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/rsvp', async (req: Request, res: Response) => {
  const { name, status } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Guest name is required.' });
  }
  if (status !== 'attending' && status !== 'declined') {
    return res.status(400).json({ error: 'Status must be either attending or declined.' });
  }

  try {
    const record: RSVPRecord = await saveRSVPRecord({
      name: name.trim(),
      status,
    });

    const currentList = await getStoredRSVPs();

    broadcastRSVP({
      type: 'UPDATE',
      record,
      list: currentList,
      summary: {
        total: currentList.length,
        attending: currentList.filter((r) => r.status === 'attending').length,
        declined: currentList.filter((r) => r.status === 'declined').length,
      },
    });

    res.status(200).json({ success: true, record });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error saving RSVP';
    res.status(500).json({ error: msg });
  }
});

// RSVP Admin Auth Verification
app.post('/api/rsvp/auth', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const isUser =
    typeof username === 'string' &&
    (username.trim() === ADMIN_USER || username.trim().toLowerCase() === ADMIN_USER.toLowerCase());
  const isPass = typeof password === 'string' && password.trim() === ADMIN_PASS;
  if (isUser && isPass) {
    res.json({ success: true, user: ADMIN_USER });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// RSVP Admin List & Summary (Protected)
app.get('/api/rsvp/admin', async (req: Request, res: Response) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  try {
    const rsvps = await getStoredRSVPs();
    res.json({
      list: rsvps,
      summary: {
        total: rsvps.length,
        attending: rsvps.filter((r) => r.status === 'attending').length,
        declined: rsvps.filter((r) => r.status === 'declined').length,
      },
      dbStatus: getDatabaseStatus(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error reading admin RSVPs';
    res.status(500).json({ error: msg });
  }
});

// RSVP Admin Delete Entry (Protected)
app.delete('/api/rsvp/admin/:id?', async (req: Request, res: Response) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  const id = req.params.id || (req.query.id as string);
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await deleteRSVPRecord(id);
    const updated = await getStoredRSVPs();

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

    res.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting RSVP';
    res.status(500).json({ error: msg });
  }
});

// SSE endpoint for RSVP Dashboard
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

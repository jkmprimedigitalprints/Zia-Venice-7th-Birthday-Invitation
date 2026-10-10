import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent message store file
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Empty initial messages as requested
const DEFAULT_WISHES: unknown[] = [];

// Ensure data folder and messages.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize messages.json if not present
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(DEFAULT_WISHES, null, 2), 'utf-8');
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

// SSE Clients for Real-time push notifications
interface SSEClient {
  id: number;
  res: Response;
}

let clients: SSEClient[] = [];

function broadcastMessage(newMsg: unknown) {
  const payload = `data: ${JSON.stringify(newMsg)}\n\n`;
  clients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// API Routes
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

// Server-Sent Events (SSE) endpoint
app.get('/api/messages/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const clientId = Date.now();
  const newClient: SSEClient = { id: clientId, res };
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

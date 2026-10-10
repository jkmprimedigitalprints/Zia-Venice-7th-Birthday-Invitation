import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

// File path in /tmp for serverless persistence on Vercel
const TMP_FILE = path.join('/tmp', 'zia_messages.json');

interface Wish {
  id: string;
  author: string;
  relation: string;
  message: string;
  sparkleEmoji: string;
  timestamp: string;
  createdAt: string;
}

let inMemoryMessages: Wish[] = [];

function getStoredMessages(): Wish[] {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // fallback to in-memory
  }
  return inMemoryMessages;
}

function saveStoredMessages(msgs: Wish[]) {
  inMemoryMessages = msgs;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(msgs), 'utf-8');
  } catch {
    // ignore
  }
}

export default async function handler(req: IncomingMessage & { body?: unknown; method?: string }, res: ServerResponse) {
  // Set CORS and JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    const msgs = getStoredMessages();
    res.statusCode = 200;
    res.end(JSON.stringify(msgs));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    try {
      const parsed = JSON.parse(body || '{}');
      if (!parsed.author || !parsed.message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Author and message are required' }));
        return;
      }

      const newWish: Wish = {
        id: `wish-${Date.now()}`,
        author: String(parsed.author).trim(),
        relation: String(parsed.relation || 'Royal Guest').trim(),
        message: String(parsed.message).trim(),
        sparkleEmoji: parsed.sparkleEmoji || '✨',
        timestamp: 'Just now',
        createdAt: new Date().toISOString(),
      };

      const msgs = getStoredMessages();
      const updated = [newWish, ...msgs];
      saveStoredMessages(updated);

      res.statusCode = 201;
      res.end(JSON.stringify(newWish));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

import type { IncomingMessage, ServerResponse } from 'http';
import { getStoredMessages, saveMessageRecord, GuestWishRecord } from './db';

export default async function handler(
  req: IncomingMessage & { body?: unknown; method?: string },
  res: ServerResponse
) {
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
    try {
      const msgs = await getStoredMessages();
      res.statusCode = 200;
      res.end(JSON.stringify(msgs));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve messages';
      console.error('[API/messages] GET Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: msg }));
    }
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

      const newWish: GuestWishRecord = {
        id: parsed.id || `wish-${Date.now()}`,
        author: String(parsed.author).trim().substring(0, 100),
        relation: String(parsed.relation || 'Royal Guest').trim().substring(0, 50),
        message: String(parsed.message).trim().substring(0, 500),
        sparkleEmoji: parsed.sparkleEmoji || '✨',
        timestamp: parsed.timestamp || 'Just now',
        createdAt: new Date().toISOString(),
      };

      const saved = await saveMessageRecord(newWish);
      res.statusCode = 201;
      res.end(JSON.stringify(saved));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save message';
      console.error('[API/messages] POST Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: msg }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

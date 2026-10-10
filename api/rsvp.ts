import type { IncomingMessage, ServerResponse } from 'http';
import { getStoredRSVPs, saveRSVPRecord, RSVPRecord } from './db';

export default async function handler(
  req: IncomingMessage & { body?: unknown; method?: string },
  res: ServerResponse
) {
  // CORS & Response Headers
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
      const list = await getStoredRSVPs();
      const summary = {
        total: list.length,
        attending: list.filter((r) => r.status === 'attending').length,
        declined: list.filter((r) => r.status === 'declined').length,
      };
      res.statusCode = 200;
      res.end(JSON.stringify({ list, summary }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve RSVPs';
      console.error('[API/rsvp] GET Error:', msg);
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
      const { name, status } = parsed;

      // 1. Validation
      if (!name || typeof name !== 'string' || !name.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Guest name is required.' }));
        return;
      }

      if (name.trim().length > 100) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Name cannot exceed 100 characters.' }));
        return;
      }

      if (status !== 'attending' && status !== 'declined') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Attendance status must be either attending or declined.' }));
        return;
      }

      // 2. Persist to Production Database
      const savedRecord: RSVPRecord = await saveRSVPRecord({
        name: name.trim(),
        status,
      });

      console.log(`[API/rsvp] Successfully persisted RSVP for: ${savedRecord.name} (${savedRecord.status})`);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, record: savedRecord }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error processing RSVP submission';
      console.error('[API/rsvp] POST Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: msg }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

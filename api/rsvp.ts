import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

const TMP_RSVP_FILE = path.join('/tmp', 'zia_rsvps.json');

interface RSVPRecord {
  id: string;
  name: string;
  status: 'attending' | 'declined';
  submittedAt: string;
}

let inMemoryRSVPs: RSVPRecord[] = [];

function getStoredRSVPs(): RSVPRecord[] {
  try {
    if (fs.existsSync(TMP_RSVP_FILE)) {
      const data = fs.readFileSync(TMP_RSVP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return inMemoryRSVPs;
}

function saveStoredRSVPs(list: RSVPRecord[]) {
  inMemoryRSVPs = list;
  try {
    fs.writeFileSync(TMP_RSVP_FILE, JSON.stringify(list), 'utf-8');
  } catch {
    // ignore
  }
}

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
    const list = getStoredRSVPs();
    res.statusCode = 200;
    res.end(JSON.stringify({ list }));
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

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Name is required' }));
        return;
      }

      if (status !== 'attending' && status !== 'declined') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Status must be either attending or declined' }));
        return;
      }

      const trimmedName = name.trim();
      const rsvps = getStoredRSVPs();

      const existingIndex = rsvps.findIndex(
        (r) => r.name.toLowerCase() === trimmedName.toLowerCase()
      );

      let record: RSVPRecord;
      if (existingIndex >= 0) {
        record = {
          ...rsvps[existingIndex],
          name: trimmedName,
          status,
          submittedAt: new Date().toISOString(),
        };
        rsvps[existingIndex] = record;
      } else {
        record = {
          id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: trimmedName,
          status,
          submittedAt: new Date().toISOString(),
        };
        rsvps.unshift(record);
      }

      saveStoredRSVPs(rsvps);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, record }));
      return;
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

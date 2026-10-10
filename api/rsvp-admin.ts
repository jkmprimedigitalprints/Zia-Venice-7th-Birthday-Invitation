import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

const TMP_RSVP_FILE = path.join('/tmp', 'zia_rsvps.json');
const ADMIN_USER = 'Zia';
const ADMIN_PASS = 'Zia@07';

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

function isAuthorized(req: IncomingMessage): boolean {
  const userHeader = req.headers['x-admin-username'] as string | undefined;
  const passHeader = req.headers['x-admin-password'] as string | undefined;

  const validUser =
    userHeader &&
    (userHeader.trim() === ADMIN_USER || userHeader.trim().toLowerCase() === ADMIN_USER.toLowerCase());
  const validPass = passHeader && passHeader.trim() === ADMIN_PASS;

  if (validUser && validPass) {
    return true;
  }

  // Also support query param fallback (?username=Zia&password=Zia@07)
  try {
    const urlObj = new URL(req.url || '', 'http://localhost');
    const u = urlObj.searchParams.get('username');
    const p = urlObj.searchParams.get('password');
    if (
      u &&
      (u.trim() === ADMIN_USER || u.trim().toLowerCase() === ADMIN_USER.toLowerCase()) &&
      p &&
      p.trim() === ADMIN_PASS
    ) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

export default async function handler(
  req: IncomingMessage & { body?: unknown; method?: string },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-username, x-admin-password');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (!isAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized admin access' }));
    return;
  }

  const rsvps = getStoredRSVPs();

  if (req.method === 'GET') {
    const summary = {
      total: rsvps.length,
      attending: rsvps.filter((r) => r.status === 'attending').length,
      declined: rsvps.filter((r) => r.status === 'declined').length,
    };
    res.statusCode = 200;
    res.end(JSON.stringify({ list: rsvps, summary }));
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const urlObj = new URL(req.url || '', 'http://localhost');
      let idToDelete = urlObj.searchParams.get('id');

      // Also parse from url path if rewrites forwarded /api/rsvp-admin/id
      if (!idToDelete) {
        const parts = (req.url || '').split('?')[0].split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart !== 'rsvp-admin' && lastPart !== 'admin') {
          idToDelete = lastPart;
        }
      }

      if (!idToDelete) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing RSVP ID to delete' }));
        return;
      }

      const filtered = rsvps.filter((r) => r.id !== idToDelete);
      saveStoredRSVPs(filtered);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, deletedId: idToDelete }));
      return;
    } catch {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error deleting RSVP' }));
      return;
    }
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

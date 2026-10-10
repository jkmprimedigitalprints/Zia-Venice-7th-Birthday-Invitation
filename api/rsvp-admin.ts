import type { IncomingMessage, ServerResponse } from 'http';
import { getStoredRSVPs, deleteRSVPRecord, getDatabaseStatus } from './db';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'Zia';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Zia@07';

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
    console.warn('[API/rsvp-admin] Unauthorized access attempt rejected');
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid admin credentials.' }));
    return;
  }

  if (req.method === 'GET') {
    try {
      const rsvps = await getStoredRSVPs();
      const summary = {
        total: rsvps.length,
        attending: rsvps.filter((r) => r.status === 'attending').length,
        declined: rsvps.filter((r) => r.status === 'declined').length,
      };
      const dbStatus = getDatabaseStatus();

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          list: rsvps,
          summary,
          dbStatus,
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve admin RSVP data';
      console.error('[API/rsvp-admin] GET Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: msg }));
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const urlObj = new URL(req.url || '', 'http://localhost');
      let id = urlObj.searchParams.get('id');

      // Also check URL path if passed as /api/rsvp-admin/xyz
      if (!id) {
        const parts = (req.url || '').split('?')[0].split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart !== 'rsvp-admin' && lastPart !== 'admin') {
          id = lastPart;
        }
      }

      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'RSVP ID is required for deletion.' }));
        return;
      }

      await deleteRSVPRecord(id);
      console.log(`[API/rsvp-admin] Successfully deleted RSVP id: ${id}`);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, deletedId: id }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete RSVP';
      console.error('[API/rsvp-admin] DELETE Error:', msg);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: msg }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

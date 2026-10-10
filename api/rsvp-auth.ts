import type { IncomingMessage, ServerResponse } from 'http';

const ADMIN_USER = 'Zia';
const ADMIN_PASS = 'Zia@07';

export default async function handler(
  req: IncomingMessage & { body?: unknown; method?: string },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-username, x-admin-password');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    try {
      const parsed = JSON.parse(body || '{}');
      const { username, password } = parsed;

      const isUserValid =
        typeof username === 'string' &&
        (username.trim() === ADMIN_USER || username.trim().toLowerCase() === ADMIN_USER.toLowerCase());
      const isPassValid = typeof password === 'string' && password.trim() === ADMIN_PASS;

      if (isUserValid && isPassValid) {
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, user: ADMIN_USER }));
        return;
      }

      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Incorrect username or password' }));
      return;
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      return;
    }
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

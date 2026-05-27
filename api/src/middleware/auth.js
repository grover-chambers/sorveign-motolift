/**
 * JWT Auth Middleware
 * Verifies Bearer token via Supabase Auth.
 * Attaches `req.user` (from Supabase) and `req.rider` / `req.admin` if applicable.
 */
import { supabase } from '../services/supabase.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = header.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}

export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    // Check if user exists in admin_users table
    supabase.from('admin_users').select('*').eq('auth_id', req.user.id).single()
      .then(({ data, error }) => {
        if (error || !data) {
          return res.status(403).json({ error: 'Admin access required' });
        }
        req.admin = data;
        next();
      });
  });
}

export async function requireRider(req, res, next) {
  await requireAuth(req, res, () => {
    supabase.from('riders').select('*').eq('auth_id', req.user.id).single()
      .then(({ data, error }) => {
        if (error || !data) {
          return res.status(403).json({ error: 'Rider access required' });
        }
        req.rider = data;
        next();
      });
  });
}

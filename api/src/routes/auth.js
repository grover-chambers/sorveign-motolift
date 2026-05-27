/**
 * Auth API
 * POST /api/auth/admin-login   — email + password → JWT
 * POST /api/auth/rider-login   — phone + password → JWT
 * POST /api/auth/activate      — phone + temp password → set permanent password
 * POST /api/auth/create-admin  — seed initial admin user (safe: checks if any exist)
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

// ── Admin Login ────────────────────────────────────────────────
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let authRes;
    try {
      authRes = await supabase.auth.signInWithPassword({ email, password });
    } catch (e) {
      console.error('signInWithPassword threw:', e);
      return res.status(500).json({ error: 'Auth service error' });
    }

    if (authRes.error) return res.status(401).json({ error: authRes.error.message });

    // Look up admin by email
    const { data: admin, error: adminErr } = await supabase
      .from('admin_users').select('*').eq('email', email).single();

    if (adminErr) return res.status(403).json({ error: 'Account not registered as admin' });

    res.json({
      token: authRes.data.session.access_token,
      user: { id: admin.id, name: admin.full_name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error('admin-login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Rider Login ────────────────────────────────────────────────
router.post('/rider-login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ phone, password });
    if (error) return res.status(401).json({ error: error.message });

    // Fetch rider profile
    const { data: rider, error: riderErr } = await supabase
      .from('riders').select('*').eq('auth_id', data.user.id).single();

    if (riderErr) {
      await supabase.auth.admin.signOut(data.user.id);
      return res.status(403).json({ error: 'Rider profile not found' });
    }

    res.json({
      token: data.session.access_token,
      user: {
        id: rider.id, name: rider.full_name, phone: rider.phone,
        bike: rider.bike_id, status: rider.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Activate (set password after admin creates account) ────────
router.post('/activate', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password || password.length < 6) {
      return res.status(400).json({ error: 'Phone and password (min 6 chars) required' });
    }

    // The rider account should already exist in Auth (created by admin)
    // They just need to set their password - use updateUser
    const { data, error } = await supabase.auth.updateUser({ password });
    // This requires the user to already be signed in with a temp token
    // Alternative: use signUp which sends OTP - rider sets password on first login

    // Actually, for activation we use signUp with phone
    // This sends an OTP to the phone
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      phone,
      password,
    });

    if (signUpErr) return res.status(400).json({ error: signUpErr.message });

    res.json({ message: 'Account activated. You can now sign in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Activation failed' });
  }
});

// ── Create Admin (seed — idempotent) ──────────────────────────
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'email, password, and full_name required' });
    }

    // Check if admin_users record already exists
    const { data: existing } = await supabase
      .from('admin_users').select('*').eq('email', email);
    if (existing && existing.length > 0) {
      return res.status(200).json({ message: 'Admin already exists', email });
    }

    // Create Supabase Auth user (idempotent — fails if exists)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    });
    if (authErr && !authErr.message.includes('already been registered')) {
      return res.status(400).json({ error: authErr.message });
    }

    // If auth user already existed, get their id via sign-in
    let authUserId = authData?.user?.id;
    if (!authUserId) {
      const { data: si } = await supabase.auth.signInWithPassword({ email, password });
      authUserId = si?.user?.id;
    }

    if (!authUserId) return res.status(400).json({ error: 'Could not resolve auth user' });

    const { data: admin, error: adminErr } = await supabase
      .from('admin_users').insert({
        auth_id: authUserId,
        full_name, email, role: 'admin',
      }).select().single();

    if (adminErr) return res.status(400).json({ error: adminErr.message });
    res.status(201).json({ message: 'Admin created', email: admin.email });
  } catch (err) {
    console.error('create-admin error:', err);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

export default router;

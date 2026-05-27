/**
 * Riders API
 * GET    /api/riders           — list all (admin)
 * GET    /api/riders/:id       — single rider profile
 * PUT    /api/riders/:id       — update rider (admin)
 * GET    /api/riders/me        — current rider's own profile (rider)
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';
import { requireAdmin, requireRider } from '../middleware/auth.js';

const router = Router();

// ── Rider's own profile ───────────────────────────────────────
router.get('/me', requireRider, async (req, res) => {
  const { data, error } = await supabase
    .from('riders').select('*, rider_platforms(*)').eq('auth_id', req.user.id).single();
  if (error) return res.status(404).json({ error: 'Rider not found' });
  res.json(data);
});

// ── Admin: List all ───────────────────────────────────────────
router.get('/', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from('riders').select('*, bike:preferred_bike, rider_platforms(*)')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Admin: Get single ─────────────────────────────────────────
router.get('/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('riders').select('*, rider_platforms(*)').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Rider not found' });
  res.json(data);
});

// ── Admin: Update rider ───────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('riders').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;

/**
 * Repayments API
 * POST /api/repayments              — record a repayment (M-Pesa callback / admin)
 * GET  /api/repayments/:riderId     — repayment history for a rider
 * GET  /api/repayments/me/history   — current rider's history
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth, requireRider } from '../middleware/auth.js';

const router = Router();

// ── Record repayment ──────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rider_id, amount, method = 'mpesa', reference } = req.body;
    if (!rider_id || !amount) return res.status(400).json({ error: 'rider_id and amount required' });

    const { data, error } = await supabase.from('repayments').insert([
      { rider_id, amount, method, reference, status: 'completed', recorded_at: new Date().toISOString() }
    ]).select().single();

    if (error) return res.status(400).json({ error: error.message });

    // Increment days_paid + update balance
    await supabase.rpc('increment_days_paid', { p_rider_id: rider_id });

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record repayment' });
  }
});

// ── Rider's own history ───────────────────────────────────────
router.get('/me/history', requireRider, async (req, res) => {
  const { data, error } = await supabase
    .from('repayments').select('*').eq('rider_id', req.rider.id)
    .order('recorded_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Admin: History for a specific rider ───────────────────────
router.get('/:riderId', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('repayments').select('*').eq('rider_id', req.params.riderId)
    .order('recorded_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;

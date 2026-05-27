/**
 * Bikes API
 * GET /api/bikes       — list all bikes (public, for marketplace and apply form)
 * GET /api/bikes/:id   — single bike
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('bikes').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase.from('bikes').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Bike not found' });
  res.json(data);
});

export default router;

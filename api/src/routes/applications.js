/**
 * Applications API
 * POST /api/applications              — submit new application (public)
 * GET  /api/applications              — list all (admin)
 * GET  /api/applications/:id          — single application
 * PUT  /api/applications/:id/status   — approve / reject (admin)
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// ── Public: Submit application ─────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      full_name, phone, email, id_number,
      applicantType, applicant_type,
      unhcr_number, youth_affiliation, is_yvc_member,
      motorcycle_type, license_status, driving_experience,
      location, referral_code, selectedBike,
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({ error: 'full_name and phone are required' });
    }

    const appType = applicant_type || applicantType || 'refugee';

    const { data, error } = await supabase.from('applications').insert([{
      full_name, phone, email, id_number,
      applicant_type: appType,
      unhcr_number: appType === 'Refugee' ? unhcr_number : null,
      youth_affiliation: appType === 'Youth' ? youth_affiliation : null,
      is_yvc_member: appType === 'YVC' ? (is_yvc_member === 'yes' || is_yvc_member === true) : null,
      motorcycle_type: motorcycle_type || selectedBike || null,
      license_status: license_status || null,
      riding_experience: driving_experience,
      location,
      referral_code,
      preferred_bike: selectedBike,
      status: 'pending',
    }]).select().single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// ── Admin: List all ───────────────────────────────────────────
router.get('/', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from('applications').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Admin: Get single ─────────────────────────────────────────
router.get('/:id', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('applications').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Application not found' });
  res.json(data);
});

// ── Admin: Approve or Reject ──────────────────────────────────
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, tier, daily_rate, deposit, staff_notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
    }

    // Update application status
    const { data: app, error: appErr } = await supabase
      .from('applications').update({ status, staff_notes })
      .eq('id', req.params.id).select().single();

    if (appErr) return res.status(400).json({ error: appErr.message });

    // If rejected, done here
    if (status === 'rejected') {
      return res.json({ application: app });
    }

    // If approved, create rider account
    const tempPassword = 'motolift' + Math.random().toString(36).slice(2, 8);

    // Create Supabase Auth user with phone
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      phone: app.phone,
      password: tempPassword,
      email: app.email || undefined,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: { full_name: app.full_name, applicant_type: app.applicant_type },
    });

    if (authErr) return res.status(400).json({ error: authErr.message });

    // Get the bike's details from bikes table
    const { data: bike } = await supabase
      .from('bikes').select('id, daily_rate, deposit').eq('name', app.preferred_bike).single();

    const rate = daily_rate || (bike?.daily_rate || 350);
    const dep = deposit || (bike?.deposit || 10000);
    const bikeId = bike?.id;

    // Create rider record
    const { data: rider, error: riderErr } = await supabase.from('riders').insert([{
      auth_id: authUser.user.id,
      full_name: app.full_name,
      phone: app.phone,
      email: app.email,
      applicant_type: app.applicant_type,
      is_refugee: app.is_refugee,
      id_number: app.id_number,
      bike_id: bikeId,
      tier: tier || 'standard',
      daily_rate: rate,
      deposit_paid: dep,
      total_days: 540,
      days_paid: 0,
      phase: 1,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    }]).select().single();

    if (riderErr) {
      // Rollback auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return res.status(400).json({ error: riderErr.message });
    }

    res.json({
      application: app,
      rider,
      temp_password: tempPassword,
      message: 'Rider account created. Share temp password via SMS.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Approval failed' });
  }
});

export default router;

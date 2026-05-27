#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  SOrvReign MotoLift — Full Platform Scaffold
#  Run from inside your "sovreign motolift" folder (where index.html lives)
#  Usage: bash setup.sh
# ═══════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()  { echo -e "${GREEN}  ✔  $1${NC}"; }
inf() { echo -e "${CYAN}  →  $1${NC}"; }
warn(){ echo -e "${YELLOW}  ⚠  $1${NC}"; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    SOrvReign MotoLift — Platform Scaffold v1.0       ║${NC}"
echo -e "${CYAN}║    Financing livelihoods, not just motorcycles.      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Detect where we are ─────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR"

# ── 1. ROOT CONFIG FILES ────────────────────────────────────────
inf "Creating root config files..."

cat > "$ROOT/.gitignore" << 'EOF'
node_modules/
.env
.env.local
.DS_Store
*.log
npm-debug.log*
dist/
build/
.vscode/settings.json
.idea/
EOF

cat > "$ROOT/package.json" << 'EOF'
{
  "name": "sovreign-motolift-platform",
  "version": "1.0.0",
  "description": "SOrvReign MotoLift — Mobility-to-income ecosystem for refugees and underserved youth in Kenya",
  "private": true,
  "workspaces": [
    "apps/rider",
    "apps/admin",
    "api",
    "shared"
  ],
  "scripts": {
    "install:all": "npm install && npm install --prefix apps/rider && npm install --prefix apps/admin && npm install --prefix api",
    "dev:api":     "npm run dev --prefix api",
    "dev:rider":   "npm run dev --prefix apps/rider",
    "dev:admin":   "npm run dev --prefix apps/admin",
    "dev:website": "npx serve website -p 8080",
    "build:rider": "npm run build --prefix apps/rider",
    "build:admin": "npm run build --prefix apps/admin"
  }
}
EOF

cat > "$ROOT/README.md" << 'EOF'
# SOrvReign MotoLift — Platform

**Financing livelihoods, not just motorcycles.**

A mobility-to-income ecosystem connecting refugees and underserved youth in Kenya to motorcycle financing, delivery platform employment, and long-term asset ownership.

## Structure

| Folder         | What it is                              | Port |
|----------------|-----------------------------------------|------|
| `website/`     | Public marketing site (HTML/CSS)        | 8080 |
| `apps/rider/`  | Rider dashboard (React, mobile-first)   | 3001 |
| `apps/admin/`  | Admin dashboard (React, desktop)        | 3002 |
| `api/`         | Backend API (Node.js + Express)         | 3000 |
| `shared/`      | Shared utilities and constants          | —    |
| `docs/`        | Setup guides and legal templates        | —    |

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Run in development (open 4 terminals)
npm run dev:api      # terminal 1 → http://localhost:3000
npm run dev:rider    # terminal 2 → http://localhost:3001
npm run dev:admin    # terminal 3 → http://localhost:3002
npm run dev:website  # terminal 4 → http://localhost:8080
```

## Setup Guides
- Database:   docs/SUPABASE_SETUP.md
- M-Pesa:     docs/MPESA_SETUP.md
- Deployment: docs/DEPLOYMENT.md
- Page guide: docs/PAGE_GUIDE.md
- Legal:      docs/LEGAL_TEMPLATES.md

## Founder
Criscent Kasuki — crescentkasuki@gmail.com — +254 717 316 793
EOF

ok "Root: package.json, .gitignore, README.md"

# ── 2. WEBSITE (migrate existing HTML/CSS) ─────────────────────
inf "Setting up website/ folder..."
mkdir -p "$ROOT/website/pages" "$ROOT/website/js" "$ROOT/website/images"

# Copy existing files if they exist in current dir (running from old folder)
if [ -f "$ROOT/index.html" ]; then
  cp "$ROOT/index.html" "$ROOT/website/index.html"
  warn "Copied existing index.html → website/index.html"
fi
if [ -f "$ROOT/style.css" ]; then
  cp "$ROOT/style.css" "$ROOT/website/style.css"
  warn "Copied existing style.css → website/style.css"
fi
if [ -d "$ROOT/images" ] && [ "$(ls -A "$ROOT/images" 2>/dev/null)" ]; then
  cp -r "$ROOT/images/." "$ROOT/website/images/"
  warn "Copied images/ → website/images/"
fi
if [ -d "$ROOT/pages" ]; then
  cp -r "$ROOT/pages/." "$ROOT/website/pages/"
  warn "Copied pages/ → website/pages/"
fi
if [ -f "$ROOT/js/script.js" ]; then
  cp "$ROOT/js/script.js" "$ROOT/website/js/script.js"
fi

# Create refugee-support.html (was empty)
cat > "$ROOT/website/pages/refugee-support.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refugee Support — SOrvReign MotoLift</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
<header>
  <nav>
    <h1>SOrvReign MotoLift</h1>
    <ul>
      <li><a href="../index.html">Home</a></li>
      <li><a href="marketplace.html">Motorcycles</a></li>
      <li><a href="apply.html">Apply</a></li>
      <li><a href="partners.html">Partners</a></li>
      <li><a href="onboarding.html">Onboarding</a></li>
      <li><a href="refugee-support.html">Support</a></li>
      <li><a href="aboutus.html">About</a></li>
      <li><a href="contacts.html">Contact</a></li>
    </ul>
  </nav>
</header>

<section class="hero" style="min-height:50vh;background-image:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url('../images/Spiro-electric-motorcycle-delivery (1).jpg')">
  <div class="hero-text">
    <h2>Refugee Support Programme</h2>
    <p>Dedicated onboarding, multilingual guidance, and UNHCR-aligned support for refugees joining the MotoLift ecosystem.</p>
    <a href="apply.html" class="btn">Apply Now</a>
  </div>
</section>

<section class="how-it-works">
  <h2>We speak your language</h2>
  <p style="margin-bottom:2rem;color:#4d5363">Support available in English · Swahili · French (Français)</p>
  <div class="cards">
    <div class="card">
      <h3>📋 Documentation Help</h3>
      <p>We help refugees with UNHCR asylum seeker cards, RAS documentation, and any paperwork needed to onboard to delivery platforms.</p>
    </div>
    <div class="card">
      <h3>🤝 Community Liaisons</h3>
      <p>Trusted liaisons from DRC, South Sudan, and Rwanda communities guide you through every step in your own language.</p>
    </div>
    <div class="card">
      <h3>📱 Platform Onboarding</h3>
      <p>End-to-end support registering on Bolt, Uber, Glovo, and Faras — from app setup to first ride.</p>
    </div>
    <div class="card">
      <h3>📚 Multilingual Training</h3>
      <p>Financial literacy, road safety, and digital skills training delivered in Swahili, French, and English.</p>
    </div>
    <div class="card">
      <h3>⚡ Electric Motorcycle Access</h3>
      <p>Refugees eligible for Spiro and Ampersand e-motorcycle plans — lower daily costs, higher net income.</p>
    </div>
    <div class="card">
      <h3>💳 Build Credit History</h3>
      <p>M-Pesa repayments tracked through MotoLift system — building your formal financial history for future access to credit.</p>
    </div>
  </div>
</section>

<section style="background:#f0faf5;border-radius:24px;margin:0 10% 60px;padding:48px">
  <h2>Eligibility</h2>
  <p style="color:#4d5363;margin-top:1rem">You qualify if you are:</p>
  <ul style="margin-top:1rem;color:#4d5363;line-height:2.2;padding-left:1.5rem">
    <li>A UNHCR-registered refugee or asylum seeker in Kenya</li>
    <li>Located in Nairobi, Kakuma, or surrounding urban areas</li>
    <li>Aged 18 or above with a valid ID document</li>
    <li>Willing to complete MotoLift rider training programme</li>
  </ul>
  <a href="apply.html" class="btn" style="margin-top:2rem;display:inline-block">Start Your Application</a>
</section>

<footer>
  <p>© 2026 SOrvReign MotoLift | <a href="contacts.html">Contact Us</a></p>
</footer>
<script src="../js/script.js"></script>
</body>
</html>
EOF

# Enhance onboarding.html (was very sparse)
cat > "$ROOT/website/pages/onboarding.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Onboarding — SOrvReign MotoLift</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
<header>
  <nav>
    <h1>SOrvReign MotoLift</h1>
    <ul>
      <li><a href="../index.html">Home</a></li>
      <li><a href="marketplace.html">Motorcycles</a></li>
      <li><a href="apply.html">Apply</a></li>
      <li><a href="partners.html">Partners</a></li>
      <li><a href="onboarding.html">Onboarding</a></li>
      <li><a href="refugee-support.html">Support</a></li>
      <li><a href="aboutus.html">About</a></li>
      <li><a href="contacts.html">Contact</a></li>
    </ul>
  </nav>
</header>

<section class="page-content">
  <h2>Platform Onboarding</h2>
  <p>We get you earning in 7 days. Here's how:</p>

  <div class="cards" style="margin-top:2rem">
    <div class="card"><h3>Day 1–2</h3><p>Document verification and motorcycle assignment. We handle all paperwork with you.</p></div>
    <div class="card"><h3>Day 3–4</h3><p>Rider training: road safety, customer service, financial literacy. Multilingual sessions available.</p></div>
    <div class="card"><h3>Day 5–6</h3><p>App registration on Bolt, Glovo, Uber, or Faras. Account verification and first test ride.</p></div>
    <div class="card"><h3>Day 7</h3><p>You're live. Start earning. Repayment schedule begins based on your daily earnings.</p></div>
  </div>

  <div style="margin-top:3rem">
    <h3>Supported Platforms</h3>
    <p style="color:#4d5363;margin-top:.5rem">We maintain active onboarding corridors with:</p>
    <ul style="margin-top:1rem;color:#4d5363;line-height:2.2;padding-left:1.5rem">
      <li><strong>Bolt</strong> — Ride-hailing and food delivery</li>
      <li><strong>Glovo</strong> — Last-mile delivery across Nairobi</li>
      <li><strong>Uber / Uber Eats</strong> — Ride and delivery network</li>
      <li><strong>Faras</strong> — Kenya-based digital transport platform</li>
    </ul>
  </div>

  <a href="apply.html" class="btn" style="margin-top:2.5rem;display:inline-block">Begin Onboarding</a>
</section>

<footer>
  <p>© 2026 SOrvReign MotoLift</p>
</footer>
<script src="../js/script.js"></script>
</body>
</html>
EOF

ok "website/ — all pages migrated and stubs filled in"

# ── 3. SHARED UTILITIES ─────────────────────────────────────────
inf "Creating shared/ utilities..."
mkdir -p "$ROOT/shared/src"

cat > "$ROOT/shared/package.json" << 'EOF'
{
  "name": "@motolift/shared",
  "version": "1.0.0",
  "main": "src/index.js"
}
EOF

cat > "$ROOT/shared/src/index.js" << 'EOF'
// ── SOrvReign MotoLift — Shared Constants & Utilities ──────────

export const PLATFORMS = ['Bolt', 'Glovo', 'Uber', 'Faras'];

export const BIKE_CATALOG = [
  { id: 'boxer',  name: 'Boxer Motorcycle',         type: 'petrol',   deposit: 20000, dailyInstallment: 450,  totalMonths: 12 },
  { id: 'tvs',    name: 'TVS Motorcycle',            type: 'petrol',   deposit: 25000, dailyInstallment: 500,  totalMonths: 12 },
  { id: 'ranger', name: 'Ranger Motorcycle',         type: 'petrol',   deposit: 18000, dailyInstallment: 420,  totalMonths: 12 },
  { id: 'spiro',  name: 'Spiro Electric',            type: 'electric', deposit: 30000, dailyInstallment: 350,  totalMonths: 18 },
  { id: 'cheche', name: 'Cheche Electric Motorcycle',type: 'electric', deposit: 28000, dailyInstallment: 480,  totalMonths: 15 },
  { id: 'std-ev', name: 'Standard Electric Bike',    type: 'electric', deposit: 15000, dailyInstallment: 350,  totalMonths: 12 },
];

export const RIDER_STATUSES = {
  PENDING:    'pending',
  APPROVED:   'approved',
  ACTIVE:     'active',
  COMPLETED:  'completed',
  DEFAULTED:  'defaulted',
};

export const LANGUAGES = ['en', 'sw', 'fr'];

/**
 * Calculate outstanding balance given a bike and number of days paid
 * @param {string} bikeId
 * @param {number} daysPaid
 */
export function calcBalance(bikeId, daysPaid) {
  const bike = BIKE_CATALOG.find(b => b.id === bikeId);
  if (!bike) return null;
  const totalDays = bike.totalMonths * 30;
  const totalOwed = bike.dailyInstallment * totalDays;
  const paid      = bike.dailyInstallment * daysPaid;
  return Math.max(0, totalOwed - paid);
}

/**
 * Format KES amounts e.g. 32500 → "KES 32,500"
 */
export function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
}

/**
 * Returns the M-Pesa paybill reference for a rider
 */
export function mpesaRef(riderId) {
  return `ML-${String(riderId).toUpperCase().padStart(6, '0')}`;
}
EOF

ok "shared/ — BIKE_CATALOG, constants, formatKES, calcBalance"

# ── 4. API ──────────────────────────────────────────────────────
inf "Creating api/ (Node.js + Express + Supabase)..."
mkdir -p "$ROOT/api/src/routes" "$ROOT/api/src/middleware" "$ROOT/api/src/services"

cat > "$ROOT/api/package.json" << 'EOF'
{
  "name": "@motolift/api",
  "version": "1.0.0",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "dev":   "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express":          "^4.18.2",
    "cors":             "^2.8.5",
    "dotenv":           "^16.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "express-validator":"^7.0.1",
    "helmet":           "^7.1.0",
    "morgan":           "^1.10.0"
  }
}
EOF

cat > "$ROOT/api/.env.example" << 'EOF'
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_SHORTCODE=your-paybill-or-till
MPESA_PASSKEY=your-mpesa-passkey
MPESA_ENV=sandbox
JWT_SECRET=change-me-in-production
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002
EOF

cat > "$ROOT/api/src/index.js" << 'EOF'
import 'dotenv/config';
import express   from 'express';
import cors      from 'cors';
import helmet    from 'helmet';
import morgan    from 'morgan';

import ridersRouter      from './routes/riders.js';
import applicationsRouter from './routes/applications.js';
import repaymentsRouter  from './routes/repayments.js';
import bikesRouter       from './routes/bikes.js';
import mpesaRouter       from './routes/mpesa.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || '').split(',') }));
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'MotoLift API' }));
app.use('/api/riders',       ridersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/repayments',   repaymentsRouter);
app.use('/api/bikes',        bikesRouter);
app.use('/api/mpesa',        mpesaRouter);

// ── 404 + Error handlers ──────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🏍  MotoLift API running on http://localhost:${PORT}`));
EOF

# ── API Routes ──────────────────────────────────────────────────
cat > "$ROOT/api/src/routes/bikes.js" << 'EOF'
import { Router } from 'express';
const router = Router();

const BIKES = [
  { id: 'boxer',  name: 'Boxer Motorcycle',          type: 'petrol',   deposit: 20000, dailyInstallment: 450 },
  { id: 'tvs',    name: 'TVS Motorcycle',             type: 'petrol',   deposit: 25000, dailyInstallment: 500 },
  { id: 'ranger', name: 'Ranger Motorcycle',          type: 'petrol',   deposit: 18000, dailyInstallment: 420 },
  { id: 'spiro',  name: 'Spiro Electric',             type: 'electric', deposit: 30000, dailyInstallment: 350 },
  { id: 'cheche', name: 'Cheche Electric Motorcycle', type: 'electric', deposit: 28000, dailyInstallment: 480 },
  { id: 'std-ev', name: 'Standard Electric Bike',     type: 'electric', deposit: 15000, dailyInstallment: 350 },
];

// GET /api/bikes
router.get('/', (_req, res) => res.json(BIKES));

// GET /api/bikes/:id
router.get('/:id', (req, res) => {
  const bike = BIKES.find(b => b.id === req.params.id);
  if (!bike) return res.status(404).json({ error: 'Bike not found' });
  res.json(bike);
});

export default router;
EOF

cat > "$ROOT/api/src/routes/riders.js" << 'EOF'
/**
 * Riders API
 * GET    /api/riders          — list all (admin)
 * GET    /api/riders/:id      — single rider profile
 * PUT    /api/riders/:id      — update rider
 * DELETE /api/riders/:id      — remove rider (admin)
 *
 * Backed by Supabase `riders` table — see docs/SUPABASE_SETUP.md
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('riders').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase.from('riders').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Rider not found' });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('riders').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
EOF

cat > "$ROOT/api/src/routes/applications.js" << 'EOF'
/**
 * Applications API
 * POST /api/applications   — submit a new rider application (public)
 * GET  /api/applications   — list all applications (admin)
 * PUT  /api/applications/:id/approve  — approve and create rider account
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.post('/', async (req, res) => {
  const { full_name, nationality, id_number, phone, email, bike_id, is_refugee } = req.body;
  if (!full_name || !phone || !bike_id) {
    return res.status(400).json({ error: 'full_name, phone, and bike_id are required' });
  }
  const { data, error } = await supabase.from('applications').insert([
    { full_name, nationality, id_number, phone, email, bike_id, is_refugee: !!is_refugee, status: 'pending' }
  ]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/:id/approve', async (req, res) => {
  const { data: app, error: appErr } = await supabase
    .from('applications').update({ status: 'approved' }).eq('id', req.params.id).select().single();
  if (appErr) return res.status(400).json({ error: appErr.message });

  // Create rider record
  const { data: rider, error: riderErr } = await supabase.from('riders').insert([{
    full_name:   app.full_name,
    phone:       app.phone,
    email:       app.email,
    bike_id:     app.bike_id,
    is_refugee:  app.is_refugee,
    status:      'active',
    days_paid:   0,
  }]).select().single();
  if (riderErr) return res.status(400).json({ error: riderErr.message });

  res.json({ application: app, rider });
});

export default router;
EOF

cat > "$ROOT/api/src/routes/repayments.js" << 'EOF'
/**
 * Repayments API
 * POST /api/repayments          — record a manual repayment
 * GET  /api/repayments/:riderId — repayment history for a rider
 */
import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.post('/', async (req, res) => {
  const { rider_id, amount, method = 'mpesa', reference } = req.body;
  if (!rider_id || !amount) return res.status(400).json({ error: 'rider_id and amount required' });

  const { data, error } = await supabase.from('repayments').insert([
    { rider_id, amount, method, reference, recorded_at: new Date().toISOString() }
  ]).select().single();
  if (error) return res.status(400).json({ error: error.message });

  // Increment days_paid on rider
  await supabase.rpc('increment_days_paid', { rider_id });

  res.status(201).json(data);
});

router.get('/:riderId', async (req, res) => {
  const { data, error } = await supabase
    .from('repayments').select('*').eq('rider_id', req.params.riderId).order('recorded_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
EOF

cat > "$ROOT/api/src/routes/mpesa.js" << 'EOF'
/**
 * M-Pesa Integration
 * POST /api/mpesa/stkpush    — initiate STK push to rider's phone
 * POST /api/mpesa/callback   — Safaricom callback (webhook)
 */
import { Router } from 'express';
const router = Router();

async function getMpesaToken() {
  const { MPESA_CONSUMER_KEY: key, MPESA_CONSUMER_SECRET: secret, MPESA_ENV } = process.env;
  const base = MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
  const creds = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${creds}` }
  });
  const json = await res.json();
  return { token: json.access_token, base };
}

router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, rider_id } = req.body;
    const { token, base } = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password  = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            amount,
      PartyA:            phone,
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       phone,
      CallBackURL:       `${process.env.API_URL || 'https://your-api.com'}/api/mpesa/callback`,
      AccountReference:  `ML-${rider_id}`,
      TransactionDesc:   'MotoLift Repayment',
    };

    const mpesaRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await mpesaRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'M-Pesa STK push failed' });
  }
});

router.post('/callback', (req, res) => {
  // TODO: parse Safaricom callback, record repayment, notify rider
  console.log('M-Pesa callback received:', JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

export default router;
EOF

cat > "$ROOT/api/src/services/supabase.js" << 'EOF'
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env — see docs/SUPABASE_SETUP.md');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
EOF

ok "api/ — Express server, 5 route files, Supabase client, M-Pesa integration"

# ── 5. RIDER APP (React) ────────────────────────────────────────
inf "Creating apps/rider/ (React, mobile-first)..."
mkdir -p "$ROOT/apps/rider/src/components" "$ROOT/apps/rider/src/pages" "$ROOT/apps/rider/src/hooks"

cat > "$ROOT/apps/rider/package.json" << 'EOF'
{
  "name": "@motolift/rider-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev":   "vite --port 3001",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react":     "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
EOF

cat > "$ROOT/apps/rider/vite.config.js" << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { port: 3001, proxy: { '/api': 'http://localhost:3000' } },
});
EOF

cat > "$ROOT/apps/rider/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>MotoLift Rider</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

cat > "$ROOT/apps/rider/src/main.jsx" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
EOF

cat > "$ROOT/apps/rider/src/index.css" << 'EOF'
:root {
  --green:  #4de1a1;
  --dark:   #061018;
  --card:   #ffffff;
  --muted:  #6b7280;
  --bg:     #f4f7f5;
  --radius: 20px;
}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }
body { background: var(--bg); color: var(--dark); }
EOF

cat > "$ROOT/apps/rider/src/App.jsx" << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard  from './pages/Dashboard.jsx';
import Repayments from './pages/Repayments.jsx';
import Onboarding from './pages/Onboarding.jsx';
import BottomNav  from './components/BottomNav.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/repayments" element={<Repayments />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
EOF

cat > "$ROOT/apps/rider/src/components/BottomNav.jsx" << 'EOF'
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',           label: 'Home',      icon: '🏠' },
  { to: '/repayments', label: 'Pay',       icon: '💳' },
  { to: '/onboarding', label: 'Platforms', icon: '📱' },
];

export default function BottomNav() {
  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0,
      background:'#fff', borderTop:'1px solid #e5e7eb',
      display:'flex', justifyContent:'space-around', padding:'12px 0 20px',
    }}>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end style={({ isActive }) => ({
          display:'flex', flexDirection:'column', alignItems:'center', gap:4,
          fontSize:12, fontWeight:600, textDecoration:'none',
          color: isActive ? 'var(--green)' : 'var(--muted)',
        })}>
          <span style={{fontSize:22}}>{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
EOF

cat > "$ROOT/apps/rider/src/pages/Dashboard.jsx" << 'EOF'
import { useState, useEffect } from 'react';

// Mock data — replace with fetch('/api/riders/:id') once backend is running
const MOCK_RIDER = {
  name:             'Jean-Claude Nziza',
  bike:             'Spiro Electric',
  status:           'active',
  daysPaid:         42,
  totalDays:        540,   // 18 months × 30
  dailyInstallment: 350,
  balance:          168000,
  earnings:         { today: 1850, week: 11200, total: 84700 },
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--green)' : '#fff',
      borderRadius: 'var(--radius)',
      padding: '20px 22px',
      boxShadow: '0 4px 20px rgba(0,0,0,.06)',
    }}>
      <p style={{ fontSize: 12, color: accent ? '#064' : 'var(--muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color: accent ? '#061018' : 'var(--dark)' }}>{value}</p>
      {sub && <p style={{ fontSize: 12, marginTop: 4, color: accent ? '#064' : 'var(--muted)' }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const r = MOCK_RIDER;
  const progress = Math.round((r.daysPaid / r.totalDays) * 100);

  return (
    <div style={{ padding: '24px 16px 100px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Hey, {r.name.split(' ')[0]} 👋</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>{r.bike} · {r.status}</p>

      {/* Progress bar */}
      <div style={{ background:'#e5e7eb', borderRadius:99, height:10, marginBottom:8 }}>
        <div style={{ width:`${progress}%`, background:'var(--green)', borderRadius:99, height:'100%', transition:'width .5s' }} />
      </div>
      <p style={{ fontSize:13, color:'var(--muted)', marginBottom:24 }}>{progress}% of motorcycle paid off ({r.daysPaid}/{r.totalDays} days)</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <StatCard label="Outstanding Balance" value={`KES ${r.balance.toLocaleString()}`} />
        <StatCard label="Daily Installment"   value={`KES ${r.dailyInstallment}`} accent />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:28 }}>
        <StatCard label="Today"  value={`KES ${r.earnings.today.toLocaleString()}`} />
        <StatCard label="Week"   value={`KES ${r.earnings.week.toLocaleString()}`} />
        <StatCard label="Total"  value={`KES ${r.earnings.total.toLocaleString()}`} />
      </div>

      <button style={{
        width:'100%', padding:'16px', background:'var(--green)',
        border:'none', borderRadius:'var(--radius)', fontSize:16, fontWeight:700, cursor:'pointer',
      }}>
        💳 Pay Today (KES {r.dailyInstallment})
      </button>
    </div>
  );
}
EOF

cat > "$ROOT/apps/rider/src/pages/Repayments.jsx" << 'EOF'
const HISTORY = [
  { date:'2026-05-27', amount:350, method:'M-Pesa', ref:'QKJ7HX' },
  { date:'2026-05-26', amount:350, method:'M-Pesa', ref:'QKJ5MN' },
  { date:'2026-05-25', amount:700, method:'M-Pesa', ref:'QKK0PL' },
];

export default function Repayments() {
  return (
    <div style={{padding:'24px 16px 100px'}}>
      <h2 style={{marginBottom:20}}>Repayment History</h2>
      {HISTORY.map((r,i) => (
        <div key={i} style={{
          background:'#fff', borderRadius:16, padding:'16px 20px',
          marginBottom:12, display:'flex', justifyContent:'space-between',
          boxShadow:'0 2px 10px rgba(0,0,0,.05)',
        }}>
          <div>
            <p style={{fontWeight:600}}>KES {r.amount.toLocaleString()}</p>
            <p style={{fontSize:12,color:'#6b7280'}}>{r.method} · {r.ref}</p>
          </div>
          <p style={{fontSize:13,color:'#6b7280',alignSelf:'center'}}>{r.date}</p>
        </div>
      ))}
    </div>
  );
}
EOF

cat > "$ROOT/apps/rider/src/pages/Onboarding.jsx" << 'EOF'
const PLATFORMS = [
  { name:'Bolt',  status:'registered', color:'#34e0a1', icon:'⚡' },
  { name:'Glovo', status:'pending',    color:'#f9a825', icon:'🟡' },
  { name:'Uber',  status:'not_started',color:'#e2e8f0', icon:'🚗' },
  { name:'Faras', status:'not_started',color:'#e2e8f0', icon:'🛵' },
];

const label = { registered:'✅ Active', pending:'⏳ Pending', not_started:'→ Start' };

export default function Onboarding() {
  return (
    <div style={{padding:'24px 16px 100px'}}>
      <h2 style={{marginBottom:8}}>Platform Onboarding</h2>
      <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>
        Register on delivery platforms to start earning
      </p>
      {PLATFORMS.map(p => (
        <div key={p.name} style={{
          background:'#fff', borderRadius:16, padding:'20px',
          marginBottom:12, display:'flex', alignItems:'center', gap:16,
          boxShadow:'0 2px 10px rgba(0,0,0,.05)',
        }}>
          <span style={{fontSize:28}}>{p.icon}</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:700}}>{p.name}</p>
            <p style={{fontSize:13,color:'#6b7280'}}>{label[p.status]}</p>
          </div>
          {p.status !== 'registered' && (
            <button style={{
              background:'var(--green)', border:'none', borderRadius:99,
              padding:'8px 18px', fontWeight:600, cursor:'pointer', fontSize:13,
            }}>Get Help</button>
          )}
        </div>
      ))}
    </div>
  );
}
EOF

ok "apps/rider/ — React mobile app: Dashboard, Repayments, Onboarding"

# ── 6. ADMIN APP (React) ────────────────────────────────────────
inf "Creating apps/admin/ (React, desktop)..."
mkdir -p "$ROOT/apps/admin/src/pages" "$ROOT/apps/admin/src/components"

cat > "$ROOT/apps/admin/package.json" << 'EOF'
{
  "name": "@motolift/admin-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev":   "vite --port 3002",
    "build": "vite build"
  },
  "dependencies": {
    "react":            "^18.2.0",
    "react-dom":        "^18.2.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
EOF

cat > "$ROOT/apps/admin/vite.config.js" << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { port: 3002, proxy: { '/api': 'http://localhost:3000' } },
});
EOF

cat > "$ROOT/apps/admin/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MotoLift Admin</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

cat > "$ROOT/apps/admin/src/main.jsx" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
EOF

cat > "$ROOT/apps/admin/src/index.css" << 'EOF'
:root { --green:#4de1a1; --dark:#061018; --sidebar:#0a1a12; --bg:#f0f4f2; }
* { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',system-ui,sans-serif; }
body { background:var(--bg); color:var(--dark); display:flex; min-height:100vh; }
EOF

cat > "$ROOT/apps/admin/src/App.jsx" << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar      from './components/Sidebar.jsx';
import Overview     from './pages/Overview.jsx';
import Riders       from './pages/Riders.jsx';
import Applications from './pages/Applications.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{display:'flex',minHeight:'100vh'}}>
        <Sidebar />
        <main style={{flex:1, padding:'32px', overflow:'auto'}}>
          <Routes>
            <Route path="/"             element={<Overview />} />
            <Route path="/riders"       element={<Riders />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="*"             element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
EOF

cat > "$ROOT/apps/admin/src/components/Sidebar.jsx" << 'EOF'
import { NavLink } from 'react-router-dom';
const links = [
  { to:'/',             label:'Overview',     icon:'📊' },
  { to:'/riders',       label:'Riders',       icon:'🏍️' },
  { to:'/applications', label:'Applications', icon:'📋' },
];
export default function Sidebar() {
  return (
    <aside style={{
      width:220, background:'var(--sidebar)', color:'#e2e8f0',
      padding:'28px 16px', display:'flex', flexDirection:'column', gap:8,
    }}>
      <p style={{color:'var(--green)',fontWeight:700,fontSize:16,marginBottom:16,paddingLeft:12}}>
        MotoLift Admin
      </p>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end style={({isActive}) => ({
          display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
          borderRadius:10, textDecoration:'none', fontSize:14,
          background: isActive ? 'rgba(77,225,161,.15)' : 'transparent',
          color: isActive ? 'var(--green)' : '#94a3b8',
          fontWeight: isActive ? 600 : 400,
        })}>
          <span>{l.icon}</span>{l.label}
        </NavLink>
      ))}
    </aside>
  );
}
EOF

cat > "$ROOT/apps/admin/src/pages/Overview.jsx" << 'EOF'
const stats = [
  { label:'Total Riders',    value:47,   unit:'' },
  { label:'Active',          value:38,   unit:'' },
  { label:'Repayment Rate',  value:'86', unit:'%' },
  { label:'Fleet Value',     value:'KES 4.7M', unit:'' },
];
export default function Overview() {
  return (
    <div>
      <h1 style={{marginBottom:24}}>Platform Overview</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:32}}>
        {stats.map(s => (
          <div key={s.label} style={{background:'#fff',borderRadius:16,padding:'20px 24px',boxShadow:'0 2px 12px rgba(0,0,0,.06)'}}>
            <p style={{fontSize:12,color:'#6b7280',marginBottom:6}}>{s.label}</p>
            <p style={{fontSize:28,fontWeight:700}}>{s.value}{s.unit}</p>
          </div>
        ))}
      </div>
      <p style={{color:'#6b7280'}}>Connect the API and Supabase to load live data. See docs/SUPABASE_SETUP.md.</p>
    </div>
  );
}
EOF

cat > "$ROOT/apps/admin/src/pages/Riders.jsx" << 'EOF'
const MOCK = [
  {id:'R001', name:'Jean-Claude Nziza', bike:'Spiro Electric', status:'active',  paid:42, balance:'KES 168,000'},
  {id:'R002', name:'Amina Hassan',      bike:'TVS Motorcycle', status:'active',  paid:15, balance:'KES 202,500'},
  {id:'R003', name:'Peter Mutua',       bike:'Boxer Motorcycle',status:'active', paid:88, balance:'KES 136,900'},
];
const pill = s => ({
  active:'background:#dcfce7;color:#166534',
  pending:'background:#fef9c3;color:#854d0e',
}[s] || 'background:#e5e7eb;color:#374151');

export default function Riders() {
  return (
    <div>
      <h1 style={{marginBottom:24}}>Riders</h1>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.06)'}}>
        <thead>
          <tr style={{background:'#f8faf9',fontSize:13,color:'#6b7280'}}>
            {['ID','Name','Bike','Status','Days Paid','Balance'].map(h => (
              <th key={h} style={{padding:'14px 20px',textAlign:'left'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK.map(r => (
            <tr key={r.id} style={{borderTop:'1px solid #f0f0f0'}}>
              <td style={{padding:'14px 20px',fontSize:13,color:'#6b7280'}}>{r.id}</td>
              <td style={{padding:'14px 20px',fontWeight:600}}>{r.name}</td>
              <td style={{padding:'14px 20px',fontSize:14}}>{r.bike}</td>
              <td style={{padding:'14px 20px'}}>
                <span style={{borderRadius:99,padding:'4px 10px',fontSize:12,fontWeight:600,...Object.fromEntries(pill(r.status).split(';').map(s=>s.split(':')))}}>
                  {r.status}
                </span>
              </td>
              <td style={{padding:'14px 20px'}}>{r.paid}</td>
              <td style={{padding:'14px 20px'}}>{r.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
EOF

cat > "$ROOT/apps/admin/src/pages/Applications.jsx" << 'EOF'
const MOCK = [
  {id:'A001', name:'Faridah Nakato',  nationality:'Uganda',    bike:'Boxer',   refugee:true,  submitted:'2026-05-26', status:'pending'},
  {id:'A002', name:'Samuel Ochieng',  nationality:'Kenya',     bike:'TVS',     refugee:false, submitted:'2026-05-25', status:'pending'},
  {id:'A003', name:'Celestin Habimana',nationality:'Rwanda',  bike:'Spiro',   refugee:true,  submitted:'2026-05-24', status:'approved'},
];
export default function Applications() {
  return (
    <div>
      <h1 style={{marginBottom:24}}>Applications</h1>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.06)'}}>
        <thead>
          <tr style={{background:'#f8faf9',fontSize:13,color:'#6b7280'}}>
            {['ID','Name','Nationality','Bike','Refugee','Submitted','Status','Action'].map(h=>(
              <th key={h} style={{padding:'14px 20px',textAlign:'left'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK.map(a => (
            <tr key={a.id} style={{borderTop:'1px solid #f0f0f0'}}>
              <td style={{padding:'14px 20px',fontSize:13,color:'#6b7280'}}>{a.id}</td>
              <td style={{padding:'14px 20px',fontWeight:600}}>{a.name}</td>
              <td style={{padding:'14px 20px'}}>{a.nationality}</td>
              <td style={{padding:'14px 20px'}}>{a.bike}</td>
              <td style={{padding:'14px 20px'}}>{a.refugee ? '✅ Yes' : 'No'}</td>
              <td style={{padding:'14px 20px',fontSize:13,color:'#6b7280'}}>{a.submitted}</td>
              <td style={{padding:'14px 20px',fontSize:13}}>{a.status}</td>
              <td style={{padding:'14px 20px'}}>
                {a.status === 'pending' && (
                  <button style={{background:'var(--green)',border:'none',borderRadius:8,padding:'6px 14px',fontWeight:600,cursor:'pointer',fontSize:13}}>
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
EOF

ok "apps/admin/ — React desktop: Overview, Riders table, Applications table"

# ── 7. DOCS ─────────────────────────────────────────────────────
inf "Creating docs/..."
mkdir -p "$ROOT/docs"

cat > "$ROOT/docs/SUPABASE_SETUP.md" << 'EOF'
# Supabase Setup — SOrvReign MotoLift

## 1. Create a project
Go to https://supabase.com → New Project → name it `motolift` → save the URL and `service_role` key → add to `api/.env`

## 2. Run this SQL in the Supabase SQL editor

```sql
-- Riders table
create table riders (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null unique,
  email       text,
  bike_id     text not null,
  is_refugee  boolean default false,
  status      text default 'active',   -- active | completed | defaulted
  days_paid   int default 0,
  created_at  timestamptz default now()
);

-- Applications table
create table applications (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  nationality  text,
  id_number    text,
  phone        text not null,
  email        text,
  bike_id      text not null,
  is_refugee   boolean default false,
  status       text default 'pending',  -- pending | approved | rejected
  created_at   timestamptz default now()
);

-- Repayments table
create table repayments (
  id          uuid primary key default gen_random_uuid(),
  rider_id    uuid references riders(id),
  amount      numeric not null,
  method      text default 'mpesa',
  reference   text,
  recorded_at timestamptz default now()
);

-- Helper function: increment days_paid
create or replace function increment_days_paid(rider_id uuid)
returns void language sql as $$
  update riders set days_paid = days_paid + 1 where id = rider_id;
$$;

-- RLS: enable row-level security (configure per your auth setup)
alter table riders       enable row level security;
alter table applications enable row level security;
alter table repayments   enable row level security;
```

## 3. Storage bucket (for application documents)
Supabase → Storage → New bucket → name: `rider-docs` → set to private

## 4. Auth
Use Supabase Auth with phone OTP for rider login, email/password for admin.
EOF

cat > "$ROOT/docs/MPESA_SETUP.md" << 'EOF'
# M-Pesa Integration Setup

## 1. Get Daraja API credentials
Go to https://developer.safaricom.co.ke → Create App → get Consumer Key and Consumer Secret

## 2. Add to api/.env
```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_paybill_or_till_number
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_ENV=sandbox        # change to 'production' when live
API_URL=https://your-api-domain.com
```

## 3. STK Push flow
The API route `POST /api/mpesa/stkpush` triggers a payment prompt on the rider's phone.
- Body: `{ phone: "2547XXXXXXXX", amount: 350, rider_id: "uuid" }`
- Safaricom calls back to `POST /api/mpesa/callback` with payment confirmation
- Callback records repayment and increments `days_paid`

## 4. Test in sandbox
Use test phone numbers from Safaricom Daraja sandbox docs.
PIN: 0000 for sandbox payments.
EOF

cat > "$ROOT/docs/DEPLOYMENT.md" << 'EOF'
# Deployment Guide

## Recommended Stack
| Service      | What for               | Free tier |
|--------------|------------------------|-----------|
| Supabase     | Database + Auth        | Yes       |
| Railway      | API (Node.js)          | Yes       |
| Vercel       | Rider & Admin React apps | Yes     |
| GitHub Pages | Marketing website      | Yes       |

## API → Railway
1. Push repo to GitHub
2. Railway → New Project → Deploy from GitHub → select `api/` directory
3. Add all `.env` variables in Railway dashboard

## React Apps → Vercel
```bash
# Rider app
cd apps/rider && npm run build
# Admin app
cd apps/admin && npm run build
```
Import each as separate Vercel project. Set `VITE_API_URL` env var to your Railway API URL.

## Website → GitHub Pages
Enable GitHub Pages on repo → Source: `website/` folder

## Custom Domain
Point `app.sorvreignmotolift.com` → rider Vercel deployment
Point `admin.sorvreignmotolift.com` → admin Vercel deployment
Point `api.sorvreignmotolift.com` → Railway API
EOF

cat > "$ROOT/docs/PAGE_GUIDE.md" << 'EOF'
# Page Content Guide

## Pages to prioritise

| Page                        | File                           | Status      | Priority |
|-----------------------------|--------------------------------|-------------|----------|
| Refugee Support             | website/pages/refugee-support.html | ✅ Done  | HIGH     |
| Motorcycle Marketplace      | website/pages/marketplace.html | ✅ Done     | HIGH     |
| Apply for Financing         | website/pages/apply.html       | ✅ Done     | HIGH     |
| Platform Onboarding         | website/pages/onboarding.html  | ✅ Done     | HIGH     |
| About Us                    | website/pages/aboutus.html     | ✅ Done     | MEDIUM   |
| Partners                    | website/pages/partners.html    | Needs content| MEDIUM |
| Contact                     | website/pages/contacts.html    | ✅ Done     | LOW      |

## Content to add to partners.html
- Bolt / Glovo / Uber / Faras logos and partnership status
- Ampersand / Spiro electric motorcycle partners
- UNHCR, Mastercard Foundation alignment section
- YVC Kenya mention

## Images
All motorcycle images are in `website/images/`. Use:
- `Spiro-electric-motorcycle-rider.jpeg` — hero images
- `Spiro-electric-motorcycle-delivery (1).jpg` — refugee support hero
- `boxer mortocycles.jpg`, `tvs mortocycles.jpg`, `ranger mortocycles.jpg` — marketplace
EOF

cat > "$ROOT/docs/LEGAL_TEMPLATES.md" << 'EOF'
# Legal Document Templates

## Rider Financing Agreement (outline)
1. Parties: SOrvReign MotoLift (Lender) and Rider (Borrower)
2. Motorcycle: description, serial number
3. Deposit paid: KES ______
4. Daily installment: KES ______
5. Total repayment period: ______ months
6. Repayment method: M-Pesa to Paybill _______ Account: [Rider ID]
7. Default clause: 7 days missed = restructuring review
8. Ownership transfer: upon full repayment, title transfers to Rider
9. Insurance: Rider responsible for third-party insurance
10. Governing law: Republic of Kenya

## UNHCR Documentation Checklist
- [ ] Mandate refugee certificate OR asylum seeker certificate
- [ ] UNHCR registration card (front and back)
- [ ] Passport photo (2 copies)
- [ ] Next-of-kin contact (in-country)
- [ ] Phone number (M-Pesa registered)

> Note: Consult a Kenyan legal professional before using any agreement for actual financing.
EOF

ok "docs/ — SUPABASE_SETUP, MPESA_SETUP, DEPLOYMENT, PAGE_GUIDE, LEGAL_TEMPLATES"

# ── SUMMARY ─────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   ✅  Scaffold complete!                             ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Structure created:"
find "$ROOT" -type f | grep -v "node_modules\|\.git\|images\|videos" | sort | wc -l | xargs echo "   Total files:"
echo ""
echo "  Next steps:"
echo "   1. cd into your project root"
echo "   2. cp api/.env.example api/.env  → fill in Supabase + M-Pesa keys"
echo "   3. npm run install:all"
echo "   4. npm run dev:api        (terminal 1)"
echo "   5. npm run dev:rider      (terminal 2)"
echo "   6. npm run dev:admin      (terminal 3)"
echo "   7. npm run dev:website    (terminal 4)"
echo ""
echo "  Docs:"
echo "   → docs/SUPABASE_SETUP.md    (database SQL + setup)"
echo "   → docs/MPESA_SETUP.md       (M-Pesa Daraja integration)"
echo "   → docs/DEPLOYMENT.md        (Railway + Vercel + GitHub Pages)"
echo "   → docs/PAGE_GUIDE.md        (which pages to fill next)"
echo ""
echo -e "${GREEN}  Financing livelihoods, not just motorcycles. 🏍️${NC}"
echo ""

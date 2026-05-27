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

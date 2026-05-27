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

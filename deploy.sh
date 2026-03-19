#!/bin/bash
# ── mvm-furniture.com deploy script ──────────────────────────────────────────
# Builds with prerendering (45 routes) + critical CSS + sitemap, then deploys
# to Vercel production via prebuilt artifacts.
#
# Usage:  ./deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
cd "$(dirname "$0")"

# Load Supabase env vars
if [ -f .env ]; then
  set -a
  source .env
  set +a
else
  echo "ERROR: .env file not found. Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  mvm-furniture.com — Prerendered Production Deploy"
echo "═══════════════════════════════════════════════════════"
echo ""

# Step 1: Build with prerendering
echo "▸ Step 1/3 — Building (vite + prerender 45 routes + critical CSS + sitemap)..."
PRERENDER=true npm run build
echo ""

# Step 2: Create Vercel output
echo "▸ Step 2/3 — Creating Vercel build output..."
PRERENDER=true npx vercel build --prod
echo ""

# Step 3: Deploy prebuilt to production
echo "▸ Step 3/3 — Deploying to mvm-furniture.com..."
npx vercel deploy --prebuilt --prod --yes
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  Deployed to https://mvm-furniture.com"
echo "═══════════════════════════════════════════════════════"
echo ""

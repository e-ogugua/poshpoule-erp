#!/bin/bash

# Exit on error
set -euo pipefail

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[${TIMESTAMP}] Starting Vercel build process..."

# Install dependencies using pnpm (project uses pnpm)
echo "[${TIMESTAMP}] Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "[${TIMESTAMP}] Generating Prisma client..."
npx prisma generate

# Run migrations (skip if fails)
echo "[${TIMESTAMP}] Running database migrations..."
NODE_ENV=production npx prisma migrate deploy || echo "[${TIMESTAMP}] Migrations skipped."

# Seed the database with products
echo "[${TIMESTAMP}] Seeding database with products..."
NODE_ENV=production npx prisma db seed || echo "[${TIMESTAMP}] Seeding failed or skipped."

# Build Next.js app
echo "[${TIMESTAMP}] Building Next.js app..."
pnpm run build

# Postbuild
if grep -q "postbuild" package.json; then
  echo "[${TIMESTAMP}] Running postbuild script..."
  pnpm run postbuild
fi

if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found!"
  exit 1
fi

echo "[${TIMESTAMP}] ✅ Build completed successfully!"

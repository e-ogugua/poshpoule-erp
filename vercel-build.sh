#!/bin/bash

# Exit on error
set -euo pipefail

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[${TIMESTAMP}] Starting Vercel build process..."

# Install dependencies using npm (Vercel default)
echo "[${TIMESTAMP}] Installing dependencies..."
npm ci

# Generate Prisma client
echo "[${TIMESTAMP}] Generating Prisma client..."
npx prisma generate

# Run migrations (skip if fails)
echo "[${TIMESTAMP}] Running database migrations..."
NODE_ENV=production npx prisma migrate deploy || echo "[${TIMESTAMP}] Migrations skipped."

# Build Next.js app
echo "[${TIMESTAMP}] Building Next.js app..."
npm run build

# Postbuild
if grep -q "postbuild" package.json; then
  echo "[${TIMESTAMP}] Running postbuild script..."
  npm run postbuild
fi

if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found!"
  exit 1
fi

echo "[${TIMESTAMP}] ✅ Build completed successfully!"

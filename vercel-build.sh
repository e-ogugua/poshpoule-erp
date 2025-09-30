#!/bin/bash

# Exit on error
set -euo pipefail

# Timestamp for logs
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[${TIMESTAMP}] Starting Vercel build process..."

# Function to approve pnpm build scripts (for Vercel CI)
approve_builds() {
  if command -v pnpm >/dev/null 2>&1; then
    echo "[${TIMESTAMP}] Attempting to approve all build scripts..."
    # Only works on Vercel environment
    if pnpm help approve-builds >/dev/null 2>&1; then
      pnpm approve-builds --all || true
      echo "[${TIMESTAMP}] Build scripts approved!"
    else
      echo "[${TIMESTAMP}] pnpm approve-builds command not available, skipping."
    fi
  fi
}

# Approve scripts
approve_builds

# Install dependencies
echo "[${TIMESTAMP}] Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "[${TIMESTAMP}] Generating Prisma client..."
npx prisma generate

# Run production migrations
echo "[${TIMESTAMP}] Running database migrations..."
NODE_ENV=production npx prisma migrate deploy

# Verify DB connection
echo "[${TIMESTAMP}] Verifying database connection..."
npx prisma db execute --stdin --url="$DATABASE_URL" <<< "SELECT 1 AS connection_test;"

# Build Next.js app
echo "[${TIMESTAMP}] Building Next.js app..."
pnpm run build

# Postbuild scripts if exist (e.g., sitemap)
if grep -q "postbuild" package.json; then
  echo "[${TIMESTAMP}] Running postbuild script..."
  pnpm run postbuild
fi

# Confirm build directory exists
if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found!"
  exit 1
fi

echo "[${TIMESTAMP}] ✅ Build completed successfully!"

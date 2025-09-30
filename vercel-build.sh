#!/bin/bash

# Exit on any error and print commands
set -euo pipefail
IFS=$'\n\t'

echo "🔹 Starting Vercel build at $(date +"%Y-%m-%d %H:%M:%S")"

# Ensure required environment variables are set
for var in DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL; do
  if [ -z "${!var:-}" ]; then
    echo "❌ Error: Environment variable $var is not set"
    exit 1
  fi
done

# Approve all native build scripts for pnpm v10
echo "✅ Approving native build scripts for pnpm..."
pnpm approve-builds --all || true

# Install dependencies with cache
echo "🔧 Installing dependencies via pnpm..."
pnpm install --frozen-lockfile --prefer-offline

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
pnpm prisma generate

# Run database migrations (non-interactive)
echo "🚀 Running Prisma migrations in production..."
NODE_ENV=production pnpm prisma migrate deploy

# Verify database connection
echo "🔌 Testing database connection..."
pnpm prisma db execute --stdin --url="$DATABASE_URL" <<< "SELECT 1 AS connection_test;"

# Build Next.js app
echo "🏗️  Building Next.js application..."
pnpm build

# Run postbuild scripts if defined
if grep -q '"postbuild"' package.json; then
  echo "🗺️  Running postbuild script (e.g., sitemap)..."
  pnpm postbuild
fi

# Check if .next build directory exists
if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found!"
  exit 1
fi

echo "✅ Build completed successfully at $(date +"%Y-%m-%d %H:%M:%S")"

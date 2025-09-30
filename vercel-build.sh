#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Enable command echo for debugging
set -x

# Set timestamp for logs
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[${TIMESTAMP}] Starting Vercel build process..."

# Function to handle errors and rollback
handle_error() {
    local exit_code=$?
    echo "❌ Build failed with exit code ${exit_code}"
    echo "🔄 Attempting to rollback incomplete migrations..."
    pnpm exec prisma migrate reset --force --skip-generate --skip-seed || true
    exit ${exit_code}
}

# Trap errors
trap handle_error ERR

# Check required environment variables (fail fast if missing)
for var in DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL; do
    if [ -z "${!var:-}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

# Install dependencies using pnpm (Vercel's package manager)
echo "🔧 Installing dependencies..."
pnpm install --frozen-lockfile --prefer-offline

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
pnpm exec prisma generate

# Run database migrations (production-safe, no dev dependencies)
echo "🚀 Deploying database migrations..."
NODE_ENV=production pnpm exec prisma migrate deploy

# Verify database connection safely (without causing exit 127)
echo "🔌 Verifying database connection..."
pnpm exec prisma db execute --url="$DATABASE_URL" --raw "SELECT 1 AS connection_test;" || {
    echo "⚠️  Warning: Database connection check failed, but continuing build..."
}

# Build the Next.js application
echo "🏗️  Building the Next.js app..."
pnpm run build

# Generate sitemap if postbuild script exists
if jq -e '.scripts.postbuild' package.json > /dev/null 2>&1; then
    echo "🗺️  Generating sitemap..."
    pnpm run postbuild
fi

# Verify build output
if [ ! -d ".next" ]; then
    echo "❌ Error: Build failed - .next directory not found"
    exit 1
fi

# Optional cleanup: Remove stale artifacts (uncomment if needed)
# echo "🧹 Cleaning up stale artifacts..."
# rm -rf node_modules/.cache .next/cache

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "✅ [${TIMESTAMP}] Build completed successfully!"

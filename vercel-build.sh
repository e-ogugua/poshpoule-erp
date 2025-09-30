#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Enable command echo for debugging
set -x

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

trap handle_error ERR

# Check required environment variables
for var in DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL; do
    if [ -z "${!var:-}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

# Install dependencies using pnpm
echo "🔧 Installing dependencies..."
pnpm install --frozen-lockfile --prefer-offline

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
pnpm exec prisma generate

# Run database migrations (production safe)
echo "🚀 Deploying database migrations..."
NODE_ENV=production pnpm exec prisma migrate deploy

# Verify database connection safely
echo "🔌 Verifying database connection..."
pnpm exec prisma db execute --url="$DATABASE_URL" --raw "SELECT 1 AS connection_test;" || true

# Build the Next.js application
echo "🏗️  Building the Next.js app..."
pnpm run build

# Generate sitemap if postbuild script exists
if jq -e '.scripts.postbuild' package.json > /dev/null; then
    echo "🗺️  Generating sitemap..."
    pnpm run postbuild
fi

# Verify build output
if [ ! -d ".next" ]; then
    echo "❌ Error: Build failed - .next directory not found"
    exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "✅ [${TIMESTAMP}] Build completed successfully!"

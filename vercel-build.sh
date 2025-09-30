#!/bin/bash

# Exit on error and print commands as they are executed
set -exo pipefail

# Set timestamp for logs
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[${TIMESTAMP}] Starting build process..."

# Function to handle errors
handle_error() {
    local exit_code=$?
    echo "❌ Build failed with exit code ${exit_code}"
    echo "🔄 Rolling back any incomplete migrations..."
    npx prisma migrate reset --force --skip-generate --skip-seed 2>/dev/null || true
    exit ${exit_code}
}

# Trap errors
trap 'handle_error' ERR

# Ensure required environment variables are set
for var in DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

# Install dependencies with caching
echo "🔧 Installing dependencies..."
npm ci --no-audit --prefer-offline --cache .npm --prefer-offline

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Run database migrations in production mode
echo "🚀 Running database migrations..."
NODE_ENV=production npx prisma migrate deploy

# Verify database connection
echo "🔌 Verifying database connection..."
npx prisma db execute --stdin --url="$DATABASE_URL" <<< "SELECT 1 AS connection_test;"

# Build the application
echo "🏗️  Building the application..."
npm run build

# Generate sitemap if postbuild script exists
if grep -q "postbuild" package.json; then
    echo "🗺️  Generating sitemap..."
    npm run postbuild
fi

# Verify build output
if [ ! -d ".next" ]; then
    echo "❌ Error: Build failed - .next directory not found"
    exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "✅ [${TIMESTAMP}] Build completed successfully!"

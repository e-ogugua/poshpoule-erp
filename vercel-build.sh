#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "Generating Prisma client..."
pnpm db:generate

# Run database migrations
echo "Running database migrations..."
pnpm db:migrate

# Build the application
echo "Building the application..."
pnpm build

# Generate sitemap
echo "Generating sitemap..."
pnpm postbuild

echo "Build completed successfully!"

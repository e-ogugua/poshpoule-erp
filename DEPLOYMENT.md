# PoshPOULE Farms - Deployment Guide

This document provides detailed instructions for deploying the PoshPOULE Farms application to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [Database Migrations](#database-migrations)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.x (LTS)
- pnpm 8.x
- Vercel CLI (for Vercel deployments)
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_sunRjm98IBPG@ep-divine-forest-ad8z9yxm.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Next.js
NEXT_PUBLIC_SITE_URL="https://poshpoule.com"
NEXT_PUBLIC_ENABLE_CSP="false"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://poshpoule-farms.vercel.app"

# Email (for contact forms, etc.)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@poshpoule.com"
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/poshpoule-farms.git
   cd poshpoule-farms
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the database:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [https://poshpoule-farms.vercel.app](https://poshpoule-farms.vercel.app) in your browser.

## Vercel Deployment

### Prerequisites

- Vercel account
- Vercel CLI installed (`pnpm add -g vercel`)
- Project linked to a Vercel project

### Deployment Steps

1. **Build the project locally (optional, for testing):**
   ```bash
   pnpm vercel:deploy
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

   Or push to your main branch if you have Vercel's GitHub integration set up.

3. **Set up environment variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add all the variables from your `.env.local` file

## Database Migrations

### Creating a new migration

1. Make your schema changes in `prisma/schema.prisma`
2. Create a migration:
   ```bash
   pnpm db:migrate --name your_migration_name
   ```

### Applying migrations in production

Migrations are automatically applied during the build process on Vercel. For manual application:

```bash
pnpm db:migrate --prod
```

## Troubleshooting

### Build Failures

- **Error: Module not found**
  - Run `pnpm install` to ensure all dependencies are installed

- **Database connection issues**
  - Verify your `DATABASE_URL` is correct
  - Ensure the database server is running and accessible

### Runtime Errors

- Check the Vercel logs for detailed error messages
- Verify all environment variables are set correctly

### Performance Issues

- Enable caching in your Vercel project settings
- Optimize images using the built-in Next.js Image component
- Use the `next-sitemap` to improve SEO

## Monitoring

- Vercel provides built-in monitoring and analytics
- Set up error tracking with a service like Sentry
- Monitor database performance using Prisma's built-in logging

## Rollback

To rollback to a previous deployment in Vercel:

1. Go to your project in the Vercel dashboard
2. Navigate to the "Deployments" tab
3. Find the deployment you want to roll back to
4. Click the "..." menu and select "Redeploy"

## Contact

For support, please contact the development team at [your-email@example.com](mailto:your-email@example.com).

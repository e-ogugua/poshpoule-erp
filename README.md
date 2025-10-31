# PoshPOULE Farms ERP Suite

A full-stack e-commerce and enterprise resource planning platform built for agricultural operations, specifically designed for organic farming businesses. The application provides comprehensive farm-to-consumer operations management including inventory, orders, customer relationship management, and multi-channel sales capabilities.

## Live Demo

- https://poshpoule-farms.vercel.app

## Technical Overview

### Architecture
- **Framework**: Next.js 15 with App Router and Server Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with session-based security
- **Styling**: TailwindCSS with custom design system
- **Type Safety**: TypeScript throughout the application
- **State Management**: React Server Components with minimal client-side state
- **Image Optimization**: Next.js Image component with WebP/AVIF support

### Key Features

#### Customer-Facing Application
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Product Catalog**: Dynamic product listings with category filtering
- **Multi-Currency Support**: Real-time currency conversion (NGN, USD, GBP)
- **Order Management**: Pre-order system with form validation and email notifications
- **Content Management**: Blog system for farm updates and educational content
- **Media Gallery**: Image management with category filtering and lazy loading
- **Contact System**: Customer inquiry handling with email integration

#### Administrative Dashboard
- **Order Processing**: Complete order lifecycle management
- **Inventory Control**: Product CRUD operations with stock tracking
- **Customer Database**: Customer profiles and order history
- **Schedule Management**: Pickup and delivery time slot coordination
- **Content Administration**: Blog post creation and management
- **System Configuration**: Multi-currency rates and site settings

## Development Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **Package Manager**: pnpm 10.17.1 or npm
- **Database**: PostgreSQL database (local or cloud service like Neon)
- **Git**: For version control

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/e-ogugua/PoshPOULE-Farms-suite.git
   cd PoshPOULE-Farms-suite
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```

   Configure the following required environment variables in `.env.local`:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

   # Next.js Configuration
   NEXTAUTH_SECRET="your-generated-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Application Settings
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. **Database Setup**:
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run database migrations
   pnpm prisma migrate dev

   # (Optional) Seed database with sample data
   pnpm prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Development Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint with auto-fix
pnpm type-check      # TypeScript type checking

# Database
pnpm prisma studio   # Open Prisma Studio
pnpm prisma migrate dev  # Create and apply migration
pnpm prisma db seed  # Seed database with sample data

# Quality Assurance
pnpm format          # Format code with Prettier
pnpm optimize-images # Optimize images for production
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Administrative dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── settings/      # System configuration
│   ├── api/               # API routes (Next.js 15 API handlers)
│   ├── products/          # Product catalog pages
│   ├── blog/              # Blog system
│   └── contact/           # Contact forms
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── contexts/              # React contexts (Currency, Authentication)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── prisma.ts         # Database client configuration
│   └── validation.ts     # Data validation schemas
└── types/                # TypeScript type definitions

prisma/
└── schema.prisma         # Database schema definition

public/
├── images/               # Static assets (product images, logos)
└── optimized-images/     # WebP/AVIF optimized images
```

## Design System

### Color Palette
- **Primary**: `#1F6E3A` - Earth green representing organic farming
- **Secondary**: `#D4AF37` - Gold accent for premium products
- **Neutral Grays**: `#F5F5F5` through `#171717`
- **Accent Colors**: Semantic colors for success, warning, and error states

### Typography
- **Headings**: Playfair Display (serif) - 300, 400, 500, 600, 700 weights
- **Body Text**: Inter (sans-serif) - 300, 400, 500, 600, 700 weights
- **Responsive Scaling**: Fluid typography with breakpoint-specific adjustments

### Layout System
- **Mobile-First**: Base styles target mobile devices (320px+)
- **Breakpoints**:
  - `sm`: 640px and up (tablet portrait)
  - `md`: 768px and up (tablet landscape)
  - `lg`: 1024px and up (desktop)
  - `xl`: 1280px and up (large desktop)

## Key Technical Decisions

### Hybrid Database Approach
The application uses a hybrid approach for data persistence:

1. **Primary Database**: PostgreSQL with Prisma ORM for structured data (users, orders, products, reviews)
2. **File-Based Storage**: JSON files for configuration and seed data
3. **Rationale**: Provides flexibility during development while maintaining data integrity for production workloads

### Server Components Strategy
Next.js 15 App Router enables:

- **Reduced Bundle Size**: Server components eliminate client-side JavaScript for static content
- **Improved Performance**: Server-side rendering for better Core Web Vitals
- **SEO Optimization**: Automatic meta tag generation and structured data
- **Type Safety**: End-to-end TypeScript support

### State Management
- **Server State**: Prisma for database operations
- **Client State**: Minimal React state for UI interactions
- **Global State**: React Context for currency settings and authentication
- **Rationale**: Simplifies complexity while maintaining performance

### Image Optimization Strategy
- **Next.js Image Component**: Automatic WebP/AVIF conversion and responsive sizing
- **Lazy Loading**: Implemented for non-critical images
- **CDN Integration**: Vercel Image Optimization for global delivery
- **Performance Impact**: Reduced initial page load and improved Core Web Vitals

## API Reference

### Public Endpoints
```typescript
GET    /api/products              // Fetch all products with optional category filter
GET    /api/products/[slug]       // Fetch single product by slug
GET    /api/currencies            // Get current currency conversion rates
POST   /api/orders                // Submit new order
POST   /api/leads                 // Submit contact form
GET    /api/gallery               // Fetch gallery images
```

### Admin-Only Endpoints
```typescript
GET    /api/admin/stats           // Dashboard statistics
GET    /api/admin/orders          // Order management
PUT    /api/admin/orders/[id]     // Update order status
POST   /api/admin/products        // Create new product
PUT    /api/admin/products/[id]   // Update existing product
DELETE /api/admin/products/[id]   // Delete product
```

### Authentication Requirements
Admin endpoints require valid NextAuth session. The application implements role-based access control with `admin` and `user` roles.

## Deployment

### Environment Configuration
Production deployment requires the following environment variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Application
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-specific-password"
```

### Platform Options

#### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Automatic Deployment**: Configure branch-based deployments
3. **Environment Variables**: Set production variables in Vercel dashboard
4. **Domain Configuration**: Configure custom domain if needed

#### Manual Deployment
1. **Build Application**:
   ```bash
   pnpm build
   ```

2. **Start Production Server**:
   ```bash
   pnpm start
   ```

3. **Process Management**: Use PM2 or similar for production process management

### Database Migration Strategy
- **Development**: `prisma migrate dev` for schema changes
- **Production**: `prisma migrate deploy` for zero-downtime migrations
- **Rollback**: Manual intervention required for production rollbacks

## Security Considerations

### Authentication
- **Session-Based**: Secure HTTP-only cookies
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access**: Admin and user role separation

### Data Protection
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: React's automatic escaping and Content Security Policy headers

### Infrastructure Security
- **HTTPS Only**: Production deployments enforce HTTPS
- **Security Headers**: Configured via Next.js headers API
- **Dependency Updates**: Regular security patch management

## Performance Optimization

### Core Web Vitals
- **LCP**: Optimized with Next.js Image component and server-side rendering
- **CLS**: Stable layouts with consistent spacing and typography
- **FID**: Minimal client-side JavaScript and optimized bundle splitting

### Caching Strategy
- **Static Generation**: Product pages and blog posts pre-rendered
- **Image Optimization**: Automatic format conversion and CDN delivery
- **Database Query Optimization**: Prisma connection pooling

### Bundle Analysis
Monitor bundle size with built-in Next.js bundle analyzer:
```bash
pnpm build --analyze
```

## Testing Strategy

### Development Testing
- **Type Checking**: `pnpm type-check` for TypeScript validation
- **Linting**: `pnpm lint` with ESLint auto-fix
- **Formatting**: `pnpm format` with Prettier

### Production Validation
- **Build Testing**: Verify production builds before deployment
- **Environment Validation**: Test with production environment variables
- **Performance Testing**: Core Web Vitals monitoring

## Troubleshooting

### Common Development Issues

**Database Connection Errors**:
- Verify `DATABASE_URL` format and credentials
- Ensure database server is running and accessible
- Check network connectivity and firewall settings

**Build Failures**:
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Verify Node.js version compatibility

**TypeScript Errors**:
- Run type checking: `pnpm type-check`
- Ensure all imports are correctly resolved
- Check for missing type definitions

### Performance Issues

**Slow Development Server**:
- Enable Fast Refresh in development
- Use development mode optimizations
- Monitor memory usage and restart if needed

**Large Bundle Size**:
- Analyze bundle with `pnpm build --analyze`
- Remove unused dependencies
- Implement code splitting for large components

## Support and Maintenance

### Development Workflow
1. **Feature Branches**: Create feature-specific branches from `main`
2. **Code Review**: All changes require review before merging
3. **Testing**: Validate changes across different environments
4. **Documentation**: Update relevant documentation for new features

### Monitoring
- **Error Tracking**: Implement error logging service (e.g., Sentry)
- **Performance Monitoring**: Vercel Analytics for Core Web Vitals
- **Database Monitoring**: Prisma logging and query optimization

## Ecosystem Links

- EmmanuelOS: https://github.com/e-ogugua/emmanuelos
- Portfolio Hub: https://ceodev.vercel.app/

---
**Developed by CEO – Chukwuka Emmanuel Ogugua**  
**PoshPOULE® Farms ERP Suite**

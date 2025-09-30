// Optional Sentry configuration
let withSentryConfig = (config) => config;

try {
  const sentry = require('@sentry/nextjs');
  withSentryConfig = sentry.withSentryConfig || withSentryConfig;
} catch (e) {
  console.log('Sentry is not installed, skipping Sentry configuration');
}

// Environment variables
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

// Security headers
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

// Common configuration
const commonConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'poshpoule.com',
      },
      {
        protocol: 'https',
        hostname: 'poshpoule.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'poshpoule-farms.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: isDev ? 60 : 60 * 60 * 24 * 7, // 1 min in dev, 1 week in prod
    qualities: isDev ? [75, 85, 90, 100] : [75, 85, 90, 100],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Webpack configuration
  webpack(config, { isServer, dev }) {
    // Add custom webpack configurations here
    if (!isServer) {
      // Client-side only configurations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Add bundle analyzer in development or when ANALYZE=true
    if (isDev || isAnalyze) {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: isAnalyze,
      });
      return withBundleAnalyzer(config);
    }

    return config;
  },

  // Experimental features
  experimental: {
    scrollRestoration: true,
    webpackBuildWorker: true,
    optimizeCss: true,
  },
};

// Development-specific configuration
const devConfig = {
  ...commonConfig,
  productionBrowserSourceMaps: true, // Enable source maps in development for better debugging
  compiler: {
    removeConsole: false, // Keep console logs in development
  },
};

// Production-specific configuration
const prodConfig = {
  ...commonConfig,
  productionBrowserSourceMaps: false, // Disable source maps in production by default
  compiler: {
    removeConsole: { exclude: ['error'] }, // Remove console logs except errors in production
  },
};

// Combine configurations based on environment
let nextConfig = isProd ? prodConfig : devConfig;

// Add Sentry configuration if SENTRY_AUTH_TOKEN is present
if (process.env.SENTRY_AUTH_TOKEN) {
  nextConfig = withSentryConfig(
    nextConfig,
    {
      // Suppresses source map uploading logs during build
      silent: true,
      
      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: false,

      // Routes browser requests to Sentry through a Next.js rewrite
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    },
    {
      // Suppresses all logs
      silent: true,
      
      // Only upload source maps in production
      dryRun: !isProd,
    }
  );
}

export default nextConfig;

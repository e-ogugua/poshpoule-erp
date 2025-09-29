/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Image optimization
  images: {
    domains: [
      'localhost', 
      'poshpoule-farms.vercel.app',
      'images.unsplash.com', 
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    qualities: [75, 85, 90, 95, 100], // All quality values used in the application
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Configure output for Vercel
  output: 'standalone',

  // Experimental features
  experimental: {
    scrollRestoration: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    serverActions: true,
    webpackBuildWorker: true,
    optimizeCss: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error'] } 
      : false,
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Add rule for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Handle fallback for server-only modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'next/dist/compiled/next-server/server.runtime.prod.js': false,
      };
    }

    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      // Enable module concatenation
      config.optimization.concatenateModules = true;
      // Minimize in production
      config.optimization.minimize = true;
    }

    // Add source map support in development
    if (dev && !isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },

  // Security and cache headers
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Cache control for static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          ...securityHeaders,
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          ...securityHeaders,
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

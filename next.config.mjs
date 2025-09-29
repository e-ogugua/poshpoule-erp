import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    unoptimized: process.env.NODE_ENV !== 'production',
  },

  // Headers for security, performance, and caching
  async headers() {
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

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Only run in production
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      // Enable module concatenation
      config.optimization.concatenateModules = true;
      // Minimize in production
      config.optimization.minimize = true;
    }
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  productionBrowserSourceMaps: false,
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

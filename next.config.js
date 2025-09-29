/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double rendering in development
  swcMinify: true,
  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,
  // Enable React's new streaming server renderer
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // Disable the new React compiler as it might cause issues
    reactCompiler: false,
    // Disable the new React server components as they might cause issues
    serverComponents: false,
  },
  // Enable webpack optimizations
  webpack: (config, { isServer }) => {
    // Only run these optimizations in production
    if (!isServer) {
      // Disable source maps to reduce memory usage
      config.devtool = false;
      
      // Disable the default webpack minifier to use swcMinify
      config.optimization.minimizer = [];
    }
    return config;
  },
  images: {
    domains: ['localhost', 'poshpoule-farms.vercel.app'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    if (process.env.NEXT_PUBLIC_ENABLE_CSP === 'true') {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-scripts.com;
          style-src 'self' 'unsafe-inline' fonts.googleapis.com;
          img-src 'self' data: blob: https:;
          font-src 'self' fonts.gstatic.com;
          connect-src 'self' *.vercel-insights.com;
          frame-ancestors 'none';
          form-action 'self';
          base-uri 'self';
          object-src 'none';
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ').trim(),
      });
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;
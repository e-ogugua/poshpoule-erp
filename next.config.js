/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React strict mode in development to prevent double rendering
  reactStrictMode: false,
  
  // Use SWC for minification (faster than Terser)
  swcMinify: true,
  
  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,
  
  // Configure image optimization
  images: {
    domains: ['localhost', 'poshpoule-farms.vercel.app'],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256],
  },
  
  // Security headers
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

    // Add CSP header if enabled
    if (process.env.NEXT_PUBLIC_ENABLE_CSP === 'true') {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:;"
      });
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  
  // Rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Only apply these optimizations in production
    if (!dev) {
      // Disable source maps in production to reduce memory usage
      config.devtool = false;
      
      // Configure minimizers for production
      config.optimization.minimizer = [
        new (require('terser-webpack-plugin'))({
          parallel: true,
          terserOptions: {
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: { safari10: true },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new (require('css-minimizer-webpack-plugin'))({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ];
      
      // Enable minification
      config.optimization.minimize = true;
    }
    
    // Important: return the modified config
    return config;
  },
  
  // Experimental features
  experimental: {
    // Enable scroll restoration
    scrollRestoration: true,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;

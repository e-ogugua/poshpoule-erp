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
      
      // Disable the default webpack minifier to use swcMinify
      config.optimization.minimizer = [];
      
      // Only add CSS minimizer if not already present
      if (Array.isArray(config.optimization.minimizer)) {
        try {
          config.optimization.minimizer.push(
            new (require('css-minimizer-webpack-plugin'))()
          );
        } catch (e) {
          console.warn('css-minimizer-webpack-plugin not found, skipping CSS optimization');
        }
      }
    }
    
    // Important: return the modified config
    return config;
  },
  
  // Experimental features
  experimental: {
    // Disable features that might cause issues
    optimizeCss: false, // Disable as we're handling it in webpack
    scrollRestoration: true,
    // Disable the new React compiler as it might cause issues
    reactCompiler: false,
    // Disable the new React server components as they might cause issues
    serverComponents: false,
    // Disable webpack's cache to prevent memory issues
    webpackBuildWorker: false,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;

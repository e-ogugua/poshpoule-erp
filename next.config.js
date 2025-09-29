/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    
    if (process.env.NEXT_PUBLIC_ENABLE_CSP === 'true') {
      securityHeaders.push({
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:;"
      });
    }
    
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: '/api/:path*' }];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Only optimize in production
    if (!dev) {
      // Add Terser plugin for JS minification
      const TerserPlugin = require('terser-webpack-plugin');
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      
      config.optimization.minimizer = [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true,
              drop_debugger: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
      ];
      
      config.optimization.minimize = true;
      config.devtool = false;
    }
    return config;
  },
};

// Bundle analyzer (only in development)
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}

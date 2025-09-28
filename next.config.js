/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization during build
  },
  swcMinify: true, // Enable SWC minification
  output: 'standalone', // Output standalone build
  productionBrowserSourceMaps: false, // Disable source maps in production
  typescript: {
    ignoreBuildErrors: true, // Disable type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
        'public/optimized-images/**/*',
        'public/images/**/*'
      ]
    }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http://localhost:3000; connect-src 'self';",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

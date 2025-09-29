/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig

// Production-specific Next.js configuration
const withProdConfig = (config) => {
  // Add production-specific configurations here
  return {
    ...config,
    // Disable source maps in production
    productionBrowserSourceMaps: false,
    // Enable React strict mode
    reactStrictMode: true,
    // Enable SWC minification
    swcMinify: true,
    // Enable compression
    compress: true,
    // Enable standalone output
    output: 'standalone',
  };
};

module.exports = withProdConfig;

// Note: This file is used in the build process. Make sure to update your build scripts accordingly.

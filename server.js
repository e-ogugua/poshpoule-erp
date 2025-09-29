const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Set development mode based on environment
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

// Initialize Next.js app
const app = next({
  dev,
  dir: __dirname,
  hostname,
  port,
  // Disable the default server runtime
  conf: process.env.NODE_ENV === 'production' 
    ? { distDir: '.next' } 
    : {}
});

// Get the request handler
const handle = app.getRequestHandler();

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Handle static files and public files
      if (pathname.startsWith('/_next/') || 
          pathname.startsWith('/static/') ||
          pathname === '/favicon.ico') {
        await handle(req, res, parsedUrl);
        return;
      }

      // Handle all other requests
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  // Start listening
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

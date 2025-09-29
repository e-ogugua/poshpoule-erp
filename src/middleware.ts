import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed domains for Content Security Policy
const cspDirectives = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.vercel-insights.com;",
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
  "img-src 'self' data: blob: https:;",
  "font-src 'self' data: fonts.gstatic.com;",
  "connect-src 'self' *.google-analytics.com *.vercel-insights.com vitals.vercel-insights.com;",
  "frame-src 'self';",
  "object-src 'none';",
  "base-uri 'self';",
  "form-action 'self';",
  "frame-ancestors 'none';",
  "block-all-mixed-content;",
  "upgrade-insecure-requests;"
].join(' ');

// List of allowed domains for Referrer Policy
const referrerPolicy = [
  'strict-origin-when-cross-origin',
  'origin-when-cross-origin',
  'strict-origin',
  'origin',
  'same-origin',
].join(',');

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add pathname to headers for tracking
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  
  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', referrerPolicy);
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', cspDirectives);
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // Cache control for static assets
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Handle redirects
  const { pathname } = request.nextUrl;
  
  // Redirect www to non-www (handled by Vercel/Netlify in production)
  if (process.env.NODE_ENV === 'production' && request.headers.get('host')?.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = url.host.replace('www.', '');
    return NextResponse.redirect(url, 308);
  }
  
  // Remove trailing slashes
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }
  
  return response;
}

// Apply to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

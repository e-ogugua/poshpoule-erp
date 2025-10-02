import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = ['/login', '/api/auth'];

// Admin paths that require admin role
const adminPaths = ['/admin'];

// List of allowed domains for Content Security Policy

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
  'origin',
  'same-origin',
].join(',');

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const currentPath = url.pathname;
  
  // Skip middleware for public paths
  if (publicPaths.some(path => currentPath.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check if the path is an admin path
  const isAdminPath = adminPaths.some(path => currentPath.startsWith(path));
  
  // For admin paths, check authentication and role
  if (isAdminPath) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', currentPath);
      return NextResponse.redirect(loginUrl);
    }
    
    // If not an admin, return 403
    if (token.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add current path to headers for tracking
  requestHeaders.set('x-pathname', currentPath);
  
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
  if (currentPath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Redirect www to non-www (handled by Vercel/Netlify in production)
  if (process.env.NODE_ENV === 'production' && request.headers.get('host')?.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = url.host.replace('www.', '');
    return NextResponse.redirect(url, 308);
  }
  
  // Remove trailing slashes
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = currentPath.slice(0, -1);
    return NextResponse.redirect(newUrl, 308);
  }
  
  return response;
}
// Apply to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - except /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|login).*)',
    // specifically include all admin routes
    '/admin/:path*',
  ],
};

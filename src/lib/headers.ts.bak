import { NextResponse } from 'next/server';

/**
 * CORS & Security Headers Helper
 * Provides consistent CORS and security headers for API routes
 */

export function setCORSHeaders(response: NextResponse) {
  // CORS headers
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development' ? '*' : process.env.NEXTAUTH_URL || '*'
  );
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy for API routes
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
  );

  return response;
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleOPTIONS() {
  const response = new NextResponse(null, { status: 200 });

  // CORS headers for preflight requests
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development' ? '*' : process.env.NEXTAUTH_URL || '*'
  );
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

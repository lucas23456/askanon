import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();
  
  // Check if the request is for an admin route (except login)
  const isAdminRoute = path.startsWith('/admin') && !path.includes('/admin/login');
  
  // Check if the user is authenticated
  const authCookie = request.cookies.get('admin_token');
  const isAuthenticated = !!authCookie;
  
  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // If it's the login route and the user is already authenticated, redirect to admin dashboard
  if (path === '/admin/login' && isAuthenticated) {
    const url = new URL('/admin', request.url);
    return NextResponse.redirect(url);
  }
  
  // Add CORS headers for API routes
  if (path.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }
  
  return response;
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/questions'],
}; 
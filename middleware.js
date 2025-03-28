import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const url = req.nextUrl;
  
  // If user is not authenticated and trying to access protected routes
  if (!session && (
    url.pathname.startsWith('/student/') ||
    url.pathname.startsWith('/company/') ||
    url.pathname === '/profile'
  )) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', url.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If user is authenticated, check their user type for correct routing
  if (session) {
    const userType = session.user.user_metadata.user_type;
    
    // Redirect student trying to access company routes
    if (userType === 'student' && url.pathname.startsWith('/company/')) {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }
    
    // Redirect company trying to access student routes
    if (userType === 'company' && url.pathname.startsWith('/student/')) {
      return NextResponse.redirect(new URL('/company/dashboard', req.url));
    }
    
    // For generic profile page, redirect to the appropriate complete-profile page
    if (url.pathname === '/profile') {
      if (userType === 'student') {
        return NextResponse.redirect(new URL('/student/complete-profile', req.url));
      } else if (userType === 'company') {
        return NextResponse.redirect(new URL('/company/complete-profile', req.url));
      }
    }
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/profile',
    '/student/:path*',
    '/company/:path*',
  ],
};
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define protected routes that require authentication
  const protectedRoutes = ['/chat', '/matches', '/profile'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If accessing a protected route without authentication, redirect to auth page
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth', req.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user tries to access auth page, redirect to home
  if (session && req.nextUrl.pathname === '/auth') {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo');
    const redirectUrl = new URL(redirectTo || '/', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

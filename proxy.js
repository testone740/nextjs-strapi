import { NextResponse } from 'next/server';
import { JWT_COOKIE } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/register'];

export function proxy(req) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const hasJwt = req.cookies.has(JWT_COOKIE);
  if (!hasJwt) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|favicon|api/).*)'],
};

// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect company pages
  if (pathname.startsWith('/[') && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}
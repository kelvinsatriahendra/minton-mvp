import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  
  // Cek untuk Dashboard User & Checkout
  if (url.startsWith('/dashboard') || url.startsWith('/admin') || url.startsWith('/sewa-lapangan/checkout')) {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Cek untuk Dashboard Mitra
  if (url.startsWith('/kemitraan/dashboard-mitra')) {
    const mitraSession = request.cookies.get('mitraSession')?.value;
    if (!mitraSession) {
      return NextResponse.redirect(new URL('/kemitraan/login-mitra', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/kemitraan/dashboard-mitra/:path*', '/sewa-lapangan/checkout'],
};

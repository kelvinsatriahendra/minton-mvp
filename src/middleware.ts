import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simulasi mengecek session (bisa dari cookies)
  const session = request.cookies.get('session')?.value;

  // Jika tidak ada session dan user mencoba akses rute dashboard atau admin
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika ada session, izinkan lanjut
  return NextResponse.next();
}

// Menentukan rute mana saja yang dikunci
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};


import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  const { userName, email, userId } = await request.json();
  const cookieStore = await cookies();

  // 1. Sync to database
  await supabase.from('users').upsert({
    email: email,
    nama_lengkap: userName,
    password: 'oauth-user'
  }, { onConflict: 'email' });

  // 2. Set cookies
  cookieStore.set('session', 'supabase-session-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  cookieStore.set('isLoggedIn', 'true', { path: '/' });
  cookieStore.set('userName', userName, { path: '/' });
  cookieStore.set('userEmail', email, { path: '/' });

  return NextResponse.json({ success: true });
}

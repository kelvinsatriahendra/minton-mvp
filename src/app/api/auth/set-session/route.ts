import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  const { userName, email, userId } = await request.json();
  const cookieStore = await cookies();

  const sessionToken = crypto.randomUUID();

  await supabase.from('users').upsert({
    email: email,
    nama_lengkap: userName,
    password: 'oauth-user',
    session_token: sessionToken,
  }, { onConflict: 'email' });

  cookieStore.set('session', sessionToken, {
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

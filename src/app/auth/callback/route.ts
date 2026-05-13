
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  console.log('Auth Callback Hit:', requestUrl.toString());

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    console.log('Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Exchange Error:', error.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
      console.log('User authenticated:', data.user.email);
      const cookieStore = await cookies();
      const user = data.user;
      const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Jagoan';
      
      // Sync to public.users
      const { error: dbError } = await supabase.from('users').upsert({
        email: user.email,
        nama_lengkap: userName,
        whatsapp: `google-${user.id.substring(0, 8)}`,
        password: 'oauth-user' 
      }, { onConflict: 'email' });

      if (dbError) console.error('Database Sync Error:', dbError);

      cookieStore.set('session', 'supabase-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      cookieStore.set('isLoggedIn', 'true', { path: '/' });
      cookieStore.set('userName', userName, { path: '/' });
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.warn('No code found in callback URL');
  return NextResponse.redirect(`${origin}/login?error=No authentication code found`);
}

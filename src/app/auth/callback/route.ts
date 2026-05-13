
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const cookieStore = await cookies();
      const user = data.user;
      const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Jagoan';
      
      // 1. Sync to public.users table (Task 2 Requirement Integration)
      await supabase.from('users').upsert({
        email: user.email,
        nama_lengkap: userName,
        whatsapp: '0000000000', // Placeholder
        password: 'oauth-user' // Mark as OAuth user
      }, { onConflict: 'email' });

      // 2. Set cookies (Middleware & UI requirements)
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

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}

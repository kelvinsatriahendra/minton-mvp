'use server'

import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function sendOtpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) return { error: 'Email tidak valid.' };

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) throw error;

    return { success: true, email };
  } catch (err: any) {
    console.error('Error sending OTP:', err);
    return { error: 'Gagal mengirim kode OTP. Coba lagi.' };
  }
}

export async function verifyOtpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  if (!email || !code) return { error: 'Email dan kode OTP wajib diisi.' };

  try {
    for (const type of ['email', 'signup'] as const) {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type });
      if (!error) {
        await supabase.from('users').update({ email_verified: true }).eq('email', email);

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        const cookieStore = await cookies();
        cookieStore.set('session', 'supabase-session-token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        cookieStore.set('userName', user?.nama_lengkap || '', { path: '/' });
        cookieStore.set('userEmail', user?.email || '', { path: '/' });
        cookieStore.set('isLoggedIn', 'true', { path: '/' });

        return { success: true };
      }
    }

    throw new Error('Kode OTP tidak valid.');
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { error: 'Gagal memverifikasi OTP. Coba lagi.' };
  }
}

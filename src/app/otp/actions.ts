'use server'

import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) return { error: 'Email tidak valid.' };

  try {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from('otp_codes').insert({
      email,
      code,
      expires_at: expiresAt,
    });

    console.log('=== OTP for', email, '===', code);

    return { success: true, email, devOtp: code };
  } catch (err) {
    console.error('Error sending OTP:', err);
    return { error: 'Gagal mengirim kode OTP. Coba lagi.' };
  }
}

export async function verifyOtpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  if (!email || !code) return { error: 'Email dan kode OTP wajib diisi.' };

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { error: 'Kode OTP tidak valid atau sudah kadaluarsa.' };

    await supabase.from('otp_codes').update({ used: true }).eq('id', data.id);
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
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { error: 'Gagal memverifikasi OTP. Coba lagi.' };
  }
}

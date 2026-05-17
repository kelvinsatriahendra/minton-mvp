'use server'

import { supabase } from '@/utils/supabase';

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
  const source = (formData.get('source') as string) || 'signup';

  if (!email || !code) return { error: 'Email dan kode OTP wajib diisi.' };

  try {
    const typeOrder: Array<'email' | 'signup'> =
      source === 'login' ? ['email', 'signup'] : ['signup', 'email'];

    let lastError: string | null = null;
    for (const type of typeOrder) {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type });
      if (!error) {
        await supabase.from('users').update({ email_verified: true }).eq('email', email);
        return { success: true, redirect: '/login' };
      }
      lastError = error?.message || null;
    }

    if (lastError?.toLowerCase().includes('expired')) {
      return { error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' };
    }
    return { error: 'Kode OTP tidak valid. Periksa kembali kode yang dimasukkan.' };
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { error: 'Gagal memverifikasi OTP. Coba lagi.' };
  }
}

'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabase';

const loginSchema = z.object({
  email: z.string().email({ message: "Email wajib diisi" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
});

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal login, periksa kembali input Anda.",
    };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) return { message: 'Terjadi kesalahan server. Silakan coba lagi.' };
    if (!data) return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };

    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };

    const user = data;

    if (!user.email_verified) {
      return { message: 'Email belum terverifikasi. Silakan cek OTP yang dikirim ke email Anda.', needsOtp: true, email: user.email };
    }
    
    const sessionToken = crypto.randomUUID();
    await supabase.from('users').update({ session_token: sessionToken }).eq('email', email);

    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    cookieStore.set('userName', user.nama_lengkap, { path: '/' });
    cookieStore.set('userEmail', user.email, { path: '/' });
    cookieStore.set('isLoggedIn', 'true', { path: '/' });

    return { success: true, userName: user.nama_lengkap };
  } catch (err) {
    console.error('Error Login:', err);
    return { message: 'Terjadi kesalahan pada server saat login.' };
  }
}

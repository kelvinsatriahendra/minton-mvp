'use server'

import { z } from 'zod';
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
      .eq('password', password);

    if (error) throw error;

    if (data && data.length > 0) {
      const user = data[0];

      if (!user.email_verified) {
        return { message: 'Email belum terverifikasi. Silakan cek OTP yang dikirim ke email Anda.', needsOtp: true, email: user.email };
      }
      
      const cookieStore = await cookies();
      cookieStore.set('session', 'supabase-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      cookieStore.set('userName', user.nama_lengkap, { path: '/' });
      cookieStore.set('userEmail', user.email, { path: '/' });
      cookieStore.set('isLoggedIn', 'true', { path: '/' });

      return { success: true, userName: user.nama_lengkap };
    } else {
      return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };
    }
  } catch (err) {
    console.error('Error Login:', err);
    return { message: 'Terjadi kesalahan pada server saat login.' };
  }
}

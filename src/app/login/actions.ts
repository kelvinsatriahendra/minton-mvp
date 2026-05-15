'use server'

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabase';

const loginSchema = z.object({
  loginId: z.string().min(1, { message: "Email atau Whatsapp wajib diisi" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
});

export async function loginAction(prevState: any, formData: FormData) {
  const loginId = formData.get('loginId') as string;
  const password = formData.get('password') as string;

  const validatedFields = loginSchema.safeParse({ loginId, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal login, periksa kembali input Anda.",
    };
  }

  try {
    const isEmail = loginId.includes('@');
    const columnToCheck = isEmail ? 'email' : 'whatsapp';
    
    // Supabase Query persis seperti auth.js
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq(columnToCheck, loginId)
      .eq('password', password);

    if (error) throw error;

    if (data && data.length > 0) {
      const user = data[0];
      
      const cookieStore = await cookies();
      // Set session agar bisa masuk /dashboard (Task 1 Middleware)
      cookieStore.set('session', 'supabase-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      // Simpan user nama di cookie untuk UI (optional)
      cookieStore.set('userName', user.nama_lengkap, { path: '/' });
      cookieStore.set('userEmail', user.email, { path: '/' });
      cookieStore.set('isLoggedIn', 'true', { path: '/' });

      // Return sukses, UI yang akan redirect
      return { success: true, userName: user.nama_lengkap };
    } else {
      return { message: 'Maaf, Email/Whatsapp atau Kata Sandi Anda salah.' };
    }
  } catch (err) {
    console.error('Error Login:', err);
    return { message: 'Terjadi kesalahan pada server saat login.' };
  }
}

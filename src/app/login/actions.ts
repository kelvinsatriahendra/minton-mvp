'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

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
    const supabaseClient = createServerSupabaseClient();
    const trimmedEmail = email.trim().toLowerCase();

    let { data: users, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', trimmedEmail);

    if (error) {
      console.error('Login select error:', error);
      return { message: 'Terjadi kesalahan server: ' + error.message };
    }

    if (!users || users.length === 0) {
      const { data: ilikeUsers, error: ilikeError } = await supabaseClient
        .from('users')
        .select('*')
        .ilike('email', trimmedEmail);
      if (ilikeError) console.error('Login ilike error:', ilikeError);
      users = ilikeUsers || null;
    }

    if (!users || users.length === 0) {
      console.log('User not found for email:', email);
      return { message: 'Email tidak ditemukan. Pastikan email yang dimasukkan sudah benar.' };
    }

    const data = users[0];
    console.log('User found:', { email: data.email, id: data.id, verified: data.email_verified });

    if (!data.password) {
      return { message: 'Password salah. Periksa kembali kata sandi Anda.' };
    }

    let passwordMatch = false;
    const storedPassword: string = data.password;

    if (storedPassword === 'oauth-user') {
      return { message: 'Akun ini terdaftar dengan Google. Silakan masuk menggunakan Google.' };
    }

    if (storedPassword.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, storedPassword);
    } else {
      // Legacy fallback: allow plaintext password once, then migrate to bcrypt hash.
      passwordMatch = password === storedPassword;
      if (passwordMatch) {
        const migratedHash = await bcrypt.hash(password, 10);
        await supabaseClient
          .from('users')
          .update({ password: migratedHash })
          .eq('id', data.id);
      }
    }

    if (!passwordMatch) {
      return { message: 'Password salah. Periksa kembali kata sandi Anda.' };
    }

    const user = data;

    if (!user.email_verified) {
      return { message: 'Email belum terverifikasi. Silakan cek OTP yang dikirim ke email Anda.', needsOtp: true, email: user.email };
    }
    
    const sessionToken = crypto.randomUUID();
    await supabaseClient.from('users').update({ session_token: sessionToken }).eq('email', email);

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
    return { message: 'Terjadi kesalahan server: ' + (err instanceof Error ? err.message : 'Unknown error') };
  }
}

'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
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
      const { data: ilikeUsers } = await supabaseClient
        .from('users')
        .select('*')
        .ilike('email', trimmedEmail);
      users = ilikeUsers || null;
    }

    if (!users || users.length === 0) {
      return { message: 'Email tidak ditemukan. Pastikan email yang dimasukkan sudah benar.' };
    }

    const data = users[0];

    if (!data.password) {
      return { message: 'Password salah. Periksa kembali kata sandi Anda.' };
    }

    const storedPassword: string = data.password;

    if (storedPassword === 'oauth-user') {
      return { message: 'Akun ini terdaftar dengan Google. Silakan masuk menggunakan Google.' };
    }

    let passwordMatch = false;
    if (storedPassword.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, storedPassword);
    } else {
      passwordMatch = password === storedPassword;
      if (passwordMatch) {
        const migratedHash = await bcrypt.hash(password, 10);
        await supabaseClient.from('users').update({ password: migratedHash }).eq('id', data.id);
      }
    }

    if (!passwordMatch) {
      return { message: 'Password salah. Periksa kembali kata sandi Anda.' };
    }

    const { error: otpError } = await supabaseClient.auth.signInWithOtp({
      email: data.email,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      return { message: 'Gagal mengirim kode OTP. Coba lagi.' };
    }

    return { message: 'Kode OTP telah dikirim ke email Anda.', needsOtp: true, email: data.email };
  } catch (err) {
    console.error('Error Login:', err);
    return { message: 'Terjadi kesalahan server: ' + (err instanceof Error ? err.message : 'Unknown error') };
  }
}

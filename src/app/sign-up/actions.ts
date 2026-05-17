'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createServerSupabaseClient } from '@/utils/supabase';
import { sendOtpAction } from '../otp/actions';

const signUpSchema = z.object({
  nama: z.string().min(1, { message: "Nama lengkap wajib diisi" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
  gender: z.string().optional(),
});

export async function signUpAction(prevState: any, formData: FormData) {
  const nama = formData.get('nama') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const gender = formData.get('gender') as string;

  const validatedFields = signUpSchema.safeParse({ nama, email, password, gender });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal mendaftar, periksa kembali input Anda.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const payload: Record<string, any> = {
    nama_lengkap: nama,
    email: email,
    password: hashedPassword,
    email_verified: false,
  };
  if (gender) payload.gender = gender;

  try {
    const supabaseClient = createServerSupabaseClient();
    const { data: existing } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) return { message: 'Email sudah terdaftar. Silakan login.' };

    const { data, error } = await supabaseClient
      .from('users')
      .insert([payload]);

    if (error) throw error;

    const otpFormData = new FormData();
    otpFormData.set('email', email);
    const otpResult = await sendOtpAction(null, otpFormData);

    if (otpResult.error) {
      return { message: otpResult.error };
    }

    return { success: true, email, redirect: '/login' };
  } catch (err: any) {
    console.error('Error:', err);
    return { message: 'Gagal Mendaftar: ' + (err.message || 'Terjadi kesalahan jaringan.') };
  }
}

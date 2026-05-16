'use server'

import { z } from 'zod';
import { supabase } from '@/utils/supabase';

const signUpSchema = z.object({
  nama: z.string().min(1, { message: "Nama lengkap wajib diisi" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
});

export async function signUpAction(prevState: any, formData: FormData) {
  const nama = formData.get('nama') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = signUpSchema.safeParse({ nama, email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal mendaftar, periksa kembali input Anda.",
    };
  }

  const payload = {
    nama_lengkap: nama,
    email: email,
    password: password
  };

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([payload]);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error('Error:', err);
    return { message: 'Gagal Mendaftar: ' + (err.message || 'Terjadi kesalahan jaringan.') };
  }
}

'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

const loginMitraSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Kata sandi wajib diisi" }),
});

export async function loginMitraAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = loginMitraSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal login, periksa kembali input Anda.",
    };
  }

  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };

    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };

    const partner = data;
      
      const sessionToken = crypto.randomUUID();
      await supabase.from('partners').update({ session_token: sessionToken }).eq('email', email);

      const cookieStore = await cookies();
      cookieStore.set('mitraSession', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      // Store partner details in cookies for UI
      cookieStore.set('mitraName', partner.owner_name, { path: '/' });
      cookieStore.set('mitraEmail', partner.email, { path: '/' });
      cookieStore.set('mitraGorName', partner.gor_name, { path: '/' });
      cookieStore.set('mitraId', partner.id.toString(), { path: '/' });
      cookieStore.set('isMitraLoggedIn', 'true', { path: '/' });

      return { success: true, mitraName: partner.owner_name };
    } else {
      return { message: 'Maaf, Email atau Kata Sandi Anda salah.' };
    }
  } catch (err) {
    console.error('Error Login Mitra:', err);
    return { message: 'Terjadi kesalahan pada server saat login.' };
  }
}

'use server'

import { z } from 'zod';
import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

const registerMitraSchema = z.object({
  gor_name: z.string().min(3, { message: "Nama GOR minimal 3 karakter" }),
  owner_name: z.string().min(3, { message: "Nama Pemilik minimal 3 karakter" }),
  whatsapp: z.string().min(10, { message: "Nomor WhatsApp tidak valid" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  address: z.string().min(5, { message: "Alamat wajib diisi" }),
  city: z.string().min(3, { message: "Kota wajib diisi" }),
  maps_url: z.string().optional(),
  court_count: z.number().min(1, { message: "Jumlah lapangan minimal 1" }),
  floor_type: z.string(),
  facilities: z.array(z.string()).optional(),
  // For simplicity in MVP, we set a default password. In real app, there should be a password field in registration.
  password: z.string().min(6).optional().default('password123'), 
});

export async function registerMitraAction(prevState: any, formData: FormData) {
  // Parse facilities from FormData (multiple checkboxes with same name)
  const facilities: string[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith('facility_')) {
      facilities.push(value as string);
    }
  });

  const rawData = {
    gor_name: formData.get('gor_name') as string,
    owner_name: formData.get('owner_name') as string,
    whatsapp: formData.get('whatsapp') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    maps_url: formData.get('maps_url') as string,
    court_count: parseInt(formData.get('court_count') as string) || 0,
    floor_type: formData.get('floor_type') as string,
    facilities: facilities,
    password: formData.get('password') as string || 'password123', // fallback default
  };

  const validatedFields = registerMitraSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal mendaftar, periksa kembali form Anda.",
    };
  }

  try {
    const { gor_name, owner_name, whatsapp, email, password } = validatedFields.data;

    // Cek apakah email sudah terdaftar
    const { data: existingData } = await supabase
      .from('partners')
      .select('id')
      .eq('email', email)
      .single();

    if (existingData) {
      return { message: "Email ini sudah terdaftar sebagai Mitra." };
    }

    // Insert ke tabel partners
    const { data, error } = await supabase
      .from('partners')
      .insert([
        {
          gor_name,
          owner_name,
          whatsapp,
          email,
          password // Simpan plaintext sesuai skema MVP
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Langsung login-kan setelah daftar
    if (data) {
      const cookieStore = await cookies();
      cookieStore.set('mitraSession', 'supabase-mitra-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      cookieStore.set('mitraName', data.owner_name, { path: '/' });
      cookieStore.set('mitraEmail', data.email, { path: '/' });
      cookieStore.set('mitraGorName', data.gor_name, { path: '/' });
      cookieStore.set('mitraId', data.id.toString(), { path: '/' });
      cookieStore.set('isMitraLoggedIn', 'true', { path: '/' });

      return { success: true, message: "Registrasi berhasil!" };
    }

    return { message: "Terjadi kesalahan saat memproses data." };
  } catch (err) {
    console.error('Error Registrasi Mitra:', err);
    return { message: 'Terjadi kesalahan pada server saat pendaftaran.' };
  }
}

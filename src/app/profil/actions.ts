'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function getProfileData() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;

  if (!email) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return null;

  return {
    nama_lengkap: data.nama_lengkap || '',
    email: data.email || '',
    kota: data.kota || '',
  };
}

export async function updateProfileData(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Sesi tidak ditemukan. Silakan login ulang.' };

  const namaDepan = formData.get('namaDepan') as string;
  const namaBelakang = formData.get('namaBelakang') as string;
  const kota = formData.get('kota') as string;
  
  const namaLengkap = `${namaDepan} ${namaBelakang}`.trim();
  
  const { error } = await supabase
    .from('users')
    .update({ nama_lengkap: namaLengkap, kota })
    .eq('email', email);

  if (error) return { error: 'Gagal menyimpan: ' + error.message };

  cookieStore.set('userName', namaLengkap, { path: '/' });

  return { success: true };
}

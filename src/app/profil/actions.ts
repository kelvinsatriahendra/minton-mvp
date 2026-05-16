'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

const DEFAULT_NOTIF = {
  email_booking: true,
  email_promo: true,
  pengingat_jadwal: true,
};

function parseNotifCookie(val?: string) {
  if (!val) return DEFAULT_NOTIF;
  try { return { ...DEFAULT_NOTIF, ...JSON.parse(val) }; } catch { return DEFAULT_NOTIF; }
}

export async function getProfileData() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!data) return null;

  return {
    nama_lengkap: data.nama_lengkap || '',
    email: data.email || '',
    kota: data.kota || '',
    notifPrefs: parseNotifCookie(cookieStore.get('notif_prefs')?.value),
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

export async function updatePasswordAction(currentPassword: string, newPassword: string, confirmPassword: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Sesi tidak ditemukan.' };

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua field harus diisi.' };
  }
  if (newPassword.length < 8) {
    return { error: 'Kata sandi baru minimal 8 karakter.' };
  }
  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi kata sandi tidak cocok.' };
  }

  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('email', email)
    .single();

  if (!user || user.password !== currentPassword) {
    return { error: 'Kata sandi saat ini salah.' };
  }

  const { error } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('email', email);

  if (error) return { error: 'Gagal menyimpan: ' + error.message };

  return { success: true };
}

export async function updateNotificationPrefs(prefs: { email_booking: boolean; email_promo: boolean; pengingat_jadwal: boolean }) {
  const cookieStore = await cookies();
  cookieStore.set('notif_prefs', JSON.stringify(prefs), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return { success: true };
}

'use server'

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function getUserStats() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { level: 'Pemula', totalBookings: 0, confirmedBookings: 0, winRate: 0, stamina: 0, power: 0 };

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('status, duration')
    .eq('user_email', email);

  const total = allBookings?.length || 0;
  const confirmed = allBookings?.filter(b => b.status === 'Terkonfirmasi').length || 0;
  const winRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  const totalHours = allBookings?.reduce((sum, b) => {
    const h = parseInt(b.duration) || 0;
    return sum + h;
  }, 0) || 0;

  const stamina = Math.min(100, Math.round(total * 8 + 20));

  let level = 'Pemula';
  if (total >= 20) level = 'Pro';
  else if (total >= 10) level = 'Semi-Pro';
  else if (total >= 5) level = 'Kasual';

  const powerMap: Record<string, number> = { Pemula: 30, Kasual: 50, 'Semi-Pro': 70, Pro: 90 };
  const power = powerMap[level] || 30;

  return { level, totalBookings: total, confirmedBookings: confirmed, winRate, stamina, power };
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

  const dbPrefs = data.notification_prefs;
  const notifPrefs = dbPrefs && typeof dbPrefs === 'object'
    ? { email_booking: !!dbPrefs.email_booking, email_promo: !!dbPrefs.email_promo, pengingat_jadwal: !!dbPrefs.pengingat_jadwal }
    : { email_booking: true, email_promo: true, pengingat_jadwal: true };

  return {
    nama_lengkap: data.nama_lengkap || '',
    email: data.email || '',
    kota: data.kota || '',
    notifPrefs,
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

  if (!user) return { error: 'Kata sandi saat ini salah.' };

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) return { error: 'Kata sandi saat ini salah.' };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('email', email);

  if (error) return { error: 'Gagal menyimpan: ' + error.message };

  return { success: true };
}

export async function updateNotificationPrefs(prefs: { email_booking: boolean; email_promo: boolean; pengingat_jadwal: boolean }) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Sesi tidak ditemukan.' };

  const { error } = await supabase
    .from('users')
    .update({ notification_prefs: prefs })
    .eq('email', email);

  if (error) return { error: error.message };
  return { success: true };
}

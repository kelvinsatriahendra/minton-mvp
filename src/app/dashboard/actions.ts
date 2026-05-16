'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function getDashboardStats() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { totalBookings: 0, confirmedBookings: 0, winRate: 0, level: 'Pemula' };

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('status')
    .eq('user_email', email);

  const total = allBookings?.length || 0;
  const confirmed = allBookings?.filter(b => b.status === 'Terkonfirmasi').length || 0;
  const winRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  let level = 'Pemula';
  if (total >= 20) level = 'Pro';
  else if (total >= 10) level = 'Semi-Pro';
  else if (total >= 5) level = 'Kasual';

  return { totalBookings: total, confirmedBookings: confirmed, winRate, level };
}

export async function getRecentBookings() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return [];

  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(5);

  return (data || []).map((b: any) => ({
    id: b.booking_id,
    venue: b.venue,
    img: b.img,
    date: b.date,
    time: b.time,
    status: b.status,
  }));
}

export async function deleteDataAction(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
}

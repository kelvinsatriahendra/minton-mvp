'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function getBookings() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;

  if (!email) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((b: any) => ({
    id: b.booking_id,
    venue: b.venue,
    venueShort: b.venue_short,
    img: b.img,
    location: b.location,
    status: b.status,
    statusClass: b.status === 'Terkonfirmasi' ? 'badge-booked' : 'badge-pending',
    date: b.date,
    time: b.time,
    duration: b.duration,
    court: b.court,
    price: b.price,
    pending: b.status === 'Menunggu Pembayaran',
  }));
}

export async function payBooking(bookingId: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Sesi tidak ditemukan' };

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Terkonfirmasi' })
    .eq('booking_id', bookingId)
    .eq('user_email', email);

  if (error) return { error: error.message };
  return { success: true };
}

export async function cancelBooking(bookingId: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Sesi tidak ditemukan' };

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Dibatalkan' })
    .eq('booking_id', bookingId)
    .eq('user_email', email);

  if (error) return { error: error.message };
  return { success: true };
}

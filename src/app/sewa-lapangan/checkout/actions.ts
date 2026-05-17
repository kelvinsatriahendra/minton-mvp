'use server'

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function createBooking(formData: FormData) {
  const cookieStore = await cookies();
  let email = cookieStore.get('userEmail')?.value;
  const userName = cookieStore.get('userName')?.value;

  // Fallback: ambil dari formData jika cookie tidak tersedia
  if (!email) email = formData.get('userEmail') as string;

  if (!email) return { error: 'Sesi tidak ditemukan. Silakan login ulang.' };

  const venueId = formData.get('venueId') as string;
  const courtId = formData.get('courtId') as string;
  const slotsParam = formData.get('slots') as string;
  const venueName = formData.get('venueName') as string;
  const venueShort = formData.get('venueShort') as string;
  const venueImg = formData.get('venueImg') as string;
  const venueLocation = formData.get('venueLocation') as string;
  const totalPrice = formData.get('totalPrice') as string;
  const courtName = formData.get('courtName') as string;

  const slots = slotsParam ? slotsParam.split(',') : [];
  const sortedSlots = [...slots].sort();
  const startTime = sortedSlots[0]?.split('-')[0] || '';
  const endTime = sortedSlots[sortedSlots.length - 1]?.split('-')[1] || '';
  const timeDisplay = `${startTime} - ${endTime}`;
  const duration = `${slots.length} Jam`;

  const bookingId = `MKM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const { error } = await supabase.from('bookings').insert({
    booking_id: bookingId,
    user_email: email,
    venue: `${venueName} - ${courtName}`,
    venue_short: venueShort || venueName,
    img: venueImg || '',
    location: venueLocation || '',
    status: 'Menunggu Pembayaran',
    date: dateStr,
    time: timeDisplay,
    duration,
    court: courtName,
    price: `Rp ${parseInt(totalPrice).toLocaleString('id-ID')}`,
  });

  if (error) return { error: error.message };

  return { success: true, bookingId, date: dateStr };
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

export async function getBooking(bookingId: string) {
  if (!bookingId) return null;

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error || !data) return null;

  const venueName = data.venue?.split(' - ')[0] || data.venue;
  const courtName = data.court || '';

  return {
    id: data.booking_id,
    venue: venueName,
    court: courtName,
    date: data.date,
    time: data.time,
    duration: data.duration,
    location: data.location,
    price: data.price,
    status: data.status,
    fullVenue: data.venue,
  };
}

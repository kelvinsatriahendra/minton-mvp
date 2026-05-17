'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

export async function getVenueDetail(id: string) {
  const supabase = createServerSupabaseClient();

  const { data: venue } = await supabase.from('venues').select('*').eq('id', id).single();
  if (!venue) return null;

  const { data: courts } = await supabase.from('courts').select('*').eq('venue_id', id);

  const { data: recommendations } = await supabase
    .from('venues')
    .select('*')
    .neq('id', id)
    .order('rating', { ascending: false })
    .limit(4);

  return { venue, courts: courts ?? [], recommendations: recommendations ?? [] };
}

export async function getBookedSlots(venueName: string, date: string) {
  const supabase = createServerSupabaseClient();

  // Get all bookings — filter in JS for better matching
  const { data: allBookings } = await supabase
    .from('bookings')
    .select('court, time, venue');

  // Match venue: check if venueName is contained in booking's venue field or vice versa
  const venueParts = venueName.toLowerCase().split(/\s+/);
  const bookings = (allBookings ?? []).filter((b: any) => {
    const bVenue = (b.venue || '').toLowerCase();
    return venueParts.some((part: string) => part.length > 3 && bVenue.includes(part));
  });

  const booked: Record<string, string[]> = {};
  for (const b of bookings ?? []) {
    const court = b.court || 'Lapangan 1';
    if (!booked[court]) booked[court] = [];
    // Booking time format: "19:00 - 21:00" → extract start time
    const times = b.time?.split(' - ') || [];
    if (times.length >= 2) {
      // Add each hour slot
      let startH = parseInt(times[0].split(':')[0]);
      const endH = parseInt(times[1].split(':')[0]);
      while (startH < endH) {
        const slot = `${startH.toString().padStart(2, '0')}:00-${(startH + 1).toString().padStart(2, '0')}:00`;
        if (!booked[court].includes(slot)) booked[court].push(slot);
        startH++;
      }
    }
  }

  return booked;
}

export async function getVenueReviews(venueName: string) {
  const supabase = createServerSupabaseClient();

  const { data: allFeedbacks } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false });

  const venueParts = venueName.toLowerCase().split(/\s+/);
  const data = (allFeedbacks ?? []).filter((f: any) => {
    const fVenue = (f.venue || '').toLowerCase();
    return venueParts.some((part: string) => part.length > 3 && fVenue.includes(part));
  }).slice(0, 4);

  return data;
}

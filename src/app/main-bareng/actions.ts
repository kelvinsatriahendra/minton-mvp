'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function joinMatch(matchId: number) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Silakan login terlebih dahulu' };

  // Fetch current match to check slots
  const { data: match, error: fetchErr } = await supabase
    .from('matches')
    .select('slots_filled, total_slots')
    .eq('id', matchId)
    .single();

  if (fetchErr || !match) return { error: 'Pertandingan tidak ditemukan' };
  
  if (match.slots_filled >= match.total_slots) {
    return { error: 'Slot sudah penuh!' };
  }

  // Update slot (Optimistic in UI, actual in DB)
  const { error: updateErr } = await supabase
    .from('matches')
    .update({ slots_filled: match.slots_filled + 1 })
    .eq('id', matchId);

  if (updateErr) return { error: updateErr.message };

  // In a real app we'd also insert into a match_participants table
  return { success: true };
}

export async function createMatch(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const venueName = formData.get('venueName') as string;
  const skillLevel = formData.get('skillLevel') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const totalSlots = parseInt(formData.get('totalSlots') as string) || 8;
  const price = formData.get('price') as string;
  const priceNum = parseInt(price.replace(/[^0-9]/g, '')) || 0;

  // Derive time
  const times = time.split('-');
  const startTime = times[0]?.trim() || '19:00';
  const endTime = times[1]?.trim() || '21:00';

  const { error } = await supabase.from('matches').insert({
    venue_name: venueName,
    city: 'Surabaya', // Default city for simplicity
    match_date: date,
    start_time: startTime,
    end_time: endTime,
    skill_level: skillLevel,
    price_per_person: priceNum,
    image_url: '/asset/card-main-bareng-1.png',
    slots_filled: 1, // The creator takes 1 slot
    total_slots: totalSlots,
    gender: 'Campur',
    created_by: email
  });

  if (error) return { error: error.message };

  return { success: true };
}

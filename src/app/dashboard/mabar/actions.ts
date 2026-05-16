'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function getMatches() {
  const { data } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })
    .limit(20);

  return (data || []).map(m => ({
    id: m.id,
    venue: m.venue_name,
    location: m.city,
    level: m.skill_level,
    date: m.match_date,
    time: `${m.start_time} - ${m.end_time}`,
    gender: m.gender || 'Campuran',
    host: m.created_by?.split('@')[0] || 'Host',
    slots: (m.total_slots || 8) - (m.slots_filled || 0),
    total: m.total_slots || 8,
    price: m.price_per_person > 0 ? `Rp ${m.price_per_person.toLocaleString()}` : 'FREE',
    img: m.image_url || '/asset/card-main-bareng-1.png',
  }));
}

export async function getMyMatches() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return [];

  const { data } = await supabase
    .from('matches')
    .select('*')
    .eq('created_by', email)
    .order('match_date', { ascending: false });

  return (data || []).map(m => ({
    id: m.id,
    venue: m.venue_name,
    location: m.city,
    level: m.skill_level,
    date: m.match_date,
    time: `${m.start_time} - ${m.end_time}`,
    gender: m.gender || 'Campuran',
    host: email.split('@')[0],
    slots: (m.total_slots || 8) - (m.slots_filled || 0),
    total: m.total_slots || 8,
    price: m.price_per_person > 0 ? `Rp ${m.price_per_person.toLocaleString()}` : 'FREE',
    img: m.image_url || '/asset/card-main-bareng-1.png',
  }));
}

export async function createMatchAction(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const venueName = formData.get('venueName') as string;
  const skillLevel = formData.get('skillLevel') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const totalSlots = parseInt(formData.get('totalSlots') as string) || 8;
  const priceRaw = formData.get('price') as string;
  const priceNum = parseInt(priceRaw.replace(/[^0-9]/g, '')) || 0;

  const times = time.split('-');
  const startTime = times[0]?.trim() || '19:00';
  const endTime = times[1]?.trim() || '21:00';

  const { error } = await supabase.from('matches').insert({
    venue_name: venueName,
    city: 'Surabaya',
    match_date: date,
    start_time: startTime,
    end_time: endTime,
    skill_level: skillLevel,
    price_per_person: priceNum,
    image_url: '/asset/card-main-bareng-1.png',
    slots_filled: 1,
    total_slots: totalSlots,
    gender: 'Campur',
    created_by: email,
  });

  if (error) return { error: error.message };

  revalidatePath('/dashboard/mabar');
  return { success: true };
}

export async function joinMatchAction(matchId: number) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const { data: match } = await supabase
    .from('matches')
    .select('slots_filled, total_slots')
    .eq('id', matchId)
    .single();

  if (!match) return { error: 'Pertandingan tidak ditemukan' };
  if (match.slots_filled >= match.total_slots) return { error: 'Slot sudah penuh!' };

  const { error } = await supabase
    .from('matches')
    .update({ slots_filled: match.slots_filled + 1 })
    .eq('id', matchId);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/mabar');
  return { success: true };
}

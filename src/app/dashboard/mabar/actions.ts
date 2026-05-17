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

  const { data: match, error } = await supabase
    .from('matches')
    .insert({
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
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (match) {
    await supabase.from('match_participants').insert({
      match_id: match.id,
      user_email: email,
      user_name: email.split('@')[0],
    });
  }

  revalidatePath('/dashboard/mabar');
  return { success: true };
}

export async function getJoinRequests() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return [];

  const { data: myMatches } = await supabase
    .from('matches')
    .select('id, venue_name, match_date, start_time')
    .eq('created_by', email);

  if (!myMatches?.length) return [];

  const matchIds = myMatches.map(m => m.id);

  const { data: participants } = await supabase
    .from('match_participants')
    .select('*, matches!inner(venue_name, match_date, start_time)')
    .in('match_id', matchIds);

  return (participants || [])
    .filter(p => p.user_email !== email)
    .map(p => ({
      id: p.id,
      matchId: p.match_id,
      venue: p.matches?.venue_name || '',
      date: p.matches?.match_date || '',
      time: p.matches?.start_time || '',
      userName: p.user_name || p.user_email.split('@')[0],
      email: p.user_email,
      joinedAt: p.joined_at,
    }));
}

export async function joinMatchAction(matchId: number) {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const userName = cookieStore.get('userName')?.value || email.split('@')[0];

  const { data: existing } = await supabase
    .from('match_participants')
    .select('id')
    .eq('match_id', matchId)
    .eq('user_email', email)
    .maybeSingle();

  if (existing) return { error: 'Kamu sudah bergabung di sesi ini!' };

  const { data: match } = await supabase
    .from('matches')
    .select('slots_filled, total_slots, created_by')
    .eq('id', matchId)
    .single();

  if (!match) return { error: 'Pertandingan tidak ditemukan' };
  if (match.slots_filled >= match.total_slots) return { error: 'Slot sudah penuh!' };
  if (match.created_by === email) return { error: 'Kamu adalah host sesi ini!' };

  const { error: updateErr } = await supabase
    .from('matches')
    .update({ slots_filled: match.slots_filled + 1 })
    .eq('id', matchId);

  if (updateErr) return { error: updateErr.message };

  const { error: insertErr } = await supabase
    .from('match_participants')
    .insert({ match_id: matchId, user_email: email, user_name: userName });

  if (insertErr) return { error: insertErr.message };

  revalidatePath('/dashboard/mabar');
  return { success: true };
}

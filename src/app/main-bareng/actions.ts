'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function joinMatch(matchId: number) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  const userName = cookieStore.get('userName')?.value || email?.split('@')[0] || 'Player';

  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const { data: existing } = await supabase
    .from('match_participants')
    .select('id')
    .eq('match_id', matchId)
    .eq('user_email', email)
    .maybeSingle();

  if (existing) return { error: 'Kamu sudah bergabung di sesi ini!' };

  const { data: match, error: fetchErr } = await supabase
    .from('matches')
    .select('slots_filled, total_slots, created_by')
    .eq('id', matchId)
    .single();

  if (fetchErr || !match) return { error: 'Pertandingan tidak ditemukan' };
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

  revalidatePath('/main-bareng');
  return { success: true };
}

export async function createMatch(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  const userName = cookieStore.get('userName')?.value || email?.split('@')[0] || 'Host';

  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const venueName = formData.get('venueName') as string;
  const skillLevel = formData.get('skillLevel') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const totalSlots = parseInt(formData.get('totalSlots') as string) || 8;
  const price = formData.get('price') as string;
  const city = (formData.get('city') as string) || 'Surabaya';
  const gender = (formData.get('gender') as string) || 'Campur';
  const priceNum = parseInt(price.replace(/[^0-9]/g, '')) || 0;

  const times = time.split('-');
  const startTime = times[0]?.trim() || '19:00';
  const endTime = times[1]?.trim() || '21:00';

  const { data: match, error } = await supabase
    .from('matches')
    .insert({
      venue_name: venueName,
      city,
      match_date: date,
      start_time: startTime,
      end_time: endTime,
      skill_level: skillLevel,
      price_per_person: priceNum,
      image_url: '/asset/card-main-bareng-1.png',
      slots_filled: 1,
      total_slots: totalSlots,
      gender,
      created_by: email,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (match) {
    await supabase.from('match_participants').insert({
      match_id: match.id,
      user_email: email,
      user_name: userName,
    });
  }

  revalidatePath('/main-bareng');
  return { success: true };
}

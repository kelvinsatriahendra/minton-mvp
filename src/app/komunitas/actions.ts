'use server'

import { createServerSupabaseClient } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function getLeaderboard(genderFilter?: string) {
  const supabase = createServerSupabaseClient();

  const { data: users } = await supabase
    .from('users')
    .select('email, nama_lengkap, gender')
    .order('nama_lengkap');

  const { data: participants } = await supabase
    .from('match_participants')
    .select('user_email');

  const countMap: Record<string, number> = {};
  participants?.forEach((p) => {
    countMap[p.user_email] = (countMap[p.user_email] || 0) + 1;
  });

  let list = (users ?? []).map((u) => ({
    email: u.email,
    nama_lengkap: u.nama_lengkap,
    gender: u.gender || '',
    points: (countMap[u.email] || 0) * 100,
  }));

  if (genderFilter) {
    list = list.filter((u) => u.gender === genderFilter);
  }

  return list.sort((a, b) => b.points - a.points);
}

export async function getClubs(limit = 4, offset = 0) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('clubs')
    .select('*', { count: 'exact' })
    .order('member_count', { ascending: false })
    .range(offset, offset + limit - 1);
  return { clubs: data ?? [], hasMore: (data ?? []).length === limit };
}

export async function getFeedPosts() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('feed_posts').select('*').order('published_at', { ascending: false });
  return data ?? [];
}

export async function getMyRank(email: string) {
  const lb = await getLeaderboard();
  const idx = lb.findIndex((u) => u.email === email);
  return idx === -1 ? null : { rank: idx + 1, ...lb[idx] };
}

export async function joinClub(clubId: string, userEmail: string, userName: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('club_requests').insert({
    club_id: clubId,
    user_email: userEmail,
    user_name: userName,
    type: 'join',
  });
  if (error) {
    if (error.code === '23505') return { success: false, message: 'Anda sudah mengirim permintaan bergabung ke klub ini.' };
    return { success: false, message: 'Gagal mengirim permintaan.' };
  }
  revalidatePath('/komunitas');
  return { success: true, message: 'Permintaan bergabung telah dikirim ke pengurus klub.' };
}

export async function requestMabar(clubId: string, userEmail: string, userName: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('club_requests').insert({
    club_id: clubId,
    user_email: userEmail,
    user_name: userName,
    type: 'mabar',
  });
  if (error) {
    if (error.code === '23505') return { success: false, message: 'Permintaan Mabar Bareng sudah dikirim sebelumnya.' };
    return { success: false, message: 'Gagal mengirim permintaan.' };
  }
  revalidatePath('/komunitas');
  return { success: true, message: 'Permintaan Mabar Bareng telah dikirim.' };
}

export async function getTournaments() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('tournaments')
    .select('*')
    .order('date', { ascending: true })
    .limit(1);
  return data?.[0] ?? null;
}

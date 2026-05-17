'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

export async function getLeaderboard() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select(`
      email,
      nama_lengkap,
      match_participants!inner(count)
    `)
    .order('nama_lengkap');

  if (error) {
    const { data: fallback } = await supabase
      .from('users')
      .select('email, nama_lengkap');
    return (fallback ?? []).map((u, i) => ({
      ...u,
      points: Math.max(0, 30 - i * 2) * 100,
    }));
  }

  return (data ?? [])
    .map((u: any) => ({
      email: u.email,
      nama_lengkap: u.nama_lengkap,
      points: (u.match_participants?.[0]?.count ?? 0) * 100,
    }))
    .sort((a, b) => b.points - a.points);
}

export async function getClubs() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('clubs').select('*').order('member_count', { ascending: false });
  return data ?? [];
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

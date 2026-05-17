'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function getFeedbacks() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!gorName) return [];

  const { data } = await supabase
    .from('feedbacks')
    .select('*')
    .ilike('venue', `%${gorName}%`)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getFeedbackStats() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!gorName) return { avgRating: 0, satisfaction: 0, total: 0 };

  const { data } = await supabase
    .from('feedbacks')
    .select('rating')
    .ilike('venue', `%${gorName}%`);

  const list = data ?? [];
  const total = list.length;
  if (total === 0) return { avgRating: 0, satisfaction: 0, total: 0 };

  const sum = list.reduce((acc: number, f: any) => acc + f.rating, 0);
  const avgRating = (sum / total).toFixed(1);
  const satisfied = list.filter((f: any) => f.rating >= 4).length;
  const satisfaction = Math.round((satisfied / total) * 100);

  return { avgRating: parseFloat(avgRating), satisfaction, total };
}

export async function exportFeedbacks() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!gorName) return null;

  const { data } = await supabase
    .from('feedbacks')
    .select('*')
    .ilike('venue', `%${gorName}%`)
    .order('created_at', { ascending: false });

  const list = data ?? [];

  const header = 'Nama,Rating,Komentar,Tanggal\n';
  const rows = list
    .map((f: any) => {
      const date = new Date(f.created_at).toLocaleDateString('id-ID');
      const comment = `"${(f.comment || '').replace(/"/g, '""')}"`;
      return `${f.user_name},${f.rating},${comment},${date}`;
    })
    .join('\n');

  return header + rows;
}

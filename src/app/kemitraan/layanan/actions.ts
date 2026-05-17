'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

function getPartnerId(raw: string): number {
  return parseInt(raw);
}

export async function getServices() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return [];

  const { data } = await supabase
    .from('gor_services')
    .select('*')
    .eq('partner_id', getPartnerId(pid))
    .order('created_at', { ascending: true });

  return data ?? [];
}

export async function toggleService(id: string, isActive: boolean) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const { error } = await supabase
    .from('gor_services')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('partner_id', getPartnerId(pid));

  if (error) return { error: error.message };
  return { success: true };
}

export async function addService(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string || 'fa-solid fa-circle';

  if (!name) return { error: 'Nama layanan wajib diisi' };

  const { error } = await supabase.from('gor_services').insert({
    partner_id: getPartnerId(pid),
    name,
    description: description || '',
    icon,
    is_active: true,
  });

  if (error) return { error: error.message };
  return { success: true };
}

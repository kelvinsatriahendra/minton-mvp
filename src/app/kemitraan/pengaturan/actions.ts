'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function getSettings() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return null;

  const { data } = await supabase
    .from('partners')
    .select('*')
    .eq('id', parseInt(pid))
    .single();

  return data;
}

export async function saveSettings(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const updates: Record<string, any> = {
    gor_name: formData.get('gor_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    city: formData.get('city'),
    address: formData.get('address'),
    maps_url: formData.get('maps_url'),
    open_time: formData.get('open_time'),
    close_time: formData.get('close_time'),
    price_day: parseInt(formData.get('price_day') as string) || 0,
    price_night: parseInt(formData.get('price_night') as string) || 0,
    payment_method: formData.get('payment_method'),
  };

  const { error } = await supabase
    .from('partners')
    .update(updates)
    .eq('id', parseInt(pid));

  if (error) return { error: error.message };

  // Update cookies with new gor_name
  if (updates.gor_name) {
    cookieStore.set('mitraGorName', updates.gor_name, { path: '/' });
  }

  return { success: true };
}

export async function deleteAccount() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', parseInt(pid));

  if (error) return { error: error.message };

  // Clear all mitra cookies
  const cookies_to_clear = ['mitraSession', 'mitraName', 'mitraEmail', 'mitraGorName', 'mitraId', 'isMitraLoggedIn'];
  for (const c of cookies_to_clear) {
    cookieStore.set(c, '', { path: '/', maxAge: 0 });
  }

  return { success: true };
}

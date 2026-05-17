'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

export async function submitLead(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const gor_name = formData.get('gor_name') as string;
  const city = formData.get('city') as string;
  const phone = formData.get('phone') as string;

  if (!gor_name || !city || !phone) {
    return { error: 'Semua field wajib diisi' };
  }

  const { error } = await supabase.from('partner_leads').insert({
    gor_name,
    city,
    phone,
  });

  if (error) return { error: error.message };
  return { success: true };
}

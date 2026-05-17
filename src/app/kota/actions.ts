'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

export async function getCitiesAction() {
  const supabaseClient = createServerSupabaseClient();

  const { data, error } = await supabaseClient
    .from('cities')
    .select('*')
    .order('province')
    .order('name');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

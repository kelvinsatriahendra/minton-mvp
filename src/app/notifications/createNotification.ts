'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

type CreateNotifParams = {
  userEmail: string;
  title: string;
  message: string;
  type?: 'info' | 'booking' | 'promo' | 'reminder';
  link?: string;
};

export async function createNotification(params: CreateNotifParams) {
  const supabaseClient = createServerSupabaseClient();

  const { error } = await supabaseClient.from('notifications').insert({
    user_email: params.userEmail,
    title: params.title,
    message: params.message,
    type: params.type || 'info',
    link: params.link || null,
  });

  if (error) console.error('Error creating notification:', error);
}

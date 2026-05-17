'use server'

import { createServerSupabaseClient } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function getNotificationsAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return { notifications: [], unreadCount: 0 };

  const supabaseClient = createServerSupabaseClient();

  const { data: notifications } = await supabaseClient
    .from('notifications')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(20);

  const { count: unreadCount } = await supabaseClient
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', email)
    .eq('is_read', false);

  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
  };
}

export async function markAsReadAction(notificationId: string) {
  const supabaseClient = createServerSupabaseClient();
  await supabaseClient
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}

export async function markAllAsReadAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  if (!email) return;

  const supabaseClient = createServerSupabaseClient();
  await supabaseClient
    .from('notifications')
    .update({ is_read: true })
    .eq('user_email', email)
    .eq('is_read', false);
}

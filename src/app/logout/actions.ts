'use server'

import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function logoutAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;

  if (email) {
    await supabase.from('users').update({ session_token: null }).eq('email', email);
  }

  cookieStore.delete('session');
  cookieStore.delete('isLoggedIn');
  cookieStore.delete('userName');
  cookieStore.delete('userEmail');
}

'use server'

import { revalidatePath } from 'next/cache';

export async function deleteDataAction(id: string) {
  // Simulasi delay seolah-olah sedang menghapus dari Supabase
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Dalam aplikasi nyata, panggil Supabase untuk delete
  // await supabase.from('lapangan').delete().eq('id', id);

  // Memicu revalidasi agar Next.js memuat ulang data asli
  revalidatePath('/dashboard');
  
  return { success: true };
}

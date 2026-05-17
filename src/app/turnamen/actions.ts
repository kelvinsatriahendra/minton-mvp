'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function getTournaments() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function registerTournament(tournamentId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const email = cookieStore.get('userEmail')?.value;
  const userName = cookieStore.get('userName')?.value;

  if (!email) return { error: 'Silakan login terlebih dahulu' };

  const teamName = formData.get('teamName') as string;
  const whatsapp = formData.get('whatsapp') as string;

  // Check if tournament exists and has slots
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('id, slots_filled, max_participants, is_open')
    .eq('id', tournamentId)
    .single();

  if (!tournament) return { error: 'Turnamen tidak ditemukan' };
  if (!tournament.is_open) return { error: 'Pendaftaran ditutup' };
  if (tournament.slots_filled >= tournament.max_participants) return { error: 'Slot sudah penuh!' };

  // Check if already registered
  const { data: existing } = await supabase
    .from('tournament_registrations')
    .select('id')
    .eq('tournament_id', tournamentId)
    .eq('user_email', email)
    .maybeSingle();

  if (existing) return { error: 'Kamu sudah terdaftar di turnamen ini' };

  // Insert registration
  const { error: insertErr } = await supabase
    .from('tournament_registrations')
    .insert({
      tournament_id: tournamentId,
      user_email: email,
      user_name: userName || email.split('@')[0],
      whatsapp: whatsapp || null,
      team_name: teamName || null,
    });

  if (insertErr) return { error: insertErr.message };

  // Increment slots_filled
  await supabase
    .from('tournaments')
    .update({ slots_filled: tournament.slots_filled + 1 })
    .eq('id', tournamentId);

  return { success: true };
}

export async function getMyRegistrations(email: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('tournament_registrations')
    .select('tournament_id, status, created_at')
    .eq('user_email', email);
  return data ?? [];
}

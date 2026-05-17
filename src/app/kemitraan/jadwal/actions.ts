'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function getSlots(courtFilter?: string) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  const gorName = cookieStore.get('mitraGorName')?.value;
  if (!pid) return { slots: [], courts: [] };

  const partnerId = parseInt(pid);

  let query = supabase
    .from('gor_slots')
    .select('*')
    .eq('partner_id', partnerId);

  if (courtFilter) {
    query = query.eq('court', courtFilter);
  }

  const { data: slots } = await query.order('start_time', { ascending: true });

  // Get unique courts
  const { data: allSlots } = await supabase
    .from('gor_slots')
    .select('court')
    .eq('partner_id', partnerId);

  const courts = [...new Set((allSlots ?? []).map((s: any) => s.court))];

  // Enrich with today's booking info
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todayShort = `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`;

  let enriched = (slots ?? []).map((s: any) => ({
    ...s,
    booking: null as any,
    status: s.is_open ? 'open' : 'closed',
  }));

  if (gorName) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .ilike('venue', `%${gorName}%`);

    if (bookings) {
      enriched = enriched.map((s: any) => {
        // Try to match booking by court + time
        const match = bookings.find((b: any) => {
          const bCourt = b.court?.trim().toLowerCase();
          const sCourt = s.court?.trim().toLowerCase();
          const bTime = b.time?.includes(s.start_time) || s.start_time?.includes(b.time?.split(' - ')[0] || '');
          return bCourt === sCourt && bTime;
        });

        if (match) {
          return {
            ...s,
            booking: match,
            status: 'booked',
          };
        }
        return s;
      });
    }
  }

  return { slots: enriched, courts };
}

export async function toggleSlot(id: string, isOpen: boolean) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('gor_slots').update({ is_open: isOpen }).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function addSlot(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const court = formData.get('court') as string || 'Lapangan 1';
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const price = parseInt(formData.get('price') as string) || 45000;

  if (!startTime || !endTime) return { error: 'Waktu sesi wajib diisi' };

  const { error } = await supabase.from('gor_slots').insert({
    partner_id: parseInt(pid),
    court,
    start_time: startTime,
    end_time: endTime,
    price,
    is_open: true,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function closeAllSlots(closed: boolean) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  if (!pid) return { error: 'Sesi tidak ditemukan' };

  const { error } = await supabase
    .from('gor_slots')
    .update({ is_open: !closed })
    .eq('partner_id', parseInt(pid))
    .eq('is_open', closed);

  if (error) return { error: error.message };
  return { success: true };
}

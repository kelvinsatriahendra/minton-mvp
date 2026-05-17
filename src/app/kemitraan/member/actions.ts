'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export async function getMembers(search?: string) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const partnerId = cookieStore.get('mitraId')?.value;
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!partnerId) return [];

  let query = supabase
    .from('gor_members')
    .select('*')
    .eq('partner_id', parseInt(partnerId));

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data: members } = await query.order('created_at', { ascending: false });
  const memberList = members ?? [];

  // Enrich with booking stats from bookings table
  if (gorName && memberList.length > 0) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('user_email, status, date, created_at')
      .ilike('venue', `%${gorName}%`);

    const enriched = memberList.map((m) => {
      const userBookings = (bookings ?? []).filter(
        (b: any) => b.user_email?.toLowerCase() === m.email.toLowerCase()
      );
      return {
        ...m,
        avatar: getInitials(m.name),
        total_bookings: userBookings.length,
        last_play: userBookings.length > 0
          ? userBookings.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].date
          : '-',
        badge: m.status === 'PRO Member' ? 'badge-pro' : 'badge-regular',
      };
    });

    return enriched;
  }

  return memberList.map((m) => ({
    ...m,
    avatar: getInitials(m.name),
    total_bookings: 0,
    last_play: '-',
    badge: m.status === 'PRO Member' ? 'badge-pro' : 'badge-regular',
  }));
}

export async function addMember(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const partnerId = cookieStore.get('mitraId')?.value;

  if (!partnerId) return { error: 'Sesi mitra tidak ditemukan' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const status = formData.get('status') as string || 'Reguler';

  if (!name || !email) return { error: 'Nama dan Email wajib diisi' };

  // Check duplicate
  const { data: existing } = await supabase
    .from('gor_members')
    .select('id')
    .eq('partner_id', parseInt(partnerId))
    .eq('email', email)
    .maybeSingle();

  if (existing) return { error: 'Member dengan email ini sudah terdaftar' };

  const { error } = await supabase.from('gor_members').insert({
    partner_id: parseInt(partnerId),
    name,
    email,
    phone,
    status,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getMemberDetail(email: string) {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!gorName || !email) return { member: null, bookings: [] };

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .ilike('venue', `%${gorName}%`)
    .ilike('user_email', email);

  return {
    member: null,
    bookings: (bookings ?? []).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  };
}

export async function exportMembers() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const partnerId = cookieStore.get('mitraId')?.value;

  if (!partnerId) return null;

  const { data } = await supabase
    .from('gor_members')
    .select('*')
    .eq('partner_id', parseInt(partnerId))
    .order('created_at', { ascending: false });

  const list = data ?? [];

  const header = 'Nama,Email,Telepon,Status,Total Booking,Bergabung\n';
  const rows = list
    .map((m: any) => {
      const name = `"${(m.name || '').replace(/"/g, '""')}"`;
      const email = `"${(m.email || '').replace(/"/g, '""')}"`;
      const phone = `"${(m.phone || '').replace(/"/g, '""')}"`;
      return `${name},${email},${phone},${m.status || 'Reguler'},${m.total_bookings || 0},${new Date(m.created_at).toLocaleDateString('id-ID')}`;
    })
    .join('\n');

  return header + rows;
}

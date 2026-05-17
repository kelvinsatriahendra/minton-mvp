'use server'

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/utils/supabase';

function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateShort(d: Date) {
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export async function getDashboardStats() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;
  const pid = cookieStore.get('mitraId')?.value;

  if (!gorName || !pid) {
    return { revenue: 0, activeBookings: 0, slots: 0, rating: 0 };
  }

  const partnerId = parseInt(pid);

  try {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .ilike('venue', `%${gorName}%`);

    let revenue = 0;
    let activeBookings = 0;

    if (bookings) {
      for (const b of bookings) {
        if (b.status === 'Terkonfirmasi' || b.status === 'Menunggu Pembayaran') {
          activeBookings++;
          if (b.status === 'Terkonfirmasi') {
            const priceStr = b.price.replace(/[^0-9]/g, '');
            revenue += parseInt(priceStr) || 0;
          }
        }
      }
    }

    const { data: slots } = await supabase
      .from('gor_slots')
      .select('*')
      .eq('partner_id', partnerId);

    const openSlots = slots?.filter(s => s.is_open).length ?? 0;
    const availableSlots = openSlots - activeBookings > 0 ? openSlots - activeBookings : 0;

    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select('rating')
      .ilike('venue', `%${gorName}%`);

    let rating = 0;
    if (feedbacks && feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc: number, f: any) => acc + f.rating, 0);
      rating = parseFloat((sum / feedbacks.length).toFixed(1));
    }

    return { revenue, activeBookings, slots: availableSlots, rating };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { revenue: 0, activeBookings: 0, slots: 0, rating: 0 };
  }
}

export async function getWeeklySchedule() {
  const supabase = createServerSupabaseClient();
  const cookieStore = await cookies();
  const pid = cookieStore.get('mitraId')?.value;
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!pid || !gorName) return { timeSlots: [], weekSlots: [] };

  const partnerId = parseInt(pid);

  const { data: slots } = await supabase
    .from('gor_slots')
    .select('*')
    .eq('partner_id', partnerId);

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .ilike('venue', `%${gorName}%`);

  const weekDates = getCurrentWeekDates();
  const timeSlots: string[] = [];
  const weekSlots: { time: string; days: { status: string; label: string }[] }[] = [];

  if (!slots || slots.length === 0) return { timeSlots: [], weekSlots: [] };

  const allStartTimes = [...new Set(slots.map((s: any) => s.start_time))].sort();

  for (const time of allStartTimes) {
    const slotAtTime = slots.filter((s: any) => s.start_time === time);
    const days = weekDates.map((date, dayIdx) => {
      const dateStr = formatDateShort(date);

      const match = (bookings ?? []).find((b: any) => {
        const bDate = b.date?.trim();
        const bCourt = b.court?.trim().toLowerCase();
        const bTime = b.time?.includes(time) || time?.includes(b.time?.split(' - ')[0] || '');
        const matchesDay = bDate === dateStr;
        return matchesDay && bTime;
      });

      const anyOpen = slotAtTime.some((s: any) => s.is_open);

      if (match) {
        const courtLabel = match.court?.replace('Lapangan ', '') || 'B';
        return { status: 'booked', label: courtLabel };
      }
      if (!anyOpen) {
        return { status: 'closed', label: '' };
      }
      return { status: 'empty', label: '' };
    });

    weekSlots.push({ time, days });
  }

  return { timeSlots: allStartTimes, weekSlots };
}

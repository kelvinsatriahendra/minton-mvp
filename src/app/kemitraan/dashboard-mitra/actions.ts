'use server'

import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function getDashboardStats() {
  const cookieStore = await cookies();
  const gorName = cookieStore.get('mitraGorName')?.value;

  if (!gorName) {
    return {
      revenue: 0,
      activeBookings: 0,
      slots: 12, // mock total slots
      rating: 0
    };
  }

  try {
    // Cari booking yang nama venue-nya mengandung nama GOR mitra ini
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .ilike('venue', `%${gorName}%`);

    if (error) throw error;

    let revenue = 0;
    let activeBookings = 0;

    if (bookings) {
      bookings.forEach(b => {
        // Hitung revenue (contoh harga format "Rp 140.000", kita bersihkan)
        if (b.status === 'Terkonfirmasi') {
          activeBookings++;
          const priceStr = b.price.replace(/[^0-9]/g, '');
          revenue += parseInt(priceStr) || 0;
        } else if (b.status === 'Menunggu Pembayaran') {
          activeBookings++; // Anggap menunggu pembayaran masih 'aktif' memblokir jadwal
        }
      });
    }

    return {
      revenue,
      activeBookings,
      slots: 24 - activeBookings > 0 ? 24 - activeBookings : 0, // Mock calculation
      rating: 4.8 // Mock rating for now
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      revenue: 0,
      activeBookings: 0,
      slots: 0,
      rating: 0
    };
  }
}

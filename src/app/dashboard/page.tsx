
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';
import { supabase } from '@/utils/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Booking {
  id: number;
  venue_name: string;
  court_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value || 'Jagoan';
  const isLoggedIn = cookieStore.get('isLoggedIn')?.value === 'true';

  // Fetch Booking History (Mockup filtering by user for now)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white" style={{ paddingTop: '100px' }}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          
          {/* Header Profil */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-[#111] p-8 rounded-2xl border border-[#222]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#bdd124] rounded-full flex items-center justify-center text-3xl font-bold text-black">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Halo, <span className="text-[#bdd124]">{decodeURIComponent(userName)}!</span></h1>
                <p className="text-gray-400 mt-1">Siap untuk mendominasi lapangan hari ini?</p>
              </div>
            </div>
            <LogoutButton />
          </div>

          {/* Statistik Singkat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1D1D1D] p-6 rounded-xl border border-[#333]">
              <p className="text-gray-400 text-sm mb-2">Poin Minton</p>
              <h3 className="text-2xl font-bold text-[#bdd124]">1.250 XP</h3>
            </div>
            <div className="bg-[#1D1D1D] p-6 rounded-xl border border-[#333]">
              <p className="text-gray-400 text-sm mb-2">Total Main</p>
              <h3 className="text-2xl font-bold">12 Pertandingan</h3>
            </div>
            <div className="bg-[#1D1D1D] p-6 rounded-xl border border-[#333]">
              <p className="text-gray-400 text-sm mb-2">Level</p>
              <h3 className="text-2xl font-bold text-blue-400">Intermediate</h3>
            </div>
          </div>

          {/* Daftar Riwayat Booking */}
          <h2 className="text-2xl font-bold mb-6">Riwayat Pemesanan Lapangan</h2>
          <div className="space-y-4">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <div key={booking.id} className="bg-[#1D1D1D] border border-[#333] p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#bdd124] transition-all">
                  <div className="flex gap-6 items-center w-full md:w-auto">
                    <div className="h-16 w-16 bg-[#2c2c2c] rounded-lg flex items-center justify-center text-3xl">
                      🏸
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{booking.venue_name}</h3>
                      <p className="text-gray-400">{booking.court_name}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-between items-end w-full md:w-auto border-t md:border-t-0 border-[#333] pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-400">Jam Main</p>
                      <p className="font-bold">{booking.start_time.substring(0,5)} - {booking.end_time.substring(0,5)}</p>
                    </div>
                    <div className="text-right mt-0 md:mt-2">
                      <span className="bg-green-500/10 text-green-500 text-xs px-3 py-1 rounded-full border border-green-500/20">{booking.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-[#1D1D1D] rounded-2xl border border-dashed border-[#444] text-gray-400">
                <i className="fa-regular fa-calendar-xmark text-4xl mb-4 block"></i>
                Belum ada riwayat pemesanan. Ayo mulai booking lapangan pertamamu!
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

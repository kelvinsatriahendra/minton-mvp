
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';
import { supabase } from '@/utils/supabase';
import DashboardSidebar from '@/components/DashboardSidebar';

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
  const userEmail = cookieStore.get('userEmail')?.value;
  const isLoggedIn = cookieStore.get('isLoggedIn')?.value === 'true';

  if (!isLoggedIn || !userEmail) {
    return (
      <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Silakan login untuk melihat dashboard.</h2>
        <a href="/login" style={{ background: '#bdd124', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Login Sekarang</a>
      </div>
    );
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_email', userEmail)
    .order('booking_date', { ascending: false });

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Dashboard</h1>
      </header>
      <div className="page-body">
        <style>{`
          .dash-profile { background: #1d1d1d; border: 1px solid #333; border-radius: 20px; padding: 32px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
          .dash-profile-left { display: flex; align-items: center; gap: 24px; }
          .dash-avatar { width: 64px; height: 64px; background: #bdd124; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; }
          .dash-greeting h2 { font-size: 24px; margin-bottom: 4px; }
          .dash-greeting h2 span { color: #bdd124; }
          .dash-greeting p { color: #888; font-size: 14px; }
          .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
          .dash-stat { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 24px; transition: 0.3s; }
          .dash-stat:hover { border-color: #bdd124; transform: translateY(-4px); }
          .dash-stat .label { color: #888; font-size: 13px; margin-bottom: 8px; }
          .dash-stat .value { font-size: 22px; font-weight: 700; }
          .dash-stat .value.lime { color: #bdd124; }
          .dash-stat .value.blue { color: #3b82f6; }
          .booking-row { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; transition: 0.3s; }
          .booking-row:hover { border-color: #bdd124; }
          .booking-row-left { display: flex; align-items: center; gap: 16px; }
          .booking-icon-box { width: 48px; height: 48px; background: #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
          .booking-info h4 { font-size: 16px; margin-bottom: 2px; }
          .booking-info p { color: #888; font-size: 13px; }
          .booking-info .date { font-size: 12px; color: #666; margin-top: 6px; }
          .booking-right { text-align: right; }
          .booking-right .time { font-size: 13px; color: #888; margin-bottom: 8px; }
          .booking-right .time strong { font-size: 16px; color: #fff; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
          .empty-state { padding: 60px; text-align: center; background: #1d1d1d; border-radius: 20px; border: 1px dashed #444; color: #666; }
          @media (max-width: 768px) {
            .dash-profile { flex-direction: column; text-align: center; }
            .dash-stats { grid-template-columns: 1fr; }
            .booking-row { flex-direction: column; text-align: center; gap: 16px; }
            .booking-row-left { flex-direction: column; }
          }
        `}</style>
        <div className="dash-profile">
          <div className="dash-profile-left">
            <div className="dash-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="dash-greeting">
              <h2>Halo, <span>{decodeURIComponent(userName)}!</span></h2>
              <p>Siap untuk mendominasi lapangan hari ini?</p>
            </div>
          </div>
          <LogoutButton />
        </div>
        <div className="dash-stats">
          <div className="dash-stat"><div className="label">Poin Minton</div><div className="value lime">1.250 XP</div></div>
          <div className="dash-stat"><div className="label">Total Main</div><div className="value">12 Pertandingan</div></div>
          <div className="dash-stat"><div className="label">Level</div><div className="value blue">Intermediate</div></div>
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 24 }}>Riwayat Pemesanan</h2>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking: Booking) => (
            <div key={booking.id} className="booking-row">
              <div className="booking-row-left">
                <div className="booking-icon-box">🏸</div>
                <div className="booking-info">
                  <h4>{booking.venue_name}</h4>
                  <p>{booking.court_name}</p>
                  <div className="date">{new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              <div className="booking-right">
                <div className="time">Jam Main<br /><strong>{booking.start_time.substring(0,5)} - {booking.end_time.substring(0,5)}</strong></div>
                <span className="status-badge">{booking.status}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fa-regular fa-calendar-xmark" style={{ fontSize: 48, marginBottom: 20, display: 'block' }}></i>
            Belum ada riwayat pemesanan. Ayo mulai booking lapangan pertamamu!
          </div>
        )}
      </div>
    </DashboardSidebar>
  );
}

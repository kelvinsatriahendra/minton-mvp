
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

  // Fetch Booking History filtered by user email
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_email', userEmail)
    .order('booking_date', { ascending: false });

  return (
    <>
      <Navbar />
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-container { padding-top: 120px; padding-bottom: 80px; min-height: 100vh; background: #000; }
        .wrapper { width: 90%; max-width: 1200px; margin: auto; }
        
        .profile-card {
          background: #111;
          padding: 40px;
          border-radius: 20px;
          border: 1px solid #222;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          gap: 24px;
        }
        .profile-info { display: flex; align-items: center; gap: 24px; }
        .avatar-lg {
          width: 80px; height: 80px;
          background: #bdd124;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 800;
        }
        .profile-info h1 { font-size: 32px; margin-bottom: 4px; }
        .profile-info h1 span { color: #bdd124; }
        .profile-info p { color: #888; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 60px; }
        .stat-item {
          background: #171717;
          padding: 30px;
          border-radius: 16px;
          border: 1px solid #333;
          transition: 0.3s;
        }
        .stat-item:hover { border-color: #bdd124; transform: translateY(-5px); }
        .stat-label { color: #888; font-size: 14px; margin-bottom: 12px; }
        .stat-value { font-size: 24px; font-weight: 700; }
        .text-lime { color: #bdd124; }

        .booking-item {
          background: #171717;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          transition: 0.3s;
          gap: 20px;
        }
        .booking-item:hover { border-color: #bdd124; }
        .booking-left { display: flex; align-items: center; gap: 20px; }
        .booking-icon { width: 56px; height: 56px; background: #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .booking-details h3 { font-size: 20px; margin-bottom: 4px; }
        .booking-details p { color: #888; font-size: 14px; }
        .booking-date { font-size: 12px; color: #666; margin-top: 8px; }

        .booking-right { text-align: right; }
        .status-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        @media (max-width: 992px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .profile-card { flex-direction: column; text-align: center; padding: 30px; }
          .profile-info { flex-direction: column; gap: 16px; }
          .stats-grid { grid-template-columns: 1fr; }
          .booking-item { flex-direction: column; text-align: center; }
          .booking-left { flex-direction: column; }
          .booking-right { text-align: center; border-top: 1px solid #333; width: 100%; pt: 20px; }
        }
      `}} />

      <div className="dashboard-container">
        <div className="wrapper">
          
          <div className="profile-card">
            <div className="profile-info">
              <div className="avatar-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1>Halo, <span>{decodeURIComponent(userName)}!</span></h1>
                <p>Siap untuk mendominasi lapangan hari ini?</p>
              </div>
            </div>
            <LogoutButton />
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Poin Minton</div>
              <div className="stat-value text-lime">1.250 XP</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Main</div>
              <div className="stat-value">12 Pertandingan</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Level</div>
              <div className="stat-value" style={{color: '#3b82f6'}}>Intermediate</div>
            </div>
          </div>

          <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Riwayat Pemesanan</h2>
          
          <div className="booking-list">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-left">
                    <div className="booking-icon">🏸</div>
                    <div className="booking-details">
                      <h3>{booking.venue_name}</h3>
                      <p>{booking.court_name}</p>
                      <div className="booking-date">
                        {new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-right">
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '13px', color: '#888' }}>Jam Main</div>
                      <div style={{ fontWeight: '700', fontSize: '18px' }}>
                        {booking.start_time.substring(0,5)} - {booking.end_time.substring(0,5)}
                      </div>
                    </div>
                    <span className="status-badge">{booking.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                padding: '80px', 
                textAlign: 'center', 
                background: '#111', 
                borderRadius: '24px', 
                border: '1px dashed #444',
                color: '#666'
              }}>
                <i className="fa-regular fa-calendar-xmark" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}></i>
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

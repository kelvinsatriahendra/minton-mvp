'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getDashboardStats, getRecentBookings } from './actions';

interface BookingItem {
  id: string;
  venue: string;
  img: string;
  date: string;
  time: string;
  status: string;
}

interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  winRate: number;
  level: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const nameCookie = cookies.find(c => c.trim().startsWith('userName='));
    if (nameCookie) {
      setUserName(decodeURIComponent(nameCookie.split('=')[1]));
    }
    loadData();
  }, []);

  async function loadData() {
    const [statsData, bookingsData] = await Promise.all([
      getDashboardStats(),
      getRecentBookings(),
    ]);
    setStats(statsData);
    setRecentBookings(bookingsData);
    setLoading(false);
  }

  const statusBadge = (status: string) => {
    if (status === 'Terkonfirmasi') return { color: 'var(--primary-lime)', text: 'Terkonfirmasi' };
    if (status === 'Menunggu Pembayaran') return { color: '#ffc107', text: 'Menunggu Bayar' };
    if (status === 'Dibatalkan') return { color: '#f44336', text: 'Dibatalkan' };
    return { color: '#4caf50', text: status };
  };

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button className="btn-secondary-dash"><i className="fa-solid fa-bell"></i></button>
          <button className="btn-primary-dash" onClick={() => window.location.href = '/sewa-lapangan'}><i className="fa-solid fa-plus"></i> Cari Lapangan</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
          .stat-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; }
          .stat-icon { width: 48px; height: 48px; background: rgba(189, 209, 36, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary-lime); font-size: 20px; flex-shrink: 0; }
          .stat-info h4 { font-size: 13px; color: var(--text-gray); margin-bottom: 4px; }
          .stat-info p { font-size: 20px; font-weight: 800; color: #fff; }
          .dashboard-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
          .activity-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; margin-bottom: 12px; transition: 0.3s; }
          .activity-item:hover { background: rgba(255,255,255,0.04); }
          .activity-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
          .activity-info h5 { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #fff; }
          .activity-info p { font-size: 12px; color: var(--text-gray); }
          .match-status { margin-left: auto; font-size: 12px; font-weight: 600; }
          .avatar-sm { width: 36px; height: 36px; background: var(--primary-lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 700; font-size: 14px; flex-shrink: 0; }
          @media (max-width: 768px) {
            .stats-row { grid-template-columns: repeat(2, 1fr); }
            .dashboard-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
            <div className="stat-info"><h4>Total Booking</h4><p>{loading ? '-' : stats?.totalBookings || 0}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-check-circle"></i></div>
            <div className="stat-info"><h4>Terkonfirmasi</h4><p>{loading ? '-' : stats?.confirmedBookings || 0}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-medal"></i></div>
            <div className="stat-info"><h4>Win Rate</h4><p>{loading ? '-' : `${stats?.winRate || 0}%`}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-ranking-star"></i></div>
            <div className="stat-info"><h4>Level</h4><p>{loading ? '-' : stats?.level || 'Pemula'}</p></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span className="content-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Jadwal Terdekat</span>
              <a href="/booking-saya" style={{ color: 'var(--primary-lime)', fontSize: 13, textDecoration: 'none' }}>Lihat Semua</a>
            </div>
            {loading ? (
              <p style={{ color: 'var(--text-gray)', textAlign: 'center', padding: 20 }}>Memuat...</p>
            ) : recentBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-gray)' }}>
                <p>Belum ada booking.</p>
                <button className="btn-primary-dash" style={{ marginTop: 12 }} onClick={() => window.location.href = '/sewa-lapangan'}>Booking Sekarang</button>
              </div>
            ) : (
              recentBookings.slice(0, 3).map((b, i) => {
                const badge = statusBadge(b.status);
                return (
                  <div key={b.id || i} className="activity-item">
                    <img src={b.img || '/asset/logo.png'} alt={b.venue} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                    <div className="activity-info">
                      <h5>{b.venue}</h5>
                      <p>{b.date} • {b.time}</p>
                    </div>
                    <div className="match-status" style={{ color: badge.color }}>{badge.text}</div>
                  </div>
                );
              })
            )}
          </div>

          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span className="content-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Ringkasan</span>
            </div>
            {stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 8 }}>Total Booking</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{stats.totalBookings}</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 8 }}>Booking Terkonfirmasi</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-lime)' }}>{stats.confirmedBookings}</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 8 }}>Level Saat Ini</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{stats.level}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span className="content-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Aktivitas Terakhir</span>
          </div>
          {recentBookings.length === 0 ? (
            <p style={{ color: 'var(--text-gray)', textAlign: 'center', padding: 20 }}>Belum ada aktivitas.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={b.id || i}>
                    <td>Sewa Lapangan</td>
                    <td>{b.date}</td>
                    <td>{b.venue}</td>
                    <td><span className={`badge ${b.status === 'Terkonfirmasi' ? 'badge-booked' : 'badge-pending'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardSidebar>
  );
}

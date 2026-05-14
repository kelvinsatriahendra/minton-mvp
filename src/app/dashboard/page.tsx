import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar active="Dashboard" />
      <main className="mitra-main">
        <style>{`
          .reward-banner {
            background: linear-gradient(135deg, #1d1d1d 0%, #111 100%);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .reward-info h2 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #fff;
          }
          .reward-info p {
            color: #aaa;
            font-size: 14px;
          }
          .points-badge {
            background: #bdd124;
            color: #000;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 18px;
          }
          .activity-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: rgba(255,255,255,0.02);
            border-radius: 12px;
            margin-bottom: 12px;
            transition: 0.3s;
          }
          .activity-item:hover {
            background: rgba(255,255,255,0.04);
          }
          .activity-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
          .activity-info h5 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            color: #fff;
          }
          .activity-info p {
            font-size: 12px;
            color: #aaa;
          }
          .match-status {
            margin-left: auto;
            font-size: 12px;
            font-weight: 600;
          }
          .main-grid {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 20px;
          }
          .avatar {
            width: 36px;
            height: 36px;
            background-color: #bdd124;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
          }
          @media (max-width: 768px) {
            .main-grid { grid-template-columns: 1fr; }
            .stats-row { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
        <header className="mitra-header">
          <h1>Dashboard Bagas</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash"><i className="fa-solid fa-bell"></i></button>
            <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Cari Lapangan</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="reward-banner">
            <div className="reward-info">
              <h2>Kumpulkan <span style={{ color: '#bdd124' }}>Minton Points.</span></h2>
              <p>Main lebih sering, kumpulkan poin, dan dapatkan potongan harga sewa lapangan!</p>
            </div>
            <div className="points-badge">2,450 pts</div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-shuttlecock"></i></div>
              <div className="stat-info"><h4>Main Bareng</h4><p>24 Sesi</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
              <div className="stat-info"><h4>Booking</h4><p>12 Kali</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-medal"></i></div>
              <div className="stat-info"><h4>Win Rate</h4><p>68%</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-ranking-star"></i></div>
              <div className="stat-info"><h4>Level</h4><p>Semi-Pro</p></div>
            </div>
          </div>

          <div className="main-grid">
            <div className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span className="content-card-title" style={{ margin: 0 }}>Jadwal Terdekat</span>
                <a href="/booking-saya" style={{ color: '#bdd124', fontSize: 13, textDecoration: 'none' }}>Lihat Semua</a>
              </div>
              <div className="activity-item">
                <img src="/asset/surabaya-badminton.png" alt="Venue" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                <div className="activity-info">
                  <h5>Main Bareng: GOR Sudirman</h5>
                  <p>Besok, 19:00 - 21:00 • Lapangan 3</p>
                </div>
                <div className="match-status" style={{ color: '#bdd124' }}>Terkonfirmasi</div>
              </div>
              <div className="activity-item">
                <img src="/asset/kalam-kudus.png" alt="Venue" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                <div className="activity-info">
                  <h5>Sewa Lapangan: Kalam Kudus</h5>
                  <p>Sabtu, 10 Mei • 08:00 - 10:00</p>
                </div>
                <div className="match-status" style={{ color: '#ffc107' }}>Menunggu Bayar</div>
              </div>
              <div className="activity-item">
                <img src="/asset/supersmash-badminton-hall.png" alt="Venue" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                <div className="activity-info">
                  <h5>Main Bareng: Surabaya Hall</h5>
                  <p>Minggu, 11 Mei • 16:00 - 18:00</p>
                </div>
                <div className="match-status" style={{ color: '#bdd124' }}>Terkonfirmasi</div>
              </div>
            </div>

            <div className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span className="content-card-title" style={{ margin: 0 }}>Teman Aktif</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>AW</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Andi Wijaya</p>
                    <p style={{ fontSize: 11, color: '#aaa' }}>Online</p>
                  </div>
                  <div style={{ width: 8, height: 8, background: '#4caf50', borderRadius: '50%' }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 11, background: '#555' }}>BP</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Budi Pratama</p>
                    <p style={{ fontSize: 11, color: '#aaa' }}>Offline</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>CP</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Citra Putri</p>
                    <p style={{ fontSize: 11, color: '#aaa' }}>Online</p>
                  </div>
                  <div style={{ width: 8, height: 8, background: '#4caf50', borderRadius: '50%' }}></div>
                </div>
              </div>
              <button className="btn-secondary-dash" style={{ width: '100%', marginTop: 24, padding: 8 }}>Cari Teman Baru</button>
            </div>
          </div>

          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span className="content-card-title" style={{ margin: 0 }}>Aktivitas Terakhir</span>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Poin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sewa Lapangan</td>
                  <td>05 Mei 2024</td>
                  <td>GOR Sudirman</td>
                  <td><span className="badge badge-open">Selesai</span></td>
                  <td style={{ color: '#bdd124' }}>+50 pts</td>
                </tr>
                <tr>
                  <td>Main Bareng</td>
                  <td>03 Mei 2024</td>
                  <td>Kalam Kudus</td>
                  <td><span className="badge badge-open">Selesai</span></td>
                  <td style={{ color: '#bdd124' }}>+30 pts</td>
                </tr>
                <tr>
                  <td>Sewa Lapangan</td>
                  <td>01 Mei 2024</td>
                  <td>Surabaya Hall</td>
                  <td><span className="badge badge-closed">Dibatalkan</span></td>
                  <td>0 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

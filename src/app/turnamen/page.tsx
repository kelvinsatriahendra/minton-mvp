
'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

const tournaments = [
  { badge: 'Regional Surabaya', title: 'Minton Championship 2024', img: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800', date: '20 - 22 Mei 2024', location: 'GOR Sudirman, Surabaya', category: 'Ganda Putra (Open)', price: 'Rp 200.000 / Tim', btn: 'Daftar', primary: true },
  { badge: 'Amateur Series', title: 'Piala Walikota Solo', img: '/asset/piala-walikota-solo.png', date: '05 - 07 Juni 2024', location: 'Kalam Kudus, Surakarta', category: 'Tunggal Putra (U-21)', price: 'Rp 150.000 / Org', btn: 'Daftar', primary: true },
  { badge: 'Corporate League', title: 'BUMN Badminton Cup', img: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&q=80&w=800', date: '12 - 15 Juni 2024', location: 'Jakarta Badminton Hall', category: 'Beregu Campuran', price: 'Rp 1.500.000 / Tim', btn: 'Penuh', primary: false },
];

export default function TurnamenPage() {
  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Turnamen</h1>
        <div className="header-actions">
          <button className="btn-secondary-dash"><i className="fa-solid fa-filter"></i> Filter</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .tournament-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
          .tournament-card { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; overflow: hidden; transition: 0.3s; }
          .tournament-card:hover { transform: translateY(-8px); border-color: #bdd124; }
          .tournament-card img { width: 100%; height: 180px; object-fit: cover; }
          .tournament-body { padding: 20px; }
          .tournament-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; background: rgba(189,209,36,0.1); color: #bdd124; }
          .tournament-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
          .tournament-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
          .tournament-info .info-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaa; }
          .tournament-info .info-item i { width: 16px; color: #bdd124; }
          .tournament-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #333; }
          .tournament-footer .price { font-size: 16px; font-weight: 700; }
        `}</style>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Turnamen <span style={{ color: '#bdd124' }}>Mendatang</span></h2>
          <p style={{ color: '#aaa' }}>Daftarkan tim Anda dan menangkan hadiah jutaan rupiah!</p>
        </div>
        <div className="tournament-grid">
          {tournaments.map((t, i) => (
            <div key={i} className="tournament-card">
              <img src={t.img} alt={t.title} />
              <div className="tournament-body">
                <span className="tournament-badge">{t.badge}</span>
                <h3>{t.title}</h3>
                <div className="tournament-info">
                  <div className="info-item"><i className="fa-solid fa-calendar"></i> {t.date}</div>
                  <div className="info-item"><i className="fa-solid fa-location-dot"></i> {t.location}</div>
                  <div className="info-item"><i className="fa-solid fa-users"></i> {t.category}</div>
                </div>
                <div className="tournament-footer">
                  <div className="price">{t.price}</div>
                  <button className={t.primary ? 'btn-primary-dash' : 'btn-secondary-dash'} style={t.primary ? { padding: '8px 16px' } : { padding: '8px 16px', color: '#aaa', borderColor: '#444', cursor: 'not-allowed' }}>{t.btn}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardSidebar>
  );
}

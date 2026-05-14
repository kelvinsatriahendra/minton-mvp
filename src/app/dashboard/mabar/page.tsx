
'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sessions = [
  { venue: 'GOR Sudirman', location: 'Surabaya', level: 'Intermediate', date: 'Jumat, 10 Mei', time: '19:00 - 21:00', slots: 2, total: 4, price: 'Rp 30.000/org' },
  { venue: 'Kalam Kudus SC', location: 'Surakarta', level: 'Pro', date: 'Sabtu, 11 Mei', time: '08:00 - 10:00', slots: 1, total: 4, price: 'Rp 45.000/org' },
  { venue: 'Surabaya Hall', location: 'Surabaya', level: 'Beginner', date: 'Minggu, 12 Mei', time: '16:00 - 18:00', slots: 3, total: 4, price: 'Rp 25.000/org' },
];

export default function MabarDashboardPage() {
  const [tab, setTab] = useState(0);
  const tabs = ['Aktif', 'Selesai', 'Diikuti'];

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Main Bareng</h1>
        <div className="header-actions">
          <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Buat Sesi</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .mabar-tabs { display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1px solid #333; }
          .mabar-tabs .tab-item { padding: 12px 4px; color: #aaa; font-size: 14px; font-weight: 600; cursor: pointer; position: relative; }
          .mabar-tabs .tab-item.active { color: #bdd124; }
          .mabar-tabs .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #bdd124; }
          .mabar-dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
          .mabar-dash-card { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; transition: 0.3s; display: flex; flex-direction: column; overflow: hidden; }
          .mabar-dash-card:hover { border-color: #bdd124; transform: translateY(-4px); }
          .mabar-dash-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
          .mabar-header-info { display: flex; justify-content: space-between; align-items: flex-start; }
          .mabar-venue h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
          .mabar-venue p { font-size: 12px; color: #aaa; }
          .level-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(189,209,36,0.1); color: #bdd124; }
          .mabar-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
          .mabar-detail-item .label { font-size: 11px; color: #666; margin-bottom: 4px; }
          .mabar-detail-item .value { font-size: 14px; font-weight: 600; }
          .mabar-detail-item .slot-info { font-size: 13px; color: #bdd124; font-weight: 600; }
          .mabar-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #333; }
          .mabar-card-footer .price { font-size: 16px; font-weight: 700; }
          @media (max-width: 768px) {
            .mabar-dash-grid { grid-template-columns: 1fr; }
            .mabar-detail-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="mabar-tabs">
          {tabs.map((t, i) => (
            <div key={i} className={`tab-item ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</div>
          ))}
        </div>
        <div className="mabar-dash-grid">
          {sessions.map((s, i) => (
            <div key={i} className="mabar-dash-card">
              <div className="mabar-dash-body">
                <div className="mabar-header-info">
                  <div className="mabar-venue">
                    <h4>{s.venue}</h4>
                    <p><i className="fa-solid fa-location-dot"></i> {s.location}</p>
                  </div>
                  <span className="level-badge">{s.level}</span>
                </div>
                <div className="mabar-detail-grid">
                  <div className="mabar-detail-item">
                    <div className="label">Tanggal</div>
                    <div className="value">{s.date}</div>
                  </div>
                  <div className="mabar-detail-item">
                    <div className="label">Waktu</div>
                    <div className="value">{s.time}</div>
                  </div>
                  <div className="mabar-detail-item">
                    <div className="label">Slot</div>
                    <div className="slot-info">{s.slots}/{s.total} Terisi</div>
                  </div>
                </div>
                <div className="mabar-card-footer">
                  <div className="price">{s.price}</div>
                  <button className="btn-primary-dash" style={{ padding: '8px 16px' }}>Gabung</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardSidebar>
  );
}

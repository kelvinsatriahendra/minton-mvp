
'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const bookings = [
  { id: 'BS-00192', venue: 'GOR Sudirman - Lapangan 3', img: '/asset/surabaya-badminton.png', location: 'Surabaya, Jawa Timur', status: 'Terkonfirmasi', statusClass: 'badge-booked', date: 'Jumat, 10 Mei 2024', time: '19:00 - 21:00', duration: '2 Jam', price: 'Rp 140.000' },
  { id: 'BS-00210', venue: 'Kalam Kudus - Lapangan 1', img: '/asset/kalam-kudus.png', location: 'Surakarta, Jawa Tengah', status: 'Terkonfirmasi', statusClass: 'badge-booked', date: 'Minggu, 12 Mei 2024', time: '08:00 - 10:00', duration: '2 Jam', price: 'Rp 100.000' },
  { id: 'BS-00215', venue: 'Supermash Hall - Lapangan 5', img: '/asset/supersmash-badminton-hall.png', location: 'Surabaya, Jawa Timur', status: 'Menunggu Pembayaran', statusClass: 'badge-pending', date: 'Selasa, 14 Mei 2024', time: '20:00 - 21:00', duration: '1 Jam', price: 'Rp 60.000', pending: true },
];

export default function BookingSayaPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Aktif (2)', 'Menunggu Pembayaran (1)', 'Riwayat', 'Dibatalkan'];

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Booking Saya</h1>
        <div className="header-actions">
          <button className="btn-primary-dash" onClick={() => window.location.href = '/sewa-lapangan'}>
            <i className="fa-solid fa-plus"></i> Booking Baru
          </button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .booking-tabs { display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1px solid #333; }
          .tab-item { padding: 12px 4px; color: #aaa; font-size: 14px; font-weight: 600; cursor: pointer; position: relative; transition: 0.2s; }
          .tab-item.active { color: #bdd124; }
          .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #bdd124; }
          .booking-list { display: flex; flex-direction: column; gap: 16px; }
          .booking-card { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 20px; display: grid; grid-template-columns: 80px 1fr auto auto; align-items: center; gap: 24px; transition: 0.3s; }
          .booking-card:hover { border-color: #444; transform: translateX(4px); }
          .booking-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
          .booking-info h4 { font-size: 16px; margin-bottom: 4px; }
          .booking-info p { font-size: 13px; color: #aaa; display: flex; align-items: center; gap: 6px; }
          .booking-time { text-align: right; }
          .booking-time p:first-child { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
          .booking-time p:last-child { font-size: 13px; color: #aaa; }
          .booking-actions { display: flex; gap: 12px; }
          @media (max-width: 768px) {
            .booking-card { grid-template-columns: 1fr; text-align: center; }
            .booking-time, .booking-actions { text-align: center; justify-content: center; }
            .booking-info p { justify-content: center; }
          }
        `}</style>
        <div className="booking-tabs">
          {tabs.map((tab, i) => (
            <div key={i} className={`tab-item ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</div>
          ))}
        </div>
        <div className="booking-list">
          {bookings.filter(b => {
            if (activeTab === 0) return b.status === 'Terkonfirmasi';
            if (activeTab === 1) return b.status === 'Menunggu Pembayaran';
            return false;
          }).map((b, i) => (
            <div key={i} className="booking-card" style={b.pending ? { borderLeft: '4px solid #ffc107' } : {}}>
              <img src={b.img} alt="" className="booking-img" />
              <div className="booking-info">
                <h4>{b.venue}</h4>
                <p><i className="fa-solid fa-location-dot"></i> {b.location}</p>
                <p style={{ marginTop: 8 }}><span className={`badge ${b.statusClass}`}>{b.status}</span></p>
              </div>
              <div className="booking-time">
                <p>{b.date}</p>
                <p>{b.time} ({b.duration})</p>
              </div>
              <div className="booking-actions">
                {b.pending ? (
                  <button className="btn-primary-dash" style={{ padding: '8px 24px' }}>Bayar Sekarang</button>
                ) : (
                  <>
                    <button className="btn-secondary-dash" style={{ padding: '8px 16px' }}>Detail</button>
                    <button className="btn-secondary-dash" style={{ padding: '8px 16px' }}><i className="fa-solid fa-qrcode"></i> Tiket</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardSidebar>
  );
}

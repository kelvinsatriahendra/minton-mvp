'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DetailData { venue: string; img: string; id: string; status: string; date: string; time: string; court: string; price: string; }
interface TicketData { id: string; venue: string; date: string; time: string; court: string; }
interface PaymentData { venue: string; amount: string; }

const bookings = [
  { id: 'BS-00192', venue: 'GOR Sudirman - Lapangan 3', venueShort: 'GOR Sudirman', img: '/asset/surabaya-badminton.png', location: 'Surabaya, Jawa Timur', status: 'Terkonfirmasi', statusClass: 'badge-booked', date: 'Jumat, 10 Mei 2024', time: '19:00 - 21:00', duration: '2 Jam', court: 'Lapangan 3', price: 'Rp 140.000' },
  { id: 'BS-00210', venue: 'Kalam Kudus - Lapangan 1', venueShort: 'Kalam Kudus', img: '/asset/kalam-kudus.png', location: 'Surakarta, Jawa Tengah', status: 'Terkonfirmasi', statusClass: 'badge-booked', date: 'Minggu, 12 Mei 2024', time: '08:00 - 10:00', duration: '2 Jam', court: 'Lapangan 1', price: 'Rp 100.000' },
  { id: 'BS-00215', venue: 'Supermash Hall - Lapangan 5', venueShort: 'Supermash Hall', img: '/asset/supersmash-badminton-hall.png', location: 'Surabaya, Jawa Timur', status: 'Menunggu Pembayaran', statusClass: 'badge-pending', date: 'Selasa, 14 Mei 2024', time: '20:00 - 21:00', duration: '1 Jam', court: 'Lapangan 5', price: 'Rp 60.000', pending: true },
];

const tabs = ['Aktif (2)', 'Menunggu Pembayaran (1)', 'Riwayat', 'Dibatalkan'];

export default function BookingSayaPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const closeAll = () => { setIsDetailOpen(false); setIsTicketOpen(false); setIsPaymentOpen(false); setIsPaymentSuccess(false); };

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
          .booking-tabs { display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); }
          .tab-item { padding: 12px 4px; color: var(--text-gray); text-decoration: none; font-size: 14px; font-weight: 600; position: relative; cursor: pointer; }
          .tab-item.active { color: var(--primary-lime); }
          .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary-lime); }
          .booking-card-list { display: flex; flex-direction: column; gap: 16px; }
          .booking-card-item { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; display: grid; grid-template-columns: 80px 1fr auto auto; align-items: center; gap: 24px; transition: 0.3s; }
          .booking-card-item:hover { border-color: #444; transform: translateX(4px); }
          .venue-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
          .venue-info h4 { font-size: 16px; margin-bottom: 4px; }
          .venue-info p { font-size: 13px; color: var(--text-gray); display: flex; align-items: center; gap: 6px; }
          .booking-time { text-align: right; }
          .booking-time p:first-child { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
          .booking-time p:last-child { font-size: 13px; color: var(--text-gray); }
          .booking-actions { display: flex; gap: 12px; }
          .modal-overlay { position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); }
          .btn-cancel-modal { transition: all 0.3s ease; }
          .btn-cancel-modal:hover { background: #f44336 !important; border-color: #f44336 !important; color: #fff !important; }
          @media (max-width: 768px) {
            .booking-card-item { grid-template-columns: 1fr; text-align: center; }
            .booking-time, .booking-actions { text-align: center; justify-content: center; }
            .venue-info p { justify-content: center; }
          }
        `}</style>
        <div className="booking-tabs">
          {tabs.map((tab, i) => (
            <div key={i} className={`tab-item ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</div>
          ))}
        </div>
        <div className="booking-card-list">
          {bookings.filter(b => {
            if (activeTab === 0) return b.status === 'Terkonfirmasi';
            if (activeTab === 1) return b.status === 'Menunggu Pembayaran';
            return false;
          }).map((b, i) => (
            <div key={i} className="booking-card-item" style={b.pending ? { borderLeft: '4px solid #ffc107' } : {}}>
              <img src={b.img} alt="Venue" className="venue-img" />
              <div className="venue-info">
                <h4>{b.venue}</h4>
                <p><i className="fa-solid fa-location-dot"></i> {b.location}</p>
                <p style={{ marginTop: 8 }}>
                  {b.pending ? (
                    <span className="badge" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}>{b.status}</span>
                  ) : (
                    <span className={`badge ${b.statusClass}`}>{b.status}</span>
                  )}
                </p>
              </div>
              <div className="booking-time">
                <p>{b.date}</p>
                <p>{b.time} ({b.duration})</p>
              </div>
              <div className="booking-actions">
                {b.pending ? (
                  <button className="btn-primary-dash" style={{ padding: '8px 24px' }} onClick={() => { setPaymentData({ venue: b.venue, amount: b.price }); setIsPaymentOpen(true); setIsPaymentSuccess(false); }}>Bayar Sekarang</button>
                ) : (
                  <>
                    <button className="btn-secondary-dash" style={{ padding: '8px 16px' }} onClick={() => { setDetailData({ venue: b.venue, img: b.img, id: b.id, status: b.status, date: b.date, time: b.time, court: b.court, price: b.price }); setIsDetailOpen(true); }}>Detail</button>
                    <button className="btn-secondary-dash" style={{ padding: '8px 16px' }} onClick={() => { setTicketData({ id: b.id, venue: b.venueShort, date: b.date, time: b.time, court: b.court }); setIsTicketOpen(true); }}><i className="fa-solid fa-qrcode"></i> Tiket</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && detailData && (
        <div className="modal-overlay" onClick={closeAll}>
          <div style={{ backgroundColor: '#121212', borderRadius: '24px', width: '90%', maxWidth: '450px', position: 'relative', overflow: 'hidden', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '180px', background: `url(${detailData.img}) center/cover`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #121212, transparent)' }}></div>
              <button onClick={closeAll} style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>ID Booking: {detailData.id}</p>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{detailData.venue}</h2>
                </div>
                <span style={{ background: 'rgba(189, 209, 36, 0.1)', color: '#bdd124', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}>{detailData.status}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Tanggal</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{detailData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Waktu</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{detailData.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Lapangan</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{detailData.court}</span>
                </div>
                <div style={{ height: '1px', background: '#333', margin: '12px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Total Bayar</span>
                  <span style={{ color: '#bdd124', fontSize: '13px', fontWeight: 700 }}>{detailData.price}</span>
                </div>
              </div>
              <button onClick={closeAll} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#bdd124', color: '#000', fontWeight: 700, cursor: 'pointer' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {isTicketOpen && ticketData && (
        <div className="modal-overlay" onClick={closeAll}>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '24px', width: '90%', maxWidth: '380px', position: 'relative', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '32px 24px', textAlign: 'center', borderBottom: '2px dashed #333', position: 'relative', background: 'linear-gradient(135deg, #1a1a1a, #222)' }}>
              <div style={{ position: 'absolute', bottom: '-11px', left: '-11px', width: '22px', height: '22px', background: 'rgba(0,0,0,0.85)', borderRadius: '50%', zIndex: 2 }}></div>
              <div style={{ position: 'absolute', bottom: '-11px', right: '-11px', width: '22px', height: '22px', background: 'rgba(0,0,0,0.85)', borderRadius: '50%', zIndex: 2 }}></div>
              <p style={{ color: '#bdd124', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>E-Ticket Sewa Lapangan</p>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>{ticketData.venue}</h2>
              <div style={{ background: '#fff', width: '160px', height: '160px', margin: '0 auto 24px', padding: '12px', borderRadius: '12px' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${ticketData.id}`} alt="QR Code" style={{ width: '100%', height: '100%' }} />
              </div>
              <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>KODE BOOKING</p>
              <p style={{ color: '#fff', fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, letterSpacing: '3px' }}>{ticketData.id}</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Tanggal</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{ticketData.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Waktu</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{ticketData.time}</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Lapangan</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{ticketData.court}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#4caf50' }}>SIAP PAKAI</p>
                </div>
              </div>
              <button onClick={closeAll} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 600, transition: '0.3s' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentOpen && paymentData && (
        <div className="modal-overlay" onClick={closeAll}>
          {!isPaymentSuccess ? (
            <div style={{ backgroundColor: '#121212', borderRadius: '24px', width: '90%', maxWidth: '400px', position: 'relative', overflow: 'hidden', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(189, 209, 36, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <i className="fa-solid fa-wallet" style={{ fontSize: '28px', color: '#bdd124' }}></i>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Selesaikan Pembayaran</h2>
                <p style={{ color: '#666', fontSize: '13px' }}>{paymentData.venue}</p>
                <div style={{ margin: '24px 0', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid #222' }}>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>TOTAL TAGIHAN</p>
                  <p style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>{paymentData.amount}</p>
                </div>
                <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Pilih Metode Pembayaran</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', marginBottom: '12px', cursor: 'pointer' }}>
                    <input type="radio" name="payment" defaultChecked style={{ accentColor: '#bdd124' }} />
                    <img src="/asset/logo.png" style={{ height: '14px', marginRight: '4px' }} />
                    <span style={{ color: '#fff', fontSize: '13px' }}>Minton Pay (Saldo: Rp 250.000)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer' }}>
                    <input type="radio" name="payment" style={{ accentColor: '#bdd124' }} />
                    <i className="fa-solid fa-building-columns" style={{ color: '#666' }}></i>
                    <span style={{ color: '#fff', fontSize: '13px' }}>Transfer Bank (VA)</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={closeAll} className="btn-cancel-modal" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #333', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                  <button onClick={() => setIsPaymentSuccess(true)} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#bdd124', color: '#000', fontWeight: 700, cursor: 'pointer' }}>Bayar Sekarang</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#121212', borderRadius: '24px', width: '90%', maxWidth: '400px', position: 'relative', overflow: 'hidden', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <i className="fa-solid fa-check-circle" style={{ fontSize: '48px', color: '#4caf50' }}></i>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Pembayaran Berhasil!</h2>
                <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>Transaksi Anda telah kami terima. Lapangan telah berhasil dipesan dan siap digunakan.</p>
                <button onClick={() => location.reload()} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#bdd124', color: '#000', fontWeight: 700, cursor: 'pointer' }}>Selesai</button>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardSidebar>
  );
}

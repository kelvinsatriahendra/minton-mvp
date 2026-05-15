'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBooking, cancelBooking } from '../checkout/actions';

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  async function loadBooking() {
    setLoading(true);
    const data = await getBooking(bookingId!);
    setBooking(data);
    setLoading(false);
  }

  async function handleCancel() {
    if (!bookingId) return;
    if (!confirm('Yakin ingin membatalkan booking ini?')) return;

    setCancelling(true);
    const result = await cancelBooking(bookingId);
    if (result.success) {
      await loadBooking();
    }
    setCancelling(false);
  }

  const totalPriceNum = booking?.price
    ? parseInt(booking.price.replace(/[^0-9]/g, ''))
    : 0;

  const priceFormatted = totalPriceNum.toLocaleString('id-ID');

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Tiket...</div>;

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ width: '90%', maxWidth: '1600px', margin: 'auto', paddingTop: '120px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: 16 }}>Booking Tidak Ditemukan</h1>
          <p style={{ color: '#aaa', marginBottom: 24 }}>Data booking tidak valid atau sudah dihapus.</p>
          <a href="/" className="btn-back" style={{ padding: '12px 28px', border: '1px solid #fff', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'inline-block' }}><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Beranda</a>
        </div>
        <Footer />
      </>
    );
  }

  const isCancelled = booking.status === 'Dibatalkan';

  const timeParts = booking.time ? booking.time.split(' ') : [];
  const duration = booking.duration || '';

  return (
    <>
      <style>{`
        .status-container { display: flex; gap: 48px; padding: 60px 0 160px; width: 90%; max-width: 1600px; margin: auto; color: white; }
        .left { flex: 2; }
        .right { flex: 1; }
        .btn-back { padding: 12px 28px; border: 1px solid #ffffff; border-radius: 12px; background: none; color: #ffffff; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 56px; text-decoration: none; cursor: pointer; transition: 0.3s; }
        .btn-back:hover { background: var(--primary-lime); border-color: var(--primary-lime); color: black; }
        .success-header { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; }
        .success-icon { width: 72px; height: 72px; border-radius: 50%; border: 4px solid var(--primary-lime); background: #0f0f0f; display: flex; justify-content: center; align-items: center; color: var(--primary-lime); font-size: 36px; box-shadow: 0 0 30px rgba(189, 209, 36, 0.4); animation: successPulse 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .success-icon i { opacity: 0; transform: scale(0); animation: checkmarkGrow 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards; }
        @keyframes successPulse {
            0% { transform: scale(0.5); box-shadow: 0 0 0 rgba(189, 209, 36, 0); opacity: 0; }
            50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(189, 209, 36, 0.8); opacity: 1; }
            100% { transform: scale(1); box-shadow: 0 0 30px rgba(189, 209, 36, 0.4); opacity: 1; }
        }
        @keyframes checkmarkGrow {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .success-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: white; }
        .success-id { font-size: 14px; color: #aaa; }
        .ticket { display: flex; background: #171717; border-radius: 12px; margin-bottom: 32px; border: 1px solid #2a2a2a; position: relative; }
        .ticket-left { flex: 1.2; padding: 40px 32px; text-align: left; border-right: 2px dashed #333; display: flex; flex-direction: column; justify-content: center; position: relative; }
        .ticket-right { flex: 1; padding: 40px 32px; display: flex; flex-direction: column; gap: 32px; position: relative; }
        .ticket-left::after, .ticket-right::before { content: ""; position: absolute; width: 30px; height: 30px; background: #000; border-radius: 50%; }
        .ticket-left::after { right: -16px; top: 50%; transform: translateY(-50%); border-left: 1px solid #2a2a2a; z-index: 10; }
        .ticket-right::before { left: -16px; top: 50%; transform: translateY(-50%); border-right: 1px solid #2a2a2a; z-index: 10; }
        .ticket-label { font-size: 13px; color: #aaa; margin-bottom: 8px; }
        .ticket-val { font-size: 24px; font-weight: 700; color: white; display: flex; align-items: center; gap: 16px; }
        .ticket-badge { background: #2a2a2a; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; color: #ccc; border: 1px solid #444; display: flex; align-items: center; gap: 8px; }
        .btn-group { display: flex; gap: 16px; }
        .btn-cancel { flex: 1; padding: 16px; border-radius: 12px; border: 1px solid #ff4d4d; background: none; color: #ff4d4d; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; text-align: center; }
        .btn-cancel:hover { background: #ff4d4d; color: white; }
        .btn-contact { flex: 1; padding: 16px; border-radius: 12px; border: 1px solid #ffffff; background: none; color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; text-align: center; }
        .btn-contact:hover { background: var(--primary-lime); border-color: var(--primary-lime); color: black; box-shadow: 0 0 20px rgba(189, 209, 36, 0.4); transform: translateY(-2px); }
        .summary-box { background: #1c1c1c; border-radius: 12px; border: 1px solid #333; overflow: hidden; margin-bottom: 24px; }
        .summary-row { display: flex; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #333; font-size: 14px; }
        .summary-row span:first-child { color: #ccc; }
        .summary-row span:last-child { color: #fff; }
        .summary-total { display: flex; justify-content: space-between; padding: 20px 24px; font-size: 16px; font-weight: 700; }
        .summary-total span:first-child { color: #fff; }
        .summary-total span:last-child { color: #fff; }
        .terms { font-size: 12px; color: #888; line-height: 1.5; }
        .cancelled-banner { background: rgba(244, 67, 54, 0.1); border: 1px solid #f44336; color: #f44336; padding: 16px 24px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-weight: 600; }
      `}</style>

      <Navbar />

      <div className="container" style={{ width: '90%', maxWidth: '1600px', margin: 'auto', paddingTop: '60px' }}>
        <a href="/" className="btn-back"><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Beranda</a>
      </div>
      
      <div className="status-container" style={{ paddingTop: '0' }}>
        <div className="left">
          {isCancelled && (
            <div className="cancelled-banner">
              <i className="fa-solid fa-circle-exclamation"></i> Booking ini telah dibatalkan
            </div>
          )}

          <div className="success-header">
            {isCancelled ? (
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: '4px solid #f44336', background: '#0f0f0f', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 36 }}>
                <i className="fa-solid fa-xmark" style={{ color: '#f44336' }}></i>
              </div>
            ) : (
              <div className="success-icon"><i className="fa-solid fa-check"></i></div>
            )}
            <div>
              <h1 className="success-title">
                {isCancelled ? 'Booking Dibatalkan' : 'Pemesanan Lapangan Berhasil!'}
              </h1>
              <div className="success-id">ID {booking.id}</div>
            </div>
          </div>

          <div className="ticket">
            <div className="ticket-left">
              <div style={{ marginBottom: '32px' }}>
                <div className="ticket-label">Venue Lapangan</div>
                <div className="ticket-val" style={{ fontSize: '20px', marginBottom: '4px' }}>
                  {booking.venue}
                </div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-lime)', marginRight: '6px' }}></i> 
                  {booking.location}
                </div>
              </div>
              <div>
                <div className="ticket-label">Tanggal Sewa</div>
                <div className="ticket-val" style={{ color: '#ffffff' }}>{booking.date}</div>
              </div>
            </div>
            <div className="ticket-right">
              <div>
                <div className="ticket-label">Waktu</div>
                <div className="ticket-val">
                  {booking.time} {duration && <span className="ticket-badge"><i className="fa-regular fa-hourglass-half"></i> {duration}</span>}
                </div>
              </div>
              <div>
                <div className="ticket-label">Court ID</div>
                <div className="ticket-val">{booking.court}</div>
              </div>
            </div>
          </div>

          <div className="btn-group">
            {!isCancelled && (
              <button className="btn-cancel" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Membatalkan...' : 'Batalkan Booking'}
              </button>
            )}
            <button className="btn-contact" onClick={() => window.location.href = '/booking-saya'}>Lihat Booking Saya</button>
          </div>
        </div>

        <div className="right">
          <div className="summary-box">
            <div className="summary-row">
              <span>Biaya Sewa</span>
              <span>Rp {priceFormatted}</span>
            </div>
            <div className="summary-row">
              <span>Biaya Produk Tambahan</span>
              <span>Rp 0</span>
            </div>
            <div className="summary-row">
              <span>Total Biaya Lainnya</span>
              <span>Rp 0</span>
            </div>
            <div className="summary-row">
              <span>Convenience Fee</span>
              <span>Rp 0</span>
            </div>
            <div className="summary-row">
              <span>Biaya Transaksi</span>
              <span>Rp 0</span>
            </div>
            <div className="summary-total">
              <span>Total Biaya</span>
              <span>Rp {priceFormatted}</span>
            </div>
          </div>

          <div className="terms">
            Pembatalan booking lapangan harus mengikuti ketentuan dari pengelola lapangan.
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function SuccessPage() {
  useEffect(() => { document.title = 'Pembayaran Berhasil - Minton'; }, []);
  return (
    <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

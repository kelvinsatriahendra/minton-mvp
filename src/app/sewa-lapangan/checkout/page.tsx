"use client";
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import { createBooking } from './actions';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const courtId = searchParams.get('courtId');
  const slots = searchParams.get('slots')?.split(',') || [];

  const [venue, setVenue] = useState<any>(null);
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  const [selectedPayment, setSelectedPayment] = useState('va');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [bookingResult, setBookingResult] = useState<{ bookingId: string; date: string } | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (venueId && courtId) fetchDetails();
  }, [venueId, courtId]);

  useEffect(() => {
    if (showPaymentModal) {
      setCountdown(900);
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [showPaymentModal]);

  async function fetchDetails() {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[decodeURIComponent(key)] = decodeURIComponent(val || '');
      return acc;
    }, {} as Record<string, string>);

    try {
      setLoading(true);
      const { data: vData } = await supabase.from('venues').select('*').eq('id', venueId).single();
      const { data: cData } = await supabase.from('courts').select('*').eq('id', courtId).single();
      setVenue(vData);
      setCourt(cData);

      const email = cookies['userEmail'] || '';
      const name = cookies['userName'] || '';
      setUserData({ name, email, phone: '' });

      if (email) {
        const { data: userData } = await supabase.from('users').select('whatsapp').eq('email', email).single();
        if (userData) {
          setUserData(prev => ({ ...prev, phone: userData.whatsapp || '' }));
        }
      }
    } catch (error) {
      console.error('Error fetching checkout details:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPrice = venue ? slots.length * venue.price_per_hour : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  async function handlePay() {
    setCreating(true);
    setBookingError(null);

    const fd = new FormData();
    fd.set('venueId', venueId || '');
    fd.set('courtId', courtId || '');
    fd.set('slots', slots.join(','));
    fd.set('venueName', venue?.name || '');
    fd.set('venueShort', venue?.name || '');
    fd.set('venueImg', venue?.image || '');
    fd.set('venueLocation', venue?.location || '');
    fd.set('totalPrice', String(totalPrice));
    fd.set('courtName', court?.name || '');

    const result = await createBooking(fd);

    if (result.error) {
      setBookingError(result.error);
      setCreating(false);
    } else if (result.success && result.bookingId) {
      setBookingResult({ bookingId: result.bookingId, date: result.date || '' });
      setShowPaymentModal(true);
      setCreating(false);
    }
  }

  const handleCopy = () => {
    if (bookingResult) {
      navigator.clipboard.writeText(bookingResult.bookingId);
    }
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Data Pembayaran...</div>;

  return (
    <>
      <Navbar />
      <style>{`
        .checkout-container {
          display: flex;
          gap: 48px;
          padding: 60px 0;
          width: 90%;
          max-width: 1600px;
          margin: auto;
        }
        .left { flex: 2; }
        .right { flex: 1; }
        .btn-back {
          padding: 12px 28px;
          border: 1px solid #ffffff;
          border-radius: 15px;
          background: none;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 32px;
          cursor: pointer;
          transition: 0.3s;
          font-family: inherit;
        }
        .btn-back:hover {
          background: var(--primary-lime);
          border-color: var(--primary-lime);
          color: black;
        }
        .card {
          background: #1c1c1c;
          padding: 28px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid #333;
        }
        .card h3 {
          margin-bottom: 8px;
          font-size: 24px;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          font-size: 14px;
          color: #aaa;
        }
        .info-item span {
          display: block;
          font-size: 16px;
          color: white;
          margin-top: 6px;
        }
        .payment-option {
          background: #eaeaea;
          color: #000;
          padding: 20px 24px;
          border-radius: 12px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: 0.3s;
          border: 1px solid transparent;
        }
        .payment-option:hover {
          border: 1px solid var(--primary-lime);
        }
        .payment-left {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 16px;
          font-weight: 600;
        }
        .payment-right {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #555;
          font-weight: 600;
        }
        input.payment-radio {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-lime);
          cursor: pointer;
        }
        .summary-box {
          background: #1c1c1c;
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
          border: 1px solid #333;
        }
        .summary-header {
          background: #2a2a2a;
          padding: 20px;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .summary-body { padding: 28px; }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 16px;
        }
        .summary-row span:first-child { color: #ccc; }
        .summary-row span:last-child { color: #fff !important; }
        .total-box {
          background: #2a2a2a;
          padding: 20px 28px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 20px;
          border: 1px solid #333;
        }
        .total-box span { color: #fff !important; }
        .total-box span:last-child { font-size: 18px; font-weight: 700; }
        .btn-checkout {
          width: 100%;
          padding: 16px;
          border-radius: 15px;
          border: 1px solid #ffffff;
          background: none;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
          font-family: inherit;
        }
        .btn-checkout:hover {
          background: var(--primary-lime);
          border-color: var(--primary-lime);
          color: black;
        }
        .terms {
          font-size: 11px;
          color: #888;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .terms span {
          color: var(--primary-lime);
          cursor: pointer;
        }
        .modal-overlay {
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          justify-content: center;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          display: flex;
        }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-content {
          background-color: #1f1f1f;
          padding: 30px;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          position: relative;
          transform: translateY(20px);
          transition: transform 0.3s;
        }
        .modal-overlay.active .modal-content { transform: translateY(0); }
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 15px;
          right: 25px;
          color: #aaa;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }
        .close-btn:hover { color: #fff; }
      `}</style>

      <div className="checkout-container">
        <div className="left">
          <button className="btn-back" onClick={() => window.history.back()}>Lihat Keranjang</button>

          <div className="card">
            <h3>Data Penyewa</h3>
            <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '24px' }}>
              {venue?.city ? `Kota ${venue.city}, Jawa Tengah` : 'Kota Surakarta, Jawa Tengah'}
            </div>
            <div className="info-grid">
              <div className="info-item">Nama Lengkap <span>{userData.name}</span></div>
              <div className="info-item">E-mail <span>{userData.email}</span></div>
              <div className="info-item">Nomor Ponsel <span>{userData.phone}</span></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '24px' }}><i className="fa-solid fa-wallet" style={{ color: 'var(--primary-lime)', marginRight: '12px', fontSize: '20px' }}></i> Metode Pembayaran</h3>

            <label className="payment-option" onClick={() => setSelectedPayment('va')}>
              <div className="payment-left">
                <img src="/asset/virtual-account.png" alt="VA" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                <div>
                  <div style={{ marginBottom: '8px' }}>Transfer Virtual Account</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src="/asset/bca.png" alt="BCA" style={{ height: '16px', objectFit: 'contain' }} />
                    <img src="/asset/bri.png" alt="Bank BRI" style={{ height: '16px', objectFit: 'contain' }} />
                    <img src="/asset/bni.png" alt="BNI" style={{ height: '16px', objectFit: 'contain' }} />
                    <img src="/asset/mandiri.png" alt="Mandiri" style={{ height: '16px', objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
              <div className="payment-right">
                <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'va'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('alfamart')}>
              <div className="payment-left">
                <img src="/asset/alfamart.png" alt="Alfamart" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                Alfamart
              </div>
              <div className="payment-right">
                Rp6.500 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'alfamart'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('gopay')}>
              <div className="payment-left">
                <img src="/asset/gopay.png" alt="GoPay" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                GoPay
              </div>
              <div className="payment-right">
                Rp7.500 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'gopay'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('shopeepay')}>
              <div className="payment-left">
                <img src="/asset/shopee-pay.png" alt="ShopeePay" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                ShopeePay
              </div>
              <div className="payment-right">
                Rp7.500 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'shopeepay'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('ovo')}>
              <div className="payment-left">
                <img src="/asset/ovo.png" alt="OVO" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                OVO
              </div>
              <div className="payment-right">
                Rp6.250 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'ovo'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('dana')}>
              <div className="payment-left">
                <img src="/asset/dana.png" alt="DANA" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                DANA
              </div>
              <div className="payment-right">
                Rp6.250 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'dana'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('qris')}>
              <div className="payment-left">
                <img src="/asset/qris.png" alt="QRIS" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
                QRIS
              </div>
              <div className="payment-right">
                Rp4.750 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'qris'} readOnly />
              </div>
            </label>

            <label className="payment-option" onClick={() => setSelectedPayment('kartukredit')}>
              <div className="payment-left">
                <div style={{ background: 'white', width: '40px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <i className="fa-solid fa-credit-card" style={{ fontSize: '20px', color: '#000' }}></i>
                </div>
                <div>
                  <div style={{ marginBottom: '8px' }}>Kartu Kredit</div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src="/asset/mastercard.png" alt="Mastercard" style={{ height: '22px', objectFit: 'contain' }} />
                    <img src="/asset/visa.png" alt="Visa" style={{ height: '22px', objectFit: 'contain' }} />
                    <img src="/asset/jcb.png" alt="JCB" style={{ height: '22px', objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
              <div className="payment-right">
                Rp11.900 <input type="radio" name="payment" className="payment-radio" checked={selectedPayment === 'kartukredit'} readOnly />
              </div>
            </label>
          </div>
        </div>

        <div className="right">
          <div className="summary-box">
            <div className="summary-header">Rincian Biaya</div>
            <div className="summary-body">
              <div className="summary-row"><span>Biaya Sewa</span><span>Rp{totalPrice.toLocaleString('id-ID')}</span></div>
              <div className="summary-row"><span>Biaya Produk Tambahan</span><span>Rp0</span></div>
              <div className="summary-row"><span>Total Biaya (Lunas)</span><span>Rp{totalPrice.toLocaleString('id-ID')}</span></div>
              <div className="summary-row"><span>Convenience Fee</span><span>Rp0</span></div>
              <div className="summary-row"><span>Biaya Transaksi</span><span>Rp0</span></div>
            </div>
          </div>

          <div className="total-box">
            <span>Total Biaya</span>
            <span>Rp.{totalPrice.toLocaleString('id-ID')}</span>
          </div>

          <div className="terms">
            Dengan mengklik tombol berikut, anda menyetujui <span>Syarat dan Ketentuan</span> serta <span>Kebijakan Privasi</span>
          </div>

          {bookingError && (
            <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{bookingError}</div>
          )}
          <button className="btn-checkout" onClick={handlePay} disabled={creating}>
            {creating ? 'Memproses Pembayaran...' : 'Lakukan Pembayaran'}
          </button>
        </div>
      </div>

      <div className={`modal-overlay ${showPaymentModal ? 'active' : ''}`} onClick={() => setShowPaymentModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-btn" onClick={() => setShowPaymentModal(false)}>&times;</span>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Menunggu Pembayaran</h2>
          <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>Selesaikan pembayaran Anda sebelum waktu habis.</p>

          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>{formatTime(countdown)}</div>

          <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>ID Booking</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {bookingResult?.bookingId || '-'}
              <i className="fa-regular fa-copy" style={{ cursor: 'pointer', color: '#fff' }} title="Salin" onClick={handleCopy}></i>
            </div>
            <div style={{ marginTop: '15px', fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Total Tagihan</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Rp{totalPrice.toLocaleString('id-ID')}</div>
          </div>

          <button className="btn-checkout" onClick={() => { window.location.href = `/sewa-lapangan/success?bookingId=${bookingResult?.bookingId}`; }}>Cek Status Pembayaran</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  useEffect(() => { document.title = 'Checkout - Minton'; }, []);
  return (
    <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

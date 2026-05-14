
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const courtId = searchParams.get('courtId');
  const slots = searchParams.get('slots')?.split(',') || [];

  const [venue, setVenue] = useState<any>(null);
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('qris');
  const [userData, setUserData] = useState({ name: 'User Minton', email: '', phone: '+62 812 3456 7890' });

  useEffect(() => {
    if (venueId && courtId) {
      fetchDetails();
    }
  }, [venueId, courtId]);

  async function fetchDetails() {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    try {
      setLoading(true);
      const { data: vData } = await supabase.from('venues').select('*').eq('id', venueId).single();
      const { data: cData } = await supabase.from('courts').select('*').eq('id', courtId).single();
      setVenue(vData);
      setCourt(cData);
      setUserData(prev => ({ ...prev, email: decodeURIComponent(cookies['userEmail'] || '') }));
    } catch (error) {
      console.error('Error fetching checkout details:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPrice = venue ? slots.length * venue.price_per_hour : 0;

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      
      const sortedSlots = [...slots].sort();
      const startTime = sortedSlots[0].split('-')[0] + ':00';
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      const endTime = lastSlot.split('-')[1] + ':00';

      const { error } = await supabase.from('bookings').insert({
        user_email: userData.email,
        venue_name: venue.name,
        court_name: court.name,
        booking_date: '2026-03-06',
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        status: 'Lunas'
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Gagal memproses pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Data Pembayaran...</div>;

  return (
    <div className="checkout-container" style={{ display: 'flex', gap: '48px', padding: '120px 0 80px', width: '90%', maxWidth: '1600px', margin: 'auto' }}>
      <style jsx>{`
        .card {
            background: #1c1c1c;
            padding: 28px;
            border-radius: 12px;
            margin-bottom: 24px;
            border: 1px solid #333;
        }
        .card h3 { margin-bottom: 20px; font-size: 22px; font-weight: 600; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; font-size: 14px; color: #aaa; }
        .info-item span { display: block; font-size: 16px; color: white; margin-top: 6px; }
        
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
            border: 2px solid transparent;
        }
        .payment-option.active { border-color: #bdd124; }
        .payment-left { display: flex; align-items: center; gap: 16px; font-size: 16px; font-weight: 600; }
        .payment-right { display: flex; align-items: center; gap: 12px; font-size: 16px; color: #555; font-weight: 600; }
        
        .summary-box { background: #1c1c1c; border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        .summary-header { background: #2a2a2a; padding: 20px; text-align: center; font-size: 16px; font-weight: 600; }
        .summary-body { padding: 28px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 16px; }
        .summary-row span:first-child { color: #ccc; }
        
        .total-box { background: #2a2a2a; padding: 20px 28px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; margin-top: 24px; border: 1px solid #333; }
      `}</style>

      <div className="left" style={{ flex: 2 }}>
        <button className="btn-outline" style={{ marginBottom: '32px', padding: '10px 24px' }} onClick={() => window.history.back()}>Lihat Keranjang</button>
        
        <div className="card">
          <h3>Data Penyewa</h3>
          <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '24px' }}>{venue.city}, Indonesia</div>
          <div className="info-grid">
            <div className="info-item">Nama Lengkap <span>{userData.name}</span></div>
            <div className="info-item">E-mail <span>{userData.email}</span></div>
            <div className="info-item">Nomor Ponsel <span>{userData.phone}</span></div>
          </div>
        </div>

        <div className="card">
          <h3><i className="fa-solid fa-wallet" style={{ color: '#bdd124', marginRight: '12px' }}></i> Metode Pembayaran</h3>
          
          <div className={`payment-option ${selectedPayment === 'va' ? 'active' : ''}`} onClick={() => setSelectedPayment('va')}>
            <div className="payment-left">
              <img src="/asset/virtual-account.png" alt="VA" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
              <div>
                <div style={{ marginBottom: '8px' }}>Transfer Virtual Account</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img src="/asset/bca.png" style={{ height: '14px' }} /><img src="/asset/bri.png" style={{ height: '14px' }} /><img src="/asset/bni.png" style={{ height: '14px' }} /><img src="/asset/mandiri.png" style={{ height: '14px' }} />
                </div>
              </div>
            </div>
            <input type="radio" checked={selectedPayment === 'va'} readOnly style={{ accentColor: '#bdd124' }} />
          </div>

          <div className={`payment-option ${selectedPayment === 'qris' ? 'active' : ''}`} onClick={() => setSelectedPayment('qris')}>
            <div className="payment-left">
              <img src="/asset/qris.png" alt="QRIS" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
              QRIS
            </div>
            <div className="payment-right">Rp 4.750 <input type="radio" checked={selectedPayment === 'qris'} readOnly style={{ accentColor: '#bdd124' }} /></div>
          </div>

          <div className={`payment-option ${selectedPayment === 'gopay' ? 'active' : ''}`} onClick={() => setSelectedPayment('gopay')}>
            <div className="payment-left">
              <img src="/asset/gopay.png" alt="GoPay" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
              GoPay
            </div>
            <div className="payment-right">Rp 7.500 <input type="radio" checked={selectedPayment === 'gopay'} readOnly style={{ accentColor: '#bdd124' }} /></div>
          </div>

          <div className={`payment-option ${selectedPayment === 'dana' ? 'active' : ''}`} onClick={() => setSelectedPayment('dana')}>
            <div className="payment-left">
              <img src="/asset/dana.png" alt="DANA" style={{ height: '36px', width: '50px', objectFit: 'contain' }} />
              DANA
            </div>
            <div className="payment-right">Rp 6.250 <input type="radio" checked={selectedPayment === 'dana'} readOnly style={{ accentColor: '#bdd124' }} /></div>
          </div>
        </div>
      </div>

      <div className="right" style={{ flex: 1 }}>
        <div className="summary-box">
          <div className="summary-header">Rincian Biaya</div>
          <div className="summary-body">
            <div className="summary-row"><span>Biaya Sewa</span><span>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
            <div className="summary-row"><span>Biaya Layanan</span><span>Rp 0</span></div>
            <div className="summary-row"><span>Total Biaya (Lunas)</span><span>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
          </div>
        </div>

        <div className="total-box">
          <span>Total Biaya</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>

        <p style={{ fontSize: '11px', color: '#888', marginTop: '16px', lineHeight: '1.4' }}>
          Dengan mengklik tombol berikut, anda menyetujui <span style={{ color: '#bdd124' }}>Syarat dan Ketentuan</span> serta <span style={{ color: '#bdd124' }}>Kebijakan Privasi</span>
        </p>

        <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px' }} onClick={handlePayment} disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Lakukan Pembayaran'}
        </button>
      </div>

      {isSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1f1f1f', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '450px', border: '1px solid #333' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px' }}></i>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Pembayaran Berhasil!</h2>
            <p style={{ color: '#ccc', marginBottom: '30px' }}>E-Tiket Anda telah terbit. Silakan cek detail jadwal di Dashboard.</p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.location.href = '/dashboard'}>Ke Dashboard Saya</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}

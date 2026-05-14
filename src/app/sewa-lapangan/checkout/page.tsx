
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

  useEffect(() => {
    if (venueId && courtId) {
      fetchDetails();
    }
  }, [venueId, courtId]);

  async function fetchDetails() {
    try {
      setLoading(true);
      const { data: vData } = await supabase.from('venues').select('*').eq('id', venueId).single();
      const { data: cData } = await supabase.from('courts').select('*').eq('id', courtId).single();
      setVenue(vData);
      setCourt(cData);
    } catch (error) {
      console.error('Error fetching checkout details:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPrice = venue ? slots.length * venue.price_per_hour : 0;

  const handlePayment = async () => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    try {
      setIsSubmitting(true);
      
      const sortedSlots = [...slots].sort();
      const startTime = sortedSlots[0].split('-')[0] + ':00';
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      const endTime = lastSlot.split('-')[1] + ':00';

      const { error } = await supabase.from('bookings').insert({
        user_email: decodeURIComponent(cookies['userEmail'] || ''),
        venue_name: venue.name,
        court_name: court.name,
        booking_date: '2026-03-06', // Mock date for now
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
    <div className="checkout-container" style={{ display: 'flex', gap: '48px', padding: '120px 0', width: '90%', maxWidth: '1600px', margin: 'auto' }}>
      <div className="left" style={{ flex: 2 }}>
        <button className="btn-back" onClick={() => window.history.back()}>Kembali</button>
        
        <div className="card" style={{ background: '#1c1c1c', padding: '28px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #333' }}>
          <h3>Data Venue</h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <img src={venue.image_url} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
              <h4 style={{ fontSize: '20px', marginBottom: '8px' }}>{venue.name}</h4>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{venue.location}</p>
              <p style={{ color: '#bdd124', fontWeight: 'bold', marginTop: '10px' }}>{court.name}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#1c1c1c', padding: '28px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px' }}>Waktu Terpilih</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {slots.map(s => (
              <div key={s} style={{ background: '#2a2a2a', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                <div style={{ fontSize: '12px', color: '#aaa' }}>Jumat, 6 Mar</div>
                <div style={{ fontWeight: 'bold' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: '#1c1c1c', padding: '28px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #333' }}>
           <h3 style={{ marginBottom: '24px' }}><i className="fa-solid fa-wallet" style={{ color: '#bdd124', marginRight: '12px' }}></i> Metode Pembayaran</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             {['QRIS', 'Gopay', 'VA BCA', 'VA Mandiri'].map(method => (
                <label key={method} style={{ 
                  background: selectedPayment === method.toLowerCase() ? 'rgba(189, 209, 36, 0.1)' : '#2a2a2a',
                  padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid',
                  borderColor: selectedPayment === method.toLowerCase() ? '#bdd124' : '#333',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }} onClick={() => setSelectedPayment(method.toLowerCase())}>
                  <span style={{ fontWeight: '600' }}>{method}</span>
                  <input type="radio" checked={selectedPayment === method.toLowerCase()} readOnly />
                </label>
             ))}
           </div>
        </div>
      </div>

      <div className="right" style={{ flex: 1 }}>
        <div className="summary-box" style={{ background: '#1c1c1c', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
          <div style={{ background: '#2a2a2a', padding: '20px', textAlign: 'center', fontWeight: 'bold' }}>Rincian Biaya</div>
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#aaa' }}>Biaya Sewa</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#aaa' }}>Layanan</span>
              <span>Rp 0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333', fontWeight: 'bold' }}>
              <span>Total Tagihan</span>
              <span style={{ color: '#bdd124', fontSize: '20px' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '12px' }}
          onClick={handlePayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
        </button>

        <p style={{ fontSize: '12px', color: '#888', marginTop: '16px', textAlign: 'center' }}>
          Dengan membayar, Anda menyetujui Syarat dan Ketentuan yang berlaku.
        </p>
      </div>

      {isSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', border: '1px solid #333' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px' }}></i>
            <h2>Booking Berhasil!</h2>
            <p style={{ color: '#aaa', margin: '15px 0 30px' }}>Pembayaran Anda telah dikonfirmasi. Cek jadwal di Dashboard.</p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.location.href = '/dashboard'}>Lihat Dashboard</button>
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

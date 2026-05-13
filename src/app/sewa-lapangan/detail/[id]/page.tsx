
"use client";
import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

interface Venue {
  id: number;
  name: string;
  location: string;
  city: string;
  price_per_hour: number;
  rating: number;
  image_url: string;
}

interface Court {
  id: number;
  name: string;
  type: string;
  is_indoor: boolean;
  image_url: string;
}

export default function DetailVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(0); 
  const [activeCourt, setActiveCourt] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('qris');

  const dates = [
    { day: 'Jum', date: '6 Mar' },
    { day: 'Sab', date: '7 Mar' },
    { day: 'Min', date: '8 Mar' },
    { day: 'Sen', date: '9 Mar' },
    { day: 'Sel', date: '10 Mar' },
    { day: 'Rab', date: '11 Mar' },
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
    '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    try {
      setLoading(true);
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      
      if (venueError) throw venueError;
      setVenue(venueData);

      const { data: courtData, error: courtError } = await supabase
        .from('courts')
        .select('*')
        .eq('venue_id', id);
      
      if (!courtError) setCourts(courtData || []);

    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const totalPrice = venue ? selectedSlots.length * venue.price_per_hour : 0;

  const handleBookingStart = () => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (cookies['isLoggedIn'] !== 'true') {
      alert('Silakan login terlebih dahulu untuk melakukan booking!');
      window.location.href = '/login';
      return;
    }

    if (selectedSlots.length === 0) {
      alert('Pilih jam terlebih dahulu!');
      return;
    }

    setIsCheckoutModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    try {
      setIsSubmitting(true);
      
      const sortedSlots = [...selectedSlots].sort();
      const startTime = sortedSlots[0] + ':00';
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      const endTime = (parseInt(lastSlot.split(':')[0]) + 1).toString().padStart(2, '0') + ':00:00';

      const { error } = await supabase.from('bookings').insert({
        user_email: decodeURIComponent(cookies['userEmail']),
        venue_name: venue!.name,
        court_name: courts.find(c => c.id === activeCourt)?.name || 'Lapangan Utama',
        booking_date: '2026-03-06',
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        status: 'Lunas'
      });

      if (error) throw error;

      setIsCheckoutModalOpen(false);
      setIsBookingModalOpen(true);
      setSelectedSlots([]);
      setActiveCourt(null);

    } catch (err) {
      console.error('Booking failed:', err);
      alert('Gagal melakukan pembayaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Detail Venue...</div>;
  if (!venue) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Venue tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Konfirmasi Pesanan</h2>
            
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#888' }}>Venue</span>
                <span>{venue.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#888' }}>Lapangan</span>
                <span>{courts.find(c => c.id === activeCourt)?.name || 'Lapangan Utama'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#888' }}>Durasi</span>
                <span>{selectedSlots.length} Jam</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #222', marginTop: '12px' }}>
                <span style={{ fontWeight: 'bold' }}>Total Bayar</span>
                <span style={{ color: '#bdd124', fontWeight: 'bold', fontSize: '18px' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <h4 style={{ marginBottom: '16px' }}>Pilih Metode Pembayaran</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
              {['QRIS', 'Gopay', 'VA Mandiri', 'VA BCA'].map(method => (
                <div 
                  key={method}
                  onClick={() => setSelectedPayment(method.toLowerCase())}
                  style={{ 
                    padding: '12px', borderRadius: '12px', border: '1px solid', 
                    borderColor: selectedPayment === method.toLowerCase() ? '#bdd124' : '#333',
                    background: selectedPayment === method.toLowerCase() ? 'rgba(189, 209, 36, 0.05)' : '#0a0a0a',
                    cursor: 'pointer', textAlign: 'center', transition: '0.3s', fontSize: '14px'
                  }}
                >
                  {method}
                </div>
              ))}
            </div>

            <button 
              onClick={handlePaymentConfirm}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#bdd124', color: '#000', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
            </button>
            <button 
              onClick={() => setIsCheckoutModalOpen(false)}
              style={{ width: '100%', padding: '14px', marginTop: '10px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isBookingModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px', display: 'block' }}></i>
            <h2 style={{ marginBottom: '12px' }}>Pembayaran Berhasil!</h2>
            <p style={{ color: '#aaa', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' }}>E-Tiket Anda sudah terbit. Silakan cek detailnya di Dashboard.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#bdd124', color: '#000', fontWeight: '700', cursor: 'pointer' }}
            >
              Ke Dashboard Saya
            </button>
          </div>
        </div>
      )}

      <div className="detail-container" style={{ width: '90%', maxWidth: '1600px', margin: '120px auto 80px' }}>
        <div className="detail-hero" style={{ marginBottom: '40px' }}>
          <img src={venue.image_url} alt={venue.name} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }} />
        </div>

        <div className="title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
          <div className="title-left" style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{venue.name}</h1>
            <div className="rating" style={{ color: '#aaa', fontSize: '15px', marginBottom: '40px' }}>
              <i className="fa-solid fa-star" style={{ color: '#bdd124', marginRight: '5px' }}></i> 
              {venue.rating} • {venue.location}
            </div>

            <div className="info-box" style={{ background: '#171717', padding: '24px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '16px' }}>Lokasi Venue</strong>
                <button className="btn-map" style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #fff', background: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Buka Peta</button>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{venue.location}</p>
            </div>

            <div className="rules" style={{ marginBottom: '40px' }}>
              <strong style={{ fontSize: '18px', marginBottom: '15px', display: 'block' }}>Aturan Venue:</strong>
              <ol style={{ marginLeft: '20px', color: '#ccc', lineHeight: '1.8' }}>
                <li>Menjaga kebersihan selama berada di lingkungan venue.</li>
                <li>Menggunakan sepatu khusus olahraga (non-marking).</li>
                <li>Dilarang merokok di dalam area lapangan.</li>
                <li>Harap datang 10 menit sebelum jadwal dimulai.</li>
              </ol>
            </div>
          </div>

          <div className="price-box" style={{ background: '#171717', padding: '30px', borderRadius: '16px', width: '320px', border: '1px solid #333', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h4 style={{ color: '#aaa', fontWeight: 'normal', marginBottom: '8px' }}>{selectedSlots.length > 0 ? `Terpilih ${selectedSlots.length} Jam` : 'Mulai dari'}</h4>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Rp {(selectedSlots.length > 0 ? totalPrice : venue.price_per_hour).toLocaleString('id-ID')}</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}> {selectedSlots.length > 0 ? '' : '/ Jam'}</span>
            </div>
            
            {selectedSlots.length > 0 && (
              <div style={{ marginBottom: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>Waktu Terpilih:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                   {selectedSlots.map(s => (
                     <span key={s} style={{ background: '#333', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>{s}</span>
                   ))}
                </div>
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginBottom: '12px', opacity: selectedSlots.length > 0 ? 1 : 0.5 }}
              onClick={handleBookingStart}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Booking Sekarang'}
            </button>
            <button className="btn-outline" style={{ width: '100%' }}>
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '8px' }}></i> Chat CS
            </button>
          </div>
        </div>

        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Pilih Lapangan</h2>
          
          <div className="date-filter-bar" style={{ display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
            {dates.map((date, index) => (
              <div 
                key={index} 
                className={`date-pill ${selectedDate === index ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDate(index);
                  setSelectedSlots([]);
                }}
                style={{ 
                  background: selectedDate === index ? '#bdd124' : '#1e1e1e',
                  color: selectedDate === index ? '#000' : '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '100px',
                  border: '1px solid #333',
                  transition: '0.3s'
                }}
              >
                <div style={{ fontSize: '12px' }}>{date.day}</div>
                <div style={{ fontWeight: 'bold' }}>{date.date}</div>
              </div>
            ))}
          </div>

          <div className="court-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {courts.length > 0 ? (
              courts.map((court) => (
                <div key={court.id} className="court-card" style={{ background: '#171717', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', transition: '0.3s', borderColor: activeCourt === court.id ? '#bdd124' : '#333' }}>
                  <img src={court.image_url || venue.image_url} alt={court.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{court.name}</h3>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>
                      <span>{court.is_indoor ? 'Indoor' : 'Outdoor'}</span>
                      <span>•</span>
                      <span>{court.type}</span>
                    </div>
                    
                    {activeCourt === court.id ? (
                      <div className="slot-picker">
                        <p style={{ fontSize: '13px', marginBottom: '12px', color: '#bdd124' }}>Pilih Jam Tersedia:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                          {timeSlots.map(slot => (
                            <button 
                              key={slot}
                              onClick={() => toggleSlot(slot)}
                              style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: selectedSlots.includes(slot) ? '#bdd124' : '#1e1e1e',
                                color: selectedSlots.includes(slot) ? '#000' : '#fff',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: '0.2s'
                              }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        <button className="btn-outline" style={{ width: '100%', borderColor: '#f44336', color: '#f44336' }} onClick={() => { setActiveCourt(null); setSelectedSlots([]); }}>Batal</button>
                      </div>
                    ) : (
                      <button className="btn-outline" style={{ width: '100%' }} onClick={() => setActiveCourt(court.id)}>Lihat Jadwal</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#aaa' }}>Belum ada data lapangan untuk venue ini.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

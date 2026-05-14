
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
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
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
    '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', 
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', 
    '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00'
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
      window.location.href = `/login?redirect=/sewa-lapangan/detail/${id}`;
      return;
    }

    if (selectedSlots.length === 0) {
      alert('Pilih jam terlebih dahulu!');
      return;
    }

    // Redirect to checkout page with data
    const slotStr = selectedSlots.join(',');
    window.location.href = `/sewa-lapangan/checkout?venueId=${id}&courtId=${activeCourt}&slots=${slotStr}`;
  };

  const handlePaymentConfirm = async () => {
    // ... logic for direct payment if needed ...
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Detail Venue...</div>;
  if (!venue) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Venue tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

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

      {/* Slot Modal */}
      {isSlotModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: '#1f1f1f', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '900px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <span className="close-btn" onClick={() => setIsSlotModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '25px', color: '#aaa', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</span>
            <h2 style={{ fontSize: '26px', marginBottom: '25px' }}>Waktu Ketersediaan Lapangan</h2>
            <div className="slot-grid">
              {timeSlots.map(slot => (
                <div 
                  key={slot}
                  className={`slot-card available ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                  onClick={() => toggleSlot(slot)}
                >
                  <div className="duration">60 Menit</div>
                  <div className="time">{slot}</div>
                  <div className="status">Tersedia</div>
                  <div className="price">Rp {venue.price_per_hour.toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={handleBookingStart}
                style={{ padding: '15px 40px', borderRadius: '12px', opacity: selectedSlots.length > 0 ? 1 : 0.5 }}
                disabled={selectedSlots.length === 0}
              >
                Pilih Jam Terpilih
              </button>
              {selectedSlots.length > 0 && (
                <div style={{ color: '#aaa' }}>{selectedSlots.length} Jam Terpilih - <span style={{ color: '#bdd124', fontWeight: 'bold' }}>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="detail-container">
        <div className="detail-hero" style={{ marginBottom: '40px' }}>
          <img src={venue.image_url} alt={venue.name} />
        </div>

        <div className="title-wrapper">
          <div className="title-left" style={{ flex: 1 }}>
            <h1>{venue.name}</h1>
            <div className="rating" style={{ marginBottom: '40px' }}>
              <i className="fa-solid fa-star" style={{ color: '#bdd124', marginRight: '5px' }}></i> 
              {venue.rating} • {venue.city}
            </div>

            <div className="info-box" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '16px' }}>Lokasi Venue</strong>
                <button className="btn-map">Buka Peta</button>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{venue.location}</p>
            </div>

            <div className="rules" style={{ marginBottom: '40px' }}>
              <strong style={{ fontSize: '16px', marginBottom: '10px', display: 'block' }}>Aturan:</strong>
              <ol style={{ marginLeft: '20px' }}>
                <li>Menjaga kebersihan selama berada di lingkungan venue / lapangan.</li>
                <li>Menggunakan alas kaki khusus SPORT yang benar.</li>
                <li>Makanan & minuman manis dilarang masuk area lapangan.</li>
                <li>Dilarang merokok di dalam area indoor.</li>
              </ol>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <strong style={{ display: 'block', marginBottom: '15px', fontSize: '16px' }}>Fasilitas</strong>
              <div className="facilities">
                <div className="facility"><i className="fa-solid fa-wifi"></i> Wifi Gratis</div>
                <div className="facility"><i className="fa-solid fa-snowflake"></i> AC di Ruangan</div>
                <div className="facility"><i className="fa-solid fa-table-tennis-paddle-ball"></i> Sewa Raket</div>
                <div className="facility"><i className="fa-solid fa-restroom"></i> Toilet / Kamar Mandi</div>
                <div className="facility"><i className="fa-solid fa-square-parking"></i> Parkir Luas</div>
                <div className="facility"><i className="fa-solid fa-mug-saucer"></i> Kantin / Kafe</div>
              </div>
            </div>
          </div>

          <div className="price-box">
            <h4 style={{ marginBottom: '12px', fontWeight: 'normal' }}>Mulai dari</h4>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '24px' }}>Rp {venue.price_per_hour.toLocaleString('id-ID')}</span>
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#aaa' }}>/Jam</span>
            </div>
            <button className="btn-chat">
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '8px', fontSize: '16px' }}></i> Chat CS
            </button>
          </div>
        </div>

        <div style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '32px' }}>Pilih Lapangan</h2>
          
          <div className="date-filter-bar">
            <div className="date-pills">
              {dates.map((date, index) => (
                <div 
                  key={index} 
                  className={`date-pill ${selectedDate === index ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDate(index);
                    setSelectedSlots([]);
                  }}
                >
                  <p className="day-name">{date.day}</p>
                  <p className="day-num">{date.date}</p>
                </div>
              ))}
              <div className="date-pill-cal" title="Pilih Tanggal">
                <i className="fa-solid fa-calendar-days"></i>
              </div>
            </div>

            <button className="btn-filter-waktu">
              <i className="fa-solid fa-sliders"></i>
              Filter Waktu
            </button>
          </div>

          <div className="court-grid">
            {courts.length > 0 ? (
              courts.map((court) => (
                <div key={court.id} className="court-card">
                  <img src={court.image_url || venue.image_url} alt={court.name} />
                  <div className="court-content">
                    <h3>{court.name}</h3>
                    <p style={{ color: '#aaa', fontSize: '13px', display: 'flex', gap: '20px', marginBottom: '5px' }}>
                      <span>{court.is_indoor ? 'Indoor' : 'Outdoor'}</span>
                      <span>{court.type}</span>
                    </p>
                    <button className="slot-btn" onClick={() => { setActiveCourt(court.id); setIsSlotModalOpen(true); }}>
                      Lihat Tersedia
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#aaa' }}>Belum ada data lapangan untuk venue ini.</p>
            )}
          </div>
        </div>

        {/* Bottom Sections */}
        <section style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Paket Membership</h2>
          <div className="membership-wrapper">
             <div className="membership-card">
                <p style={{ color: '#aaa' }}>Belum ada paket membership tersedia untuk venue ini.</p>
             </div>
          </div>
        </section>

        <section style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Ulasan</h2>
          <div className="review-wrapper">
             <div className="review-card">
                <p style={{ color: '#aaa' }}>Belum ada ulasan untuk venue ini.</p>
             </div>
          </div>
        </section>

        <section style={{ marginTop: '100px', marginBottom: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Rekomendasi Lapangan</h2>
          <div className="recommend-grid">
             <div className="recommend-card" style={{ textAlign: 'center', padding: '40px' }}>
                <button className="btn-primary" onClick={() => window.location.href = '/sewa-lapangan'}>Cari Lapangan Lain</button>
             </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

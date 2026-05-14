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

const BOOKED_SLOTS = ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '21:00-22:00'];

const CALENDAR_DAYS = [
  { day: 'S', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'S', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'R', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'K', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'J', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'S', classes: 'font-size:12px;color:#666;font-weight:700' },
  { day: 'M', classes: 'font-size:12px;color:#666;font-weight:700' },
];

export default function DetailVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeCourt, setActiveCourt] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('qris');
  const [selectedCalDate, setSelectedCalDate] = useState(6);

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

  const availableSlots = timeSlots.filter(s => !BOOKED_SLOTS.includes(s));

  useEffect(() => { document.title = 'Detail Lapangan - Minton'; }, []);

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
    if (BOOKED_SLOTS.includes(slot)) return;
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

    const slotStr = selectedSlots.join(',');
    window.location.href = `/sewa-lapangan/keranjang?venueId=${id}&courtId=${activeCourt}&slots=${slotStr}`;
  };

  const openSlotModal = (courtId: number) => {
    setActiveCourt(courtId);
    setSelectedSlots([]);
    setIsSlotModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSlotModal = () => {
    setIsSlotModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCalendarModal = () => {
    setIsCalendarModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const isNoSlotCourt = (index: number) => index % 2 === 1;

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Detail Venue...</div>;
  if (!venue) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Venue tidak ditemukan.</div>;

  return (
    <>
      <style>{`
        .detail-container { width: 90%; max-width: 1600px; margin: 40px auto 80px; color: #fff; }
        .detail-hero img { width: 100%; height: 350px; object-fit: cover; border-radius: 12px; }
        .title-wrapper { display: flex; justify-content: space-between; margin-top: 30px; align-items: flex-start; }
        .title-left h1 { font-size: 28px; margin-bottom: 10px; }
        .rating { color: #aaa; font-size: 14px; }
        .price-box { background: #171717; padding: 24px; border-radius: 12px; width: 280px; position: sticky; top: 100px; border: 1px solid #333; }
        .price-box h4 { font-size: 14px; color: #aaa; margin-bottom: 8px; font-weight: normal; }
        .price-box span { font-size: 24px; font-weight: 700; }
        .btn-chat { margin-top: 15px; width: 100%; padding: 12px; border-radius: 10px; border: 1px solid white; background: none; color: white; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-chat:hover { background: white; color: black; }
        .info-box { background: #171717; padding: 24px; border-radius: 12px; margin-top: 25px; }
        .btn-map { padding: 8px 20px; border-radius: 20px; border: 1px solid white; background: none; color: white; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.3s; }
        .btn-map:hover { background: white; color: black; }
        .rules { margin-top: 20px; color: white; font-size: 16px; line-height: 1.8; }
        .facilities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 15px; }
        .facility { display: flex; align-items: center; gap: 12px; font-size: 16px; color: white; }
        .facility i { color: var(--primary-lime); font-size: 18px; width: 24px; text-align: center; }
        .date-filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; gap: 20px; flex-wrap: wrap; }
        .date-pills { display: flex; gap: 12px; align-items: center; flex-wrap: nowrap; }
        .date-pill { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; color: #fff; font-size: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 24px; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; line-height: 1.3; }
        .date-pill:hover { border-color: #555; background: #2a2a2a; }
        .date-pill.active { background: var(--primary-lime); border-color: var(--primary-lime); color: #000; font-weight: 700; }
        .date-pill.active .day-name, .date-pill.active .day-num { color: #000; }
        .date-pill .day-name { font-size: 13px; font-weight: 400; }
        .date-pill .day-num { font-size: 14px; font-weight: 700; }
        .date-pill-cal { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; color: #fff; width: 54px; height: 54px; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; transition: all 0.25s ease; flex-shrink: 0; }
        .date-pill-cal:hover { border-color: #555; background: #2a2a2a; }
        .btn-filter-waktu { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 15px; color: #fff; font-size: 14px; font-weight: 600; padding: 12px 20px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; flex-shrink: 0; }
        .btn-filter-waktu:hover { border-color: #555; background: #2a2a2a; }
        .btn-filter-waktu i { font-size: 16px; color: #aaa; }
        .court-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; margin-top: 50px; }
        .court-card { background: #171717; border-radius: 14px; overflow: hidden; position: relative; transition: all 0.3s ease; }
        .court-card.no-slot { opacity: 0.6; }
        .court-card.no-slot img { filter: grayscale(1); }
        .no-slot-badge { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(4px); z-index: 2; }
        .court-card img { width: 100%; height: 170px; object-fit: cover; }
        .court-content { padding: 24px; }
        .court-content h3 { font-size: 15px; margin-bottom: 8px; }
        .slot-btn { margin-top: 15px; width: 100%; padding: 10px; border-radius: 8px; background: none; border: 1px solid #333; color: white; cursor: pointer; transition: 0.3s; }
        .slot-btn:hover { border-color: white; }
        .slot-btn:disabled { border-color: #222; color: #555; cursor: not-allowed; }
        .modal-overlay-detail { position: fixed; z-index: 1000; inset: 0; background-color: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease; }
        .modal-content-detail { background-color: #1f1f1f; padding: 30px; border-radius: 16px; width: 90%; max-width: 900px; position: relative; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .close-btn-detail { position: absolute; top: 15px; right: 25px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
        .close-btn-detail:hover { color: white; }
        .modal-content-detail h2 { font-size: 26px; margin-bottom: 25px; }
        .slot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
        .slot-card { background-color: #2f2f2f; border-radius: 12px; padding: 20px; text-align: center; transition: 0.3s; }
        .slot-card.booked { opacity: 0.6; }
        .slot-card.available { cursor: pointer; }
        .slot-card.available:hover { background-color: #3a3a3a; }
        .slot-card.available.selected { border: 2px solid #c6e400; background-color: #3a3a3a; }
        .slot-card .duration { font-size: 13px; color: #aaa; }
        .slot-card .time { font-size: 20px; font-weight: 600; margin: 8px 0; }
        .slot-card .status { font-size: 13px; color: #888; }
        .slot-card .price { font-size: 16px; font-weight: bold; color: #c6e400; }
        .modal-footer-detail { margin-top: 30px; display: flex; gap: 20px; align-items: center; }
        .btn-pilih { background-color: #c6e400; color: black; font-weight: bold; padding: 15px 40px; border-radius: 12px; border: none; cursor: pointer; font-size: 16px; transition: 0.3s; }
        .btn-pilih:hover { transform: scale(1.05); }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; text-align: center; }
        .cal-day { padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .cal-day:hover:not(.empty) { background: #333; }
        .cal-day.active { background: var(--primary-lime) !important; color: #000 !important; font-weight: 700; }
        .cal-day.disabled { color: #444 !important; cursor: not-allowed; }
        .cal-day.empty { color: transparent; pointer-events: none; }
        @media (max-width: 768px) { .title-wrapper { flex-direction: column; gap: 20px; } }
      `}</style>
      <Navbar />

      {/* Success Modal */}
      {isBookingModalOpen && (
        <div className="modal-overlay-detail" style={{ zIndex: 3000 }} onClick={() => setIsBookingModalOpen(false)}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: 'var(--primary-lime)', marginBottom: '24px', display: 'block' }}></i>
            <h2 style={{ marginBottom: '12px' }}>Pembayaran Berhasil!</h2>
            <p style={{ color: '#aaa', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' }}>E-Tiket Anda sudah terbit. Silakan cek detailnya di Dashboard.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary-lime)', color: '#000', fontWeight: '700', cursor: 'pointer' }}
            >
              Ke Dashboard Saya
            </button>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {isSlotModalOpen && (
        <div className="modal-overlay-detail" onClick={(e) => { if (e.target === e.currentTarget) closeSlotModal(); }}>
          <div className="modal-content-detail">
            <span className="close-btn-detail" onClick={closeSlotModal}>&times;</span>
            <h2>Waktu Ketersediaan Lapangan</h2>
            <div className="slot-grid">
              {timeSlots.map(slot => {
                const isBooked = BOOKED_SLOTS.includes(slot);
                const isSelected = selectedSlots.includes(slot);
                return (
                  <div 
                    key={slot}
                    className={`slot-card ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isBooked && toggleSlot(slot)}
                  >
                    <div className="duration">60 Menit</div>
                    <div className="time">{slot}</div>
                    {isBooked ? (
                      <div className="status">Booked</div>
                    ) : (
                      <div className="price">Rp {venue?.price_per_hour.toLocaleString('id-ID')}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="modal-footer-detail">
              <button 
                className="btn-pilih" 
                onClick={handleBookingStart}
                style={{ opacity: selectedSlots.length > 0 ? 1 : 0.5 }}
                disabled={selectedSlots.length === 0}
              >
                Pilih Waktu Sewa
              </button>
              {selectedSlots.length > 0 && (
                <div style={{ color: '#aaa' }}>{selectedSlots.length} Jam Terpilih - <span style={{ color: 'var(--primary-lime)', fontWeight: 'bold' }}>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="modal-overlay-detail" onClick={(e) => { if (e.target === e.currentTarget) closeCalendarModal(); }}>
          <div className="modal-content-detail" style={{ maxWidth: '400px' }}>
            <span className="close-btn-detail" onClick={closeCalendarModal}>&times;</span>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Pilih Tanggal Main</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#2a2a2a', padding: '12px', borderRadius: '12px' }}>
              <i className="fa-solid fa-chevron-left" style={{ cursor: 'pointer' }}></i>
              <span style={{ fontWeight: 700 }}>Maret 2026</span>
              <i className="fa-solid fa-chevron-right" style={{ cursor: 'pointer' }}></i>
            </div>
            <div className="cal-grid">
              {CALENDAR_DAYS.map((d, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#666', fontWeight: 700 }}>{d.day}</div>
              ))}
              {Array(6).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day empty">0</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <div 
                  key={day} 
                  className={`cal-day ${selectedCalDate === day ? 'active' : ''}`}
                  onClick={() => setSelectedCalDate(day)}
                >
                  {day}
                </div>
              ))}
            </div>
            <button className="btn-pilih" style={{ width: '100%', marginTop: '30px' }} onClick={closeCalendarModal}>Terapkan Tanggal</button>
          </div>
        </div>
      )}

      <div className="detail-container">
        <div className="detail-hero" style={{ marginBottom: '40px' }}>
          <img src={venue.image_url} alt={venue.name} />
        </div>

        <div className="title-wrapper" style={{ alignItems: 'flex-start', gap: '40px' }}>
          <div className="title-left" style={{ flex: 1 }}>
            <h1>{venue.name}</h1>
            <div className="rating" style={{ marginBottom: '40px' }}>
              <i className="fa-solid fa-star" style={{ color: 'var(--primary-lime)', marginRight: '5px' }}></i> 
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
                <li>Menggunakan alas kaki khusus SPORT yang benar. Jadi tidak merusak lapangan yang ada / tempat ganti baju.</li>
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

          <div className="price-box" style={{ width: '280px', position: 'sticky', top: '100px' }}>
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
              <div className="date-pill-cal" title="Pilih Tanggal" onClick={openCalendarModal}>
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
              courts.map((court, index) => {
                const noSlot = isNoSlotCourt(index);
                return (
                  <div key={court.id} className={`court-card ${noSlot ? 'no-slot' : ''}`}>
                    {noSlot && <div className="no-slot-badge">Penuh</div>}
                    <img src={court.image_url || venue.image_url} alt={court.name} />
                    <div className="court-content">
                      <h3>{court.name}</h3>
                      <p style={{ color: '#aaa', fontSize: '13px', display: 'flex', gap: '20px', marginBottom: '5px' }}>
                        <span>{court.is_indoor ? 'Indoor' : 'Outdoor'}</span>
                        <span>{court.type}</span>
                      </p>
                      {noSlot ? (
                        <button className="slot-btn" disabled>Tidak Tersedia</button>
                      ) : (
                        <button 
                          className="slot-btn"
                          onClick={() => openSlotModal(court.id)}
                        >
                          Lihat Tersedia
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#aaa' }}>Belum ada data lapangan untuk venue ini.</p>
            )}
          </div>
        </div>

        <section style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Paket Membership</h2>
          <div className="membership-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
             <div className="membership-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a2a2a' }}>
                <div>
                  <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>Member Badminton Reguler</h3>
                  <ul style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginLeft: '20px' }}>
                    <li>Langganan 4x main / minggu</li>
                    <li>Bebas pilih jam dan hari</li>
                  </ul>
                </div>
                <button style={{ background: 'none', border: '1px solid #333', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Beli Paket</button>
             </div>
             <div className="membership-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a2a2a' }}>
                <div>
                  <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>Member Badminton Premium</h3>
                  <ul style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginLeft: '20px' }}>
                    <li>Langganan 4x main / minggu</li>
                    <li>Termasuk parkir gratis & free air</li>
                  </ul>
                </div>
                <button style={{ background: 'none', border: '1px solid #333', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Beli Paket</button>
             </div>
          </div>
        </section>

        <section style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Ulasan</h2>
          <div className="review-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
             <div className="review-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}><i className="fa-solid fa-user"></i></div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>Rudy Kurniawan</h4>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Reviewer</p>
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Badminton Blue Court 1</h4>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>Lapangan sangat nyaman digunakan dan sangat bersih. Harga sesuai dengan fasilitas yang diberikan.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--primary-lime)' }}>★</span> 5.0</div>
                  <div style={{ color: '#aaa' }}>2 hari yang lalu</div>
                </div>
             </div>
             <div className="review-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}><i className="fa-solid fa-user"></i></div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>Ahmad Fauzi</h4>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Reviewer</p>
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Badminton Blue Court 2</h4>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>Pelayanan ramah, lapangan terang, sirkulasi udara baik. Namun parkir agak susah saat weekend.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.5</div>
                  <div style={{ color: '#aaa' }}>4 hari yang lalu</div>
                </div>
             </div>
             <div className="review-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}><i className="fa-solid fa-user"></i></div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>Clarissa Anwar</h4>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Reviewer</p>
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Badminton Green Court 1</h4>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>Kualitas karpetnya bagus, tidak licin. Sangat recommended buat main bareng teman kantor.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--primary-lime)' }}>★</span> 5.0</div>
                  <div style={{ color: '#aaa' }}>1 mgg yang lalu</div>
                </div>
             </div>
             <div className="review-card" style={{ background: '#171717', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}><i className="fa-solid fa-user"></i></div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>Bambang Pamungkas</h4>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>Reviewer</p>
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Badminton Green Court 2</h4>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>Overall baik. Harga sewa cukup terjangkau untuk fasilitas yang disediakan oleh GOR ini.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.0</div>
                  <div style={{ color: '#aaa' }}>2 mgg yang lalu</div>
                </div>
             </div>
          </div>
        </section>

        <section style={{ marginTop: '100px', marginBottom: '100px', position: 'relative' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '32px' }}>Rekomendasi Lapangan</h2>
          <div className="recommend-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
             <div className="recommend-card" style={{ background: '#171717', borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/asset/kalam-kudus.png" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Kalam Kudus Sport Center</h3>
                  <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.9 • Surakarta, Jawa Tengah</p>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Mulai</div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Rp250.000<span style={{ fontSize: '12px', fontWeight: 'normal', color: '#aaa' }}>/sesi</span></div>
                </div>
             </div>
             <div className="recommend-card" style={{ background: '#171717', borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/asset/surabaya-badminton.png" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Surabaya Badminton Hall</h3>
                  <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.8 • Surabaya, Jawa Timur</p>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Mulai</div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Rp150.000<span style={{ fontSize: '12px', fontWeight: 'normal', color: '#aaa' }}>/sesi</span></div>
                </div>
             </div>
             <div className="recommend-card" style={{ background: '#171717', borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/asset/gor-arek-surabaya.png" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>GOR Arak Surabaya</h3>
                  <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.5 • Surabaya, Jawa Timur</p>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Mulai</div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Rp80.000<span style={{ fontSize: '12px', fontWeight: 'normal', color: '#aaa' }}>/sesi</span></div>
                </div>
             </div>
             <div className="recommend-card" style={{ background: '#171717', borderRadius: '12px', overflow: 'hidden' }}>
                <img src="/asset/supersmash-badminton-hall.png" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Supermash Badminton</h3>
                  <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}><span style={{ color: 'var(--primary-lime)' }}>★</span> 4.7 • Surabaya, Jawa Timur</p>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Mulai</div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>Rp120.000<span style={{ fontSize: '12px', fontWeight: 'normal', color: '#aaa' }}>/sesi</span></div>
                </div>
             </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button style={{ background: 'var(--primary-lime)', color: 'black', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: '0.3s' }} onClick={() => window.location.href = '/sewa-lapangan'}>
              <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '8px' }}></i> Cari Lapangan Lain
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}


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
  const [selectedDate, setSelectedDate] = useState(0); 
  const [activeCourt, setActiveCourt] = useState<number | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

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

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Detail Venue...</div>;
  if (!venue) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Venue tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
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
              onClick={() => {
                if (selectedSlots.length > 0) {
                  alert(`Berhasil memesan ${venue.name} untuk ${selectedSlots.length} jam!`);
                  setSelectedSlots([]);
                  setActiveCourt(null);
                } else {
                  alert('Pilih jam terlebih dahulu!');
                }
              }}
            >
              Booking Sekarang
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
                  setSelectedSlots([]); // Reset selection on date change
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

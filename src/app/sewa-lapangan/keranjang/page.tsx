'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

function KeranjangContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const courtId = searchParams.get('courtId');
  const slotsParam = searchParams.get('slots');
  const initialSlots = slotsParam ? slotsParam.split(',') : [];

  const [venue, setVenue] = useState<any>(null);
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeSlots, setActiveSlots] = useState<string[]>(initialSlots);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    if (venueId && courtId) {
      fetchDetails();
    } else {
      setLoading(false);
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
      console.error('Error fetching keranjang details:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleSlot = (slot: string) => {
    if (activeSlots.includes(slot)) {
      setActiveSlots(activeSlots.filter(s => s !== slot));
    } else {
      setActiveSlots([...activeSlots, slot]);
    }
  };

  const totalPrice = venue ? activeSlots.length * venue.price_per_hour : 0;

  const handleCheckout = () => {
    if (activeSlots.length === 0) {
      alert('Pilih setidaknya satu pesanan untuk dilanjutkan.');
      return;
    }
    const slotStr = activeSlots.join(',');
    window.location.href = `/sewa-lapangan/checkout?venueId=${venueId}&courtId=${courtId}&slots=${slotStr}`;
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Keranjang...</div>;

  return (
    <div className="sewa-container" style={{ display: 'flex', gap: '48px', padding: '120px 0 80px', width: '90%', maxWidth: '1600px', margin: 'auto' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .sewa-container { color: #fff; }
        .btn-tambah { padding: 12px 28px; border: 1px solid #ffffff; border-radius: 15px; background: none; color: #ffffff; font-size: 16px; font-weight: 500; margin-bottom: 32px; cursor: pointer; transition: 0.3s; }
        .btn-tambah:hover { background: #bdd124; border-color: #bdd124; color: black; }
        .card { background: #1c1c1c; padding: 28px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #333; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        input[type="checkbox"].slot-checkbox { width: 22px; height: 22px; accent-color: #bdd124; cursor: pointer; margin-top: 4px; }
        .card h3 { margin-bottom: 8px; font-size: 24px; font-weight: 600; }
        .rating { font-size: 14px; color: #aaa; margin-bottom: 20px; }
        .badminton { font-weight: 600; font-size: 18px; margin-bottom: 16px; }
        .time-box { background: #2a2a2a; padding: 16px 20px; border-radius: 12px; font-size: 15px; position: relative; line-height: 1.6; }
        .time-box::before { content: ""; position: absolute; left: 0; top: 0; height: 100%; width: 6px; background: #bdd124; border-radius: 12px 0 0 12px; }
        .summary-box { background: #1c1c1c; padding: 28px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #333; }
        .summary-box h4 { margin-bottom: 20px; font-size: 16px; font-weight: 600; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 16px; }
        .summary-row span:first-child { color: #ffffff; }
        .summary-row span:last-child { color: #ffffff; }
        .total { display: flex; justify-content: space-between; font-weight: 600; font-size: 16px; margin-top: 20px; }
        .btn-sewa-primary { width: 100%; padding: 16px; border-radius: 15px; border: 1px solid #ffffff; background: none; color: #ffffff; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 16px; transition: 0.3s; }
        .btn-sewa-primary:hover { background: #bdd124; border-color: #bdd124; color: black; }
        .small-box { background: #1c1c1c; padding: 16px; border-radius: 12px; margin-bottom: 16px; text-align: center; cursor: pointer; font-size: 16px; border: 1px solid #333; transition: 0.3s; }
        .small-box:hover { border-color: #bdd124; }
        .modal-overlay { position: fixed; z-index: 2000; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; }
        .modal-content { background: #1c1c1c; width: 90%; max-width: 450px; border-radius: 20px; border: 1px solid #333; padding: 32px; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        .close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .policy-list { list-style: none; margin-bottom: 30px; }
        .policy-list li { position: relative; padding-left: 28px; margin-bottom: 16px; font-size: 14px; color: #ccc; line-height: 1.6; }
        .policy-list li::before { content: "✓"; font-weight: 900; position: absolute; left: 0; color: #bdd124; }
      `}} />

      <div className="left" style={{ flex: 2 }}>
        <button className="btn-tambah" onClick={() => window.location.href = '/sewa-lapangan'}>Tambah Pesanan</button>

        {initialSlots.length > 0 && venue && court ? (
          initialSlots.map((slot) => (
            <div className="card" key={slot}>
              <div className="card-header">
                <div>
                  <h3>{venue.name}</h3>
                  <div className="rating">
                    <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '4px' }}></i> 4.9 
                    <i className="fa-solid fa-location-dot" style={{ marginLeft: '10px', marginRight: '4px' }}></i> {venue.city}, Indonesia
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="slot-checkbox" 
                  checked={activeSlots.includes(slot)} 
                  onChange={() => toggleSlot(slot)} 
                />
              </div>

              <div className="badminton">{court.name}</div>

              <div className="time-box">
                Jumat, 6 Maret 2026 | {slot}
                <br />
                Rp {venue.price_per_hour.toLocaleString('id-ID')}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#aaa', marginTop: '20px' }}>Keranjang kosong. Silakan tambah pesanan dari halaman sewa lapangan.</div>
        )}
      </div>

      <div className="right" style={{ flex: 1 }}>
        <div className="small-box" onClick={() => setIsVoucherModalOpen(true)}>
          <i className="fa-solid fa-ticket" style={{ color: '#bdd124', marginRight: '12px' }}></i> Gunakan Voucher
        </div>

        <div className="summary-box">
          <h4>Rincian Biaya</h4>
          <div className="summary-row">
            <span>Biaya Sewa</span>
            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <div className="summary-row">
            <span>Biaya Produk Tambahan</span>
            <span>Rp 0</span>
          </div>
          <hr style={{ border: '1px solid #333', margin: '10px 0' }} />
          <div className="total">
            <p>Total Biaya</p>
            <p>Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="summary-box">
          <h4>Metode Pembayaran</h4>
          <div className="summary-row">
            <span>Bayar Lunas</span>
            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="small-box" onClick={() => setIsRescheduleModalOpen(true)}>
          <i className="fa-solid fa-circle-info" style={{ color: '#bdd124', marginRight: '12px' }}></i> Kebijakan Pembatalan & Reschedule
        </div>

        <button className="btn-sewa-primary" onClick={handleCheckout} disabled={activeSlots.length === 0}>
          Lanjutkan ke Pembayaran
        </button>
      </div>

      {isRescheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRescheduleModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kebijakan Reschedule</h2>
              <button className="close-btn" onClick={() => setIsRescheduleModalOpen(false)}>&times;</button>
            </div>
            <ul className="policy-list">
              <li>Reschedule dapat dilakukan maksimal 24 jam sebelum waktu sewa dimulai.</li>
              <li>Pengembalian dana (refund) tidak tersedia untuk pembatalan sepihak.</li>
              <li>Reschedule hanya berlaku untuk GOR yang sama dengan durasi sewa yang sama.</li>
              <li>Jika terdapat perbedaan harga pada slot baru, penyewa wajib membayar selisihnya.</li>
            </ul>
            <button className="btn-tambah" style={{ width: '100%', marginBottom: 0 }} onClick={() => setIsRescheduleModalOpen(false)}>Saya Mengerti</button>
          </div>
        </div>
      )}

      {isVoucherModalOpen && (
        <div className="modal-overlay" onClick={() => setIsVoucherModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gunakan Voucher</h2>
              <button className="close-btn" onClick={() => setIsVoucherModalOpen(false)}>&times;</button>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Masukkan kode voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none' }}
                />
                <button className="btn-tambah" style={{ marginBottom: 0, padding: '10px 20px' }}>Gunakan</button>
              </div>
              <p style={{ fontSize: '12px', color: '#888' }}>Punya kode promo? Masukkan kodenya di sini.</p>
            </div>

            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Voucher Tersedia</div>
            <div className="voucher-list" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
              <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px dashed #bdd124' }}>
                <div style={{ fontWeight: 700, color: '#bdd124', marginBottom: '4px' }}>DISKON MINTON 10%</div>
                <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>Potongan harga 10% hingga Rp25.000</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Berlaku hingga 12 Mar 2026</div>
              </div>
              <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #333' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>MAINKAN SURAKARTA</div>
                <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>Potongan Rp15.000 tanpa minimal sewa</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Berlaku hingga 15 Mar 2026</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KeranjangPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <KeranjangContent />
      </Suspense>
      <Footer />
    </>
  );
}

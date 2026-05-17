'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import { getAvailableVouchers, validateVoucher } from './actions';

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
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (cookies['isLoggedIn'] !== 'true') {
      window.location.href = `/login?redirect=/sewa-lapangan/keranjang${window.location.search}`;
      return;
    }

    if (venueId && courtId) {
      loadCartData();
    } else {
      setLoading(false);
    }
  }, [venueId, courtId]);

  async function loadCartData() {
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

  async function handleOpenVoucherModal() {
    setVoucherCode('');
    setVoucherLoading(true);
    setIsVoucherModalOpen(true);
    try {
      const vouchers = await getAvailableVouchers();
      setAvailableVouchers(vouchers);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setVoucherLoading(false);
    }
  }

  function handleCloseVoucherModal() {
    setIsVoucherModalOpen(false);
    setVoucherCode('');
    setVoucherLoading(false);
  }

  const toggleSlot = (slot: string) => {
    if (activeSlots.includes(slot)) {
      setActiveSlots(activeSlots.filter(s => s !== slot));
    } else {
      setActiveSlots([...activeSlots, slot]);
    }
  };

  const totalPrice = venue ? activeSlots.length * venue.price_per_hour : 0;
  const discountAmount = appliedVoucher?.discountAmount ?? 0;
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const handleApplyVoucher = async (code: string) => {
    const codeToCheck = code.toUpperCase().trim();
    if (!codeToCheck) return;
    setVoucherLoading(true);
    const result = await validateVoucher(codeToCheck, totalPrice);
    if (result.valid) {
      setAppliedVoucher({ code: result.code!, discountAmount: result.discountAmount!, description: result.description || '' });
      setVoucherCode(result.code!);
      handleCloseVoucherModal();
    }
    setVoucherLoading(false);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCheckout = () => {
    if (activeSlots.length === 0) {
      alert('Pilih setidaknya satu pesanan untuk dilanjutkan.');
      return;
    }
    const slotStr = activeSlots.join(',');
    let url = `/sewa-lapangan/checkout?venueId=${venueId}&courtId=${courtId}&slots=${slotStr}`;
    if (appliedVoucher) {
      url += `&voucher=${appliedVoucher.code}&discount=${discountAmount}`;
    }
    window.location.href = url;
  };

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Keranjang...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .sewa-container { display: flex; gap: 48px; padding: 140px 0 80px; width: 90%; max-width: 1600px; margin: auto; color: #fff; }
        .left { flex: 2; }
        .btn-tambah { padding: 12px 28px; border: 1px solid #ffffff; border-radius: 15px; background: none; color: #ffffff; font-size: 16px; font-weight: 500; margin-bottom: 32px; cursor: pointer; transition: 0.3s; }
        .btn-tambah:hover { background: var(--primary-lime); border-color: var(--primary-lime); color: black; }
        .card { background: #1c1c1c; border-radius: 12px; margin-bottom: 24px; border: 1px solid #333; overflow: hidden; display: flex; gap: 24px; }
        .card-img { width: 200px; height: 100%; object-fit: cover; flex-shrink: 0; min-height: 180px; }
        .card-content { padding: 24px; flex: 1; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        input[type="checkbox"].slot-checkbox { width: 22px; height: 22px; accent-color: var(--primary-lime); cursor: pointer; margin-top: 4px; }
        .card h3 { margin-bottom: 8px; font-size: 24px; font-weight: 600; }
        .rating { font-size: 14px; color: #aaa; margin-bottom: 20px; }
        .badminton { font-weight: 600; font-size: 18px; margin-bottom: 16px; }
        .time-box { background: #2a2a2a; padding: 16px 20px; border-radius: 12px; font-size: 15px; position: relative; line-height: 1.6; }
        .time-box::before { content: ""; position: absolute; left: 0; top: 0; height: 100%; width: 6px; background: var(--primary-lime); border-radius: 12px 0 0 12px; }
        .right { flex: 1; }
        .summary-box { background: #1c1c1c; padding: 28px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #333; }
        .summary-box h4 { margin-bottom: 20px; font-size: 16px; font-weight: 600; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 16px; }
        .summary-row span:first-child { color: #ffffff; }
        .summary-row span:last-child { color: #ffffff; }
        .total { display: flex; justify-content: space-between; font-weight: 600; font-size: 16px; margin-top: 20px; }
        .btn-sewa-primary { width: 100%; padding: 16px; border-radius: 15px; border: 1px solid #ffffff; background: none; color: #ffffff; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 16px; transition: 0.3s; }
        .btn-sewa-primary:hover { background: var(--primary-lime); border-color: var(--primary-lime); color: black; }
        .btn-sewa-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-sewa-primary:disabled:hover { background: none; border-color: #ffffff; color: #ffffff; }
        .small-box { background: #1c1c1c; padding: 14px 16px; border-radius: 12px; margin-bottom: 16px; cursor: pointer; font-size: 16px; border: 1px solid #333; transition: 0.3s; min-height: 66px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
        .voucher-trigger { width: 100%; appearance: none; -webkit-appearance: none; text-align: center; color: #fff; font-family: inherit; }
        .small-box:hover { border-color: var(--primary-lime); }
        .voucher-line { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }
        .voucher-label { font-weight: 500; }
        .voucher-detail { max-width: 100%; font-size: 13px; color: #c9c9c9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .voucher-tag { color: var(--primary-lime); font-weight: 700; }
        .voucher-remove { font-size: 12px; color: #888; cursor: pointer; text-decoration: underline; }
        .modal-overlay { position: fixed; z-index: 2000; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease; }
        .modal-content { background: #1c1c1c; width: 90%; max-width: 450px; border-radius: 20px; border: 1px solid #333; padding: 32px; position: relative; animation: slideUp 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        .close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .policy-list { list-style: none; margin-bottom: 30px; }
        .policy-list li { position: relative; padding-left: 28px; margin-bottom: 16px; font-size: 14px; color: #ccc; line-height: 1.6; }
        .policy-list li::before { content: "✓"; font-weight: 900; position: absolute; left: 0; color: var(--primary-lime); }
        @media (max-width: 992px) { .sewa-container { flex-direction: column; } .card { flex-direction: column; } .card-img { width: 100%; height: 180px; } }
      `}} />

      <div className="sewa-container">
        <div className="left">
          <button className="btn-tambah" onClick={() => window.location.href = '/sewa-lapangan'}>Tambah Pesanan</button>

          {initialSlots.length > 0 && venue && court ? (
            initialSlots.map((slot) => (
              <div className="card" key={slot}>
                <img src={venue.image_url || '/asset/kalam-kudus.png'} alt={venue.name} className="card-img" />
                <div className="card-content">
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
              </div>
            ))
          ) : (
            <div style={{ color: '#aaa', marginTop: '20px' }}>Keranjang kosong. Silakan tambah pesanan dari halaman sewa lapangan.</div>
          )}
        </div>

        <div className="right">
          <button type="button" className="small-box voucher-trigger" onClick={handleOpenVoucherModal} style={appliedVoucher ? { borderColor: 'var(--primary-lime)' } : {}}>
            <div className="voucher-line">
              <i className="fa-solid fa-ticket" style={{ color: 'var(--primary-lime)' }}></i>
              <span className="voucher-label">Gunakan Voucher</span>
            </div>
            {appliedVoucher && (
              <div className="voucher-line voucher-detail" title={`${appliedVoucher.code} - Diskon Rp ${discountAmount.toLocaleString('id-ID')}`}>
                <span className="voucher-tag">{appliedVoucher.code}</span>
                <span>- Diskon Rp {discountAmount.toLocaleString('id-ID')}</span>
                <span className="voucher-remove" onClick={(e) => { e.stopPropagation(); handleRemoveVoucher(); }}>hapus</span>
              </div>
            )}
          </button>

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
            {appliedVoucher && (
              <div className="summary-row" style={{ color: 'var(--primary-lime)' }}>
                <span>Diskon Voucher ({appliedVoucher.code})</span>
                <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <hr style={{ border: '1px solid #333', margin: '10px 0' }} />
            <div className="total">
              <p>Total Biaya</p>
              <p>Rp {finalPrice.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="summary-box">
            <h4>Metode Pembayaran</h4>
            <div className="summary-row">
              <span>Bayar Lunas</span>
              <span>Rp {finalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="small-box" onClick={() => setIsRescheduleModalOpen(true)}>
            <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary-lime)', marginRight: '12px' }}></i> Kebijakan Pembatalan & Reschedule
          </div>

          <button className="btn-sewa-primary" onClick={handleCheckout} disabled={activeSlots.length === 0}>
            Lanjutkan ke Pembayaran
          </button>
        </div>
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
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseVoucherModal(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gunakan Voucher</h2>
              <button type="button" className="close-btn" onClick={handleCloseVoucherModal}>&times;</button>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Masukkan kode voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher(voucherCode)}
                  style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '10px', outline: 'none', fontFamily: 'inherit' }}
                />
                <button type="button" className="btn-tambah" style={{ marginBottom: 0, padding: '10px 20px' }} onClick={() => handleApplyVoucher(voucherCode)} disabled={voucherLoading}>
                  {voucherLoading ? '...' : 'Gunakan'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#888' }}>Punya kode promo? Masukkan kodenya di sini.</p>
            </div>

            {voucherLoading ? (
              <p style={{ fontSize: '13px', color: '#888', textAlign: 'center' }}>Memuat voucher...</p>
            ) : availableVouchers.length > 0 ? (
              <>
                <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Voucher Tersedia</div>
                <div className="voucher-list" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                  {availableVouchers.map((v) => {
                    const isUsed = appliedVoucher?.code === v.code;
                    const isOverLimit = v.usage_limit > 0 && v.used_count >= v.usage_limit;
                    return (
                      <div
                        key={v.id}
                        style={{
                          background: '#2a2a2a', borderRadius: '12px', padding: '16px', marginBottom: '12px',
                          border: isUsed ? '1px dashed var(--primary-lime)' : '1px solid #333',
                          cursor: isOverLimit ? 'not-allowed' : 'pointer', opacity: isOverLimit ? 0.5 : 1,
                        }}
                        onClick={() => {
                          if (!isOverLimit) {
                            setVoucherCode(v.code);
                            handleApplyVoucher(v.code);
                          }
                        }}
                      >
                        <div style={{ fontWeight: 700, color: isUsed ? 'var(--primary-lime)' : '#fff', marginBottom: '4px' }}>{v.code}</div>
                        <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>{v.description}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>
                          {v.usage_limit > 0 ? `Sisa ${v.usage_limit - v.used_count} / ${v.usage_limit}` : 'Unlimited'}
                          {v.expires_at && ` · Berlaku hingga ${new Date(v.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p style={{ fontSize: '13px', color: '#888', textAlign: 'center' }}>Tidak ada voucher tersedia</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function KeranjangPage() {
  useEffect(() => { document.title = 'Keranjang - Minton'; }, []);
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

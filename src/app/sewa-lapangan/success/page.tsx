'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

function SuccessContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const courtId = searchParams.get('courtId');
  const slotsParam = searchParams.get('slots');
  const slots = slotsParam ? slotsParam.split(',') : [];

  const [venue, setVenue] = useState<any>(null);
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching success details:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPrice = venue ? slots.length * venue.price_per_hour : 0;
  
  // Format the time properly
  let timeDisplay = '';
  if (slots.length > 0) {
    const sortedSlots = [...slots].sort();
    const startTime = sortedSlots[0].split('-')[0];
    const endTime = sortedSlots[sortedSlots.length - 1].split('-')[1];
    timeDisplay = `${startTime} - ${endTime}`;
  }

  if (loading) return <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat Tiket...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />

      <div className="container" style={{ width: '90%', maxWidth: '1600px', margin: 'auto', paddingTop: '60px' }}>
        <a href="/" className="btn-back">← Kembali ke Beranda</a>
      </div>
      
      <div className="status-container" style={{ paddingTop: '0' }}>
        <div className="left">
          <div className="success-header">
            <div className="success-icon"><i className="fa-solid fa-check"></i></div>
            <div>
              <h1 className="success-title">Pemesanan Lapangan Berhasil!</h1>
              <div className="success-id">ID #MKM{Math.floor(Math.random() * 100000) + 100000}</div>
            </div>
          </div>

          <div className="ticket">
            <div className="ticket-left">
              <div style={{ marginBottom: '32px' }}>
                <div className="ticket-label">Venue Lapangan</div>
                <div className="ticket-val" style={{ fontSize: '20px', marginBottom: '4px' }}>
                  {venue?.name || 'Venue Name'}
                </div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-lime)', marginRight: '6px' }}></i> 
                  {venue?.location || 'Location Address'}
                </div>
              </div>
              <div>
                <div className="ticket-label">Tanggal Sewa</div>
                <div className="ticket-val" style={{ color: '#ffffff' }}>06 Maret 2026</div>
              </div>
            </div>
            <div className="ticket-right">
              <div>
                <div className="ticket-label">Waktu</div>
                <div className="ticket-val">
                  {timeDisplay} <span className="ticket-badge"><i className="fa-regular fa-hourglass-half"></i> {slots.length} Jam</span>
                </div>
              </div>
              <div>
                <div className="ticket-label">Court ID</div>
                <div className="ticket-val">{court?.name || 'Court Name'}</div>
              </div>
            </div>
          </div>

          <div className="btn-group">
            <button className="btn-cancel">Batalkan Booking</button>
            <button className="btn-contact">Hubungi Pengelola</button>
          </div>
        </div>

        <div className="right">
          <div className="summary-box">
            <div className="summary-row">
              <span>Biaya Sewa</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
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
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="terms">
            Pembatalan booking lapangan harus mengikuti ketentuan dari pengelola lapangan.
          </div>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  useEffect(() => { document.title = 'Pembayaran Berhasil - Minton'; }, []);
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}

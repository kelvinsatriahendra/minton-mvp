
"use client";
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { submitLead } from './actions';

export default function KemitraanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => { document.title = 'Kemitraan - Minton'; }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitLead(new FormData(e.currentTarget as HTMLFormElement));
    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setIsModalOpen(false); }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <style dangerouslySetInnerHTML={{__html: `
        .page-hero { width: 90%; max-width: 1600px; margin: 40px auto; margin-bottom: 48px; display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
        .hero-left { flex: 1; }
        .badge { font-size: 24px; color: #ffffff; margin-bottom: 24px; display: block; font-weight: 500; }
        .hero-left h1 { font-size: 48px; font-weight: 700; line-height: 1.2; }
        .text-highlight { color: var(--primary-lime); }
        .hero-right { flex: 0.8; display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
        .hero-right p { color: #ffffff; font-size: 20px; line-height: 1.6; }
        .hero-image-container { width: 90%; max-width: 1600px; margin: 0 auto 80px; }
        .hero-image { width: 100%; height: 600px; border-radius: 16px; object-fit: cover; margin-bottom: 72px; }

        .benefits-wrapper { width: 90%; max-width: 1600px; margin: 80px auto; display: grid; grid-template-columns: 0.65fr 1.35fr; gap: 60px; align-items: start; }
        .benefits-image img { width: 100%; height: 550px; object-fit: cover; border-radius: 16px; margin-bottom: 64px; }
        .benefits-content h2 { font-size: 42px; font-weight: 700; margin-bottom: 48px; line-height: 1.3; }
        .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .benefit-item img { width: 72px; height: 72px; margin-bottom: 4px; }
        .benefit-item h4 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
        .benefit-item p { font-size: 16px; color: #ffffff; line-height: 1.6; }

        .features-section { width: 90%; max-width: 1600px; margin: 80px auto; }
        .features-section h2 { font-size: 48px; font-weight: 700; margin-bottom: 24px; line-height: 1.4; }
        .features-banner { width: 100%; height: 350px; object-fit: cover; border-radius: 16px; margin-bottom: 36px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .feature-item { display: flex; gap: 16px; align-items: flex-start; }
        .feature-item img { width: 72px; height: 72px; margin-bottom: 4px; }
        .feature-content h4 { font-size: 24px; font-weight: 600; margin-bottom: 16px; }
        .feature-content p { font-size: 16px; color: #ffffff; line-height: 1.6; margin-bottom: 48px; }

        .cta-section { width: 100%; margin: 80px 0; position: relative; min-height: 700px; display: flex; align-items: stretch; padding: 80px 0; background: url('/asset/cta-kemitraan.png') no-repeat center 10% / cover; }
        .cta-container { width: 90%; max-width: 1600px; margin: 0 auto; display: flex; align-items: stretch; }
        .cta-content { max-width: 450px; position: relative; z-index: 2; display: flex; flex-direction: column; width: 100%; }
        .cta-content h2 { font-size: 42px; font-weight: 700; margin-bottom: 24px; line-height: 1.3; }
        .cta-content p { font-size: 18px; color: #ffffff; margin-bottom: 32px; line-height: 1.6; }
        .btn-cta { margin-top: auto; background: #000; color: #fff; border: 1px solid #fff; padding: 16px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; text-align: center; width: 100%; max-width: 400px; }
        .btn-cta:hover { border-color: var(--primary-lime); background: var(--primary-lime); color: #000; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease; }
        .modal-content { background: #111; border: 1px solid #333; border-radius: 24px; padding: 40px; width: 100%; max-width: 500px; position: relative; animation: slideUp 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #aaa; }
        .form-group input { width: 100%; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; padding: 14px 16px; color: #fff; outline: none; }
        .btn-submit { width: 100%; background: var(--primary-lime); color: #000; padding: 16px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>&times;</button>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: 'var(--primary-lime)', marginBottom: '24px' }}></i>
                <h2>Pendaftaran Berhasil!</h2>
                <p style={{ color: '#aaa' }}>Tim Minton akan menghubungi Anda segera.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: '10px' }}>Daftar Mitra Minton</h2>
                <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '14px' }}>Lengkapi data GOR Anda untuk mulai digitalisasi.</p>
                <div className="form-group"><label>Nama GOR / Venue</label><input type="text" name="gor_name" placeholder="GOR Sudirman" required /></div>
                <div className="form-group"><label>Lokasi (Kota)</label><input type="text" name="city" placeholder="Surabaya" required /></div>
                <div className="form-group"><label>No. WhatsApp Aktif</label><input type="tel" name="phone" placeholder="0812xxxxxx" required /></div>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}</button>
              </form>
            )}
          </div>
        </div>
      )}

      <main>
        <section className="page-hero">
          <div className="hero-left">
            <span className="badge">Business Growth</span>
            <h1>Kelola GOR <span className="text-highlight">Lebih Mudah.</span><br />Pendapatan Lebih<span className="text-highlight"> <br />Maksimal.</span></h1>
          </div>
          <div className="hero-right">
            <p>Bergabung di ekosistem digital Minton dan ubah manajemen lapangan manual Anda menjadi serba otomatis.</p>
            <button className="btn-outline" style={{ borderRadius: '8px', padding: '12px 24px' }} onClick={() => setIsModalOpen(true)}>Daftar GOR Anda Sekarang <i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </section>
        <div className="hero-image-container"><img src="/asset/hero-kemitraan.png" className="hero-image" alt="Hero" /></div>

        <section className="benefits-wrapper">
          <div className="benefits-image"><img src="/asset/benefit-kemitraan.png" alt="Benefits" /></div>
          <div className="benefits-content">
            <h2>Kenapa harus menjadi <span className="text-highlight">Mitra Minton?</span></h2>
            <div className="benefits-grid">
              <div className="benefit-item"><img src="/asset/icon-sistem-booking.png" /><h4>Sistem Booking 24/7</h4><p>Fasilitas booking di Minton tersedia 24 jam.</p></div>
              <div className="benefit-item"><img src="/asset/icon-verifikasi-pembayaran.png" /><h4>Verifikasi Pembayaran</h4><p>Sistem Minton otomatis memverifikasi pembayaran.</p></div>
              <div className="benefit-item"><img src="/asset/icon-jangkauan-pemain.png" /><h4>Jangkauan Pasar Luas</h4><p>Jadikan GOR Anda mudah ditemukan.</p></div>
              <div className="benefit-item"><img src="/asset/icon-analisis-pendapatan.png" /><h4>Analisis Pendapatan</h4><p>Pantau laporan keuangan melalui Dashboard Mitra.</p></div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Fitur <span className="text-highlight">Dashboard Mitra.</span></h2>
          <img src="/asset/fitur-dashboard.png" className="features-banner reveal" alt="Features" />
          <div className="features-grid">
            <div className="feature-item reveal"><img src="/asset/icon-real-time.png" /><div className="feature-content"><h4>Real-Time Availability</h4><p>Kelola ketersediaan lapangan secara instan.</p></div></div>
            <div className="feature-item reveal"><img src="/asset/icon-manajemen-member.png" /><div className="feature-content"><h4>Manajemen Member</h4><p>Atur jadwal member tetap GOR Anda dengan mudah.</p></div></div>
            <div className="feature-item reveal"><img src="/asset/icon-e-invoicing.png" /><div className="feature-content"><h4>E-Invoicing</h4><p>Otomatisasi pengiriman invoice dan bukti bayar.</p></div></div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Siap <span className="text-highlight">Digitalisasi<br />Bisnis GOR</span> anda?</h2>
              <p>Jadilah bagian dari revolusi sport-tech bersama Minton.</p>
              <button className="btn-cta" onClick={() => setIsModalOpen(true)}>Daftarkan GOR anda sekarang!</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KemitraanPage() {
  const router = useRouter();

  useEffect(() => { document.title = 'Kemitraan - Minton'; }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, []);

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
        .btn-cta-login { background: var(--primary-lime) !important; color: #000 !important; border-color: var(--primary-lime) !important; }
        .btn-cta-login:hover { background: #d4e92a !important; border-color: #d4e92a !important; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(189,209,36,0.2); }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}} />

      <main>
        <section className="page-hero">
          <div className="hero-left">
            <span className="badge">Business Growth</span>
            <h1>Kelola GOR <span className="text-highlight">Lebih Mudah.</span><br />Pendapatan Lebih<span className="text-highlight"> <br />Maksimal.</span></h1>
          </div>
          <div className="hero-right">
            <p>Bergabung di ekosistem digital Minton dan ubah manajemen lapangan manual Anda menjadi serba otomatis.</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <button className="btn-outline" style={{ borderRadius: '8px', padding: '12px 24px', margin: 0 }} onClick={() => router.push('/kemitraan/registrasi')}>Daftar GOR Anda Sekarang <i className="fa-solid fa-arrow-right"></i></button>
              <button className="btn-primary" style={{ borderRadius: '8px', padding: '12px 24px', margin: 0 }} onClick={() => router.push('/kemitraan/login-mitra')}>Login Dashboard</button>
            </div>
          </div>
        </section>
        <div className="hero-image-container"><img src="/asset/hero-kemitraan.png" className="hero-image" alt="Hero" /></div>

        <section className="benefits-wrapper">
          <div className="benefits-image"><img src="/asset/benefit-kemitraan.png" alt="Benefits" /></div>
          <div className="benefits-content">
            <h2>Kenapa harus menjadi <span className="text-highlight">Mitra Minton?</span></h2>
            <div className="benefits-grid">
              <div className="benefit-item"><img src="/asset/icon-sistem-booking.png" /><h4>Sistem Booking 24/7</h4><p>Fasilitas booking di Minton tersedia 24 jam. Tanpa perlu admin stand by, biarkan sistem bekerja mencatat pesanan untuk Anda.</p></div>
              <div className="benefit-item"><img src="/asset/icon-verifikasi-pembayaran.png" /><h4>Verifikasi Pembayaran</h4><p>Tidak perlu lagi cek mutasi rekening harian. Sistem Minton otomatis memverifikasi pembayaran dari pelanggan secara real-time.</p></div>
              <div className="benefit-item"><img src="/asset/icon-jangkauan-pemain.png" /><h4>Jangkauan Pasar Luas</h4><p>Jadikan GOR Anda mudah ditemukan oleh ribuan pegiat olahraga di ekosistem digital Minton dan sekitarnya.</p></div>
              <div className="benefit-item"><img src="/asset/icon-analisis-pendapatan.png" /><h4>Analisis Pendapatan</h4><p>Pantau laporan keuangan dan jam paling ramai di GOR Anda melalui Dashboard Mitra yang intuitif.</p></div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Fitur <span className="text-highlight">Dashboard Mitra.</span></h2>
          <img src="/asset/fitur-dashboard.png" className="features-banner reveal" alt="Features" />
          <div className="features-grid">
            <div className="feature-item reveal"><img src="/asset/icon-real-time.png" /><div className="feature-content"><h4>Real-Time Availability</h4><p>Kelola ketersediaan lapangan secara instan. Hindari double-booking yang merugikan operasional harian Anda.</p></div></div>
            <div className="feature-item reveal"><img src="/asset/icon-manajemen-member.png" /><div className="feature-content"><h4>Manajemen Member</h4><p>Atur jadwal member tetap GOR Anda dengan mudah, cukup atur sekali di awal dan sistem akan menyesuaikan.</p></div></div>
            <div className="feature-item reveal"><img src="/asset/icon-e-invoicing.png" /><div className="feature-content"><h4>E-Invoicing</h4><p>Otomatisasi pengiriman invoice dan bukti bayar ke pelanggan tanpa harus cetak kertas.</p></div></div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Siap <span className="text-highlight">Digitalisasi<br />Bisnis GOR</span> anda?</h2>
              <p>Jadilah bagian dari revolusi sport-tech bersama Minton. dan biarkan teknologi bekerja untuk Anda.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                <button className="btn-cta" onClick={() => router.push('/kemitraan/registrasi')}>Daftarkan GOR Sekarang!</button>
                <button className="btn-cta btn-cta-login" onClick={() => router.push('/kemitraan/login-mitra')}>Login Dashboard</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

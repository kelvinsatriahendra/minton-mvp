"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KemitraanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const autoRevealSelectors = ['.card', '.feature-item', '.testimoni-header', '.section-image', '.venue-card', '.mabar-card', '.lb-list', '.klub-card', '.recommend-card'];
    autoRevealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          const delay = (i % 3) * 0.1;
          (el as HTMLElement).style.transitionDelay = delay + 's';
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const handleScroll = () => {
      const navbar = document.querySelector('.navbar-transparent') || document.querySelector('.navbar-solid');
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <style dangerouslySetInnerHTML={{__html: `
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          background: #111;
          border: 1px solid #333;
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
        }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #aaa; }
        .form-group input, .form-group textarea {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }
        .form-group input:focus { border-color: #bdd124; }
        .btn-submit {
          width: 100%;
          background: #bdd124;
          color: #000;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px' }}></i>
                <h2 style={{ marginBottom: '12px' }}>Pendaftaran Berhasil!</h2>
                <p style={{ color: '#aaa' }}>Tim Minton akan menghubungi Anda dalam 1x24 jam melalui WhatsApp.</p>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: '10px' }}>Daftar Mitra Minton</h2>
                <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '14px' }}>Lengkapi data GOR Anda untuk mulai digitalisasi.</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nama GOR / Venue</label>
                    <input type="text" placeholder="Contoh: GOR Sudirman" required />
                  </div>
                  <div className="form-group">
                    <label>Lokasi (Kota)</label>
                    <input type="text" placeholder="Contoh: Surabaya" required />
                  </div>
                  <div className="form-group">
                    <label>No. WhatsApp Aktif</label>
                    <input type="tel" placeholder="0812xxxxxx" required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    <main>
        
        <section className="page-hero">
            <div className="hero-left">
                <span className="badge">Business Growth</span>
                <h1>Kelola GOR <span className="text-highlight">Lebih Mudah.</span><br />Pendapatan Lebih
                    <span className="text-highlight"> <br />Maksimal.</span>
                </h1>
            </div>
            <div className="hero-right">
                <p>Bergabung di ekosistem digital Minton dan ubah manajemen lapangan manual Anda menjadi serba otomatis.
                </p>
                <button className="btn-outline" style={{ borderRadius: '8px', padding: '12px 24px' }} onClick={() => setIsModalOpen(true)}>Daftar GOR Anda Sekarang <i
                        className="fa-solid fa-arrow-right"></i></button>
            </div>
        </section>

        <div className="hero-image-container">
            <img src="/asset/hero-kemitraan.png" alt="Dashboard Minton" className="hero-image" />
        </div>

        
        <section className="benefits-wrapper">
            <div className="benefits-image">
                <img src="/asset/benefit-kemitraan.png" alt="Analisis Pertumbuhan" />
            </div>
            <div className="benefits-content">
                <h2>Kenapa harus menjadi <span className="text-highlight">Mitra Minton?</span></h2>
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <div className="icon"><img src="/asset/icon-sistem-booking.png" /></div>
                        <h4>Sistem Booking 24/7</h4>
                        <p>Fasilitas booking di Minton tersedia 24 jam. Tanpa perlu admin stand by, biarkan sistem
                            bekerja mencatat pesanan untuk Anda.</p>
                    </div>
                    <div className="benefit-item">
                        <div className="icon"><img src="/asset/icon-verifikasi-pembayaran.png" /></div>
                        <h4>Verifikasi Pembayaran</h4>
                        <p>Tidak perlu lagi cek mutasi rekening harian. Sistem Minton otomatis memverifikasi pembayaran
                            dari pelanggan secara real-time.</p>
                    </div>
                    <div className="benefit-item">
                        <div className="icon"><img src="/asset/icon-jangkauan-pemain.png" /></div>
                        <h4>Jangkauan Pasar Luas</h4>
                        <p>Jadikan GOR Anda mudah ditemukan oleh ribuan pegiat olahraga di ekosistem digital Minton dan
                            sekitarnya.</p>
                    </div>
                    <div className="benefit-item">
                        <div className="icon"><img src="/asset/icon-analisis-pendapatan.png" /></div>
                        <h4>Analisis Pendapatan</h4>
                        <p>Pantau laporan keuangan dan jam paling ramai di GOR Anda melalui Dashboard Mitra yang
                            intuitif.</p>
                    </div>
                </div>
            </div>
</section>
<section className="features-section">
            <h2>Fitur <span className="text-highlight">Dashboard Mitra.</span></h2>
            <img src="/asset/fitur-dashboard.png" alt="Dashboard Pengelola" className="features-banner reveal" />

            <div className="features-grid">
                <div className="feature-item reveal reveal-delay-1">
                    <div className="icon"><img src="/asset/icon-real-time.png" /></div>
                    <div className="feature-content">
                        <h4>Real-Time Availability</h4>
                        <p>Kelola ketersediaan lapangan secara instan. Hindari double-booking yang merugikan operasional
                            harian Anda.</p>
                    </div>
                </div>
                <div className="feature-item reveal reveal-delay-2">
                    <div className="icon"><img src="/asset/icon-manajemen-member.png" /></div>
                    <div className="feature-content">
                        <h4>Manajemen Member</h4>
                        <p>Atur jadwal member tetap GOR Anda dengan mudah, cukup atur sekali di awal dan sistem akan
                            menyesuaikan.</p>
                    </div>
                </div>
                <div className="feature-item reveal reveal-delay-3">
                    <div className="icon"><img src="/asset/icon-e-invoicing.png" /></div>
                    <div className="feature-content">
                        <h4>E-Invoicing</h4>
                        <p>Otomatisasi pengiriman invoice dan bukti bayar ke pelanggan tanpa harus cetak kertas.</p>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-content">
                    <h2>Siap <span className="text-highlight">Digitalisasi<br />Bisnis GOR</span> anda?</h2>
                    <p>Jadilah bagian dari revolusi sport-tech bersama Minton. dan biarkan teknologi bekerja untuk Anda.
                    </p>
                    <button className="btn-cta" onClick={() => setIsModalOpen(true)}>Daftarkan GOR anda sekarang!</button>
                </div>
            </div>
        </section>
    </main>

      <Footer />
    </>
  );
}


"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KemitraanPage() {
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

  return (
    <>
      <Navbar />

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
                <button className="btn-outline" style={{ borderRadius: '8px', padding: '12px 24px' }}>Daftar GOR Anda Sekarang <i
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
                    <button className="btn-cta">Daftarkan GOR anda sekarang!</button>
                </div>
            </div>
        </section>
    </main>

      <Footer />
    </>
  );
}

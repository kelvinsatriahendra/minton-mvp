
"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SewaLapanganPage() {
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
  }, []);

  return (
    <>
      <Navbar />
    
    <section className="page-hero">
        <div className="page-hero-content">
            <h1>Temukan <br /><span>Lapangan Terbaikmu.</span></h1>
            <div className="hero-sub">
                <p>Kamu pemilik lapangan?</p>
                <button className="btn-outline">Daftarkan Lapanganmu</button>
            </div>
        </div>
    </section>

    <div className="search-section">
        <div className="search-container">
            <div className="search-input-group">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Cari nama venue atau olahraga" />
            </div>
            <div className="search-input-group">
                <i className="fa-solid fa-location-dot"></i>
                <input type="text" placeholder="Pilih Kota" />
            </div>
            <button className="btn-filter">
                <i className="fa-solid fa-sliders"></i> Filter
            </button>
            <button className="btn-primary">Cari Venue</button>
        </div>
    </div>

    <div className="section-label reveal">
        <h2>Semua Venue</h2>
        <p>9 venue ditemukan di seluruh Indonesia</p>
    </div>

    <div className="venue-section">
        <div className="venue-grid">
            <div className="venue-card reveal reveal-delay-1">
                <img src="/asset/kalam-kudus.png" alt="Kalam Kudus Sport Center" />
                <div className="venue-card-body">
                    <span className="venue-tag">Venue</span>
                    <h3>Kalam Kudus Sport Center</h3>
                    <div className="venue-meta">
                        <i className="fa-solid fa-star star"></i>
                        <span>4.9</span>
                        <span className="dot">•</span>
                        <span>Kota Surakarta, Jawa Tengah</span>
                    </div>
                    <div className="venue-footer">
                        <div className="venue-price">Mulai <span>Rp25.000</span>/jam</div>
                        <button className="btn-pilih">Pilih</button>
                    </div>
                </div>
            </div>

            <div className="venue-card reveal reveal-delay-2">
                <img src="/asset/bengawan-sport.png" alt="Bengawan Sport Center" />
                <div className="venue-card-body">
                    <span className="venue-tag">Venue</span>
                    <h3>Bengawan Sport Center</h3>
                    <div className="venue-meta">
                        <i className="fa-solid fa-star star"></i>
                        <span>4.8</span>
                        <span className="dot">•</span>
                        <span>Kota Surakarta, Jawa Tengah</span>
                    </div>
                    <div className="venue-footer">
                        <div className="venue-price">Mulai <span>Rp15.000</span>/jam</div>
                        <button className="btn-pilih">Pilih</button>
                    </div>
                </div>
            </div>

            <div className="venue-card reveal reveal-delay-3">
                <img src="/asset/surabaya-badminton.png" alt="Surabaya Badminton Hall" />
                <div className="venue-card-body">
                    <span className="venue-tag">Venue</span>
                    <h3>Surabaya Badminton Hall</h3>
                    <div className="venue-meta">
                        <i className="fa-solid fa-star star"></i>
                        <span>4.7</span>
                        <span className="dot">•</span>
                        <span>Kota Surabaya, Jawa Timur</span>
                    </div>
                    <div className="venue-footer">
                        <div className="venue-price">Mulai <span>Rp165.000</span>/jam</div>
                        <button className="btn-pilih">Pilih</button>
                    </div>
                </div>
            </div>

            <div className="venue-card">
                <img src="/asset/gor-arek-surabaya.png" alt="GOR Arak Surabaya" />
                <div className="venue-card-body">
                    <span className="venue-tag">Venue</span>
                    <h3>GOR Arak Surabaya</h3>
                    <div className="venue-meta">
                        <i className="fa-solid fa-star star"></i>
                        <span>4.6</span>
                        <span className="dot">•</span>
                        <span>Kota Surabaya, Jawa Timur</span>
                    </div>
                    <div className="venue-footer">
                        <div className="venue-price">Mulai <span>Rp165.000</span>/jam</div>
                        <button className="btn-pilih">Pilih</button>
                    </div>
                </div>
            </div>
            {/* ... Rest of venues simplified ... */}
        </div>
    </div>

    <Footer />
    </>
  );
}

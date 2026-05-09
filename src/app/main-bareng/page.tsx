
"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainBarengPage() {
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

    <div className="container" style={{ paddingTop: '60px' }}>
        <main>
            
            <section className="hero-mabar">
                <div className="hero-text">
                    <h1>Cari Kawan. Lawan. <br /> <span className="text-highlight">Dan Kemenangan.</span></h1>
                    <p>Bergabung ke dalam pertandingan yang diinisiasi oleh kawan-kawan badminton di sekitar kamu.</p>
                </div>
                <div className="hero-img">
                    <img src="/asset/header_main_bareng.png" alt="Pemain Badminton" />
                </div>
            </section>

            <section className="filter-box">
                <div className="filter-header">
                    <h3>Filter <span className="text-highlight">Permainan.</span></h3>
                    <button className="btn btn-outline filter-btn"><i className="fa-solid fa-rotate-left"
                            style={{ marginRight: '4px' }}></i> Clear Filter</button>
                </div>
                <div className="filter-grid">
                    <select className="form-select">
                        <option value="" disabled defaultValue="">Lokasi</option>
                        <option value="surakarta">Surakarta</option>
                        <option value="surabaya">Surabaya</option>
                        <option value="jakarta">Jakarta</option>
                    </select>
                    <select className="form-select">
                        <option value="" disabled defaultValue="">Hari</option>
                        <option value="senin">Senin</option>
                        <option value="selasa">Selasa</option>
                        <option value="rabu">Rabu</option>
                        <option value="kamis">Kamis</option>
                        <option value="jumat">Jumat</option>
                        <option value="sabtu">Sabtu</option>
                        <option value="minggu">Minggu</option>
                    </select>
                    <select className="form-select">
                        <option value="" disabled defaultValue="">Waktu</option>
                        <option value="pagi">Pagi (06:00 - 10:00)</option>
                        <option value="siang">Siang (10:00 - 15:00)</option>
                        <option value="sore">Sore (15:00 - 18:00)</option>
                        <option value="malam">Malam (18:00 - 23:00)</option>
                    </select>
                    <select className="form-select">
                        <option value="" disabled defaultValue="">Jenis Kelamin</option>
                        <option value="campur">Campur</option>
                        <option value="pria">Pria Saja</option>
                        <option value="wanita">Wanita Saja</option>
                    </select>
                    <button className="btn btn-primary filter-btn">Terapkan Filter</button>
                </div>
                <div className="filter-actions-bottom">
                    <button className="btn btn-primary filter-btn"><i className="fa-solid fa-circle-plus"
                            style={{ marginRight: '4px' }}></i> Buat Jadwal</button>
                </div>
            </section>

            <section className="mabar-grid">
                <div className="mabar-card">
                    <img src="/asset/card-main-bareng-1.png" alt="Mabar 1" />
                    <div className="mabar-content">
                        <div className="card-info-grid">
                            <div>
                                <span className="label-text">Venue</span>
                                <div className="value-text">Kalam Kudus Sport Center</div>
                                <div className="sub-value-text">Surakarta</div>
                            </div>
                            <div>
                                <span className="label-text">Level</span>
                                <div className="value-text" style={{ marginBottom: '12px' }}>Bebas</div>
                                <span className="label-text">Waktu</span>
                                <div className="value-text">19:00 - 22:00</div>
                            </div>
                        </div>
                        <div className="mabar-footer">
                            <div>
                                <span className="label-text">Harga / org</span>
                                <div className="price-val">Free</div>
                            </div>
                            <button className="btn btn-outline">Ikut Main Bareng</button>
                        </div>
                    </div>
                </div>
                {/* ... Simplified for brevity in replacement ... */}
            </section>

            <section className="bottom-banner">
                <div className="banner-text-row">
                    <h2>Olahraga <span className="text-highlight">Lebih Seru</span> ramai-ramai.</h2>
                    <p>Tingkatkan skill main, tambah relasi, dan pengalaman baru. Buat kawan dan gabung di lingkungan
                        baru bersama Minton.</p>
                </div>
                <img src="/asset/cta_main_bareng.png" alt="Kumpul Badminton" className="banner-img" />
            </section>

        </main>
    </div>

    <Footer />
    </>
  );
}

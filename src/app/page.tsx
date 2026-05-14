
"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    const autoRevealSelectors = [
      '.card', '.feature-item', '.testimoni-header', '.section-image'
    ];

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
      const navbar = document.querySelector('.navbar-transparent');
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
      <style dangerouslySetInnerHTML={{__html: `
        :root { --primary-lime: #bdd124; --bg-dark: #000000; --bg-card: #1c1c1c; }
        .container { width: 90%; max-width: 1600px; margin: auto; }
        .hero { min-height: 100vh; padding: 180px 0 100px; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/asset/herosection.png') no-repeat center center / cover; }
        .hero-text h1 { font-size: 84px; font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
        .hero-text span { color: var(--primary-lime); }
        .hero-text p { font-size: 20px; color: #ccc; max-width: 600px; line-height: 1.6; }
        .hero-btn { display: flex; gap: 20px; margin-top: 40px; }
        
        .why { padding: 120px 0; }
        .why h2 { font-size: 48px; text-align: center; margin-bottom: 60px; }
        .why h2 span { color: var(--primary-lime); }
        .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .card { background: var(--bg-card); padding: 50px 40px; border-radius: 20px; border: 1px solid #333; transition: 0.3s; }
        .card:hover { border-color: var(--primary-lime); transform: translateY(-10px); }
        .feature-icon { height: 60px; margin-bottom: 30px; }
        .card h3 { font-size: 24px; margin-bottom: 16px; }
        .card p { color: #aaa; line-height: 1.7; }

        .partner { padding: 120px 0; background: #0a0a0a; }
        .partner h1 { font-size: 48px; text-align: center; margin-bottom: 60px; }
        .partner h1 span { color: var(--primary-lime); }
        .section-image { width: 100%; border-radius: 24px; margin-bottom: 60px; }
        .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .feature-item { display: flex; gap: 24px; }
        .feature-item img { width: 48px; height: 48px; }
        .feature-content h2 { font-size: 22px; margin-bottom: 12px; }
        .feature-content p { color: #aaa; line-height: 1.6; }

        .dominate { padding: 150px 0; background: url('/asset/dominasi.png') no-repeat right center / contain; }
        .dominate-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .dominate-text h1 { font-size: 64px; margin-bottom: 60px; line-height: 1.1; }
        .dominate-text span { color: var(--primary-lime); }
        .dominate-text .feature-item { margin-bottom: 40px; }
        .dominate-icon img { width: 56px; margin-right: 24px; }

        .testimoni { padding: 120px 0; }
        .testimoni h2 { font-size: 42px; text-align: center; margin-bottom: 80px; }
        .testimoni h2 span { color: var(--primary-lime); }
        .testimoni-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
        .testimoni-header { display: flex; gap: 24px; background: var(--bg-card); padding: 40px; border-radius: 20px; border: 1px solid #333; }
        .testimoni-header img { width: 80px; height: 80px; border-radius: 50%; }
        .testimoni-header p { font-style: italic; color: #ccc; margin-bottom: 16px; line-height: 1.6; }
        .testimoni-header h4 { color: var(--primary-lime); }

        .cta { padding: 150px 0; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/asset/cta.png') no-repeat center center / cover; }
        .cta h1 { font-size: 64px; margin-bottom: 24px; line-height: 1.1; }
        .cta span { color: var(--primary-lime); }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* RESPONSIVE QUERIES */
        @media (max-width: 1200px) {
          .hero-text h1 { font-size: 64px; }
          .dominate-text h1 { font-size: 48px; }
        }

        @media (max-width: 992px) {
          .card-grid, .feature-grid, .testimoni-grid { grid-template-columns: 1fr 1fr; }
          .dominate-grid { grid-template-columns: 1fr; }
          .dominate { background: #000; }
        }

        @media (max-width: 768px) {
          .hero { padding-top: 140px; }
          .hero-text h1 { font-size: 42px; }
          .hero-btn { flex-direction: column; }
          .card-grid, .feature-grid, .testimoni-grid { grid-template-columns: 1fr; }
          .why h2, .partner h1, .testimoni h2, .cta h1 { font-size: 32px; }
          .cta h1 { font-size: 36px; }
          .testimoni-header { flex-direction: column; text-align: center; align-items: center; }
        }
      `}} />
      <Navbar />

<section className="hero">
  <div className="container hero-grid">

    <div className="hero-text">
      <h1>
        Booking Kilat.<br />
        <span>Main Hebat.</span>
      </h1>

      <p>
        <br />Sewa lapangan atau ikut main bareng</p><p>dan tunjukkan kalau kamulah jagoannya!
      </p>

      <div className="hero-btn">
        <button className="btn-primary" onClick={() => { window.location.href = "/sewa-lapangan"; }}>Sewa Lapangan</button>
        <button className="btn-outline" onClick={() => { window.location.href = "/main-bareng"; }}>Main Bareng</button>
      </div>
    </div>

    

  </div>
</section>



<section className="why">
  <div className="container">

    <h2>Kenapa harus <span>Minton?</span></h2>

    <div className="card-grid">

      <div className="card">
        <div className="icon"><img className="feature-icon" src="/asset/icon-booking-kilat.png" alt="Icon Booking Kilat" /></div>
        <h3>Booking Kilat Tanpa Antre</h3>
        <p>
          Lupakan menunggu balasan admin GOR; sistem kami memberikan konfirmasi instan dalam hitungan detik.
        </p>
      </div>

      <div className="card">
        <div className="icon"><img className="feature-icon" src="/asset/icon-transparansi-lapangan.png" alt="Icon Transparansi Lapangan" /></div>
        <h3>Transparansi Lapangan</h3>
        <p>
          Lihat foto asli, jenis lantai (karpet/kayu), hingga kualitas pencahayaan sebelum Anda membayar.
        </p>
      </div>

      <div className="card">
        <div className="icon"><img className="feature-icon" src="/asset/icon-pembayaran-aman.png" alt="Icon Pembayaran Aman" /></div>
        <h3>Pembayaran Aman</h3>
        <p>
          Integrasi dengan berbagai metode pembayaran digital (E-wallet & Virtual Account) yang terverifikasi otomatis
        </p>
      </div>

    </div>

  </div>
</section>



<section className="partner">
  <div className="container">

    <h1>Temukan <span>Partner Main</span> Anda</h1>

    <img className="section-image reveal" src="/asset/mainbareng.png" alt="" />

    <div className="feature-grid">
      <div className="feature-item">
        <img className="feature-icon" src="/asset/icon-cari-lawan-seimbang.png" alt="Icon Cari Lawan Seimbang" />
        <div className="feature-content">
          <h2>Cari Lawan Seimbang</h2>
          <p>Gunakan filter Skill Level (Beginner, Intermediate, Pro) agar pertandingan Anda tetap kompetitif dan menyenangkan.</p>
        </div>
      </div>

      <div className="feature-item">
        <img className="feature-icon" src="/asset/icon-open-play-&-sparring.png" />
        <div className="feature-content">
          <h2>Open Play & Sparring</h2>
          <p>Bergabunglah dalam slot pertandingan yang sudah tersedia atau tantang tim lain untuk bertanding secara resmi.</p>
        </div>
      </div>
     
      <div className="feature-item">
        <img className="feature-icon" src="/asset/icon-sistem-reputasi.png" alt="Icon Sistem Reputasi" />
        <div className="feature-content">
          <h2>Sistem Reputasi</h2>
          <p>Berikan rating kepada kawan atau lawan main setelah pertandingan selesai untuk menjaga ekosistem komunitas yang sehat.</p>
        </div>
      </div>
    </div>

  </div>
</section>



<section className="dominate">
  <div className="container dominate-grid">
    <div className="dominate-text">
      <h1>Pesan. Main.<br /><span>Dominasi.</span></h1>
      
      <div className="feature-item">
        <div className="dominate-icon">
          <img src="/asset/icon-statistik-jagoan.png" alt="Icon Statistik Jagoan" />
        </div>
        <div className="content">
          <h2>Statistik Jagoan</h2>
          <p>Setiap kemenangan akan tercatat di profil Anda, lengkap dengan rasio menang/kalah yang bisa dipamerkan ke teman-teman.</p>
        </div>
      </div>
      
      <div className="feature-item">
        <div className="dominate-icon">
          <img src="/asset/icon-peringkat-wilayah.png" alt="Icon Peringkat Wilayah" />
        </div>
        <div className="content">
          <h2>Peringkat Wilayah</h2>
          <p>Masuk ke dalam Leaderboard bulanan dan jadilah pemain nomor satu di wilayahmu!</p>
        </div>
      </div>
      
      <div className="feature-item">
        <div className="dominate-icon">
          <img src="/asset/icon-badges-of-honor.png" alt="Icon Badges of Honor" />
        </div>
        <div className="content">
          <h2>Badges of Honor</h2>
          <p>Dapatkan lencana digital eksklusif setiap kali Anda mencapai milestones tertentu, seperti bermain 10 kali tanpa kalah.</p>
        </div>
      </div>
    </div>
    
    <div className="dominate-empty-col"></div>
  </div>
</section>



<section className="testimoni">
  <div className="testimoni-container">
    <h2>Ini Kata Mereka Tentang <span>Minton.</span></h2>

    <div className="testimoni-grid">

      <div className="testimoni-header reveal reveal-delay-1">
        <div>
        <img src="/asset/testimoni-rina.png" alt="Portrait of Rina, a testimonial customer for Minton, smiling confidently against a sports background" />
        </div>
        <div>
        <p>"Minton benar-benar mengubah cara saya main badminton. Sekarang saya bisa cari partner main kapan saja tanpa ribet!"</p>
        <h4>- Rina, 28 tahun</h4>
       </div>
      </div>

      <div className="testimoni-header reveal reveal-delay-2">
        <div>
        <img src="/asset/testimoni-budi.png" alt="Portrait of Budi, a testimonial customer for Minton, smiling confidently against a sports background" />
       </div>
       <div>
        <p>"Sistem booking-nya cepat banget, gak perlu nunggu balasan admin lagi. Plus, lapangannya juga sesuai ekspektasi."</p>
        <h4>- Budi, 35 tahun</h4>
       </div>
      </div>

      <div className="testimoni-header reveal reveal-delay-3">
        <div>
        <img src="/asset/testimoni-sari.png" alt="Portrait of Sari, a testimonial customer for Minton, smiling confidently against a sports background" />
        </div>
        <div>
        <p>"Fitur statistik dan leaderboard-nya bikin saya makin semangat main. Jadi pengen jadi nomor satu di wilayah saya!"</p>
        <h4>- Sari, 22 tahun</h4>
        </div>
      </div>

      <div className="testimoni-header reveal reveal-delay-1">
        <div>
         <img src="/asset/testimoni-rina.png" alt="Portrait of Rina, a testimonial customer for Minton, smiling confidently against a sports background" />
        </div>
        <div>
        <p>"Fitur statistik dan leaderboard-nya bikin saya makin semangat main. Jadi pengen jadi nomor satu di wilayah saya!"</p>
        <h4>- Sari, 22 tahun</h4>
        </div>      
      </div>
    </div>
  </div>
</section>
<section className="cta">

  <div className="container cta-grid">

    <div>
      <h1>
        Siap Turun ke<br /><span>Lapangan</span> Hari ini?
      </h1>

      <p>Jangan cuma nonton. Ayo main!</p>

      <div className="hero-btn">
        <button className="btn-primary" onClick={() => { window.location.href = "/sewa-lapangan"; }}>Sewa Lapangan</button>
        <button className="btn-outline" onClick={() => { window.location.href = "/main-bareng"; }}>Main Bareng</button>
      </div>

    </div>


  </div>

</section>

<Footer />

    </>
  );
}

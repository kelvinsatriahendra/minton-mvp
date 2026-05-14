
"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => { document.title = 'Minton - Booking Lapangan Badminton'; }, []);

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

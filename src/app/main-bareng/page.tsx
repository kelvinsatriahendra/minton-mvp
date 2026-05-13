
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

interface Match {
  id: number;
  venue_name: string;
  city: string;
  match_date: string;
  start_time: string;
  end_time: string;
  skill_level: string;
  price_per_person: number;
  image_url: string;
}

export default function MainBarengPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*');
      
      if (error) throw error;
      setMatches(data || []);
      setFilteredMatches(data || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilter = () => {
    const results = matches.filter(match => 
      cityFilter === '' || match.city.toLowerCase() === cityFilter.toLowerCase()
    );
    setFilteredMatches(results);
  };

  useEffect(() => {
    // Reveal animation logic exactly like script.js
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, [filteredMatches]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --bg-dark: #000000; --bg-card: #1c1c1c; --bg-input: #121212; --primary-green: #bdd124; --text-white: #ffffff; --text-gray: #aaaaaa; --border-color: #333333; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-white); line-height: 1.5; }
        .text-highlight { color: var(--primary-green); }
        .btn { padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-white); }
        .btn-outline:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--text-white); }
        .btn-primary { background: var(--primary-green); border: none; color: var(--bg-dark); font-weight: 600; }
        .hero-mabar { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 80px 0; margin-bottom: 60px; }
        .hero-text { flex: 1; }
        .hero-text h1 { font-size: 56px; font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
        .hero-text p { color: var(--text-white); font-size: 24px; margin-top: 24px; line-height: 1.4; max-width: 90%; }
        .hero-img { flex: 1; }
        .hero-img img { width: 100%; height: 250px; object-fit: cover; border-radius: 16px; }
        .filter-box { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 80px; }
        .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .filter-header h3 { font-size: 32px; font-weight: 600; }
        .filter-grid { display: flex; gap: 16px; }
        .filter-btn { width: 200px !important; height: 48px !important; margin: 0 !important; padding: 0 24px !important; }
        .form-select { flex: 1; max-width: 220px; height: 48px; background-color: var(--bg-input); color: var(--text-white); border: 1px solid var(--border-color); padding: 0 16px; border-radius: 8px; font-size: 14px; outline: none; appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a3a3a3%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 16px top 50%; background-size: 10px auto; cursor: pointer; }
        .filter-actions-bottom { display: flex; justify-content: flex-end; margin-top: 16px; }
        .mabar-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 80px; }
        .mabar-card { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
        .mabar-card img { width: 100%; height: 200px; object-fit: cover; }
        .mabar-content { padding: 24px; display: flex; flex-direction: column; flex: 1; }
        .card-info-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 24px; }
        .label-text { font-size: 12px; color: var(--text-gray); margin-bottom: 4px; display: block; }
        .value-text { font-size: 16px; font-weight: 600; color: var(--text-white); }
        .sub-value-text { font-size: 14px; color: var(--text-gray); margin-top: 2px; }
        .mabar-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border-color); }
        .price-val { font-size: 20px; font-weight: 700; }
        .bottom-banner { margin-top: 80px; margin-bottom: 80px; width: 100%; }
        .banner-text-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .banner-text-row h2 { font-size: 42px; font-weight: 700; max-width: 500px; line-height: 1.2; }
        .banner-text-row p { color: var(--text-gray); font-size: 18px; max-width: 450px; line-height: 1.6; }
        .banner-img { width: 100%; height: 500px; object-fit: cover; border-radius: 16px; }
        @media (max-width: 992px) { .hero-mabar { flex-direction: column; align-items: flex-start; } .hero-img { width: 100%; } .filter-grid { grid-template-columns: repeat(2, 1fr); } .banner-text-row { flex-direction: column; align-items: flex-start; gap: 16px; } }
        @media (max-width: 768px) { .mabar-grid { grid-template-columns: 1fr; } .filter-grid { grid-template-columns: 1fr; } .hero-text h1, .banner-text-row h2 { font-size: 28px; } .banner-img { height: 250px; } }
        
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}} />

      <Navbar />

      <div className="container" style={{ paddingTop: '60px', width: '90%', maxWidth: '1600px', margin: 'auto' }}>
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
              <button className="btn btn-outline filter-btn" onClick={() => { setCityFilter(''); setFilteredMatches(matches); }}>
                <i className="fa-solid fa-rotate-left" style={{ marginRight: '4px' }}></i> Clear Filter
              </button>
            </div>
            <div className="filter-grid">
              <select className="form-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="">Lokasi</option>
                <option value="surakarta">Surakarta</option>
                <option value="surabaya">Surabaya</option>
                <option value="jakarta">Jakarta</option>
              </select>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Hari</option>
                <option value="senin">Senin</option>
                <option value="minggu">Minggu</option>
              </select>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Waktu</option>
                <option value="malam">Malam (18:00 - 23:00)</option>
              </select>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Jenis Kelamin</option>
                <option value="campur">Campur</option>
              </select>
              <button className="btn btn-primary filter-btn" onClick={handleFilter}>Terapkan Filter</button>
            </div>
            <div className="filter-actions-bottom">
              <button className="btn btn-primary filter-btn">
                <i className="fa-solid fa-circle-plus" style={{ marginRight: '4px' }}></i> Buat Jadwal
              </button>
            </div>
          </section>

          <section className="mabar-grid">
            {loading ? (
              <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1/-1' }}>Memuat jadwal mabar...</p>
            ) : filteredMatches.length > 0 ? (
              filteredMatches.map((match, i) => (
                <div key={match.id} className="mabar-card reveal" style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                  <img src={match.image_url || '/asset/card-main-bareng-1.png'} alt={match.venue_name} />
                  <div className="mabar-content">
                    <div className="card-info-grid">
                      <div>
                        <span className="label-text">Venue</span>
                        <div className="value-text">{match.venue_name}</div>
                        <div className="sub-value-text">{match.city}</div>
                      </div>
                      <div>
                        <span className="label-text">Level</span>
                        <div className="value-text" style={{ marginBottom: '12px' }}>{match.skill_level}</div>
                        <span className="label-text">Waktu</span>
                        <div className="value-text">{match.start_time.substring(0,5)} - {match.end_time.substring(0,5)}</div>
                      </div>
                    </div>
                    <div className="mabar-footer">
                      <div>
                        <span className="label-text">Harga / org</span>
                        <div className="price-val">
                          {match.price_per_person === 0 ? 'Free' : `Rp${match.price_per_person.toLocaleString('id-ID')}`}
                          {match.price_per_person !== 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-gray)' }}>/org</span>}
                        </div>
                      </div>
                      <button className="btn btn-outline" onClick={() => alert('Anda berhasil bergabung!')}>Ikut Main Bareng</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1/-1' }}>Belum ada jadwal mabar tersedia.</p>
            )}
          </section>

          <section className="bottom-banner">
            <div className="banner-text-row">
              <h2>Olahraga <span className="text-highlight">Lebih Seru</span> ramai-ramai.</h2>
              <p>Tingkatkan skill main, tambah relasi, dan pengalaman baru. Buat kawan dan gabung di lingkungan baru bersama Minton.</p>
            </div>
            <img src="/asset/cta_main_bareng.png" alt="Kumpul Badminton" className="banner-img" />
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

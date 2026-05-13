
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';

interface Venue {
  id: number;
  name: string;
  location: string;
  city: string;
  price_per_hour: number;
  rating: number;
  image_url: string;
  category: string;
}

export default function SewaLapanganPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select('*');
      
      if (error) throw error;
      setVenues(data || []);
      setFilteredVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  }

  // Real-time search & category logic
  useEffect(() => {
    const filtered = venues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = venue.city.toLowerCase().includes(cityQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || venue.category === selectedCategory;
      return matchesSearch && matchesCity && matchesCategory;
    });
    setFilteredVenues(filtered);
  }, [searchQuery, cityQuery, selectedCategory, venues]);

  useEffect(() => {
    // Reveal animation logic exactly like script.js
    const autoRevealSelectors = ['.reveal'];
    autoRevealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (!el.classList.contains('visible')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(el);
        }
      });
    });
  }, [filteredVenues]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000000; color: white; font-family: 'Plus Jakarta Sans', sans-serif; }
        .page-hero { width: 90%; max-width: 1600px; margin: 40px auto 0; padding: 80px 60px; background: url('/asset/header-sewa-lapangan-3.png') no-repeat center / cover; border-radius: 16px; position: relative; overflow: hidden; }
        .page-hero::before { content: ""; position: absolute; inset: 0; border-radius: 16px; }
        .page-hero-content { position: relative; z-index: 1; }
        .page-hero h1 { font-size: 56px; font-weight: 700; line-height: 1.2; margin-bottom: 24px; }
        .page-hero h1 span { color: #bdd124; }
        .hero-sub { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .hero-sub p { font-size: 18px; color: #cccccc; }
        .search-section { width: 90%; max-width: 1600px; margin: 32px auto; }
        .search-container { display: flex; background: #1c1c1c; padding: 12px; border-radius: 12px; gap: 12px; border: 1px solid #333; }
        .search-input-group { display: flex; align-items: center; background: #0f0f0f; padding: 14px 20px; border-radius: 12px; flex: 1; gap: 12px; border: 1px solid #333; }
        .search-input-group i { color: #aaa; font-size: 15px; }
        .search-input-group input { background: transparent; border: none; color: #ffffff; width: 100%; outline: none; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .search-input-group input::placeholder { color: #666; }
        .btn-filter { display: flex; align-items: center; gap: 8px; padding: 0 24px; background: #1c1c1c; border: 1px solid #333; color: #ffffff; border-radius: 12px; cursor: pointer; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s; }
        .btn-filter:hover { border-color: #bdd124; color: #bdd124; }
        .section-label { width: 90%; max-width: 1600px; margin: 0 auto 24px; }
        .section-label h2 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .section-label p { font-size: 16px; color: #aaa; font-weight: 300; }
        .venue-section { width: 90%; max-width: 1600px; margin: 0 auto 80px; }
        .venue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .venue-card { background: #1c1c1c; border: 1px solid #333; border-radius: 12px; overflow: hidden; transition: transform 0.3s, border-color 0.3s; cursor: pointer; text-decoration: none; color: inherit; display: block; }
        .venue-card:hover { transform: translateY(-5px); border-color: #bdd124; }
        .venue-card img { width: 100%; height: 210px; object-fit: cover; display: block; }
        .venue-card-body { padding: 20px 24px 24px; }
        .venue-tag { display: inline-block; font-size: 12px; color: #ffffff; background: rgba(255, 255, 255, 0.1); padding: 2px 10px; border-radius: 20px; margin-bottom: 10px; font-weight: 500; }
        .venue-card-body h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; line-height: 1.3; }
        .venue-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaa; margin-bottom: 16px; }
        .venue-meta .star { color: #f59e0b; }
        .venue-meta .dot { color: #555; }
        .venue-meta span { color: #aaa; }
        .venue-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #2a2a2a; }
        .venue-price { font-size: 15px; font-weight: 600; color: #ffffff; }
        .venue-price span { color: #ffffff; }
        .btn-pilih { padding: 8px 20px; border-radius: 15px; border: 1px solid #ffffff; background: none; color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s; }
        .btn-pilih:hover { background: #bdd124; border-color: #bdd124; color: black; }
        
        @media (max-width: 1024px) { .venue-grid { grid-template-columns: repeat(2, 1fr); } .page-hero h1 { font-size: 42px; } }
        @media (max-width: 768px) { .page-hero { padding: 60px 32px; } .page-hero h1 { font-size: 32px; } .search-container { flex-direction: column; } .btn-filter { padding: 14px; justify-content: center; } .venue-grid { grid-template-columns: 1fr; } }
        
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}} />

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
            <input 
              type="text" 
              placeholder="Cari nama venue atau olahraga" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-input-group">
            <i className="fa-solid fa-location-dot"></i>
            <input 
              type="text" 
              placeholder="Pilih Kota" 
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" style={{ padding: '0 30px' }}>Cari Venue</button>
        </div>

        <div className="category-pills" style={{ display: 'flex', gap: '12px', marginTop: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['Semua', 'Badminton', 'Futsal', 'Basket', 'Tenis'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#bdd124' : '#333',
                background: selectedCategory === cat ? '#bdd124' : 'transparent',
                color: selectedCategory === cat ? '#000' : '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: '0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section-label reveal">
        <h2>Semua Venue</h2>
        <p>{filteredVenues.length} venue ditemukan di seluruh Indonesia</p>
      </div>

      <div className="venue-section">
        <div className="venue-grid">
          {loading ? (
            // Skeleton Loader matching card structure
            [...Array(6)].map((_, i) => (
              <div key={i} className="venue-card" style={{ opacity: 0.5 }}>
                <div style={{ height: '210px', background: '#222' }}></div>
                <div className="venue-card-body">
                  <div style={{ height: '20px', width: '100px', background: '#333', marginBottom: '10px' }}></div>
                  <div style={{ height: '24px', width: '200px', background: '#333', marginBottom: '10px' }}></div>
                  <div style={{ height: '16px', width: '150px', background: '#333' }}></div>
                </div>
              </div>
            ))
          ) : filteredVenues.length > 0 ? (
            filteredVenues.map((venue, index) => (
              <Link 
                href={`/sewa-lapangan/detail/${venue.id}`} 
                key={venue.id} 
                className={`venue-card reveal`}
                style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
              >
                <img src={venue.image_url || '/asset/kalam-kudus.png'} alt={venue.name} />
                <div className="venue-card-body">
                  <span className="venue-tag">Venue</span>
                  <h3>{venue.name}</h3>
                  <div className="venue-meta">
                    <i className="fa-solid fa-star star"></i>
                    <span>{venue.rating}</span>
                    <span className="dot">•</span>
                    <span>{venue.location}</span>
                  </div>
                  <div className="venue-footer">
                    <div className="venue-price">Mulai <span>Rp{venue.price_per_hour.toLocaleString('id-ID')}</span>/jam</div>
                    <button className="btn-pilih">Pilih</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#aaa' }}>
              Tidak ada venue yang ditemukan.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

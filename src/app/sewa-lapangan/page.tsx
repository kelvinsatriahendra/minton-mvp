
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => { document.title = 'Sewa Lapangan - Minton'; }, []);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('venues').select('*');
      if (error) throw error;
      setVenues(data || []);
      setFilteredVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  }

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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, [filteredVenues, loading]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .page-hero { width: 90%; max-width: 1600px; margin: 40px auto 0; padding: 80px 60px; background: url('/asset/header-sewa-lapangan-3.png') no-repeat center / cover; border-radius: 16px; position: relative; overflow: hidden; }
        .page-hero h1 { font-size: 56px; font-weight: 700; line-height: 1.2; margin-bottom: 24px; }
        .page-hero h1 span { color: var(--primary-lime); }
        .hero-sub { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .hero-sub p { font-size: 18px; color: #cccccc; }
        
        .search-section { width: 90%; max-width: 1600px; margin: 32px auto; }
        .search-container { display: flex; background: #1c1c1c; padding: 12px; border-radius: 12px; gap: 12px; border: 1px solid #333; }
        .search-input-group { display: flex; align-items: center; background: #0f0f0f; padding: 14px 20px; border-radius: 12px; flex: 1; gap: 12px; border: 1px solid #333; }
        .search-input-group i { color: #aaa; font-size: 15px; }
        .search-input-group input { background: transparent; border: none; color: #ffffff; width: 100%; outline: none; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .btn-filter { display: flex; align-items: center; gap: 8px; padding: 0 24px; background: #1c1c1c; border: 1px solid #333; color: #ffffff; border-radius: 12px; cursor: pointer; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s; }
        .btn-filter:hover { border-color: var(--primary-lime); color: var(--primary-lime); }
        
        .section-label { width: 90%; max-width: 1600px; margin: 0 auto 24px; }
        .section-label h2 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .section-label p { font-size: 16px; color: #aaa; font-weight: 300; }
        
        .venue-section { width: 90%; max-width: 1600px; margin: 0 auto 80px; }
        .venue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .venue-card { background: #1c1c1c; border: 1px solid #333; border-radius: 12px; overflow: hidden; transition: transform 0.3s, border-color 0.3s; cursor: pointer; text-decoration: none; color: inherit; display: block; }
        .venue-card:hover { transform: translateY(-5px); border-color: var(--primary-lime); }
        .venue-card img { width: 100%; height: 210px; object-fit: cover; display: block; }
        .venue-card-body { padding: 20px 24px 24px; }
        .venue-tag { display: inline-block; font-size: 12px; color: #ffffff; background: rgba(255, 255, 255, 0.1); padding: 2px 10px; border-radius: 20px; margin-bottom: 10px; font-weight: 500; }
        .venue-card-body h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; line-height: 1.3; }
        .venue-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaa; margin-bottom: 16px; }
        .venue-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #2a2a2a; }
        .venue-price { font-size: 15px; font-weight: 600; color: #ffffff; }
        .btn-pilih { padding: 8px 20px; border-radius: 15px; border: 1px solid #ffffff; background: none; color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.3s; }
        .btn-pilih:hover { background: var(--primary-lime); border-color: var(--primary-lime); color: black; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-content { background: #1c1c1c; width: 90%; max-width: 500px; border-radius: 20px; border: 1px solid #333; padding: 32px; transform: translateY(20px); transition: transform 0.3s; }
        .modal-overlay.active .modal-content { transform: translateY(0); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 22px; font-weight: 700; }
        .close-modal { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .filter-group { margin-bottom: 24px; }
        .filter-group label { display: block; font-size: 14px; font-weight: 600; color: #aaa; margin-bottom: 12px; }
        .filter-options { display: flex; flex-wrap: wrap; gap: 10px; }
        .filter-opt { padding: 8px 16px; background: #0f0f0f; border: 1px solid #333; border-radius: 30px; font-size: 13px; cursor: pointer; transition: 0.2s; }
        .filter-opt.active { background: var(--primary-lime); border-color: var(--primary-lime); color: #000; font-weight: 700; }
        .modal-footer { margin-top: 32px; display: flex; gap: 12px; }
        .btn-reset { flex: 1; padding: 14px; background: transparent; border: 1px solid #333; color: #fff; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .btn-apply { flex: 2; padding: 14px; background: var(--primary-lime); border: none; color: #000; border-radius: 12px; cursor: pointer; font-weight: 700; }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
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
            <input type="text" placeholder="Cari nama venue atau olahraga" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="search-input-group">
            <i className="fa-solid fa-location-dot"></i>
            <input type="text" placeholder="Pilih Kota" value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
          </div>
          <button className="btn-filter" onClick={() => setIsFilterModalOpen(true)}>
            <i className="fa-solid fa-sliders"></i> Filter
          </button>
          <button className="btn-primary" style={{ padding: '0 30px' }}>Cari Venue</button>
        </div>
      </div>

      <div className="section-label reveal">
        <h2>Semua Venue</h2>
        <p>{filteredVenues.length} venue ditemukan di seluruh Indonesia</p>
      </div>

      <div className="venue-section">
        <div className="venue-grid">
          {loading ? (
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
                className={`venue-card reveal reveal-delay-${(index % 3) + 1}`}
              >
                <img src={venue.image_url || '/asset/kalam-kudus.png'} alt={venue.name} />
                <div className="venue-card-body">
                  <span className="venue-tag">Venue</span>
                  <h3>{venue.name}</h3>
                  <div className="venue-meta">
                    <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '5px' }}></i>
                    <span>{venue.rating}</span>
                    <span style={{ color: '#555', margin: '0 8px' }}>•</span>
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
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#aaa' }}>Tidak ada venue yang ditemukan.</div>
          )}
        </div>
      </div>

      <div className={`modal-overlay ${isFilterModalOpen ? 'active' : ''}`} onClick={() => setIsFilterModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Filter Pencarian</h2>
            <button className="close-modal" onClick={() => setIsFilterModalOpen(false)}>&times;</button>
          </div>
          <div className="filter-group">
            <label>Kategori Olahraga</label>
            <div className="filter-options">
              {['Semua', 'Badminton', 'Futsal', 'Basket', 'Tenis'].map(cat => (
                <div key={cat} className={`filter-opt ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</div>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Jenis Lapangan</label>
            <div className="filter-options">
              {['Vinyl', 'Kayu / Parquet', 'Semen', 'Interlock'].map(opt => <div key={opt} className="filter-opt">{opt}</div>)}
            </div>
          </div>
          <div className="filter-group">
            <label>Fasilitas</label>
            <div className="filter-options">
              {['Parkir Luas', 'Toilet & Shower', 'Kantin', 'Musholla', 'Sewa Raket'].map(opt => <div key={opt} className="filter-opt">{opt}</div>)}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-reset" onClick={() => { setSelectedCategory('Semua'); setIsFilterModalOpen(false); }}>Reset</button>
            <button className="btn-apply" onClick={() => setIsFilterModalOpen(false)}>Terapkan Filter</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

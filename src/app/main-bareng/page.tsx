'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import { joinMatch, createMatch } from './actions';

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
  slots_filled?: number;
  total_slots?: number;
  gender?: string;
}

const SLOT_DATA: Record<number, { filled: number; total: number }> = {
  1: { filled: 5, total: 8 },
  2: { filled: 3, total: 8 },
  3: { filled: 2, total: 8 },
  4: { filled: 6, total: 8 },
  5: { filled: 1, total: 8 },
  6: { filled: 4, total: 8 },
};

function getSlotInfo(match: Match): { filled: number; total: number } {
  if (match.slots_filled !== undefined && match.total_slots !== undefined) {
    return { filled: match.slots_filled, total: match.total_slots };
  }
  return SLOT_DATA[match.id] ?? { filled: 0, total: 8 };
}

export default function MainBarengPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [processing, setProcessing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { document.title = 'Main Bareng - Minton'; }, []);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
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
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const results = matches.filter(match => {
      if (cityFilter && match.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (dayFilter) {
        const d = new Date(match.match_date);
        const dayName = days[d.getDay()];
        if (dayName !== dayFilter) return false;
      }
      if (timeFilter === 'malam') {
        const hour = parseInt(match.start_time.substring(0, 2));
        if (hour < 18) return false;
      }
      if (genderFilter && (match.gender || '').toLowerCase() !== genderFilter.toLowerCase()) return false;
      return true;
    });
    setFilteredMatches(results);
  };

  const openDetailModal = (match: Match) => {
    const cookies = document.cookie.split(';').some(c => c.trim().startsWith('isLoggedIn=true'));
    if (!cookies) {
      alert('Silakan login terlebih dahulu untuk bergabung!');
      window.location.href = '/login';
      return;
    }
    setSelectedMatch(match);
    setShowDetailModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMatch(null);
    document.body.style.overflow = 'auto';
  };

  const confirmJoin = async () => {
    if (!selectedMatch) return;
    setProcessing(true);
    const res = await joinMatch(selectedMatch.id);
    setProcessing(false);
    
    if (res.error) {
      alert('Gagal bergabung: ' + res.error);
    } else {
      alert('Selamat! Anda berhasil bergabung ke pertandingan ini. Silakan cek menu Jadwal Saya atau hubungi Host.');
      fetchMatches();
      closeDetailModal();
    }
  };

  const openCreateModal = () => {
    const cookies = document.cookie.split(';').some(c => c.trim().startsWith('isLoggedIn=true'));
    if (!cookies) {
      alert('Silakan login terlebih dahulu!');
      window.location.href = '/login';
      return;
    }
    setShowCreateModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    document.body.style.overflow = 'auto';
  };

  const submitMabar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setProcessing(true);
    const formData = new FormData(formRef.current);
    const res = await createMatch(formData);
    setProcessing(false);

    if (res.error) {
      alert('Gagal membuat jadwal: ' + res.error);
    } else {
      alert('Jadwal Main Bareng Anda telah berhasil dibuat dan dipublikasikan!');
      fetchMatches();
      closeCreateModal();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, [filteredMatches, loading]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --bg-dark: #000000; --bg-card: #1c1c1c; --bg-input: #121212; --primary-green: var(--primary-lime); --text-white: #ffffff; --text-gray: #aaaaaa; --border-color: #333333; }
        .text-highlight { color: var(--primary-green); }
        .hero-mabar { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 80px 0; margin-bottom: 60px; }
        .hero-text h1 { font-size: 56px; font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
        .hero-text p { color: var(--text-white); font-size: 24px; margin-top: 24px; line-height: 1.4; max-width: 90%; }
        .hero-img img { width: 100%; height: 250px; object-fit: cover; border-radius: 16px; }
        .filter-box { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 80px; }
        .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .filter-header h3 { font-size: 32px; font-weight: 600; }
        .filter-grid { display: flex; gap: 16px; }
        .form-select { flex: 1; max-width: 220px; height: 48px; background-color: var(--bg-input); color: var(--text-white); border: 1px solid var(--border-color); padding: 0 16px; border-radius: 8px; font-size: 14px; outline: none; appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a3a3a3%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 16px top 50%; background-size: 10px auto; cursor: pointer; }
        .filter-btn { width: 200px !important; height: 48px !important; }
        .filter-actions-bottom { display: flex; justify-content: flex-end; margin-top: 16px; }
        .mabar-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 80px; }
        .mabar-card { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
        .mabar-card img { width: 100%; height: 200px; object-fit: cover; }
        .mabar-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .card-info-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 24px; }
        .label-text { font-size: 12px; color: var(--text-gray); margin-bottom: 4px; display: block; }
        .value-text { font-size: 16px; font-weight: 600; }
        .sub-value-text { font-size: 14px; color: var(--text-gray); }
        .mabar-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--border-color); margin-top: auto; }
        .price-val { font-size: 20px; font-weight: 700; }
        .bottom-banner { margin: 80px 0; }
        .banner-text-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .banner-text-row h2 { font-size: 42px; font-weight: 700; max-width: 500px; line-height: 1.2; }
        .banner-text-row p { color: var(--text-gray); font-size: 18px; max-width: 450px; }
        .banner-img { width: 100%; height: 500px; object-fit: cover; border-radius: 16px; }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .modal-overlay-mabar { display: flex; position: fixed; z-index: 1000; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); justify-content: center; align-items: center; animation: fadeIn 0.3s ease; }
        .modal-content-mabar { background-color: var(--bg-card); border: 1px solid #333; width: 90%; max-width: 500px; border-radius: 20px; padding: 32px; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-header-mabar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header-mabar h3 { font-size: 24px; font-weight: 700; }
        .close-modal-mabar { background: transparent; border: none; color: var(--text-gray); font-size: 24px; cursor: pointer; transition: 0.3s; }
        .close-modal-mabar:hover { color: var(--text-white); }
        .match-detail-box { background: #252525; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { color: var(--text-gray); font-size: 14px; }
        .detail-value { font-weight: 600; text-align: right; color: #fff; }
        .slot-info-mabar { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; padding: 12px; background: rgba(189,209,36,0.1); border-radius: 8px; color: var(--primary-green); font-size: 14px; font-weight: 600; }
        .modal-footer-mabar { display: flex; flex-direction: column; gap: 12px; }
        .modal-footer-mabar .footer-top { display: flex; gap: 12px; }
        .modal-footer-mabar button { padding: 14px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .btn-cancel-mabar:hover { background-color: #ff4444 !important; border-color: #ff4444 !important; color: #fff !important; }
        .create-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group-mabar label { display: block; color: var(--text-gray); font-size: 12px; margin-bottom: 8px; }
        .form-group-mabar input, .form-group-mabar select, .form-group-mabar textarea { width: 100%; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 8px; font-family: inherit; outline: none; }
        .form-group-mabar input:focus, .form-group-mabar select:focus, .form-group-mabar textarea:focus { border-color: var(--primary-green); box-shadow: 0 0 0 4px rgba(189,209,36,0.1); background: #1f1f1f; }
        @media (max-width: 768px) { .mabar-grid { grid-template-columns: 1fr; } .filter-grid { flex-direction: column; } .create-form-grid { grid-template-columns: 1fr; } }
      `}} />

      <Navbar />

      <div className="container" style={{ paddingTop: '60px', width: '90%', maxWidth: '1600px', margin: 'auto' }}>
        <section className="hero-mabar">
          <div className="hero-text">
            <h1>Cari Kawan. Lawan. <br /> <span className="text-highlight">Dan Kemenangan.</span></h1>
            <p>Bergabung ke dalam pertandingan yang diinisiasi oleh kawan-kawan badminton di sekitar kamu.</p>
          </div>
          <div className="hero-img">
            <img src="/asset/header_main_bareng.png" alt="Hero" />
          </div>
        </section>

        <section className="filter-box">
          <div className="filter-header">
            <h3>Filter <span className="text-highlight">Permainan.</span></h3>
            <button className="btn btn-outline filter-btn" onClick={() => { setCityFilter(''); setFilteredMatches(matches); }}><i className="fa-solid fa-rotate-left" style={{ marginRight: '4px' }}></i> Clear Filter</button>
          </div>
          <div className="filter-grid">
            <select className="form-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}><option value="">Lokasi</option><option value="surakarta">Surakarta</option><option value="surabaya">Surabaya</option><option value="jakarta">Jakarta</option></select>
            <select className="form-select" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}><option value="">Hari</option><option value="senin">Senin</option><option value="selasa">Selasa</option><option value="rabu">Rabu</option><option value="kamis">Kamis</option><option value="jumat">Jumat</option><option value="sabtu">Sabtu</option><option value="minggu">Minggu</option></select>
            <select className="form-select" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}><option value="">Waktu</option><option value="malam">Malam (18:00 - 23:00)</option></select>
            <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}><option value="">Jenis Kelamin</option><option value="campur">Campur</option></select>
            <button className="btn btn-primary filter-btn" onClick={handleFilter}>Terapkan Filter</button>
          </div>
          <div className="filter-actions-bottom">
            <button className="btn btn-primary filter-btn" onClick={openCreateModal}><i className="fa-solid fa-circle-plus" style={{ marginRight: '4px' }}></i> Buat Jadwal</button>
          </div>
        </section>

        <section className="mabar-grid">
          {loading ? (
            <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1/-1' }}>Memuat jadwal mabar...</p>
          ) : filteredMatches.map((match, i) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className={`font-semibold ${getSlotInfo(match).filled >= getSlotInfo(match).total ? 'text-red-500' : 'text-green-600'}`}>
                    {getSlotInfo(match).filled}/{getSlotInfo(match).total} slot tersedia
                  </span>
                </div>
                <div className="mabar-footer">
                  <div>
                    <span className="label-text">Harga / org</span>
                    <div className="price-val">{match.price_per_person === 0 ? 'Free' : `Rp${match.price_per_person.toLocaleString('id-ID')}`} {match.price_per_person !== 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-gray)' }}>/org</span>}</div>
                  </div>
                  <button className="btn btn-outline" onClick={() => openDetailModal(match)}>Ikut Main Bareng</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bottom-banner">
          <div className="banner-text-row">
            <h2>Olahraga <span className="text-highlight">Lebih Seru</span> ramai-ramai.</h2>
            <p>Tingkatkan skill main, tambah relasi, dan pengalaman baru. Buat kawan dan gabung di lingkungan baru bersama Minton.</p>
          </div>
          <img src="/asset/cta_main_bareng.png" alt="CTA" className="banner-img" />
        </section>
      </div>

      <Footer />

      {showDetailModal && selectedMatch && (
        <div className="modal-overlay-mabar" onClick={(e) => { if (e.target === e.currentTarget) closeDetailModal(); }}>
          <div className="modal-content-mabar">
            <div className="modal-header-mabar">
              <h3>Detail <span className="text-highlight">Pertandingan.</span></h3>
              <button className="close-modal-mabar" onClick={closeDetailModal}>&times;</button>
            </div>
            <div className="match-detail-box">
              <div className="detail-row">
                <span className="detail-label">Venue</span>
                <span className="detail-value">{selectedMatch.venue_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Waktu</span>
                <span className="detail-value">{selectedMatch.start_time.substring(0,5)} - {selectedMatch.end_time.substring(0,5)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Level</span>
                <span className="detail-value">{selectedMatch.skill_level}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Harga</span>
                <span className="detail-value">{selectedMatch.price_per_person === 0 ? 'Free' : `Rp${selectedMatch.price_per_person.toLocaleString('id-ID')}`}</span>
              </div>
            </div>
            <div className="slot-info-mabar">
              <i className="fa-solid fa-users"></i>
              <span>
                {(() => {
                  const s = getSlotInfo(selectedMatch);
                  const remaining = s.total - s.filled;
                  return remaining > 0
                    ? `${remaining} slot tersisa dari ${s.total} slot`
                    : 'Slot sudah penuh';
                })()}
              </span>
            </div>
            <div className="modal-footer-mabar">
              <div className="footer-top">
                <button className="btn btn-outline btn-cancel-mabar" style={{ flex: 1 }} onClick={closeDetailModal}>Batal</button>
              </div>
              <button className="btn btn-primary" style={{ border: 'none', color: '#000', fontWeight: 600 }} onClick={confirmJoin} disabled={processing}>
                {processing ? 'Memproses...' : 'Konfirmasi Ikut'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay-mabar" onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal(); }}>
          <div className="modal-content-mabar" style={{ maxWidth: '600px' }}>
            <div className="modal-header-mabar">
              <h3>Buat Jadwal <span className="text-highlight">Main Bareng.</span></h3>
              <button className="close-modal-mabar" onClick={closeCreateModal}>&times;</button>
            </div>
            <form ref={formRef} onSubmit={submitMabar}>
              <div className="create-form-grid">
                <div className="form-group-mabar">
                  <label>Nama Venue</label>
                  <input type="text" name="venueName" placeholder="Contoh: GOR Sudirman" required />
                </div>
                <div className="form-group-mabar">
                  <label>Level Permainan</label>
                  <select name="skillLevel" required>
                    <option value="Bebas">Bebas / All Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group-mabar">
                  <label>Tanggal</label>
                  <input type="date" name="date" required />
                </div>
                <div className="form-group-mabar">
                  <label>Waktu (Jam)</label>
                  <input type="text" name="time" placeholder="Contoh: 19:00 - 21:00" required />
                </div>
                <div className="form-group-mabar">
                  <label>Maksimal Pemain</label>
                  <input type="number" name="totalSlots" placeholder="8" required />
                </div>
                <div className="form-group-mabar">
                  <label>Harga / Orang</label>
                  <input type="text" name="price" placeholder="Contoh: 35.000 atau Free" required />
                </div>
              </div>
              <div className="form-group-mabar" style={{ marginBottom: '24px' }}>
                <label>Deskripsi & Aturan (Opsional)</label>
                <textarea rows={3} placeholder="Contoh: Kok disediakan, iuran lapangan bagi rata." style={{ resize: 'none' }}></textarea>
              </div>
              <div className="modal-footer-mabar" style={{ flexDirection: 'row', gap: '12px' }}>
                <button type="button" className="btn btn-outline btn-cancel-mabar" style={{ flex: 1 }} onClick={closeCreateModal}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, border: 'none', color: '#000', fontWeight: 600 }} disabled={processing}>
                  {processing ? 'Memproses...' : 'Publikasikan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

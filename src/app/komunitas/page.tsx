
"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KomunitasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedKlub, setSelectedKlub] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const klubs = [
    { name: 'PB Djarum Surabaya', city: 'Surabaya', users: 124, level: 'Campuran', schedule: 'Sabtu & Minggu', price: 'Rp 50K / bln', img: '/asset/card-komunitas1.png' },
    { name: 'Smash Hunter SBY', city: 'Surabaya', users: 86, level: 'Menengah - Pro', schedule: 'Rabu & Jumat', price: 'Rp 75K / bln', img: '/asset/card-komunitas2.png' },
    { name: 'Badminton Lovers Sidoarjo', city: 'Sidoarjo', users: 210, level: 'Pemula - Menengah', schedule: 'Minggu Pagi', price: 'Patungan Harian', img: '/asset/card-komunitas3.png' },
    { name: 'Kok Terbang Club', city: 'Malang', users: 45, level: 'Campuran', schedule: 'Selasa Malam', price: 'Rp 40K / bln', img: '/asset/card-komunitas4.png' },
  ];

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
      const navbar = document.querySelector('.navbar');
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

  const handleJoin = (klubName: string) => {
    setSelectedKlub(klubName);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 3000);
    }, 1500);
  };

  const filteredKlubs = klubs.filter(klub => {
    const matchSearch = klub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = selectedLocation === '' || klub.city.toLowerCase() === selectedLocation.toLowerCase();
    return matchSearch && matchLocation;
  });

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
        .form-group input {
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
      `}} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px' }}></i>
                <h2 style={{ marginBottom: '12px' }}>Berhasil Bergabung!</h2>
                <p style={{ color: '#aaa' }}>Permintaan bergabung Anda ke <strong>{selectedKlub}</strong> telah terkirim.</p>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: '10px' }}>Join {selectedKlub}</h2>
                <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '14px' }}>Konfirmasi data diri Anda untuk bergabung ke komunitas.</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" placeholder="Masukkan nama Anda" required />
                  </div>
                  <div className="form-group">
                    <label>No. WhatsApp</label>
                    <input type="tel" placeholder="0812xxxxxx" required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses...' : 'Kirim Permintaan'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="container" style={{ width: '90%', maxWidth: '1600px', margin: 'auto' }}>
        <main>
          <section style={{ paddingTop: '100px' }}>
            <div className="section-title">
              <p>The <span>Hall of Fame</span></p>
              <h2>Jajaran Para <span className="text-highlight">Jagoan.</span></h2>
            </div>
            <div className="podium-container">
              <div className="podium-card rank-2">
                <div className="podium-rank">2</div>
                <div className="podium-content">
                  <div className="podium-name">Siti Aminah</div>
                  <div className="podium-points">2.890</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
              <div className="podium-card rank-1">
                <div className="podium-rank">1</div>
                <div className="podium-content">
                  <div className="podium-name">Bagus Saputra</div>
                  <div className="podium-points">3.150</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
              <div className="podium-card rank-3">
                <div className="podium-rank">3</div>
                <div className="podium-content">
                  <div className="podium-name">Kevin Sanjaya</div>
                  <div className="podium-points">2.540</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Minton <span className="text-highlight">Leaderboard</span></h2>
            </div>
            <div className="leaderboard-header">
              <div className="lb-tabs">
                <div className="lb-tab active">Pria</div>
                <div className="lb-tab">Wanita</div>
                <div className="lb-tab">Klub/Grup</div>
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Lihat Peringkat Saya</button>
            </div>
            <div className="leaderboard-grid">
              <div className="lb-list">
                <div className="lb-row"><span className="lb-rank">1</span><div className="lb-user"><div className="lb-avatar"></div>Bagus Saputra</div><span className="lb-score">3.150 pts</span></div>
                <div className="lb-row"><span className="lb-rank">2</span><div className="lb-user"><div className="lb-avatar"></div>Siti Aminah</div><span className="lb-score">2.890 pts</span></div>
                <div className="lb-row"><span className="lb-rank">3</span><div className="lb-user"><div className="lb-avatar"></div>Kevin Sanjaya</div><span className="lb-score">2.540 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>4</span><div className="lb-user"><div className="lb-avatar"></div>Ahmad F.</div><span className="lb-score">2.400 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>5</span><div className="lb-user"><div className="lb-avatar"></div>Rina M.</div><span className="lb-score">2.350 pts</span></div>
              </div>
              <div className="lb-list">
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>6</span><div className="lb-user"><div className="lb-avatar"></div>Joko S.</div><span className="lb-score">2.210 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>7</span><div className="lb-user"><div className="lb-avatar"></div>Dedi T.</div><span className="lb-score">2.100 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>8</span><div className="lb-user"><div className="lb-avatar"></div>Fajar A.</div><span className="lb-score">2.050 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>9</span><div className="lb-user"><div className="lb-avatar"></div>Rian A.</div><span className="lb-score">1.980 pts</span></div>
                <div className="lb-row"><span className="lb-rank" style={{ color: 'var(--text-gray)' }}>10</span><div className="lb-user"><div className="lb-avatar"></div>Hendra S.</div><span className="lb-score">1.890 pts</span></div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Klub & <span className="text-highlight">Komunitas</span></h2>
            </div>
            <div className="filter-bar">
              <div className="filter-input">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                  type="text" 
                  placeholder="Cari nama klub/komunitas" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-input">
                <i className="fa-solid fa-location-dot"></i>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                  <option value="">Semua Lokasi</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="sidoarjo">Sidoarjo</option>
                  <option value="malang">Malang</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={() => { setSearchTerm(''); setSelectedLocation(''); }}>Reset</button>
            </div>
            <div className="klub-grid">
              {filteredKlubs.length > 0 ? (
                filteredKlubs.map((klub, i) => (
                  <div key={i} className="klub-card reveal">
                    <img src={klub.img} className="klub-img" alt={klub.name} />
                    <div className="klub-info">
                      <div className="klub-header">
                        <div>
                          <h3>{klub.name}</h3>
                          <p>Kota {klub.city}</p>
                        </div>
                        <div className="text-highlight"><i className="fa-solid fa-users"></i> {klub.users}</div>
                      </div>
                      <div className="klub-stats">
                        <div><span className="stat-label">Level</span><span className="stat-val">{klub.level}</span></div>
                        <div><span className="stat-label">Jadwal</span><span className="stat-val">{klub.schedule}</span></div>
                        <div><span className="stat-label">Iuran</span><span className="stat-val">{klub.price}</span></div>
                      </div>
                      <div className="klub-actions">
                        <button className="btn btn-outline" onClick={() => handleJoin(klub.name)}>Join Komunitas</button>
                        <button className="btn btn-outline" onClick={() => window.location.href='/main-bareng'}>Mabar</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: '#666' }}>
                  Tidak ada komunitas yang sesuai.
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Community <span className="text-highlight">Feed & Tips</span></h2>
            </div>
            <div className="feed-grid">
              <div className="feed-card">
                <img src="/asset/card-artikel1.png" className="feed-img" alt="Tips Grip" />
                <div className="feed-info">
                  <h3 className="feed-title">Tips Grip Raket yang Benar</h3>
                  <p className="feed-desc">Simak teknik dasar memegang raket ala atlet pro agar smash lebih powerfull.</p>
                  <div className="feed-footer"><span>Coach Hendra</span><span>2 Hari yang lalu</span></div>
                </div>
              </div>
              <div className="feed-card">
                <img src="/asset/card-artikel2.png" className="feed-img" alt="Review Sepatu" />
                <div className="feed-info">
                  <h3 className="feed-title">Review Sepatu Badminton 2026</h3>
                  <p className="feed-desc">Komparasi top 5 sepatu badminton rilis terbaru yang empuk dan ringan.</p>
                  <div className="feed-footer"><span>Budi Santoso</span><span>4 Hari yang lalu</span></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

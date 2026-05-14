
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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
      setTimeout(() => { setIsSuccess(false); setIsModalOpen(false); }, 3000);
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
        .section-title { text-align: center; margin-bottom: 40px; }
        .section-title h2 { font-size: 48px; font-weight: 700; }
        .section-title p { color: #aaa; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .text-highlight { color: #bdd124; }

        .podium-container { display: flex; justify-content: center; align-items: flex-end; gap: 20px; margin-top: 40px; }
        .podium-card { position: relative; border-radius: 16px; overflow: hidden; text-align: center; display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; border: 2px solid transparent; }
        .podium-card::before { content: ''; position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 0; opacity: 0.8; }
        .podium-card::after { content: ''; position: absolute; inset: 0; z-index: 1; }
        .podium-content { position: relative; z-index: 2; }
        .podium-rank { position: absolute; top: 15px; right: 20px; font-size: 40px; font-weight: 800; z-index: 2; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }
        .podium-name { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .podium-points { font-size: 32px; font-weight: 800; }
        .podium-label { font-size: 14px; opacity: 0.8; }

        .rank-2 { width: 300px; height: 500px; border-color: #C0C0C0; }
        .rank-2::before { background-image: url('/asset/peringkat-2.png'); }
        .rank-2::after { background: linear-gradient(to top, #F8B505, rgba(192, 192, 192, 0) 60%); }
        .rank-2 .podium-rank, .rank-2 .podium-points { color: #C0C0C0; }

        .rank-1 { width: 350px; height: 600px; border-color: #bdd124; }
        .rank-1::before { background-image: url('/asset/peringkat-1.png'); }
        .rank-1::after { background: linear-gradient(to top, #bdd124, rgba(255, 215, 0, 0) 60%); }
        .rank-1 .podium-rank, .rank-1 .podium-points { color: #FFD700; font-size: 56px; }
        .rank-1 .podium-points { font-size: 40px; }

        .rank-3 { width: 300px; height: 500px; border-color: #CD7F32; }
        .rank-3::before { background-image: url('/asset/peringkat-3.png'); }
        .rank-3::after { background: linear-gradient(to top, rgba(205, 127, 50, 0.9) 0%, rgba(205, 127, 50, 0) 60%); }
        .rank-3 .podium-rank, .rank-3 .podium-points { color: #CD7F32; }

        .leaderboard-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; margin-bottom: 24px; }
        .lb-tabs { display: flex; gap: 32px; }
        .lb-tab { padding: 12px 0; color: #aaa; cursor: pointer; font-size: 16px; font-weight: 500; border-bottom: 2px solid transparent; transition: 0.3s; }
        .lb-tab.active { color: #bdd124; border-bottom-color: #bdd124; }
        .leaderboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
        .lb-list { display: flex; flex-direction: column; gap: 12px; }
        .lb-row { display: flex; align-items: center; padding: 12px; background: #1c1c1c; border-radius: 8px; font-size: 16px; border: 1px solid transparent; transition: 0.3s; }
        .lb-row:hover { border-color: #333; }
        .lb-rank { width: 30px; color: #bdd124; font-weight: 700; }
        .lb-user { display: flex; align-items: center; gap: 10px; flex: 1; }
        .lb-avatar { width: 24px; height: 24px; border-radius: 50%; background: #333; }
        .lb-score { font-weight: 600; }

        .klub-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .klub-card { background: #1c1c1c; border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        .klub-img { width: 100%; height: 200px; object-fit: cover; }
        .klub-info { padding: 20px; }
        .klub-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .klub-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; font-size: 13px; }
        .stat-label { color: #aaa; display: block; margin-bottom: 4px; }
        .stat-val { font-weight: 600; }

        .feed-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .feed-card { background: #1c1c1c; border-radius: 12px; overflow: hidden; border: 1px solid #333; }
        .feed-img { width: 100%; height: 180px; object-fit: cover; }
        .feed-info { padding: 20px; }
        .feed-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #aaa; border-top: 1px solid #333; padding-top: 12px; margin-top: 16px; }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}} />

      <div className="container" style={{ width: '90%', maxWidth: '1600px', margin: 'auto', padding: '100px 0' }}>
        <section>
          <div className="section-title"><p>The <span>Hall of Fame</span></p><h2>Jajaran Para <span className="text-highlight">Jagoan.</span></h2></div>
          <div className="podium-container">
            <div className="podium-card rank-2"><div className="podium-rank">2</div><div className="podium-content"><div className="podium-name">Siti Aminah</div><div className="podium-points">2.890</div><div className="podium-label">Poin</div></div></div>
            <div className="podium-card rank-1"><div className="podium-rank">1</div><div className="podium-content"><div className="podium-name">Bagus Saputra</div><div className="podium-points">3.150</div><div className="podium-label">Poin</div></div></div>
            <div className="podium-card rank-3"><div className="podium-rank">3</div><div className="podium-content"><div className="podium-name">Kevin Sanjaya</div><div className="podium-points">2.540</div><div className="podium-label">Poin</div></div></div>
          </div>
        </section>

        <section>
          <div className="section-title"><h2>Minton <span className="text-highlight">Leaderboard</span></h2></div>
          <div className="leaderboard-header"><div className="lb-tabs"><div className="lb-tab active">Pria</div><div className="lb-tab">Wanita</div><div className="lb-tab">Klub/Grup</div></div><button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Lihat Peringkat Saya</button></div>
          <div className="leaderboard-grid">
            <div className="lb-list">
              {[1, 2, 3, 4, 5].map(r => (
                <div key={r} className="lb-row"><span className="lb-rank">{r}</span><div className="lb-user"><div className="lb-avatar"></div>User {r}</div><span className="lb-score">{(3200 - r * 100)} pts</span></div>
              ))}
            </div>
            <div className="lb-list">
              {[6, 7, 8, 9, 10].map(r => (
                <div key={r} className="lb-row"><span className="lb-rank" style={{ color: '#aaa' }}>{r}</span><div className="lb-user"><div className="lb-avatar"></div>User {r}</div><span className="lb-score">{(3200 - r * 100)} pts</span></div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="section-title"><h2>Klub & <span className="text-highlight">Komunitas</span></h2></div>
          <div className="klub-grid">
            {klubs.map((klub, i) => (
              <div key={i} className="klub-card reveal">
                <img src={klub.img} className="klub-img" alt={klub.name} />
                <div className="klub-info">
                  <div className="klub-header"><div><h3>{klub.name}</h3><p>Kota {klub.city}</p></div><div className="text-highlight"><i className="fa-solid fa-users"></i> {klub.users}</div></div>
                  <div className="klub-stats">
                    <div><span className="stat-label">Level</span><span className="stat-val">{klub.level}</span></div>
                    <div><span className="stat-label">Jadwal</span><span className="stat-val">{klub.schedule}</span></div>
                    <div><span className="stat-label">Iuran</span><span className="stat-val">{klub.price}</span></div>
                  </div>
                  <div className="klub-actions">
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => handleJoin(klub.name)}>Join Komunitas</button>
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => window.location.href='/main-bareng'}>Mabar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title"><h2>Community <span className="text-highlight">Feed & Tips</span></h2></div>
          <div className="feed-grid">
            <div className="feed-card"><img src="/asset/card-artikel1.png" className="feed-img" /><div className="feed-info"><h3>Tips Grip Raket yang Benar</h3><p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>Simak teknik dasar memegang raket ala atlet pro.</p><div className="feed-footer"><span>Coach Hendra</span><span>2 Hari yang lalu</span></div></div></div>
            <div className="feed-card"><img src="/asset/card-artikel2.png" className="feed-img" /><div className="feed-info"><h3>Review Sepatu Badminton 2026</h3><p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>Komparasi top 5 sepatu badminton rilis terbaru.</p><div className="feed-footer"><span>Budi Santoso</span><span>4 Hari yang lalu</span></div></div></div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

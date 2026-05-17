'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLeaderboard, getClubs, getFeedPosts, getMyRank } from './actions';

interface LeaderboardUser { email: string; nama_lengkap: string; points: number }
interface Club { id: string; name: string; description: string; city: string; level: string; schedule: string; fee: string; member_count: number; image_url: string }
interface FeedPost { id: string; title: string; content: string; author_name: string; image_url: string; published_at: string }

function formatDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hari ini';
  if (days === 1) return '1 Hari yang lalu';
  if (days < 7) return `${days} Hari yang lalu`;
  if (days < 30) return `${Math.floor(days / 7)} Minggu yang lalu`;
  return `${Math.floor(days / 30)} Bulan yang lalu`;
}

function getAvatar(email: string, idx: number) {
  const imgs = ['/asset/peringkat-1.png','/asset/testimoni-rina.png','/asset/peringkat-2.png','/asset/testimoni-budi.png','/asset/testimoni-sari.png'];
  return imgs[idx] ?? undefined;
}

export default function KomunitasPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number } | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('Pria');

  const [articleModal, setArticleModal] = useState<FeedPost | null>(null);
  const [clubModal, setClubModal] = useState<{ club: Club; action: string } | null>(null);
  const [myRankModal, setMyRankModal] = useState(false);
  const [loadMoreModal, setLoadMoreModal] = useState(false);

  useEffect(() => { document.title = 'Komunitas - Minton'; }, []);

  useEffect(() => {
    (async () => {
      const [lb, c, f] = await Promise.all([getLeaderboard(), getClubs(), getFeedPosts()]);
      setLeaderboard(lb);
      setClubs(c);
      setFeed(f);
    })();
    const email = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
    setUserEmail(email);
    if (email) getMyRank(email).then(setMyRank);
  }, []);

  const filteredClubs = clubs.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter && !c.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (scheduleFilter && !c.schedule.toLowerCase().includes(scheduleFilter.toLowerCase())) return false;
    return true;
  });

  const cities = [...new Set(clubs.map((c) => c.city))];

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  function openArticleModal(post: FeedPost) { setArticleModal(post); document.body.style.overflow = 'hidden'; }
  function closeArticleModal() { setArticleModal(null); document.body.style.overflow = 'auto'; }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .modal-overlay-kom { display: flex; position: fixed; z-index: 1000; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); justify-content: center; align-items: center; }
        .modal-content-kom { background-color: #1c1c1c; border: 1px solid #333; width: 90%; max-width: 560px; border-radius: 20px; padding: 32px; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto; }
        .modal-header-kom { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header-kom h3 { font-size: 24px; font-weight: 700; margin: 0; }
        .close-modal-kom { background: transparent; border: none; color: #aaaaaa; font-size: 24px; cursor: pointer; }
        .close-modal-kom:hover { color: #fff; }
        .modal-body-kom p { font-size: 14px; color: #ccc; line-height: 1.7; margin-bottom: 16px; }
        .modal-body-kom img { width: 100%; border-radius: 12px; margin-bottom: 16px; }
        .modal-footer-kom { display: flex; gap: 12px; margin-top: 24px; }
        .modal-footer-kom button { flex: 1; padding: 14px; border-radius: 8px; font-size: 14px; cursor: pointer; border: none; font-family: inherit; font-weight: 600; }
        .btn-kom-secondary { background: transparent; border: 1px solid #333 !important; color: #fff; }
        .btn-kom-primary { background: var(--primary-lime); color: #000; }
        .btn-kom-primary:hover { background: #d4e92a; }
        .btn-kom-secondary:hover { background: rgba(255,255,255,0.05); }
      `}} />

      <Navbar />
      <div className="container">
        <section>
          <div className="section-title">
            <p>The <span>Hall of Fame</span></p>
            <h2>Jajaran Para <span className="text-highlight">Jagoan.</span></h2>
          </div>
          <div className="podium-container">
            {top3.length >= 2 && (
              <div className="podium-card rank-2">
                <div className="podium-rank">2</div>
                <div className="podium-content">
                  <div className="podium-name">{top3[1]?.nama_lengkap ?? '-'}</div>
                  <div className="podium-points">{top3[1]?.points.toLocaleString()}</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
            )}
            {top3.length >= 1 && (
              <div className="podium-card rank-1">
                <div className="podium-rank">1</div>
                <div className="podium-content">
                  <div className="podium-name">{top3[0]?.nama_lengkap ?? '-'}</div>
                  <div className="podium-points">{top3[0]?.points.toLocaleString()}</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
            )}
            {top3.length >= 3 && (
              <div className="podium-card rank-3">
                <div className="podium-rank">3</div>
                <div className="podium-content">
                  <div className="podium-name">{top3[2]?.nama_lengkap ?? '-'}</div>
                  <div className="podium-points">{top3[2]?.points.toLocaleString()}</div>
                  <div className="podium-label">Poin</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="section-title">
            <h2>Minton <span className="text-highlight">Leaderboard</span></h2>
          </div>
          <div className="leaderboard-header">
            <div className="lb-tabs">
              {['Pria', 'Wanita', 'Klub/Grup'].map((tab) => (
                <div key={tab} className={`lb-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
              ))}
            </div>
            <button className="btn-standard primary" onClick={() => setMyRankModal(true)}>
              Lihat Peringkat Saya
            </button>
          </div>
          <div className="leaderboard-grid">
            {(() => {
              const cols = 3;
              const perCol = Math.ceil(rest.length / cols) || 1;
              return Array.from({ length: cols }, (_, ci) => (
                <div key={ci} className="lb-list">
                  {rest.slice(ci * perCol, (ci + 1) * perCol).map((u, i) => {
                    const globalIdx = ci * perCol + i + 4;
                    const isMe = u.email === userEmail;
                    return (
                      <div
                        key={u.email}
                        className="lb-row"
                        id={isMe ? 'my-rank' : undefined}
                        style={isMe ? { background: 'var(--primary-lime)', borderRadius: '8px', padding: '4px 8px' } : undefined}
                      >
                        <span className="lb-rank" style={globalIdx > 3 ? { color: '#aaaaaa' } : undefined}>{globalIdx}</span>
                        <div className="lb-user">
                          <div className="lb-avatar">{getAvatar(u.email, globalIdx - 1) && <img src={getAvatar(u.email, globalIdx - 1)} alt="" />}</div>
                          {u.nama_lengkap}
                        </div>
                        <span className="lb-score">{u.points.toLocaleString()} pts</span>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </section>

        <section>
          <div className="section-title">
            <h2>Klub & <span className="text-highlight">Komunitas</span></h2>
          </div>
          <div className="filter-bar">
            <div className="filter-input">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Cari nama klub/komunitas" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-input">
              <i className="fa-solid fa-location-dot"></i>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="">Lokasi</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-input">
              <i className="fa-regular fa-calendar"></i>
              <select value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)}>
                <option value="">Jadwal Rutin</option>
                <option value="weekend">Weekend</option>
                <option value="weekday">Weekday</option>
              </select>
            </div>
            <button className="btn-standard primary" onClick={() => { setSearch(''); setCityFilter(''); setScheduleFilter(''); }}>
              <i className="fa-solid fa-rotate-left"></i> Reset Filter
            </button>
          </div>
          <div className="klub-grid">
            {filteredClubs.map((club) => (
              <div key={club.id} className="klub-card">
                <img src={club.image_url} className="klub-img" alt={club.name} />
                <div className="klub-info">
                  <div className="klub-header">
                    <div>
                      <h3>{club.name}</h3>
                      <p>Kota {club.city}</p>
                    </div>
                    <div className="text-highlight"><i className="fa-solid fa-users"></i> {club.member_count}</div>
                  </div>
                  <div className="klub-stats">
                    <div><span className="stat-label">Level</span><span className="stat-val">{club.level}</span></div>
                    <div><span className="stat-label">Jadwal Rutin</span><span className="stat-val">{club.schedule}</span></div>
                    <div><span className="stat-label">Iuran</span><span className="stat-val">{club.fee}</span></div>
                  </div>
                  <div className="klub-actions">
                    <button className="btn btn-outline" onClick={() => setClubModal({ club, action: 'join' })}>Join Komunitas</button>
                    <button className="btn btn-outline" onClick={() => setClubModal({ club, action: 'mabar' })}>Mabar Bareng</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button className="btn btn-outline" style={{ borderColor: 'var(--primary-lime)', color: 'var(--primary-lime)' }} onClick={() => setLoadMoreModal(true)}>
              <i className="fa-solid fa-plus"></i> Muat Lebih Banyak
            </button>
          </div>
        </section>

        <section>
          <div className="section-title">
            <h2>Community <span className="text-highlight">Feed & Tips</span></h2>
          </div>
          <div className="feed-grid">
            {feed.map((post) => (
              <div key={post.id} className="feed-card" onClick={() => openArticleModal(post)}>
                <img src={post.image_url} className="feed-img" alt={post.title} />
                <div className="feed-info">
                  <h3 className="feed-title">{post.title}</h3>
                  <p className="feed-desc">{post.content}</p>
                  <div className="feed-footer">
                    <span><i className="fa-regular fa-user"></i> {post.author_name}</span>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title">
            <h2>Upcoming <span className="text-highlight">Tournament</span></h2>
          </div>
          <img
            src="/asset/turnamen.png"
            alt="Badminton Tournament Banner"
            className="tournament-banner"
            onClick={() => setArticleModal({ id: 'tournament', title: 'Turnamen Badminton Minton 2026', content: 'Turnamen tahunan Minton akan segera digelar! Berbagai kategori dipertandingkan mulai dari Ganda Dewasa, Tunggal Pemula, hingga Ganda Campuran. Total hadiah mencapai puluhan juta rupiah. Segera daftarkan tim Anda melalui GOR mitra Minton terdekat. Pantau terus informasi jadwal kualifikasi dan pendaftaran di halaman ini.', author_name: 'Minton Tournament', image_url: '/asset/turnamen.png', published_at: new Date().toISOString() })}
          />
        </section>
      </div>
      <Footer />

      {articleModal && (
        <div className="modal-overlay-kom" onClick={(e) => { if (e.target === e.currentTarget) closeArticleModal(); }}>
          <div className="modal-content-kom">
            <div className="modal-header-kom">
              <h3>{articleModal.title}</h3>
              <button className="close-modal-kom" onClick={closeArticleModal}>&times;</button>
            </div>
            <div className="modal-body-kom">
              <img src={articleModal.image_url} alt={articleModal.title} />
              <p>{articleModal.content}</p>
              <p style={{ fontSize: '12px', color: '#888' }}><i className="fa-regular fa-user"></i> {articleModal.author_name}</p>
            </div>
            <div className="modal-footer-kom">
              <button className="btn-kom-secondary" onClick={closeArticleModal}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {clubModal && (
        <div className="modal-overlay-kom" onClick={(e) => { if (e.target === e.currentTarget) setClubModal(null); }}>
          <div className="modal-content-kom">
            <div className="modal-header-kom">
              <h3>{clubModal.action === 'join' ? 'Join ' : 'Mabar Bareng '}{clubModal.club.name}</h3>
              <button className="close-modal-kom" onClick={() => setClubModal(null)}>&times;</button>
            </div>
            <div className="modal-body-kom">
              <p>{clubModal.action === 'join'
                ? `Anda akan bergabung sebagai anggota ${clubModal.club.name}. Level: ${clubModal.club.level}, Jadwal: ${clubModal.club.schedule}, Iuran: ${clubModal.club.fee}.`
                : `Anda akan mengirim permintaan main bareng ke ${clubModal.club.name}. Anggota klub akan melihat permintaan Anda dan menghubungi untuk detail jadwal.`
              }</p>
            </div>
            <div className="modal-footer-kom">
              <button className="btn-kom-secondary" onClick={() => setClubModal(null)}>Batal</button>
              <button className="btn-kom-primary" onClick={() => { alert(clubModal.action === 'join' ? 'Permintaan bergabung telah dikirim ke pengurus klub.' : 'Permintaan Mabar Bareng telah dikirim.'); setClubModal(null); }}>
                {clubModal.action === 'join' ? 'Kirim Permintaan' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {myRankModal && (
        <div className="modal-overlay-kom" onClick={(e) => { if (e.target === e.currentTarget) setMyRankModal(false); }}>
          <div className="modal-content-kom">
            <div className="modal-header-kom">
              <h3>Peringkat Anda</h3>
              <button className="close-modal-kom" onClick={() => setMyRankModal(false)}>&times;</button>
            </div>
            <div className="modal-body-kom">
              {myRank ? (
                <p>Saat ini Anda berada di peringkat <strong>{myRank.rank}</strong> dengan <strong>{leaderboard[myRank.rank - 1]?.points?.toLocaleString() || 0}</strong> poin. Pertahankan prestasimu!</p>
              ) : (
                <p>Anda belum memiliki peringkat. Mulai bergabung dengan pertandingan Main Bareng untuk mengumpulkan poin!</p>
              )}
            </div>
            <div className="modal-footer-kom">
              <button className="btn-kom-primary" onClick={() => setMyRankModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {loadMoreModal && (
        <div className="modal-overlay-kom" onClick={(e) => { if (e.target === e.currentTarget) setLoadMoreModal(false); }}>
          <div className="modal-content-kom">
            <div className="modal-header-kom">
              <h3>Memuat Data</h3>
              <button className="close-modal-kom" onClick={() => setLoadMoreModal(false)}>&times;</button>
            </div>
            <div className="modal-body-kom">
              <p>Menampilkan lebih banyak klub dan komunitas badminton di sekitar Anda...</p>
            </div>
            <div className="modal-footer-kom">
              <button className="btn-kom-primary" onClick={() => setLoadMoreModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

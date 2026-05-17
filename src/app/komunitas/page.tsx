'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
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
    return true;
  });

  const cities = [...new Set(clubs.map((c) => c.city))];

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <>
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
              <div className="lb-tab active">Semua</div>
            </div>
            <button className="btn btn-primary" onClick={() => {
              const el = document.getElementById('my-rank');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>Lihat Peringkat Saya</button>
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
                <option value="">Semua Lokasi</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setCityFilter(''); }}>Reset Filter</button>
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
                    <button className="btn btn-outline">Join Komunitas</button>
                    <button className="btn btn-outline">Mabar Bareng</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button className="btn btn-outline" style={{ borderColor: 'var(--primary-lime)', color: 'var(--primary-lime)' }}>
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
              <div key={post.id} className="feed-card">
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
          <img src="/asset/turnamen.png" alt="Badminton Tournament Banner" className="tournament-banner" />
        </section>
      </div>
      <Footer />
    </>
  );
}

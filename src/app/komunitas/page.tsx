import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Komunitas - Minton' };

export default function KomunitasPage() {
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
            <button className="btn btn-primary">Lihat Peringkat Saya</button>
          </div>
          <div className="leaderboard-grid">
            <div className="lb-list">
              <div className="lb-row"><span className="lb-rank">1</span><div className="lb-user"><div className="lb-avatar"><img src="/asset/peringkat-1.png" alt="User 1" /></div>Bagus Saputra</div><span className="lb-score">3.150 pts</span></div>
              <div className="lb-row"><span className="lb-rank">2</span><div className="lb-user"><div className="lb-avatar"><img src="/asset/testimoni-rina.png" alt="User 2" /></div>Siti Aminah</div><span className="lb-score">2.890 pts</span></div>
              <div className="lb-row"><span className="lb-rank">3</span><div className="lb-user"><div className="lb-avatar"><img src="/asset/peringkat-2.png" alt="User 3" /></div>Kevin Sanjaya</div><span className="lb-score">2.540 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>4</span><div className="lb-user"><div className="lb-avatar"><img src="/asset/testimoni-budi.png" alt="User 4" /></div>Ahmad F.</div><span className="lb-score">2.400 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>5</span><div className="lb-user"><div className="lb-avatar"><img src="/asset/testimoni-sari.png" alt="User 5" /></div>Rina M.</div><span className="lb-score">2.350 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>6</span><div className="lb-user"><div className="lb-avatar"></div>Joko S.</div><span className="lb-score">2.210 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>7</span><div className="lb-user"><div className="lb-avatar"></div>Dedi T.</div><span className="lb-score">2.100 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>8</span><div className="lb-user"><div className="lb-avatar"></div>Fajar A.</div><span className="lb-score">2.050 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>9</span><div className="lb-user"><div className="lb-avatar"></div>Rian A.</div><span className="lb-score">1.980 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>10</span><div className="lb-user"><div className="lb-avatar"></div>Hendra S.</div><span className="lb-score">1.890 pts</span></div>
            </div>
            <div className="lb-list">
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>11</span><div className="lb-user"><div className="lb-avatar"></div>Ahsan S.</div><span className="lb-score">1.850 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>12</span><div className="lb-user"><div className="lb-avatar"></div>Tontowi A.</div><span className="lb-score">1.800 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>13</span><div className="lb-user"><div className="lb-avatar"></div>Liliyana N.</div><span className="lb-score">1.750 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>14</span><div className="lb-user"><div className="lb-avatar"></div>Praveen J.</div><span className="lb-score">1.700 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>15</span><div className="lb-user"><div className="lb-avatar"></div>Melati D.</div><span className="lb-score">1.650 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>16</span><div className="lb-user"><div className="lb-avatar"></div>Apriyani R.</div><span className="lb-score">1.600 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>17</span><div className="lb-user"><div className="lb-avatar"></div>Greysia P.</div><span className="lb-score">1.550 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>18</span><div className="lb-user"><div className="lb-avatar"></div>Jonatan C.</div><span className="lb-score">1.500 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>19</span><div className="lb-user"><div className="lb-avatar"></div>Anthony G.</div><span className="lb-score">1.450 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>20</span><div className="lb-user"><div className="lb-avatar"></div>Chico A.</div><span className="lb-score">1.400 pts</span></div>
            </div>
            <div className="lb-list">
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>21</span><div className="lb-user"><div className="lb-avatar"></div>Shesar H.</div><span className="lb-score">1.350 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>22</span><div className="lb-user"><div className="lb-avatar"></div>Gregoria M.</div><span className="lb-score">1.300 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>23</span><div className="lb-user"><div className="lb-avatar"></div>Putri K.</div><span className="lb-score">1.250 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>24</span><div className="lb-user"><div className="lb-avatar"></div>Rinov R.</div><span className="lb-score">1.200 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>25</span><div className="lb-user"><div className="lb-avatar"></div>Pitha H.</div><span className="lb-score">1.150 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>26</span><div className="lb-user"><div className="lb-avatar"></div>Rehan N.</div><span className="lb-score">1.100 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>27</span><div className="lb-user"><div className="lb-avatar"></div>Lisa A.</div><span className="lb-score">1.050 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>28</span><div className="lb-user"><div className="lb-avatar"></div>Dejan F.</div><span className="lb-score">1.000 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>29</span><div className="lb-user"><div className="lb-avatar"></div>Gloria E.</div><span className="lb-score">950 pts</span></div>
              <div className="lb-row"><span className="lb-rank" style={{ color: '#aaaaaa' }}>30</span><div className="lb-user"><div className="lb-avatar"></div>Zachariah J.</div><span className="lb-score">900 pts</span></div>
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
              <input type="text" placeholder="Cari nama klub/komunitas" />
            </div>
            <div className="filter-input">
              <i className="fa-solid fa-location-dot"></i>
              <select defaultValue="">
                <option value="" disabled>Lokasi</option>
                <option value="surabaya">Surabaya</option>
                <option value="jakarta">Jakarta</option>
              </select>
            </div>
            <div className="filter-input">
              <i className="fa-regular fa-calendar"></i>
              <select defaultValue="">
                <option value="" disabled>Jadwal Rutin</option>
                <option value="weekend">Weekend</option>
                <option value="weekday">Weekday</option>
              </select>
            </div>
            <button className="btn btn-primary">Terapkan Filter</button>
          </div>
          <div className="klub-grid">
            <div className="klub-card">
              <img src="/asset/card-komunitas1.png" className="klub-img" alt="Klub 1" />
              <div className="klub-info">
                <div className="klub-header">
                  <div>
                    <h3>PB Djarum Surabaya</h3>
                    <p>Kota Surabaya</p>
                  </div>
                  <div className="text-highlight"><i className="fa-solid fa-users"></i> 124</div>
                </div>
                <div className="klub-stats">
                  <div><span className="stat-label">Level</span><span className="stat-val">Campuran</span></div>
                  <div><span className="stat-label">Jadwal Rutin</span><span className="stat-val">Sabtu & Minggu</span></div>
                  <div><span className="stat-label">Iuran</span><span className="stat-val">Rp 50K / bln</span></div>
                </div>
                <div className="klub-actions">
                  <button className="btn btn-outline">Join Komunitas</button>
                  <button className="btn btn-outline">Mabar Bareng</button>
                </div>
              </div>
            </div>
            <div className="klub-card">
              <img src="/asset/card-komunitas2.png" className="klub-img" alt="Klub 2" />
              <div className="klub-info">
                <div className="klub-header">
                  <div>
                    <h3>Smash Hunter SBY</h3>
                    <p>Kota Surabaya</p>
                  </div>
                  <div className="text-highlight"><i className="fa-solid fa-users"></i> 86</div>
                </div>
                <div className="klub-stats">
                  <div><span className="stat-label">Level</span><span className="stat-val">Menengah - Pro</span></div>
                  <div><span className="stat-label">Jadwal Rutin</span><span className="stat-val">Rabu & Jumat</span></div>
                  <div><span className="stat-label">Iuran</span><span className="stat-val">Rp 75K / bln</span></div>
                </div>
                <div className="klub-actions">
                  <button className="btn btn-outline">Join Komunitas</button>
                  <button className="btn btn-outline">Mabar Bareng</button>
                </div>
              </div>
            </div>
            <div className="klub-card">
              <img src="/asset/card-komunitas3.png" className="klub-img" alt="Klub 3" />
              <div className="klub-info">
                <div className="klub-header">
                  <div>
                    <h3>Badminton Lovers Sidoarjo</h3>
                    <p>Sidoarjo</p>
                  </div>
                  <div className="text-highlight"><i className="fa-solid fa-users"></i> 210</div>
                </div>
                <div className="klub-stats">
                  <div><span className="stat-label">Level</span><span className="stat-val">Pemula - Menengah</span></div>
                  <div><span className="stat-label">Jadwal Rutin</span><span className="stat-val">Minggu Pagi</span></div>
                  <div><span className="stat-label">Iuran</span><span className="stat-val">Patungan Harian</span></div>
                </div>
                <div className="klub-actions">
                  <button className="btn btn-outline">Join Komunitas</button>
                  <button className="btn btn-outline">Mabar Bareng</button>
                </div>
              </div>
            </div>
            <div className="klub-card">
              <img src="/asset/card-komunitas4.png" className="klub-img" alt="Klub 4" />
              <div className="klub-info">
                <div className="klub-header">
                  <div>
                    <h3>Kok Terbang Club</h3>
                    <p>Kota Malang</p>
                  </div>
                  <div className="text-highlight"><i className="fa-solid fa-users"></i> 45</div>
                </div>
                <div className="klub-stats">
                  <div><span className="stat-label">Level</span><span className="stat-val">Campuran</span></div>
                  <div><span className="stat-label">Jadwal Rutin</span><span className="stat-val">Selasa Malam</span></div>
                  <div><span className="stat-label">Iuran</span><span className="stat-val">Rp 40K / bln</span></div>
                </div>
                <div className="klub-actions">
                  <button className="btn btn-outline">Join Komunitas</button>
                  <button className="btn btn-outline">Mabar Bareng</button>
                </div>
              </div>
            </div>
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
            <div className="feed-card">
              <img src="/asset/card-artikel1.png" className="feed-img" alt="Artikel 1" />
              <div className="feed-info">
                <h3 className="feed-title">Tips Grip Raket yang Benar</h3>
                <p className="feed-desc">Genggaman raket sangat menentukan kekuatan pukulan smash dan backhand kamu. Simak teknik dasar memegang raket ala atlet pro.</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> Coach Hendra</span>
                  <span>2 Hari yang lalu</span>
                </div>
              </div>
            </div>
            <div className="feed-card">
              <img src="/asset/card-artikel2.png" className="feed-img" alt="Artikel 2" />
              <div className="feed-info">
                <h3 className="feed-title">Review Sepatu Badminton 2026</h3>
                <p className="feed-desc">Mencari sepatu yang ringan namun empuk di pergelangan kaki? Berikut adalah komparasi top 5 sepatu badminton rilis terbaru.</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> Budi Santoso</span>
                  <span>4 Hari yang lalu</span>
                </div>
              </div>
            </div>
            <div className="feed-card">
              <img src="/asset/card-artikel3.png" className="feed-img" alt="Artikel 3" />
              <div className="feed-info">
                <h3 className="feed-title">Aturan Poin Baru BWF</h3>
                <p className="feed-desc">BWF merilis wacana sistem poin 5x11 menggantikan 3x21. Bagaimana pengaruhnya terhadap stamina pemain dan durasi laga?</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> Minton News</span>
                  <span>1 Minggu yang lalu</span>
                </div>
              </div>
            </div>
            <div className="feed-card">
              <img src="/asset/card-artikel4.png" className="feed-img" alt="Artikel 4" />
              <div className="feed-info">
                <h3 className="feed-title">Turnamen Tarkam Surabaya</h3>
                <p className="feed-desc">Persiapkan tim kamu! Turnamen tahunan antar kecamatan se-Surabaya kembali digelar bulan depan. Daftarkan tim di GOR terdekat.</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> PBSI Surabaya</span>
                  <span>2 Minggu yang lalu</span>
                </div>
              </div>
            </div>
            <div className="feed-card">
              <img src="/asset/card-artikel5.png" className="feed-img" alt="Artikel 5" />
              <div className="feed-info">
                <h3 className="feed-title">Pemanasan Wajib Sebelum Main</h3>
                <p className="feed-desc">Jangan anggap remeh cedera engkel dan lutut. Berikut 5 gerakan dinamis untuk memanaskan otot bagian bawah sebelum turun lapang.</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> Dr. Andi Sport</span>
                  <span>3 Minggu yang lalu</span>
                </div>
              </div>
            </div>
            <div className="feed-card">
              <img src="/asset/card-artikel6.png" className="feed-img" alt="Artikel 6" />
              <div className="feed-info">
                <h3 className="feed-title">Mitos vs Fakta Senar Raket</h3>
                <p className="feed-desc">Apakah tarikan senar yang lebih kencang selalu berarti smash lebih kuat? Mari bedah fisika di balik pantulan senar raket badminton.</p>
                <div className="feed-footer">
                  <span><i className="fa-regular fa-user"></i> Stringer Pro ID</span>
                  <span>1 Bulan yang lalu</span>
                </div>
              </div>
            </div>
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

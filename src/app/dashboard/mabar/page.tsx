'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getMatches, getMyMatches, createMatchAction, joinMatchAction } from './actions';

interface MabarSession {
  id: number;
  venue: string;
  location: string;
  level: string;
  date: string;
  time: string;
  gender: string;
  host: string;
  slots: number;
  total: number;
  price: string;
  img: string;
}

export default function MabarDashboardPage() {
  const [tab, setTab] = useState(0);
  const [sessions, setSessions] = useState<MabarSession[]>([]);
  const [mySessions, setMySessions] = useState<MabarSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Main Bareng - Minton';
    loadData();
  }, []);

  useEffect(() => {
    if (tab === 1) loadMySessions();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    const data = await getMatches();
    setSessions(data);
    setLoading(false);
  }

  async function loadMySessions() {
    setLoading(true);
    const data = await getMyMatches();
    setMySessions(data);
    setLoading(false);
  }

  const openCreateModal = () => {
    setShowCreateModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    document.body.style.overflow = 'auto';
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await createMatchAction(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert('Mabar berhasil dipublikasikan!');
      closeCreateModal();
      loadData();
      loadMySessions();
    }
  }

  async function handleJoin(matchId: number) {
    setActionLoading(matchId);
    const result = await joinMatchAction(matchId);
    if (result.error) {
      alert(result.error);
    } else {
      loadData();
    }
    setActionLoading(null);
  }

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Main Bareng</h1>
        <div className="header-actions">
          <button className="btn-primary-dash" onClick={openCreateModal}><i className="fa-solid fa-plus"></i> Buat Mabar</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .mabar-tabs { display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1px solid #333; }
          .mabar-tabs .tab-item { padding: 12px 4px; color: #aaa; font-size: 14px; font-weight: 600; cursor: pointer; position: relative; }
          .mabar-tabs .tab-item.active { color: var(--primary-lime); }
          .mabar-tabs .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary-lime); }
          .mabar-dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
          .mabar-dash-card { background: var(--card-bg, #1d1d1d); border: 1px solid #333; border-radius: 16px; transition: 0.3s; display: flex; flex-direction: column; overflow: hidden; }
          .mabar-dash-card:hover { border-color: var(--primary-lime); transform: translateY(-4px); }
          .mabar-card-img { width: 100%; height: 180px; object-fit: cover; }
          .mabar-dash-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
          .mabar-header-info { display: flex; justify-content: space-between; align-items: flex-start; }
          .mabar-venue h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
          .mabar-venue p { font-size: 12px; color: #aaa; }
          .level-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(189,209,36,0.1); color: var(--primary-lime); }
          .mabar-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; }
          .detail-item-small { display: flex; flex-direction: column; gap: 4px; }
          .detail-item-small span:first-child { font-size: 10px; color: #666; text-transform: uppercase; }
          .detail-item-small span:last-child { font-size: 13px; font-weight: 600; }
          .mabar-footer-dash { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid #333; }
          .slot-pill { font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 6px; }
          .slot-pill i { color: var(--primary-lime); }
          .price-text { font-size: 15px; font-weight: 700; }
          .modal-overlay-mabar { position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s ease; }
          .modal-content-mabar { background: #121212; border: 1px solid #333; width: 90%; max-width: 600px; border-radius: 24px; padding: 32px; animation: slideUp 0.3s ease; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .modal-header-mabar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .modal-header-mabar h3 { font-size: 24px; font-weight: 700; color: #fff; }
          .close-modal-mabar { background: none; border: none; color: #666; font-size: 28px; cursor: pointer; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
          .form-group label { display: block; color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
          .form-group input, .form-group select, .form-group textarea { width: 100%; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 12px; font-family: inherit; outline: none; }
          .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary-lime); box-shadow: 0 0 0 4px rgba(189,209,36,0.1); background: #1f1f1f; }
          .btn-modal-primary { padding: 14px; border-radius: 12px; border: none; background: var(--primary-lime); color: #000; font-weight: 700; cursor: pointer; transition: 0.3s; }
          .btn-modal-primary:hover { background: #bce025; box-shadow: 0 0 20px rgba(189,209,36,0.4); transform: translateY(-2px); }
          .btn-modal-cancel { padding: 14px; border-radius: 12px; border: 1px solid #333; background: transparent; color: #fff; font-weight: 600; cursor: pointer; transition: 0.3s; }
          .btn-modal-cancel:hover { background: #ff4444; border-color: #ff4444; color: #fff; }
          @media (max-width: 768px) { .mabar-dash-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
        `}</style>

        <div className="mabar-tabs">
          {['Eksplorasi Sesi', 'Mabar Saya', 'Permintaan'].map((t, i) => (
            <div key={i} className={`tab-item ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--primary-lime)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#aaa' }}>Memuat sesi...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="mabar-dash-grid">
            {(tab === 0 ? sessions : tab === 1 ? mySessions : []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)', gridColumn: '1 / -1' }}>
                <p style={{ marginBottom: 12 }}>{tab === 0 ? 'Belum ada sesi mabar tersedia.' : tab === 1 ? 'Kamu belum membuat sesi mabar.' : 'Belum ada permintaan masuk.'}</p>
                {tab === 1 && <button className="btn-primary-dash" onClick={openCreateModal}><i className="fa-solid fa-plus"></i> Buat Mabar</button>}
              </div>
            ) : (
              (tab === 0 ? sessions : mySessions).map(s => (
                <div key={s.id} className="mabar-dash-card">
                  <img src={s.img} alt={s.venue} className="mabar-card-img" />
                  <div className="mabar-dash-body">
                    <div className="mabar-header-info">
                      <div className="mabar-venue">
                        <h4>{s.venue}</h4>
                        <p><i className="fa-solid fa-location-dot"></i> {s.location}</p>
                      </div>
                      <span className="level-badge">{s.level}</span>
                    </div>
                    <div className="mabar-details">
                      <div className="detail-item-small">
                        <span>Waktu</span>
                        <span>{s.time}</span>
                      </div>
                      <div className="detail-item-small">
                        <span>Tanggal</span>
                        <span>{s.date}</span>
                      </div>
                      <div className="detail-item-small">
                        <span>Gender</span>
                        <span>{s.gender}</span>
                      </div>
                      <div className="detail-item-small">
                        <span>Host</span>
                        <span>{s.host}</span>
                      </div>
                    </div>
                    <div className="mabar-footer-dash">
                      <div className="slot-pill"><i className="fa-solid fa-user-group"></i> {s.slots}/{s.total} Tersedia</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="price-text">{s.price}</div>
                        {tab !== 1 && (
                          <button className="btn-primary-dash" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => handleJoin(s.id)} disabled={actionLoading === s.id || s.slots === 0}>
                            {actionLoading === s.id ? '...' : s.slots === 0 ? 'Penuh' : 'Gabung'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay-mabar" onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal(); }}>
          <div className="modal-content-mabar">
            <div className="modal-header-mabar">
              <h3>Buat Jadwal <span style={{ color: 'var(--primary-lime)' }}>Mabar.</span></h3>
              <button className="close-modal-mabar" onClick={closeCreateModal}>&times;</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Venue</label>
                  <input type="text" name="venueName" placeholder="Contoh: GOR Sudirman" required />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select name="skillLevel" required>
                    <option value="All Level">All Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="date" name="date" required />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input type="text" name="time" placeholder="19:00 - 21:00" required />
                </div>
                <div className="form-group">
                  <label>Maks Pemain</label>
                  <input type="number" name="totalSlots" placeholder="8" required />
                </div>
                <div className="form-group">
                  <label>Biaya / Orang</label>
                  <input type="text" name="price" placeholder="Contoh: 30.000 atau Free" required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-modal-cancel" style={{ flex: 1 }} onClick={closeCreateModal}>Batal</button>
                <button type="submit" className="btn-modal-primary" style={{ flex: 2 }}>Publikasikan Mabar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardSidebar>
  );
}

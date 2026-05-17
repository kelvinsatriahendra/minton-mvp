
'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getTournaments, registerTournament, getMyRegistrations } from './actions';

interface Tournament {
  id: string; badge: string; title: string; description: string; image_url: string;
  date: string; location: string; category: string; price: string;
  max_participants: number; slots_filled: number; is_open: boolean;
}

export default function TurnamenPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myRegs, setMyRegs] = useState<Set<string>>(new Set());
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [regModal, setRegModal] = useState<Tournament | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState('');

  useEffect(() => { document.title = 'Turnamen - Minton'; }, []);

  useEffect(() => {
    (async () => {
      const data = await getTournaments();
      setTournaments(data);
      const email = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
      setUserEmail(email);
      if (email) {
        const regs = await getMyRegistrations(email);
        setMyRegs(new Set(regs.map((r: any) => r.tournament_id)));
      }
      setLoading(false);
    })();
  }, []);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!regModal) return;
    setRegLoading(true);
    setRegMsg('');

    const result = await registerTournament(regModal.id, new FormData(e.currentTarget));
    if (result.error) {
      setRegMsg(result.error);
    } else {
      setRegMsg('Berhasil mendaftar!');
      setMyRegs((prev) => new Set(prev).add(regModal.id));
      setTournaments((prev) =>
        prev.map((t) =>
          t.id === regModal.id ? { ...t, slots_filled: t.slots_filled + 1 } : t
        )
      );
      setTimeout(() => setRegModal(null), 1500);
    }
    setRegLoading(false);
  }

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Turnamen</h1>
        <div className="header-actions">
          <button className="btn-secondary-dash"><i className="fa-solid fa-filter"></i> Filter</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .tournament-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
          .tournament-card { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; overflow: hidden; transition: 0.3s; }
          .tournament-card:hover { transform: translateY(-8px); border-color: var(--primary-lime); }
          .tournament-card img { width: 100%; height: 180px; object-fit: cover; }
          .tournament-body { padding: 20px; }
          .tournament-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; background: rgba(189,209,36,0.1); color: var(--primary-lime); }
          .tournament-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
          .tournament-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
          .tournament-info .info-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaa; }
          .tournament-info .info-item i { width: 16px; color: var(--primary-lime); }
          .tournament-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #333; }
          .tournament-footer .price { font-size: 16px; font-weight: 700; }
          .slot-bar { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; color: #aaa; }
          .slot-bar-inner { flex: 1; height: 6px; background: #2a2a2a; border-radius: 4px; overflow: hidden; }
          .slot-bar-fill { height: 100%; background: var(--primary-lime); border-radius: 4px; transition: width 0.3s; }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
          .modal-content { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 420px; }
          .modal-content h3 { margin-bottom: 20px; font-size: 20px; }
          .modal-content .form-group { margin-bottom: 16px; }
          .modal-content label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
          .modal-content input { width: 100%; padding: 10px 14px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; outline: none; }
          .modal-content input:focus { border-color: var(--primary-lime); }
          .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
          .msg { font-size: 13px; margin-top: 12px; }
          .msg.error { color: #ff5252; }
          .msg.success { color: var(--primary-lime); }
        `}</style>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Turnamen <span style={{ color: 'var(--primary-lime)' }}>Mendatang</span></h2>
          <p style={{ color: '#aaa' }}>Daftarkan tim Anda dan menangkan hadiah jutaan rupiah!</p>
        </div>

        {loading ? (
          <p style={{ color: '#aaa' }}>Memuat...</p>
        ) : (
          <div className="tournament-grid">
            {tournaments.map((t) => {
              const isFull = t.slots_filled >= t.max_participants;
              const isRegistered = myRegs.has(t.id);
              const pct = Math.round((t.slots_filled / t.max_participants) * 100);
              const canRegister = !isFull && !isRegistered && t.is_open;
              return (
                <div key={t.id} className="tournament-card">
                  <img src={t.image_url} alt={t.title} />
                  <div className="tournament-body">
                    <span className="tournament-badge">{t.badge}</span>
                    <h3>{t.title}</h3>
                    <div className="tournament-info">
                      <div className="info-item"><i className="fa-solid fa-calendar"></i> {t.date}</div>
                      <div className="info-item"><i className="fa-solid fa-location-dot"></i> {t.location}</div>
                      <div className="info-item"><i className="fa-solid fa-users"></i> {t.category}</div>
                    </div>
                    <div className="slot-bar">
                      <span>{t.slots_filled}/{t.max_participants} peserta</span>
                      <div className="slot-bar-inner">
                        <div className="slot-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                    <div className="tournament-footer">
                      <div className="price">{t.price}</div>
                      {isRegistered ? (
                        <button className="btn-secondary-dash" style={{ padding: '8px 16px', color: 'var(--primary-lime)', borderColor: 'var(--primary-lime)', cursor: 'default' }}><i className="fa-solid fa-check"></i> Terdaftar</button>
                      ) : isFull ? (
                        <button className="btn-secondary-dash" style={{ padding: '8px 16px', color: '#aaa', borderColor: '#444', cursor: 'not-allowed' }}>Penuh</button>
                      ) : !userEmail ? (
                        <button className="btn-secondary-dash" style={{ padding: '8px 16px' }} onClick={() => window.location.href = '/login'}>Login</button>
                      ) : (
                        <button className="btn-primary-dash" style={{ padding: '8px 16px' }} onClick={() => setRegModal(t)}>Daftar</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {regModal && (
          <div className="modal-overlay" onClick={() => setRegModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Daftar {regModal.title}</h3>
              <form onSubmit={handleRegister}>
                <input type="hidden" name="tournamentId" value={regModal.id} />
                <div className="form-group">
                  <label>Nama Tim (opsional)</label>
                  <input name="teamName" placeholder="Misal: PB Garuda" />
                </div>
                <div className="form-group">
                  <label>Nomor WhatsApp (opsional)</label>
                  <input name="whatsapp" placeholder="08xxxxxxxxx" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setRegModal(null)}>Batal</button>
                  <button type="submit" className="btn-primary-dash" style={{ flex: 1 }} disabled={regLoading}>
                    {regLoading ? 'Memproses...' : 'Konfirmasi'}
                  </button>
                </div>
                {regMsg && (
                  <div className={`msg ${regMsg.includes('Berhasil') ? 'success' : 'error'}`}>{regMsg}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardSidebar>
  );
}

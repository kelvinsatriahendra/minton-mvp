"use client";

import { useEffect, useState } from 'react';
import MitraSidebar from "@/components/MitraSidebar";
import { getServices, toggleService, addService } from './actions';

interface Service {
  id: string; name: string; description: string; icon: string; is_active: boolean;
}

const ICON_OPTIONS = [
  { value: 'fa-solid fa-socks', label: 'Sepatu' },
  { value: 'fa-solid fa-bottle-water', label: 'Minuman' },
  { value: 'fa-solid fa-screwdriver-wrench', label: 'Perbaikan' },
  { value: 'fa-solid fa-shower', label: 'Shower' },
  { value: 'fa-solid fa-shuttle-space', label: 'Raket & Kok' },
  { value: 'fa-solid fa-car', label: 'Parkir' },
  { value: 'fa-solid fa-wifi', label: 'WiFi' },
  { value: 'fa-solid fa-music', label: 'Musik' },
  { value: 'fa-solid fa-fan', label: 'AC/Kipas' },
  { value: 'fa-solid fa-kitchen-set', label: 'Kantin' },
  { value: 'fa-solid fa-dumbbell', label: 'Fitness' },
  { value: 'fa-solid fa-circle', label: 'Lainnya' },
];

export default function LayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => { document.title = 'Layanan Tambahan - Minton'; }, []);

  function load() {
    setLoading(true);
    getServices().then((data) => { setServices(data); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function handleToggle(s: Service) {
    setToggling(s.id);
    const result = await toggleService(s.id, !s.is_active);
    if (result.success) {
      setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, is_active: !x.is_active } : x));
    }
    setToggling(null);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await addService(new FormData(e.currentTarget));
    if (result.error) {
      setMsg(result.error); setMsgType('error');
    } else {
      setMsg('Layanan berhasil ditambahkan!'); setMsgType('success');
      load();
      setTimeout(() => { setShowAdd(false); setMsg(''); }, 1200);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Service" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Layanan Tambahan</h1>
          <div className="mitra-header-actions">
            <button className="btn-primary-dash" onClick={() => { setShowAdd(true); setMsg(''); }}><i className="fa-solid fa-plus"></i> Tambah Layanan</button>
          </div>
        </header>
        <div className="mitra-body">
          {loading ? (
            <p style={{ color: '#aaa' }}>Memuat...</p>
          ) : services.length === 0 ? (
            <p style={{ color: '#555' }}>Belum ada layanan tambahan. Klik "Tambah Layanan" untuk mulai.</p>
          ) : (
            <div className="services-grid">
              {services.map((s) => (
                <div key={s.id} className="service-card">
                  <div className="service-icon"><i className={s.icon}></i></div>
                  <div>
                    <p className="service-name">{s.name}</p>
                    <p className="service-desc">{s.description}</p>
                  </div>
                  <button
                    className={`btn-toggle ${s.is_active ? "on" : ""}`}
                    onClick={() => handleToggle(s)}
                    disabled={toggling === s.id}
                  >
                    <i className={`fa-solid ${s.is_active ? "fa-circle-check" : "fa-circle-xmark"}`}></i>{' '}
                    {toggling === s.id ? 'Memproses...' : s.is_active ? 'Aktif' : 'Non-Aktif'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAdd && (
          <div className="modal-overlay" onClick={() => setShowAdd(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Tambah Layanan Baru</h3>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Nama Layanan</label>
                  <input name="name" placeholder="Contoh: Sewa Raket" required />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea name="description" placeholder="Deskripsi layanan..." rows={3} style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}></textarea>
                </div>
                <div className="form-group">
                  <label>Ikon</label>
                  <select name="icon" style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                    {ICON_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Batal</button>
                  <button type="submit" className="btn-primary-dash" style={{ flex: 1 }}>Simpan</button>
                </div>
                {msg && <div className={`msg ${msgType}`}>{msg}</div>}
              </form>
            </div>
          </div>
        )}

        <style>{`
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
          .modal-content { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 420px; }
          .modal-content h3 { margin-bottom: 20px; font-size: 20px; margin-top: 0; }
          .modal-content .form-group { margin-bottom: 16px; }
          .modal-content label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
          .modal-content input { width: 100%; padding: 10px 14px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; }
          .modal-content input:focus { border-color: var(--primary-lime); }
          .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
          .msg { font-size: 13px; margin-top: 12px; padding: 8px 12px; border-radius: 6px; }
          .msg.error { color: #ff5252; background: rgba(244,67,54,0.1); }
          .msg.success { color: var(--primary-lime); background: rgba(189,209,36,0.1); }
          .btn-toggle:disabled { opacity: 0.5; cursor: wait; }
        `}</style>
      </main>
    </div>
  );
}

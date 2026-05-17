"use client";

import { useEffect, useState } from 'react';
import MitraSidebar from "@/components/MitraSidebar";
import { getSlots, toggleSlot, addSlot, closeAllSlots } from './actions';

interface BookingInfo {
  booking_id: string; user_email: string; status: string; date: string; time: string; court: string;
}

interface Slot {
  id: string; partner_id: number; court: string; start_time: string; end_time: string;
  price: number; is_open: boolean; status: string; booking: BookingInfo | null;
}

export default function JadwalPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [activeCourt, setActiveCourt] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [detailSlot, setDetailSlot] = useState<Slot | null>(null);

  useEffect(() => { document.title = 'Jadwal Lapangan - Minton'; }, []);

  function load(court?: string) {
    setLoading(true);
    getSlots(court || activeCourt).then((result) => {
      setSlots(result.slots);
      if (!court) setCourts(result.courts);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  function switchCourt(court: string) {
    setActiveCourt(court);
    load(court);
  }

  async function handleToggle(s: Slot) {
    setToggling(s.id);
    const result = await toggleSlot(s.id, !s.is_open);
    if (result.success) {
      setSlots((prev) => prev.map((x) => x.id === s.id ? { ...x, is_open: !x.is_open, status: x.is_open ? 'closed' : 'open' } : x));
    }
    setToggling(null);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await addSlot(new FormData(e.currentTarget));
    if (result.error) {
      setMsg(result.error); setMsgType('error');
    } else {
      setMsg('Sesi berhasil ditambahkan!'); setMsgType('success');
      load();
      setTimeout(() => { setShowAdd(false); setMsg(''); }, 1200);
    }
  }

  async function handleCloseAll() {
    const anyOpen = slots.some((s) => s.is_open);
    const result = await closeAllSlots(anyOpen);
    if (result.success) load();
  }

  const priceFormat = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  function getBadge(s: Slot) {
    if (s.booking) return { cls: 'badge-booked', text: 'Booked' };
    if (!s.is_open) return { cls: 'badge-closed', text: 'Closed' };
    return { cls: 'badge-open', text: 'Open' };
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Schedule" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Atur Jadwal Lapangan</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash" onClick={handleCloseAll}>
              {slots.some((s) => s.is_open) ? 'Tutup Semua Sesi' : 'Buka Semua Sesi'}
            </button>
            <button className="btn-primary-dash" onClick={() => { setShowAdd(true); setMsg(''); }}><i className="fa-solid fa-plus"></i> Tambah Sesi</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="content-card">
            <div className="court-pills">
              <button className={`court-pill ${!activeCourt ? 'active' : ''}`} onClick={() => switchCourt('')}>Semua Lapangan</button>
              {courts.map((c) => (
                <button key={c} className={`court-pill ${activeCourt === c ? 'active' : ''}`} onClick={() => switchCourt(c)}>{c}</button>
              ))}
            </div>
            {loading ? (
              <p style={{ color: '#aaa', padding: '24px' }}>Memuat...</p>
            ) : slots.length === 0 ? (
              <p style={{ color: '#555', padding: '24px' }}>Belum ada sesi jadwal. Klik "Tambah Sesi" untuk mulai.</p>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Lapangan</th>
                    <th>Waktu Sesi</th>
                    <th>Status</th>
                    <th>Harga / Jam</th>
                    <th>Pemesan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => {
                    const badge = getBadge(s);
                    return (
                      <tr key={s.id}>
                        <td style={{ color: '#888' }}>{s.court}</td>
                        <td>{s.start_time} – {s.end_time}</td>
                        <td><span className={`badge ${badge.cls}`}>{badge.text}</span></td>
                        <td>{priceFormat(s.price)}</td>
                        <td style={{ color: s.booking ? undefined : '#aaaaaa' }}>
                          {s.booking?.user_email || '—'}
                        </td>
                        <td>
                          {s.booking ? (
                            <button className="btn-action-sm" onClick={() => setDetailSlot(s)}>Lihat Detail</button>
                          ) : (
                            <button
                              className="btn-action-sm"
                              onClick={() => handleToggle(s)}
                              disabled={toggling === s.id}
                            >
                              {toggling === s.id ? '...' : s.is_open ? 'Tutup Sesi' : 'Buka Sesi'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showAdd && (
          <div className="modal-overlay" onClick={() => setShowAdd(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Tambah Sesi Baru</h3>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Lapangan</label>
                  <select name="court" className="form-select-dash">
                    {courts.length > 0 ? courts.map((c) => <option key={c} value={c}>{c}</option>) : <option value="Lapangan 1">Lapangan 1</option>}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Jam Mulai</label>
                    <input name="startTime" type="time" defaultValue="08:00" required className="form-input-dash" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Jam Selesai</label>
                    <input name="endTime" type="time" defaultValue="09:00" required className="form-input-dash" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input name="price" type="number" defaultValue={45000} className="form-input-dash" />
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

        {detailSlot && (
          <div className="modal-overlay" onClick={() => setDetailSlot(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Detail Booking</h3>
              {detailSlot.booking && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div><span style={{ color: '#aaa' }}>Booking ID</span><br/>{detailSlot.booking.booking_id}</div>
                  <div><span style={{ color: '#aaa' }}>Pemesan</span><br/>{detailSlot.booking.user_email}</div>
                  <div><span style={{ color: '#aaa' }}>Tanggal</span><br/>{detailSlot.booking.date}</div>
                  <div><span style={{ color: '#aaa' }}>Jam</span><br/>{detailSlot.booking.time}</div>
                  <div><span style={{ color: '#aaa' }}>Lapangan</span><br/>{detailSlot.booking.court}</div>
                  <div><span style={{ color: '#aaa' }}>Status</span><br/><span className="badge" style={{ background: detailSlot.booking.status === 'Terkonfirmasi' ? 'rgba(189,209,36,0.12)' : 'rgba(255,193,7,0.1)', color: detailSlot.booking.status === 'Terkonfirmasi' ? 'var(--primary-lime)' : '#ffc107' }}>{detailSlot.booking.status}</span></div>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setDetailSlot(null)}>Tutup</button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
          .modal-content { background: #1d1d1d; border: 1px solid #333; border-radius: 16px; padding: 32px; width: 90%; max-width: 420px; }
          .modal-content h3 { margin-bottom: 20px; font-size: 20px; margin-top: 0; }
          .modal-content .form-group { margin-bottom: 16px; }
          .modal-content label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
          .modal-content input, .form-input-dash { width: 100%; padding: 10px 14px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; font-family: inherit; }
          .modal-content input:focus, .form-input-dash:focus { border-color: var(--primary-lime); }
          .form-select-dash { width: 100%; padding: 10px 14px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; outline: none; font-family: inherit; }
          .form-row { display: flex; gap: 12px; }
          .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
          .msg { font-size: 13px; margin-top: 12px; padding: 8px 12px; border-radius: 6px; }
          .msg.error { color: #ff5252; background: rgba(244,67,54,0.1); }
          .msg.success { color: var(--primary-lime); background: rgba(189,209,36,0.1); }
          .btn-action-sm:disabled { opacity: 0.5; cursor: wait; }
        `}</style>
      </main>
    </div>
  );
}

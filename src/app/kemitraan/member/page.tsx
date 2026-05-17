"use client";

import { useEffect, useState } from 'react';
import MitraSidebar from "@/components/MitraSidebar";
import { getMembers, addMember, getMemberDetail } from './actions';

interface Member {
  id: string; name: string; email: string; phone: string; status: string;
  avatar: string; total_bookings: number; last_play: string;
  badge: string; joined_at: string;
}

interface BookingDetail {
  id: number; booking_id: string; date: string; time: string; court: string;
  venue: string; price: string; status: string; created_at: string;
}

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [detailBookings, setDetailBookings] = useState<BookingDetail[]>([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => { document.title = 'Manajemen Member - Minton'; }, []);

  function loadMembers(s?: string) {
    getMembers(s || search).then(setMembers);
  }

  useEffect(() => { loadMembers(); }, []);

  function handleSearch() { loadMembers(search); }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await addMember(new FormData(e.currentTarget));
    if (result.error) {
      setMsg(result.error);
      setMsgType('error');
    } else {
      setMsg('Member berhasil ditambahkan!');
      setMsgType('success');
      loadMembers();
      setTimeout(() => { setShowAddModal(false); setMsg(''); }, 1200);
    }
  }

  async function handleDetail(m: Member) {
    setSelectedMember(m);
    const result = await getMemberDetail(m.email);
    setDetailBookings(result.bookings);
    setShowDetailModal(true);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Members" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Manajemen Member</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash"><i className="fa-solid fa-file-export"></i> Ekspor</button>
            <button className="btn-primary-dash" onClick={() => { setShowAddModal(true); setMsg(''); }}><i className="fa-solid fa-plus"></i> Tambah Member</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="content-card">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass" style={{ cursor: 'pointer' }} onClick={handleSearch}></i>
              <input
                type="text"
                placeholder="Cari nama, email, atau nomor HP member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Status</th>
                  <th>Bergabung Sejak</th>
                  <th>Terakhir Main</th>
                  <th>Total Booking</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>Belum ada member</td></tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="member-info">
                          <div className="member-avatar-sm">{m.avatar}</div>
                          <div>
                            <p className="member-name">{m.name}</p>
                            <p style={{ fontSize: 12, color: '#888' }}>{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${m.badge}`}>{m.status}</span></td>
                      <td>{new Date(m.joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</td>
                      <td>{m.last_play}</td>
                      <td>{m.total_bookings} kali</td>
                      <td><button className="btn-action-sm" onClick={() => handleDetail(m)}>Detail</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Tambah Member Baru</h3>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input name="name" placeholder="Nama member" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="member@email.com" required />
                </div>
                <div className="form-group">
                  <label>Nomor WhatsApp</label>
                  <input name="phone" placeholder="08xxxxxxxxx" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                    <option value="Reguler">Reguler</option>
                    <option value="PRO Member">PRO Member</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Batal</button>
                  <button type="submit" className="btn-primary-dash" style={{ flex: 1 }}>Simpan</button>
                </div>
                {msg && <div className={`msg ${msgType}`}>{msg}</div>}
              </form>
            </div>
          </div>
        )}

        {showDetailModal && selectedMember && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#000' }}>{selectedMember.avatar}</div>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedMember.name}</h3>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>{selectedMember.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div className="stat-mini"><span className="stat-label">Status</span><span className="stat-val">{selectedMember.status}</span></div>
                <div className="stat-mini"><span className="stat-label">Total Booking</span><span className="stat-val">{selectedMember.total_bookings}x</span></div>
                <div className="stat-mini"><span className="stat-label">Terakhir Main</span><span className="stat-val">{selectedMember.last_play}</span></div>
              </div>
              <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#aaa' }}>Riwayat Booking</h4>
              {detailBookings.length === 0 ? (
                <p style={{ color: '#555', fontSize: '13px' }}>Belum ada riwayat booking</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {detailBookings.map((b) => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a', fontSize: '13px' }}>
                      <div>
                        <div style={{ color: '#fff' }}>{b.date} • {b.time}</div>
                        <div style={{ color: '#888' }}>{b.court}</div>
                      </div>
                      <span style={{ color: b.status === 'Terkonfirmasi' ? 'var(--primary-lime)' : '#ffc107', fontSize: '12px', whiteSpace: 'nowrap' }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setShowDetailModal(false)}>Tutup</button>
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
          .modal-content input { width: 100%; padding: 10px 14px; background: #111; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; }
          .modal-content input:focus { border-color: var(--primary-lime); }
          .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
          .msg { font-size: 13px; margin-top: 12px; padding: 8px 12px; border-radius: 6px; }
          .msg.error { color: #ff5252; background: rgba(244,67,54,0.1); }
          .msg.success { color: var(--primary-lime); background: rgba(189,209,36,0.1); }
          .stat-mini { background: #111; border-radius: 8px; padding: 12px 16px; min-width: 100px; flex: 1; }
          .stat-mini .stat-label { display: block; font-size: 11px; color: #888; margin-bottom: 4px; }
          .stat-mini .stat-val { font-size: 16px; font-weight: 700; }
        `}</style>
      </main>
    </div>
  );
}

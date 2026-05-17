"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MitraSidebar from "@/components/MitraSidebar";
import { getSettings, saveSettings, deleteAccount } from './actions';

interface Settings {
  id: number; gor_name: string; owner_name: string; email: string;
  phone: string; address: string; city: string; maps_url: string;
  open_time: string; close_time: string; price_day: number; price_night: number;
  payment_method: string;
}

export default function PengaturanPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => { document.title = 'Pengaturan GOR - Minton'; }, []);

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data as Settings);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const result = await saveSettings(new FormData(e.currentTarget));
    if (result.error) {
      setMsg(result.error); setMsgType('error');
    } else {
      setMsg('Pengaturan berhasil disimpan!'); setMsgType('success');
    }
    setSaving(false);
  }

  function handleReset() {
    setMsg('');
    getSettings().then((data) => setSettings(data as Settings));
  }

  async function handleDelete() {
    if (!confirm('Yakin ingin menghapus akun mitra? Semua data akan hilang permanen.')) return;
    const result = await deleteAccount();
    if (result.success) {
      router.push('/kemitraan');
    } else {
      setMsg(result.error || 'Gagal menghapus akun'); setMsgType('error');
    }
  }

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Settings" />
      <main className="mitra-main"><div className="mitra-body"><p style={{ color: '#aaa' }}>Memuat...</p></div></main>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Settings" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Pengaturan GOR</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash" onClick={handleReset}>Batalkan</button>
            <button className="btn-primary-dash" form="settings-form" disabled={saving}>
              <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </header>
        <div className="mitra-body">
          <form id="settings-form" onSubmit={handleSave}>
            <div className="content-card">
              <p className="content-card-title">Informasi Dasar GOR</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nama GOR</label>
                  <input className="form-input" name="gor_name" type="text" defaultValue={settings?.gor_name || ''} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp Bisnis</label>
                  <input className="form-input" name="phone" type="tel" defaultValue={settings?.phone || ''} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Bisnis</label>
                  <input className="form-input" name="email" type="email" defaultValue={settings?.email || ''} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Kota / Kabupaten</label>
                  <input className="form-input" name="city" type="text" defaultValue={settings?.city || ''} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Alamat Lengkap</label>
                <textarea className="form-textarea" name="address" rows={3} defaultValue={settings?.address || ''}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Link Google Maps (Opsional)</label>
                <input className="form-input" name="maps_url" type="url" defaultValue={settings?.maps_url || ''} placeholder="https://maps.google.com/..." />
              </div>
            </div>

            <div className="content-card">
              <p className="content-card-title">Jam Operasional</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Jam Buka</label>
                  <input className="form-input" name="open_time" type="time" defaultValue={settings?.open_time || '08:00'} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jam Tutup</label>
                  <input className="form-input" name="close_time" type="time" defaultValue={settings?.close_time || '23:00'} />
                </div>
              </div>
            </div>

            <div className="content-card">
              <p className="content-card-title">Pengaturan Harga</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Harga / Jam (Pagi & Sore)</label>
                  <input className="form-input" name="price_day" type="number" defaultValue={settings?.price_day || 35000} />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga / Jam (Malam / Lampu Menyala)</label>
                  <input className="form-input" name="price_night" type="number" defaultValue={settings?.price_night || 50000} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Metode Pembayaran yang Diterima</label>
                <select className="form-select" name="payment_method" defaultValue={settings?.payment_method || 'Semua Metode (Transfer, E-Wallet, Tunai)'}>
                  <option>Semua Metode (Transfer, E-Wallet, Tunai)</option>
                  <option>Transfer Bank & E-Wallet</option>
                  <option>Tunai Saja</option>
                </select>
              </div>
            </div>
          </form>

          {msg && (
            <div className={`settings-msg ${msgType}`} style={{ marginBottom: '16px' }}>{msg}</div>
          )}

          <div className="content-card" style={{ borderColor: "rgba(244, 67, 54, 0.3)" }}>
            <p className="content-card-title" style={{ color: "#f44336" }}>Zona Berbahaya</p>
            <p style={{ fontSize: "14px", color: "#aaaaaa", marginBottom: "16px" }}>Menghapus akun mitra akan menghapus semua data GOR Anda secara permanen dan tidak dapat dikembalikan.</p>
            <button onClick={handleDelete} style={{ background: "none", border: "1px solid #f44336", color: "#f44336", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: 600 }}>Hapus Akun Mitra</button>
          </div>
        </div>

        <style>{`
          .settings-msg { font-size: 13px; padding: 10px 14px; border-radius: 8px; }
          .settings-msg.success { color: var(--primary-lime); background: rgba(189,209,36,0.1); }
          .settings-msg.error { color: #ff5252; background: rgba(244,67,54,0.1); }
        `}</style>
      </main>
    </div>
  );
}

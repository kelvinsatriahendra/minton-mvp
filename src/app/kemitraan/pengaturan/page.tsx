"use client";
import { useEffect } from 'react';
import MitraSidebar from "@/components/MitraSidebar";

export default function PengaturanPage() {
  useEffect(() => { document.title = 'Pengaturan GOR - Minton'; }, []);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Settings" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Pengaturan GOR</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash">Batalkan</button>
            <button className="btn-primary-dash"><i className="fa-solid fa-floppy-disk"></i> Simpan Perubahan</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="content-card">
            <p className="content-card-title">Informasi Dasar GOR</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nama GOR</label>
                <input className="form-input" type="text" defaultValue="GOR Sudirman Jaya" />
              </div>
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp Bisnis</label>
                <input className="form-input" type="tel" defaultValue="081234567890" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Bisnis</label>
                <input className="form-input" type="email" defaultValue="gor.sudirman@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Kota / Kabupaten</label>
                <input className="form-input" type="text" defaultValue="Surabaya" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <textarea className="form-textarea" rows={3} defaultValue="Jl. Raya Sudirman No. 123, Surabaya, Jawa Timur"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Link Google Maps (Opsional)</label>
              <input className="form-input" type="url" placeholder="https://maps.google.com/..." />
            </div>
          </div>

          <div className="content-card">
            <p className="content-card-title">Jam Operasional</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Jam Buka</label>
                <input className="form-input" type="time" defaultValue="08:00" />
              </div>
              <div className="form-group">
                <label className="form-label">Jam Tutup</label>
                <input className="form-input" type="time" defaultValue="23:00" />
              </div>
            </div>
          </div>

          <div className="content-card">
            <p className="content-card-title">Pengaturan Harga</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Harga / Jam (Pagi & Sore)</label>
                <input className="form-input" type="number" defaultValue={35000} />
              </div>
              <div className="form-group">
                <label className="form-label">Harga / Jam (Malam / Lampu Menyala)</label>
                <input className="form-input" type="number" defaultValue={50000} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Metode Pembayaran yang Diterima</label>
              <select className="form-select">
                <option>Semua Metode (Transfer, E-Wallet, Tunai)</option>
                <option>Transfer Bank & E-Wallet</option>
                <option>Tunai Saja</option>
              </select>
            </div>
          </div>

          <div className="content-card" style={{ borderColor: "rgba(244, 67, 54, 0.3)" }}>
            <p className="content-card-title" style={{ color: "#f44336" }}>Zona Berbahaya</p>
            <p style={{ fontSize: "14px", color: "#aaaaaa", marginBottom: "16px" }}>Menghapus akun mitra akan menghapus semua data GOR Anda secara permanen dan tidak dapat dikembalikan.</p>
            <button style={{ background: "none", border: "1px solid #f44336", color: "#f44336", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: 600 }}>Hapus Akun Mitra</button>
          </div>
        </div>
      </main>
    </div>
  );
}

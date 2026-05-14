"use client";
import { useEffect } from 'react';
import Link from "next/link";

export default function RegistrasiPage() {
  useEffect(() => { document.title = 'Registrasi Mitra - Minton'; }, []);
  return (
    <>
      <header className="navbar">
        <div className="container nav-wrapper">
          <div className="logo">
            <Link href="/"><img src="/asset/logo.png" alt="logo" /></Link>
          </div>
          <nav>
            <Link href="/kemitraan">Kembali ke Kemitraan</Link>
          </nav>
        </div>
      </header>

      <div className="reg-container">
        <div className="reg-header">
          <h1>Daftarkan <span style={{ color: "var(--primary-lime)" }}>GOR Anda</span></h1>
          <p>Lengkapi data di bawah untuk bergabung dalam ekosistem digital Minton.</p>
        </div>

        <div className="reg-body">
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = "/kemitraan/dashboard-mitra"; }}>
            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-building"></i> Informasi GOR
              </div>
              <div className="grid-inputs">
                <div className="form-group">
                  <label>Nama GOR / Lapangan</label>
                  <input type="text" placeholder="Contoh: GOR Sudirman Jaya" required />
                </div>
                <div className="form-group">
                  <label>Nama Pemilik / Pengelola</label>
                  <input type="text" placeholder="Nama Lengkap" required />
                </div>
                <div className="form-group">
                  <label>Nomor WhatsApp</label>
                  <input type="tel" placeholder="08123456789" required />
                </div>
                <div className="form-group">
                  <label>Email Bisnis</label>
                  <input type="email" placeholder="gor@email.com" required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-location-dot"></i> Detail Lokasi
              </div>
              <div className="grid-inputs">
                <div className="form-group full">
                  <label>Alamat Lengkap GOR</label>
                  <textarea rows={3} placeholder="Jl. Raya Utama No. 123..."></textarea>
                </div>
                <div className="form-group">
                  <label>Kota / Kabupaten</label>
                  <input type="text" placeholder="Contoh: Surabaya" />
                </div>
                <div className="form-group">
                  <label>Link Google Maps (Opsional)</label>
                  <input type="url" placeholder="https://maps.google.com/..." />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-star"></i> Fasilitas & Lapangan
              </div>
              <div className="grid-inputs" style={{ marginBottom: "20px" }}>
                <div className="form-group">
                  <label>Jumlah Lapangan</label>
                  <input type="number" min={1} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Jenis Lantai</label>
                  <select>
                    <option>Vinyl (Standard BWF)</option>
                    <option>Parquet / Kayu</option>
                    <option>Semen / Beton</option>
                    <option>Karpet Biasa</option>
                  </select>
                </div>
              </div>

              <label style={{ marginBottom: "15px", display: "block" }}>Fasilitas Tersedia:</label>
              <div className="facility-grid">
                {["wifi", "car", "faucet-detergent", "utensils", "mosque", "shower"].map((icon, i) => (
                  <div className="facility-item" key={i}>
                    <input type="checkbox" id={`f${i}`} />
                    <label htmlFor={`f${i}`} className="facility-label">
                      <i className={`fa-solid fa-${icon}`}></i>{" "}
                      {["WiFi", "Parkir Luas", "Ruang Ganti", "Kantin", "Mushola", "Shower Area"][i]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-submit-reg">
              Daftarkan Sekarang <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>

      <footer className="footer" style={{ padding: "40px 0" }}>
        <div className="container" style={{ textAlign: "center", color: "#555", fontSize: "14px" }}>
          <p>&copy; 2026 Minton Partnership Program. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

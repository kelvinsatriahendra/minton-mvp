"use client";
import { useEffect } from 'react';
import Link from "next/link";

export default function LoginMitraPage() {
  useEffect(() => { document.title = 'Login Mitra - Minton'; }, []);
  return (
    <>
      <div className="header-overlay" style={{ position: "absolute", top: 0, left: 0, width: "100%", padding: "26px 0", zIndex: 20 }}>
        <div style={{ width: "90%", maxWidth: "1600px", margin: "auto" }}>
          <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" style={{ height: "28px" }} /></Link>
        </div>
      </div>
      <div className="split-layout">
        <div className="left-side">
          <div className="left-content"></div>
        </div>
        <div className="right-side">
          <div className="login-card">
            <h2>Login Mitra</h2>
            <p className="subtitle">Silakan masukkan akun pengelola GOR Anda.</p>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = "/kemitraan/dashboard-mitra"; }}>
              <div className="form-group">
                <label>Email Bisnis / ID Mitra</label>
                <input type="text" placeholder="contoh: gor_sudirman@email.com" required />
              </div>
              <div className="form-group">
                <label>Kata Sandi</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <a href="#" style={{ color: "#aaaaaa", fontSize: "13px", textDecoration: "none" }}>Lupa kata sandi?</a>
              </div>
              <button type="submit" className="btn-login">Masuk ke Dashboard</button>
            </form>
            <div className="footer-links">
              <p>Belum bergabung menjadi mitra? <a href="/kemitraan/registrasi">Daftar Sekarang</a></p>
              <div style={{ marginTop: "16px" }}>
                <a href="/" style={{ color: "#666", fontWeight: 400, fontSize: "13px" }}><i className="fa-solid fa-arrow-left"></i> Kembali ke Login Pemain</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

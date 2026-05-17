"use client";
import { useEffect, useState, useActionState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { loginMitraAction } from './actions';

export default function LoginMitraPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginMitraAction, null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  useEffect(() => { 
    document.title = 'Login Mitra - Minton'; 
  }, []);

  useEffect(() => {
    if (state?.success) {
      router.push('/kemitraan/dashboard-mitra');
      router.refresh();
    }
  }, [state?.success, router]);

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
            
            {state?.message && !state.success && (
              <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
                {state.message}
              </div>
            )}

            <form action={formAction}>
              <div className="form-group">
                <label>Email Bisnis / ID Mitra</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="contoh: gor_sudirman@email.com" 
                  required 
                />
                {state?.errors?.email && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.email[0]}</span>}
              </div>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Kata Sandi</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={passwordVisible ? "text" : "password"} 
                    name="password"
                    placeholder="Masukkan kata sandi" 
                    required 
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    <i className={`fa-regular ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {state?.errors?.password && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.password[0]}</span>}
              </div>

              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setForgotEmail(''); setForgotMsg(''); setShowForgotModal(true); }} style={{ color: "#aaaaaa", fontSize: "13px", textDecoration: "none" }}>Lupa kata sandi?</a>
              </div>
              <button type="submit" className="btn-login" disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
                {isPending ? 'Memproses...' : 'Masuk ke Dashboard'}
              </button>
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
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowForgotModal(false)}>
          <div style={{ background: '#1D1D1D', border: '1px solid #333', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '8px', marginTop: 0 }}>Reset Kata Sandi</h3>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
              Masukkan email bisnis/ID Mitra Anda. Link reset akan dikirim ke email tersebut.
            </p>
            <div className="form-group">
              <label>Email Bisnis / ID Mitra</label>
              <input
                type="email"
                placeholder="contoh: gor_sudirman@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            {forgotMsg && (
              <div style={{ padding: '10px', backgroundColor: 'rgba(189,209,36,0.1)', color: 'var(--primary-lime)', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                {forgotMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary-dash" style={{ flex: 1 }} onClick={() => setShowForgotModal(false)}>Batal</button>
              <button type="button" className="btn-primary-dash" style={{ flex: 1 }} onClick={() => {
                if (!forgotEmail) { setForgotMsg('Masukkan email terlebih dahulu.'); return; }
                setForgotMsg('Fitur reset password sedang dikembangkan. Silakan hubungi admin Minton untuk bantuan reset akun.');
              }}>Kirim</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

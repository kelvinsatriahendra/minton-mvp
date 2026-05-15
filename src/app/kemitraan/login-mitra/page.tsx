"use client";
import { useEffect, useState, useActionState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { loginMitraAction } from './actions';

export default function LoginMitraPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginMitraAction, null);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
                <a href="#" style={{ color: "#aaaaaa", fontSize: "13px", textDecoration: "none" }}>Lupa kata sandi?</a>
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
    </>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpAction } from './actions';
import { supabase } from '@/utils/supabase';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  async function handleGoogleLogin() {
    alert("Tombol Google Diklik!");
    console.log("Memulai Login Google...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error Google Login:", error.message);
      setError(error.message);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signUpAction(null, formData);

    if (result?.message) {
      setError(result.message);
      setLoading(false);
    } else {
      setShowSuccess(true);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --bg-dark: #000000; --bg-card: #1D1D1D; --primary-lime: #bdd124; --text-white: #ffffff; --text-gray: #aaaaaa; --input-bg: #111111; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-white); display: flex; min-height: 100vh; }
        .split-layout { display: flex; width: 100%; min-height: 100vh; }
        .left-side { flex: 1; position: relative; background: linear-gradient(to right, rgba(10, 10, 10, 0.1) 50%, var(--bg-dark) 100%), url('/asset/background-sign-up.png') center/cover no-repeat; }
        .header-overlay { position: absolute; top: 0; left: 0; width: 100%; padding: 26px 0; z-index: 20; }
        .container-overlay { width: 90%; max-width: 1600px; margin: auto; }
        .logo-img { height: 28px; }
        .right-side { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; background-color: var(--bg-dark); }
        .form-card { background-color: var(--bg-card); padding: 46px; border-radius: 16px; width: 100%; max-width: 520px; }
        .form-card h2 { font-size: 26px; font-weight: 600; margin-bottom: 10px; }
        .highlight { color: var(--primary-lime); }
        .form-card p { color: var(--text-gray); font-size: 14px; margin-bottom: 24px; }
        .social-buttons { display: flex; gap: 15px; margin-bottom: 24px; }
        .btn-social { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; background: transparent; border: 1px solid rgba(255, 255, 255, 0.3); color: var(--text-white); padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.3s; }
        .btn-social:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--text-white); }
        .form-group { margin-bottom: 18px; }
        .form-row { display: flex; gap: 20px; }
        .form-row .form-group { flex: 1; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-white); }
        input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 14px; border: 1px solid #333; border-radius: 12px; background-color: var(--input-bg); color: var(--text-white); font-size: 14px; outline: none; transition: 0.3s; }
        input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .checkbox-group { display: flex; align-items: center; gap: 10px; margin-top: 20px; margin-bottom: 24px; }
        .checkbox-group input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary-lime); cursor: pointer; }
        .checkbox-group label { margin-bottom: 0; color: var(--text-gray); cursor: pointer; font-size: 14px; }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-lime); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-bottom: 18px; }
        .btn-submit:hover { background-color: #a7bc1d; box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4); }
        .login-link { text-align: center; font-size: 14px; color: var(--text-gray); }
        .login-link a { color: var(--primary-lime); text-decoration: none; font-weight: 500; margin-left: 5px; }
        @media (max-width: 992px) { .form-card { padding: 30px; } .form-row { flex-direction: column; gap: 0; } }
        @media (max-width: 768px) { .left-side { display: none; } .right-side { padding: 20px; } .social-buttons { flex-direction: column; } }
      `}} />

      <div className="header-overlay">
        <div className="container-overlay">
          <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" className="logo-img" /></Link>
        </div>
      </div>
      <div className="split-layout">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="form-card">
            <h2>Mulai Langkah <span className="highlight">Pertamamu!</span></h2>
            <p>Bergabung dengan ribuan jagoan lapangan dan pantau statistikmu.</p>
            <div className="social-buttons">
              <button type="button" className="btn-social" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Daftar dengan Google
              </button>
              <button className="btn-social">
                <i className="fa-brands fa-apple" style={{ fontSize: '20px' }}></i>
                Daftar dengan Apple ID
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="nama" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nomor Whatsapp</label>
                  <input type="text" name="whatsapp" required />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" name="email" required />
                </div>
              </div>
              <div className="form-group">
                <label>Kata Sandi</label>
                <input type="password" name="password" required />
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">Saya setuju dengan syarat & ketentuan dari Minton.</label>
              </div>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </form>
            <div className="login-link">
              sudah punya akun? <Link href="/login">Log-in disini</Link>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#1f1f1f', padding: '40px 30px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', border: '1px solid #333' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '64px', color: '#bdd124', marginBottom: '24px', display: 'block' }}></i>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#fff', fontWeight: '600' }}>Pendaftaran Sukses!</h2>
            <p style={{ color: '#aaa', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' }}>Akun Anda berhasil dibuat. Silakan login untuk melanjutkan.</p>
            <button onClick={() => router.push('/login')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#bdd124', color: '#000', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' }}>Lanjut ke Login</button>
          </div>
        </div>
      )}
    </>
  );
}

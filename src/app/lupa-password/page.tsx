'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        :root { --bg-dark: #000000; --bg-card: #1D1D1D; --text-white: #ffffff; --text-gray: #aaaaaa; --input-bg: #111111; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-white); display: flex; min-height: 100vh; }
        .split-layout { display: flex; width: 100%; min-height: 100vh; }
        .left-side { flex: 1; position: relative; background: linear-gradient(to right, rgba(10, 10, 10, 0.1) 50%, var(--bg-dark) 100%), url('/asset/background-login.png') center/cover no-repeat; }
        .header-overlay { position: absolute; top: 0; left: 0; width: 100%; padding: 26px 0; z-index: 20; pointer-events: none; }
        .container-overlay { width: 90%; max-width: 1600px; margin: auto; pointer-events: auto; }
        .right-side { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; background-color: var(--bg-dark); }
        .form-card { background-color: var(--bg-card); padding: 50px; border-radius: 16px; width: 100%; max-width: 550px; text-align: center; }
        .form-card h2 { font-size: 32px; font-weight: 600; margin-bottom: 10px; line-height: 1.3; }
        .highlight { color: var(--primary-lime); }
        .form-card p { color: var(--text-gray); font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .form-group { margin-bottom: 24px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-white); }
        input[type="email"] { width: 100%; padding: 14px; border: 1px solid #333; border-radius: 12px; background-color: var(--input-bg); color: var(--text-white); font-size: 14px; outline: none; transition: 0.3s; }
        input[type="email"]:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-lime); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-bottom: 20px; }
        .btn-submit:hover { background-color: #a7bc1d; box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .back-link { color: var(--text-gray); font-size: 14px; text-decoration: none; transition: 0.3s; }
        .back-link:hover { color: var(--primary-lime); }
        .success-icon { font-size: 48px; color: var(--primary-lime); margin-bottom: 16px; }
        @media (max-width: 768px) { .left-side { display: none; } .right-side { padding: 20px; } }
      `}</style>

      <div className="header-overlay">
        <div className="container-overlay">
          <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" style={{ height: 28 }} /></Link>
        </div>
      </div>

      <div className="split-layout">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="form-card">
            {sent ? (
              <>
                <div className="success-icon">✉️</div>
                <h2>Cek <span className="highlight">Email</span> kamu</h2>
                <p>Kami sudah kirim link reset password ke <strong>{email}</strong>. Cek inbox atau folder spam.</p>
                <Link href="/login" className="back-link">Kembali ke Login</Link>
              </>
            ) : (
              <>
                <h2>Lupa <span className="highlight">Kata Sandi?</span></h2>
                <p>Masukkan email terdaftar, kami kirim link untuk reset password.</p>

                {error && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                  </button>
                </form>

                <Link href="/login" className="back-link">Kembali ke Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

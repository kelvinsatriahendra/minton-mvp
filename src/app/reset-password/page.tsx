'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setReady(true);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setReady(true);
        else setError('Link tidak valid atau sudah kedaluwarsa.');
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Jagoan';
        await fetch('/api/auth/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, email: user.email, userId: user.id }),
        });
      }

      setTimeout(() => router.push('/'), 2000);
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
        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-white); }
        input[type="password"] { width: 100%; padding: 14px; border: 1px solid #333; border-radius: 12px; background-color: var(--input-bg); color: var(--text-white); font-size: 14px; outline: none; transition: 0.3s; }
        input[type="password"]:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-lime); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-submit:hover { background-color: #a7bc1d; box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
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
            {success ? (
              <>
                <div className="success-icon">✓</div>
                <h2>Kata Sandi <span className="highlight">Berhasil</span> Diubah</h2>
                <p>Kamu akan dialihkan ke halaman utama...</p>
              </>
            ) : !ready ? (
              <>
                <div style={{ width: 40, height: 40, border: '3px solid var(--primary-lime)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p>Memverifikasi link...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              <>
                <h2>Buat <span className="highlight">Kata Sandi</span> Baru</h2>
                <p>Minimal 6 karakter, pastikan kamu ingat ya!</p>

                {error && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Kata Sandi Baru</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 32 }}>
                    <label>Konfirmasi Kata Sandi</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ketik ulang kata sandi" required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

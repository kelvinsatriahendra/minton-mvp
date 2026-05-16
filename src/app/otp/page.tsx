'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { verifyOtpAction, sendOtpAction } from './actions';

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { document.title = 'Verifikasi OTP - Minton'; }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setInterval(() => setResendTimer(p => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (!email) router.replace('/login');
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.trim();
    if (otp.length < 4 || otp.length > 10) return setError('Masukkan kode OTP yang valid.');

    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.set('email', email);
    fd.set('code', otp);
    const result = await verifyOtpAction(null, fd);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      setCode('');
      inputRef.current?.focus();
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    const fd = new FormData();
    fd.set('email', email);
    const result = await sendOtpAction(null, fd);
    if (result.error) {
      setError(result.error);
    } else {
      setCode('');
      setResendTimer(60);
      inputRef.current?.focus();
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `(${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')})`;
  };

  return (
    <>
      <style>{`
        :root { --bg-dark: #000000; --bg-card: #1D1D1D; --text-white: #ffffff; --text-gray: #aaaaaa; --input-bg: #111111; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-white); display: flex; min-height: 100vh; }
        .split-layout { display: flex; width: 100%; min-height: 100vh; }
        .left-side { flex: 1; position: relative; background: linear-gradient(to right, rgba(10, 10, 10, 0.1) 50%, var(--bg-dark) 100%), url('/asset/background-sign-up.png') center/cover no-repeat; }
        .header-overlay { position: absolute; top: 0; left: 0; width: 100%; padding: 26px 0; z-index: 20; pointer-events: none; }
        .container-overlay { width: 90%; max-width: 1600px; margin: auto; pointer-events: auto; }
        .logo-img { height: 28px; }
        .right-side { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; background-color: var(--bg-dark); }
        .form-card { background-color: var(--bg-card); padding: 46px; border-radius: 16px; width: 100%; max-width: 520px; text-align: center; }
        .form-card h2 { font-size: 26px; font-weight: 600; margin-bottom: 10px; }
        .highlight { color: var(--primary-lime); }
        .form-card p { color: var(--text-gray); font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .otp-input-single { width: 100%; padding: 14px; border: 1px solid #333; border-radius: 12px; background-color: var(--input-bg); color: var(--text-white); font-size: 20px; font-weight: 600; text-align: center; outline: none; transition: 0.3s; letter-spacing: 6px; margin-bottom: 24px; }
        .otp-input-single:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-lime); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-bottom: 18px; }
        .btn-submit:hover { background-color: #a7bc1d; box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .resend-link { font-size: 14px; color: var(--text-gray); }
        .resend-link button { background: none; border: none; color: var(--primary-lime); font-weight: 500; cursor: pointer; font-size: 14px; font-family: inherit; text-decoration: none; }
        .resend-link button:hover { text-decoration: underline; }
        .resend-link button:disabled { color: #666; cursor: not-allowed; text-decoration: none; }
        .error-box { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        @media (max-width: 992px) { .form-card { padding: 30px; } }
        @media (max-width: 768px) { .left-side { display: none; } .right-side { padding: 20px; } }
      `}</style>

      <div className="header-overlay">
        <div className="container-overlay">
          <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" className="logo-img" /></Link>
        </div>
      </div>

      <div className="split-layout">
        <div className="left-side"></div>
        <div className="right-side">
          <div className="form-card">
            <h2>Verifikasi <span className="highlight">OTP</span></h2>
            <p>Kami telah mengirimkan kode verifikasi ke <strong style={{ color: '#fff' }}>{email}</strong>. Masukkan kode di bawah untuk memverifikasi akun kamu.</p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="otp-input-single"
                placeholder="Masukkan kode verifikasi"
                value={code}
                ref={inputRef}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                autoFocus
              />

              <button type="submit" className="btn-submit" disabled={loading || code.trim().length < 4}>
                {loading ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}
              </button>
            </form>

            <div className="resend-link">
              Belum menerima kode?{' '}
              <button onClick={handleResend} disabled={resendTimer > 0}>
                Kirim Ulang
              </button>{' '}
              {resendTimer > 0 && <span>{formatTimer(resendTimer)}</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <OtpContent />
    </Suspense>
  );
}

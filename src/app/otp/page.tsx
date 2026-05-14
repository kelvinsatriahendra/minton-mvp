'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

export default function OTPPage() {
  const router = useRouter();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const current = inputRefs[index].current;
    if (!current) return;

    if (current.value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (e.key === 'Backspace' && current.value.length === 0 && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful OTP validation and redirect to home
    router.push('/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --bg-dark: #000000; --bg-card: #1D1D1D; --primary-lime: #bdd124; --text-white: #ffffff; --text-gray: #aaaaaa; --input-bg: #111111; }
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
        .otp-container { display: flex; gap: 12px; justify-content: center; margin-bottom: 32px; }
        .otp-input { width: 56px; height: 64px; border: 1px solid #333; border-radius: 12px; background-color: var(--input-bg); color: var(--text-white); font-size: 24px; font-weight: 700; text-align: center; outline: none; transition: 0.3s; }
        .otp-input:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-lime); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; margin-bottom: 18px; }
        .btn-submit:hover { background-color: #a7bc1d; box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4); }
        .resend-link { font-size: 14px; color: var(--text-gray); }
        .resend-link a { color: var(--primary-lime); text-decoration: none; font-weight: 500; margin-left: 5px; }
        .resend-link a:hover { text-decoration: underline; }
        @media (max-width: 992px) { .form-card { padding: 30px; } }
        @media (max-width: 768px) { .left-side { display: none; } .right-side { padding: 20px; } .otp-input { width: 48px; height: 56px; font-size: 20px; } }
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
            <h2>Verifikasi <span className="highlight">OTP</span></h2>
            <p>Kami telah mengirimkan 4 digit kode OTP ke email dan nomor WhatsApp Anda yang terdaftar.</p>

            <form onSubmit={handleVerify}>
              <div className="otp-container">
                <input type="text" className="otp-input" maxLength={1} required ref={inputRefs[0]} onKeyUp={(e) => handleKeyUp(0, e)} />
                <input type="text" className="otp-input" maxLength={1} required ref={inputRefs[1]} onKeyUp={(e) => handleKeyUp(1, e)} />
                <input type="text" className="otp-input" maxLength={1} required ref={inputRefs[2]} onKeyUp={(e) => handleKeyUp(2, e)} />
                <input type="text" className="otp-input" maxLength={1} required ref={inputRefs[3]} onKeyUp={(e) => handleKeyUp(3, e)} />
              </div>

              <button type="submit" className="btn-submit">Verifikasi & Lanjutkan</button>
            </form>

            <div className="resend-link">
              Belum menerima kode? <Link href="#">Kirim Ulang</Link> <span id="timer">(00:59)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

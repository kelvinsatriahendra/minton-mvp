'use client';

import { useActionState, useEffect } from 'react';
import { loginAction } from './actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const router = useRouter();

  // Handle successful login
  useEffect(() => {
    if (state?.success) {
      sessionStorage.setItem('flashMessage', JSON.stringify({
        title: 'Login Berhasil',
        message: `Selamat datang kembali, ${state.userName}! Siap untuk mendominasi lapangan hari ini?`
      }));
      window.location.href = '/dashboard';
    }
  }, [state]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --bg-dark: #000000;
            --bg-card: #1D1D1D;
            --primary-lime: #bdd124;
            --text-white: #ffffff;
            --text-gray: #aaaaaa;
            --input-bg: #111111;
        }
        .login-body {
            background-color: var(--bg-dark);
            color: var(--text-white);
            display: flex;
            min-height: 100vh;
        }
        .split-layout {
            display: flex;
            width: 100%;
        }
        .left-side {
            flex: 1;
            position: relative;
            background: linear-gradient(to right, rgba(10, 10, 10, 0.1) 50%, var(--bg-dark) 100%),
                url(/asset/background-login.png) center/cover no-repeat;
        }
        .header-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 26px 0;
            z-index: 20;
            pointer-events: none;
        }
        .container-overlay {
            width: 90%;
            max-width: 1600px;
            margin: auto;
            pointer-events: auto;
        }
        .logo-img {
            height: 28px;
        }
        .right-side {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            background-color: var(--bg-dark);
        }
        .form-card {
            background-color: var(--bg-card);
            padding: 50px;
            border-radius: 16px;
            width: 100%;
            max-width: 550px;
        }
        .form-card h2 {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 30px;
            line-height: 1.3;
        }
        .highlight {
            color: var(--primary-lime);
        }
        .social-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        .btn-social {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: var(--text-white);
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
        }
        .btn-social:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--text-white);
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--text-white);
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 14px;
            border: 1px solid #333;
            border-radius: 12px;
            background-color: var(--input-bg);
            color: var(--text-white);
            font-size: 14px;
            outline: none;
            transition: 0.3s;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            box-shadow: 0 0 0 2px var(--primary-lime);
        }
        .forgot-password {
            text-align: right;
            margin-top: 10px;
        }
        .forgot-password a {
            color: var(--text-gray);
            font-size: 13px;
            text-decoration: none;
            transition: 0.3s;
        }
        .forgot-password a:hover {
            color: var(--primary-lime);
            text-decoration: underline;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 40px;
            margin-bottom: 25px;
        }
        .checkbox-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--primary-lime);
            cursor: pointer;
        }
        .checkbox-group label {
            margin-bottom: 0;
            color: var(--text-gray);
            font-size: 14px;
            cursor: pointer;
        }
        .btn-submit {
            width: 100%;
            padding: 14px;
            background-color: var(--primary-lime);
            color: #000;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            margin-bottom: 20px;
        }
        .btn-submit:hover {
            background-color: #a7bc1d;
            box-shadow: 0 4px 12px rgba(189, 209, 36, 0.4);
        }
        .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .register-link {
            text-align: center;
            font-size: 14px;
            color: var(--text-gray);
        }
        .register-link a {
            color: var(--primary-lime);
            text-decoration: none;
            font-weight: 500;
            margin-left: 5px;
        }
        .register-link a:hover {
            text-decoration: underline;
        }
        @media (max-width: 992px) {
            .form-card { padding: 30px; }
        }
        @media (max-width: 768px) {
            .left-side { display: none; }
            .right-side { padding: 20px; }
            .social-buttons { flex-direction: column; }
        }
      `}} />
      <div className="login-body">
          <div className="header-overlay">
              <div className="container-overlay">
                  <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" className="logo-img" /></Link>
              </div>
          </div>
          <div className="split-layout">
              <div className="left-side"></div>
              <div className="right-side">
                  <div className="form-card">
                      <h2>Selamat datang <br /> kembali, <span className="highlight">Jagoan!</span></h2>
                      <div className="social-buttons">
                          <button className="btn-social">
                              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                              </svg>
                              Masuk dengan Google
                          </button>
                          <button className="btn-social">
                              <i className="fa-brands fa-apple"></i>
                              Masuk dengan Apple ID
                          </button>
                      </div>
                      <form action={formAction}>
                          <div className="form-group">
                              <label>Nomor Whatsapp/E-mail</label>
                              <input type="text" name="loginId" />
                              {state?.errors?.loginId && <p style={{color: 'red', fontSize: '13px', marginTop: '5px'}}>{state.errors.loginId[0]}</p>}
                          </div>
                          <div className="form-group">
                              <label>Kata Sandi</label>
                              <input type="password" name="password" />
                              {state?.errors?.password && <p style={{color: 'red', fontSize: '13px', marginTop: '5px'}}>{state.errors.password[0]}</p>}
                              <div className="forgot-password">
                                  <a href="#">Lupa kata sandi?</a>
                              </div>
                          </div>
                          <div className="checkbox-group">
                              <input type="checkbox" id="remember" />
                              <label htmlFor="remember">Ingat Saya</label>
                          </div>
                          
                          {state?.message && <div style={{color: 'red', fontSize: '14px', marginBottom: '15px', textAlign: 'center'}}>{state.message}</div>}

                          <button type="submit" className="btn-submit" disabled={isPending}>
                              {isPending ? (
                                <span><i className="fa-solid fa-spinner fa-spin" style={{marginRight: '8px'}}></i> Sedang Masuk...</span>
                              ) : (
                                'Masuk Ke Lapangan'
                              )}
                          </button>
                      </form>
                      <div className="register-link">
                          Belum jadi bagian dari Minton? <Link href="/sign-up">Daftar Sekarang</Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

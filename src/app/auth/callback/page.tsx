
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

function getRedirectUrl(): string {
  if (typeof window === 'undefined') return '/';
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect_to') || '/';
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const calledRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const handleAuth = async () => {
      const maxRetries = 10;
      for (let i = 0; i < maxRetries; i++) {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session) {
          setStatus('redirecting');
          const user = session.user;
          const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Jagoan';

          try {
            const res = await fetch('/api/auth/set-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userName,
                email: user.email,
                userId: user.id
              }),
            });
            if (!res.ok) throw new Error('Gagal menyimpan session');
          } catch (e: any) {
            console.error('set-session error:', e);
            setErrorMsg(e.message || 'Gagal menyimpan session');
            setStatus('error');
            return;
          }

          const hash = window.location.hash;
          if (hash.includes('type=recovery')) {
            router.push('/reset-password');
          } else {
            router.push(getRedirectUrl());
          }
          router.refresh();
          return;
        }

        if (error) {
          console.error('Auth Error:', error.message);
          setErrorMsg(error.message);
          setStatus('error');
          return;
        }

        await new Promise(r => setTimeout(r, 1000));
      }

      setErrorMsg('Sesi tidak ditemukan setelah beberapa kali percobaan');
      setStatus('error');
    };

    handleAuth();
  }, [router]);

  if (status === 'error') {
    return (
      <div style={{ 
        background: '#000', color: '#fff', height: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', padding: '0 20px', textAlign: 'center'
      }}>
        <p style={{ color: '#ef4444', marginBottom: 12 }}>Autentikasi gagal</p>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>{errorMsg}</p>
        <button onClick={() => router.push('/login')} style={{
          padding: '12px 24px', background: 'var(--primary-lime)', color: '#000',
          border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer'
        }}>
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#000', color: '#fff', height: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      {status === 'loading' && (
        <>
          <div style={{ 
            width: 40, height: 40, border: '3px solid var(--primary-lime)',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 1s linear infinite', marginBottom: 20
          }}></div>
          <p>Sedang memproses autentikasi...</p>
        </>
      )}
      {status === 'redirecting' && <p>Mengarahkan...</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

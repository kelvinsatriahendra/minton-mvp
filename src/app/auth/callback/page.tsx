
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Tunggu sebentar agar Supabase memproses fragment (#) di URL
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;
        const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Jagoan';

        // Panggil API helper untuk pasang cookie
        await fetch('/api/auth/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName,
            email: user.email,
            userId: user.id
          }),
        });

        // Redirect ke home
        router.push('/');
        router.refresh();
      } else if (error) {
        console.error('Auth Error:', error.message);
        router.push('/login?error=' + encodeURIComponent(error.message));
      } else {
        // Jika tidak ada session, mungkin masih proses atau gagal
        setTimeout(() => {
          if (!window.location.hash) {
             router.push('/login?error=No session found');
          }
        }, 5000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div style={{ 
      background: '#000', 
      color: '#fff', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid #bdd124', 
        borderTopColor: 'transparent', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p>Sedang memproses autentikasi...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

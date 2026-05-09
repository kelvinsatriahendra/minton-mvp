'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check login status from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const loggedIn = getCookie('isLoggedIn') === 'true';
    const name = getCookie('userName');

    if (loggedIn && name) {
      setIsLoggedIn(true);
      setUserName(decodeURIComponent(name));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : 'navbar-transparent'}`}>
      <div className="container nav-wrapper">
        <div className="logo">
          <Link href="/"><img src="/asset/logo.png" alt="logo" /></Link>
        </div>

        <div className="hamburger" id="hamburger" onClick={() => {
            document.getElementById('nav-menu')?.classList.toggle('active');
            document.getElementById('nav-btn')?.classList.toggle('active');
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav id="nav-menu">
          <Link href="/sewa-lapangan">Sewa Lapangan</Link>
          <Link href="/main-bareng">Main Bareng</Link>
          <Link href="/kemitraan">Kemitraan</Link>
          <Link href="/komunitas">Komunitas</Link>
        </nav>

        <div className="nav-btn" id="nav-btn">
          {isLoggedIn ? (
            <div className="profile-menu" style={{ position: 'relative' }}>
              <button 
                className="profile-btn-ui" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer' 
                }}
              >
                <div className="profile-avatar" style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: '#bdd124', 
                  borderRadius: '50%', 
                  color: 'black', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold' 
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <p className="profile-name" style={{ margin: 0, fontWeight: 500 }}>{userName}</p>
                <i className={`fa-solid fa-chevron-down`} style={{ fontSize: '10px' }}></i>
              </button>

              {showDropdown && (
                <div className="profile-dropdown" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  background: '#1D1D1D', 
                  border: '1px solid #333', 
                  borderRadius: '8px', 
                  padding: '10px 0', 
                  width: '180px', 
                  marginTop: '10px',
                  zIndex: 100
                }}>
                  <Link href="/dashboard" className="dropdown-item" style={{ display: 'block', padding: '8px 20px', color: 'white', textDecoration: 'none' }}>
                    <i className="fa-solid fa-gauge" style={{ marginRight: '10px' }}></i> Dashboard
                  </Link>
                  <div style={{ height: '1px', background: '#333', margin: '5px 0' }}></div>
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item" 
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '8px 20px', 
                      color: '#ff4d4d', 
                      background: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '10px' }}></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-outline" onClick={() => { window.location.href = "/sign-up"; }}>Sign-Up</button>
              <button className="btn-primary" onClick={() => { window.location.href = "/login"; }}>Login</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

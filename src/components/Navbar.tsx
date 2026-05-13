
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Handle scroll for transparent navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check login status from cookies
    const cookies = document.cookie.split(';');
    const loggedInCookie = cookies.find(c => c.trim().startsWith('isLoggedIn='));
    const nameCookie = cookies.find(c => c.trim().startsWith('userName='));
    
    if (loggedInCookie && loggedInCookie.split('=')[1] === 'true') {
      setIsLoggedIn(true);
      if (nameCookie) {
        setUserName(decodeURIComponent(nameCookie.split('=')[1]));
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 26px 0;
          z-index: 1000;
          transition: all 0.4s ease;
        }
        .navbar.scrolled {
          background-color: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          padding: 16px 0;
          border-bottom: 1px solid #222;
        }
        .nav-wrapper {
          width: 90%;
          max-width: 1600px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo img {
          height: 28px;
          display: block;
        }
        nav {
          display: flex;
          gap: 40px;
        }
        nav a {
          color: #ffffff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          position: relative;
          transition: color 0.25s;
        }
        nav a::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 0; height: 2px;
          background: #bdd124;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        nav a:hover { color: #bdd124; }
        nav a:hover::after { width: 100%; }
        
        .nav-btn {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .btn-primary {
          background-color: #bdd124;
          color: #000;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-outline {
          background: transparent;
          color: #fff;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #333;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-outline:hover {
          background: #bdd124 !important;
          border-color: #bdd124 !important;
          color: #000 !important;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          background: #bdd124;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          z-index: 1100;
        }
        .hamburger span {
          width: 28px;
          height: 2px;
          background-color: #fff;
          transition: 0.3s;
        }

        @media (max-width: 992px) {
          .navbar { padding: 18px 0; }
          nav { display: none; }
          .hamburger { display: flex; }
          
          nav.mobile-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #0a0a0a;
            padding: 30px;
            gap: 20px;
            border-bottom: 1px solid #222;
          }

          .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
          .hamburger.open span:nth-child(2) { opacity: 0; }
          .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }
          
          .nav-btn { display: none; }
          nav.mobile-open .nav-btn-mobile {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
          }
        }
      `}} />
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrapper">
          <div className="logo">
            <Link href="/"><img src="/asset/logo.png" alt="logo" /></Link>
          </div>

          <nav id="nav-menu" className={isMenuOpen ? 'mobile-open' : ''}>
            <Link href="/sewa-lapangan" style={pathname.includes('sewa-lapangan') ? {color: '#bdd124'} : {}}>Sewa Lapangan</Link>
            <Link href="/main-bareng" style={pathname.includes('main-bareng') ? {color: '#bdd124'} : {}}>Main Bareng</Link>
            <Link href="/kemitraan" style={pathname.includes('kemitraan') ? {color: '#bdd124'} : {}}>Kemitraan</Link>
            <Link href="/komunitas" style={pathname.includes('komunitas') ? {color: '#bdd124'} : {}}>Komunitas</Link>
            
            <div className="nav-btn-mobile" style={{ display: isMenuOpen ? 'flex' : 'none' }}>
               {isLoggedIn ? (
                  <Link href="/dashboard" className="user-profile">
                    <span>{userName}</span>
                    <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                  </Link>
                ) : (
                  <>
                    <Link href="/login"><button className="btn-primary" style={{ width: '100%' }}>Login</button></Link>
                    <Link href="/sign-up"><button className="btn-outline" style={{ width: '100%' }}>Sign-Up</button></Link>
                  </>
                )}
            </div>
          </nav>

          <div className="nav-btn">
            {isLoggedIn ? (
              <Link href="/dashboard" className="user-profile">
                <span>{userName}</span>
                <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              </Link>
            ) : (
              <>
                <Link href="/sign-up"><button className="btn-outline">Sign-Up</button></Link>
                <Link href="/login"><button className="btn-primary">Login</button></Link>
              </>
            )}
          </div>

          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
    </>
  );
}
    </>
  );
}

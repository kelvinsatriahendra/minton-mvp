
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationBell from '@/app/notifications/NotificationBell';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrapper">
          <div className="logo">
            <Link href="/"><img src="/asset/logo.png" alt="logo" /></Link>
          </div>

          <nav id="nav-menu" className={isMenuOpen ? 'mobile-open' : ''}>
            <Link href="/sewa-lapangan" style={pathname.includes('sewa-lapangan') ? {color: 'var(--primary-lime)'} : {}}>Sewa Lapangan</Link>
            <Link href="/main-bareng" style={pathname.includes('main-bareng') ? {color: 'var(--primary-lime)'} : {}}>Main Bareng</Link>
            <Link href="/kemitraan" style={pathname.includes('kemitraan') ? {color: 'var(--primary-lime)'} : {}}>Kemitraan</Link>
            <Link href="/komunitas" style={pathname.includes('komunitas') ? {color: 'var(--primary-lime)'} : {}}>Komunitas</Link>
            
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
              <div className={`user-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                <NotificationBell />
                <div className="user-profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                  <span>{userName}</span>
                  <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
                </div>
                <div className="dropdown-menu" onClick={() => setIsDropdownOpen(false)}>
                  <Link href="/dashboard" className="dropdown-item">
                    <i className="fa-solid fa-gauge"></i> Dashboard
                  </Link>
                  <Link href="/profil" className="dropdown-item">
                    <i className="fa-solid fa-user"></i> Profil Saya
                  </Link>
                  <Link href="/booking-saya" className="dropdown-item">
                    <i className="fa-solid fa-ticket"></i> Booking Saya
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => {
                    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = '/';
                  }} className="dropdown-item" style={{ color: '#ef4444' }}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </div>
              </div>
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

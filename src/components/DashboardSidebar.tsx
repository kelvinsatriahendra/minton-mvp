
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState('User');
  const [initial, setInitial] = useState('U');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const nameCookie = cookies.find(c => c.trim().startsWith('userName='));
    if (nameCookie) {
      const name = decodeURIComponent(nameCookie.split('=')[1]);
      setUserName(name);
      setInitial(name.charAt(0).toUpperCase());
    }
  }, []);

  const navItems = [
    { href: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
    { href: '/booking-saya', icon: 'fa-calendar-days', label: 'Booking Saya' },
    { href: '/dashboard/mabar', icon: 'fa-users', label: 'Main Bareng' },
    { href: '/turnamen', icon: 'fa-trophy', label: 'Turnamen' },
  ];

  const bottomItems = [
    { href: '/profil', icon: 'fa-user', label: 'Profil' },
    { href: '/minton-pay', icon: 'fa-wallet', label: 'Minton Pay' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <style>{`
        :root { --sidebar-bg: #111111; --card-bg: #1d1d1d; --primary-lime: #bdd124; --text-gray: #aaaaaa; --border-color: #333333; }
        .dash-layout { display: flex; height: 100vh; overflow: hidden; background: #000; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sidebar { width: 260px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; padding: 28px 20px; flex-shrink: 0; }
        .sidebar-logo { padding: 0 8px; margin-bottom: 48px; }
        .sidebar-logo img { height: 30px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .sidebar-nav a { display: flex; align-items: center; gap: 14px; padding: 12px 16px; color: var(--text-gray); text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .sidebar-nav a i { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-nav a:hover { background: rgba(189, 209, 36, 0.07); color: #fff; }
        .sidebar-nav a.active { background: rgba(189, 209, 36, 0.12); color: var(--primary-lime); font-weight: 600; }
        .sidebar-nav a.logout { color: #f44336; margin-top: auto; }
        .sidebar-nav a.logout:hover { background: rgba(244, 67, 54, 0.1); color: #ff5252; }
        .sidebar-divider { height: 1px; background: var(--border-color); margin: 12px 8px; }
        .sidebar-footer { padding-top: 20px; border-top: 1px solid var(--border-color); }
        .sidebar-user { display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-radius: 10px; text-decoration: none; color: #fff; }
        .sidebar-avatar { width: 36px; height: 36px; background: var(--primary-lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 700; font-size: 14px; }
        .sidebar-user-info .name { font-size: 14px; font-weight: 600; }
        .sidebar-user-info .role { font-size: 12px; color: var(--text-gray); }
        .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #000; }
        .page-header { padding: 20px 36px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
        .page-header h1 { font-size: 22px; font-weight: 700; }
        .page-body { flex: 1; padding: 28px 36px; overflow-y: auto; }
        .btn-primary-dash { background: var(--primary-lime); color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: 0.2s; }
        .btn-primary-dash:hover { background: #d4e92a; transform: translateY(-1px); }
        .btn-secondary-dash { background: none; border: 1px solid var(--border-color); color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; transition: 0.2s; }
        .btn-secondary-dash:hover { border-color: var(--primary-lime); color: var(--primary-lime); }
        .content-card { background: var(--card-bg); border-radius: 16px; padding: 20px; border: 1px solid var(--border-color); margin-bottom: 20px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .badge-booked { background: rgba(189, 209, 36, 0.12); color: var(--primary-lime); }
        .badge-pending { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        @media (max-width: 768px) {
          .sidebar { width: 60px; padding: 20px 10px; }
          .sidebar-logo img { height: 24px; }
          .sidebar-nav a span, .sidebar-user-info, .sidebar-nav a.logout span { display: none; }
          .page-header, .page-body { padding: 20px; }
        }
      `}</style>
      <div className="dash-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <Link href="/"><img src="/asset/logo.png" alt="Minton" /></Link>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="sidebar-divider"></div>
            {bottomItems.map(item => (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
            <a href="/" className="logout" onClick={(e) => {
              e.preventDefault();
              document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = '/';
            }}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Keluar</span>
            </a>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{initial}</div>
              <div className="sidebar-user-info">
                <div className="name">{userName}</div>
                <div className="role">Member Gold</div>
              </div>
            </div>
          </div>
        </aside>
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}

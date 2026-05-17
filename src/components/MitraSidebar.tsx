"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { mitraLogoutAction } from '@/app/kemitraan/login-mitra/actions';

const navItems = [
  { href: "/kemitraan/dashboard-mitra", icon: "fa-solid fa-calendar-check", label: "Booking" },
  { href: "/kemitraan/jadwal", icon: "fa-solid fa-clock", label: "Schedule" },
  { href: "/kemitraan/layanan", icon: "fa-solid fa-box-archive", label: "Service" },
  { href: "/kemitraan/survei", icon: "fa-solid fa-file-lines", label: "Survey" },
];

const bottomItems = [
  { href: "/kemitraan/member", icon: "fa-solid fa-users", label: "Members" },
  { href: "/kemitraan/pengaturan", icon: "fa-solid fa-gear", label: "Settings" },
];

export default function MitraSidebar({ active }: { active: string }) {
  const router = useRouter();
  const [gorName, setGorName] = useState("GOR Mitra");

  useEffect(() => {
    // Read cookie for mitraGorName
    const cookies = document.cookie.split(';');
    const gorNameCookie = cookies.find(c => c.trim().startsWith('mitraGorName='));
    if (gorNameCookie) {
      setGorName(decodeURIComponent(gorNameCookie.split('=')[1]));
    }
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await mitraLogoutAction();
    router.push('/kemitraan/login-mitra');
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name) return "GM";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="mitra-sidebar">
      <div className="logo-section">
        <Link href="/"><img src="/asset/logo.png" alt="Minton Logo" /></Link>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active === item.label ? "active" : ""}`}
          >
            <i className={item.icon}></i> {item.label}
          </Link>
        ))}
        <div className="nav-divider"></div>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active === item.label ? "active" : ""}`}
          >
            <i className={item.icon}></i> {item.label}
          </Link>
        ))}
        {/* Logout Button */}
        <a href="#" onClick={handleLogout} className="nav-item logout">
          <i className="fa-solid fa-right-from-bracket"></i> Keluar
        </a>
      </nav>
      <div className="sidebar-footer">
        <Link href="#" className="user-profile">
          <div className="avatar">{getInitials(gorName)}</div>
          <div>
            <p className="user-name">{gorName}</p>
            <p className="user-role">Pengelola</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

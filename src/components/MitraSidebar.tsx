"use client";
import Link from "next/link";

const navItems = [
  { href: "/kemitraan/dashboard-mitra", icon: "fa-solid fa-calendar-check", label: "Booking" },
  { href: "/kemitraan/jadwal", icon: "fa-solid fa-clock", label: "Schedule" },
  { href: "/kemitraan/layanan", icon: "fa-solid fa-box-archive", label: "Service" },
  { href: "/kemitraan/survei", icon: "fa-solid fa-file-lines", label: "Survey" },
];

const bottomItems = [
  { href: "/kemitraan/member", icon: "fa-solid fa-users", label: "Members" },
  { href: "/kemitraan/pengaturan", icon: "fa-solid fa-gear", label: "Settings" },
  { href: "/kemitraan/login-mitra", icon: "fa-solid fa-right-from-bracket", label: "Keluar" },
];

export default function MitraSidebar({ active }: { active: string }) {
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
            className={`nav-item ${item.label === "Keluar" ? "logout" : ""} ${active === item.label ? "active" : ""}`}
          >
            <i className={item.icon}></i> {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link href="#" className="user-profile">
          <div className="avatar">GS</div>
          <div>
            <p className="user-name">GOR Sudirman</p>
            <p className="user-role">Pengelola</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

"use client";
import { useEffect } from 'react';
import MitraSidebar from "@/components/MitraSidebar";

const members = [
  { avatar: "BA", name: "Budi Anderson", phone: "081234567890", badge: "badge-pro", badgeText: "PRO Member", since: "Jan 2025", lastPlay: "Hari ini", total: "42 kali" },
  { avatar: "RS", name: "Rina Septiani", phone: "087711223344", badge: "badge-regular", badgeText: "Reguler", since: "Mar 2025", lastPlay: "2 hari lalu", total: "15 kali" },
  { avatar: "AW", name: "Andi Wijaya", phone: "082299887766", badge: "badge-pro", badgeText: "PRO Member", since: "Feb 2025", lastPlay: "Kemarin", total: "31 kali" },
  { avatar: "DP", name: "Dewi Permata", phone: "081555444333", badge: "badge-regular", badgeText: "Reguler", since: "Apr 2025", lastPlay: "5 hari lalu", total: "8 kali" },
];

export default function MemberPage() {
  useEffect(() => { document.title = 'Manajemen Member - Minton'; }, []);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Members" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Manajemen Member</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash"><i className="fa-solid fa-file-export"></i> Ekspor</button>
            <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Tambah Member</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="content-card">
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Cari nama atau nomor HP member..." />
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Status</th>
                  <th>Bergabung Sejak</th>
                  <th>Terakhir Main</th>
                  <th>Total Booking</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="member-info">
                        <div className="member-avatar-sm">{m.avatar}</div>
                        <div>
                          <p className="member-name">{m.name}</p>
                          <p className="member-phone">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${m.badge}`}>{m.badgeText}</span></td>
                    <td>{m.since}</td>
                    <td>{m.lastPlay}</td>
                    <td>{m.total}</td>
                    <td><button className="btn-action-sm">Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

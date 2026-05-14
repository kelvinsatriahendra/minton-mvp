"use client";
import MitraSidebar from "@/components/MitraSidebar";

const sessions = [
  { time: "08:00 – 09:00", badge: "badge-closed", badgeText: "Closed", price: "Rp 45.000", pemesan: "—", aksi: "Buka Sesi" },
  { time: "09:00 – 10:00", badge: "badge-open", badgeText: "Open", price: "Rp 45.000", pemesan: "—", aksi: "Tutup Sesi" },
  { time: "10:00 – 11:00", badge: "badge-booked", badgeText: "Booked", price: "Rp 45.000", pemesan: "Andi Wijaya", aksi: "Lihat Detail" },
  { time: "11:00 – 12:00", badge: "badge-booked", badgeText: "Booked", price: "Rp 45.000", pemesan: "Rina S.", aksi: "Lihat Detail" },
  { time: "12:00 – 13:00", badge: "badge-open", badgeText: "Open", price: "Rp 35.000", pemesan: "—", aksi: "Tutup Sesi" },
  { time: "13:00 – 14:00", badge: "badge-open", badgeText: "Open", price: "Rp 35.000", pemesan: "—", aksi: "Tutup Sesi" },
  { time: "14:00 – 15:00", badge: "badge-booked", badgeText: "Booked", price: "Rp 50.000", pemesan: "Budi A.", aksi: "Lihat Detail" },
];

export default function JadwalPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Schedule" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Atur Jadwal Lapangan</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash">Tutup Semua Sesi</button>
            <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Tambah Sesi</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="content-card">
            <div className="court-pills">
              <button className="court-pill active">Semua Lapangan</button>
              <button className="court-pill">Lapangan 1</button>
              <button className="court-pill">Lapangan 2</button>
              <button className="court-pill">Lapangan 3</button>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Waktu Sesi</th>
                  <th>Status</th>
                  <th>Harga / Jam</th>
                  <th>Pemesan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.time}</td>
                    <td><span className={`badge ${s.badge}`}>{s.badgeText}</span></td>
                    <td>{s.price}</td>
                    <td style={{ color: s.pemesan === "—" ? "#aaaaaa" : undefined }}>{s.pemesan}</td>
                    <td><button className="btn-action-sm">{s.aksi}</button></td>
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

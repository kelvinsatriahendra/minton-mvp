"use client";
import MitraSidebar from "@/components/MitraSidebar";

export default function DashboardMitraPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Booking" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Dashboard Mitra</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash"><i className="fa-solid fa-magnifying-glass"></i> Cari</button>
            <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Booking Baru</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-money-bill-trend-up"></i></div>
              <div className="stat-info"><h4>Pendapatan Hari Ini</h4><p>Rp 1.250.000</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-ticket"></i></div>
              <div className="stat-info"><h4>Booking Aktif</h4><p>12 Jadwal</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-door-open"></i></div>
              <div className="stat-info"><h4>Slot Tersedia</h4><p>8 Sesi</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-solid fa-star"></i></div>
              <div className="stat-info"><h4>Rating GOR</h4><p>4.8 / 5.0</p></div>
            </div>
          </div>

          <div className="schedule-grid-wrapper" style={{ flex: 1, minHeight: 0 }}>
            <div className="content-card" style={{ marginBottom: 0, display: "flex", flexDirection: "column", overflow: "hidden", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span className="content-card-title" style={{ margin: 0 }}>Jadwal Lapangan Minggu Ini</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-secondary-dash" style={{ padding: "4px 10px" }}><i className="fa-solid fa-chevron-left"></i></button>
                  <button className="btn-secondary-dash" style={{ padding: "4px 12px", fontSize: "12px" }}>Minggu Ini</button>
                  <button className="btn-secondary-dash" style={{ padding: "4px 10px" }}><i className="fa-solid fa-chevron-right"></i></button>
                </div>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                <table className="court-table">
                  <thead>
                    <tr>
                      <th className="cell-time" style={{ textAlign: "left", color: "#555" }}>Waktu</th>
                      <th>Sen</th><th>Sel</th><th>Rab</th><th>Kam</th><th>Jum</th><th>Sab</th><th>Min</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-time">08:00</td>
                      <td className="cell-closed"></td><td className="cell-closed"></td><td className="cell-closed"></td><td className="cell-closed"></td><td className="cell-closed"></td><td className="cell-closed"></td><td className="cell-closed"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">09:00</td>
                      <td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">10:00</td>
                      <td className="cell-empty"></td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">11:00</td>
                      <td className="cell-empty"></td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-booked">1B</td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">12:00</td>
                      <td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">13:00</td>
                      <td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-booked">2B</td><td className="cell-empty"></td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">14:00</td>
                      <td className="cell-empty"></td><td className="cell-booked">2B</td><td className="cell-booked">1B</td><td className="cell-booked">3B</td><td className="cell-booked">2B</td><td className="cell-booked">1B</td><td className="cell-empty"></td>
                    </tr>
                    <tr>
                      <td className="cell-time">15:00</td>
                      <td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td><td className="cell-empty"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="side-panel">
              <div className="content-card" style={{ marginBottom: 0, padding: "20px" }}>
                <p className="content-card-title" style={{ marginBottom: "15px" }}>Notifikasi Terbaru</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div className="stat-icon" style={{ width: "36px", height: "36px", fontSize: "14px", flexShrink: 0 }}><i className="fa-solid fa-bell"></i></div>
                    <div><p style={{ fontSize: "13px", marginBottom: "3px" }}>Booking baru dari Andi W.</p><p style={{ fontSize: "11px", color: "#666" }}>10 menit lalu</p></div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div className="stat-icon" style={{ width: "36px", height: "36px", fontSize: "14px", flexShrink: 0 }}><i className="fa-solid fa-star"></i></div>
                    <div><p style={{ fontSize: "13px", marginBottom: "3px" }}>Ulasan baru: ★★★★★</p><p style={{ fontSize: "11px", color: "#666" }}>1 jam lalu</p></div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div className="stat-icon" style={{ width: "36px", height: "36px", fontSize: "14px", flexShrink: 0 }}><i className="fa-solid fa-circle-check"></i></div>
                    <div><p style={{ fontSize: "13px", marginBottom: "3px" }}>Pembayaran terverifikasi</p><p style={{ fontSize: "11px", color: "#666" }}>3 jam lalu</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import MitraSidebar from "@/components/MitraSidebar";

const services = [
  { icon: "fa-solid fa-socks", name: "Sewa Sepatu", desc: "Persewaan sepatu badminton berbagai ukuran untuk pelanggan yang tidak membawa perlengkapan.", active: true },
  { icon: "fa-solid fa-bottle-water", name: "Kantin & Minuman", desc: "Penjualan minuman dingin dan makanan ringan di area GOR untuk pelanggan.", active: true },
  { icon: "fa-solid fa-screwdriver-wrench", name: "Jasa Pasang Senar", desc: "Layanan profesional pemasangan senar raket badminton dengan berbagai pilihan senar.", active: false },
  { icon: "fa-solid fa-shower", name: "Shower Air Hangat", desc: "Fasilitas mandi air hangat tersedia setelah berolahraga bagi pelanggan.", active: true },
  { icon: "fa-solid fa-shuttle-space", name: "Sewa Raket & Kok", desc: "Persewaan raket dan penjualan kok untuk keperluan bermain pelanggan.", active: true },
  { icon: "fa-solid fa-car", name: "Parkir Berbayar", desc: "Area parkir luas dengan tarif per kendaraan untuk pengelolaan yang lebih tertib.", active: false },
];

export default function LayananPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Service" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Layanan Tambahan</h1>
          <div className="mitra-header-actions">
            <button className="btn-primary-dash"><i className="fa-solid fa-plus"></i> Tambah Layanan</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon"><i className={s.icon}></i></div>
                <div>
                  <p className="service-name">{s.name}</p>
                  <p className="service-desc">{s.desc}</p>
                </div>
                <button className={`btn-toggle ${s.active ? "on" : ""}`}>
                  <i className={`fa-solid ${s.active ? "fa-circle-check" : "fa-circle-xmark"}`}></i>{" "}
                  {s.active ? "Aktif" : "Non-Aktif"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

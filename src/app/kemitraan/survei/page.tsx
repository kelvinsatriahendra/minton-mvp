"use client";
import MitraSidebar from "@/components/MitraSidebar";

const feedbacks = [
  { name: "Andi Wijaya", stars: 5, text: "Lapangannya sangat bersih dan pencahayaannya bagus sekali. Sangat puas main di sini, pasti balik lagi!", date: "8 Mei 2026 · Booking via Minton" },
  { name: "Siti Aminah", stars: 4, text: "Kantinnya kalau bisa ditambah menu minumannya lebih banyak lagi. Selebihnya pelayanan sudah sangat oke!", date: "7 Mei 2026 · Booking via Minton" },
  { name: "Budi Santoso", stars: 5, text: "Sistem booking lewat Minton mudah banget, langsung dapat konfirmasi. Lapangan juga sesuai foto, tidak mengecewakan.", date: "6 Mei 2026 · Booking via Minton" },
  { name: "Dewi Permata", stars: 3, text: "AC di lapangan 2 agak kurang dingin. Perlu dicek mungkin? Tapi secara keseluruhan fasilitas sudah cukup baik.", date: "5 Mei 2026 · Booking via Minton" },
];

function renderStars(n: number) {
  let s = "";
  for (let i = 0; i < 5; i++) s += i < n ? "★" : "<span style='color:#333;'>★</span>";
  return s;
}

export default function SurveiPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Survey" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Survei Pelanggan</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash"><i className="fa-solid fa-file-export"></i> Ekspor Laporan</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="survey-stats-row">
            <div className="survey-stat-card">
              <h2>4.8</h2>
              <p>Rating Rata-rata</p>
            </div>
            <div className="survey-stat-card">
              <h2>92%</h2>
              <p>Tingkat Kepuasan</p>
            </div>
            <div className="survey-stat-card">
              <h2>156</h2>
              <p>Total Masukan</p>
            </div>
          </div>

          <p className="content-card-title" style={{ marginBottom: "14px" }}>Masukan Terbaru</p>
          <div className="feedback-list">
            {feedbacks.map((f, i) => (
              <div key={i} className="feedback-item">
                <div className="feedback-meta">
                  <span className="feedback-name">{f.name}</span>
                  <span className="stars" dangerouslySetInnerHTML={{ __html: renderStars(f.stars) }}></span>
                </div>
                <p className="feedback-text">"{f.text}"</p>
                <p className="feedback-date">{f.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

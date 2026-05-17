"use client";

import { useEffect, useState } from 'react';
import MitraSidebar from "@/components/MitraSidebar";
import { getFeedbacks, getFeedbackStats, exportFeedbacks } from './actions';

interface Feedback {
  id: string; user_name: string; rating: number; comment: string; created_at: string;
}

function renderStars(n: number) {
  let s = "";
  for (let i = 0; i < 5; i++) s += i < n ? "★" : "<span style='color:#333;'>★</span>";
  return s;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SurveiPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({ avgRating: 0, satisfaction: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Survei Pelanggan - Minton'; }, []);

  useEffect(() => {
    (async () => {
      const [f, s] = await Promise.all([getFeedbacks(), getFeedbackStats()]);
      setFeedbacks(f);
      setStats(s);
      setLoading(false);
    })();
  }, []);

  async function handleExport() {
    const csv = await exportFeedbacks();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <MitraSidebar active="Survey" />
      <main className="mitra-main">
        <header className="mitra-header">
          <h1>Survei Pelanggan</h1>
          <div className="mitra-header-actions">
            <button className="btn-secondary-dash" onClick={handleExport}><i className="fa-solid fa-file-export"></i> Ekspor CSV</button>
          </div>
        </header>
        <div className="mitra-body">
          <div className="survey-stats-row">
            <div className="survey-stat-card">
              <h2>{stats.avgRating}</h2>
              <p>Rating Rata-rata</p>
              <div className="stars" style={{ marginTop: 4 }} dangerouslySetInnerHTML={{ __html: renderStars(Math.round(stats.avgRating)) }}></div>
            </div>
            <div className="survey-stat-card">
              <h2>{stats.satisfaction}%</h2>
              <p>Tingkat Kepuasan</p>
            </div>
            <div className="survey-stat-card">
              <h2>{stats.total}</h2>
              <p>Total Masukan</p>
            </div>
          </div>

          <p className="content-card-title" style={{ marginBottom: "14px" }}>Masukan Terbaru</p>
          {loading ? (
            <p style={{ color: '#aaa' }}>Memuat...</p>
          ) : feedbacks.length === 0 ? (
            <p style={{ color: '#555' }}>Belum ada masukan dari pelanggan</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map((f) => (
                <div key={f.id} className="feedback-item">
                  <div className="feedback-meta">
                    <span className="feedback-name">{f.user_name}</span>
                    <span className="stars" dangerouslySetInnerHTML={{ __html: renderStars(f.rating) }}></span>
                  </div>
                  <p className="feedback-text">&ldquo;{f.comment}&rdquo;</p>
                  <p className="feedback-date">{formatDate(f.created_at)} · Booking via Minton</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

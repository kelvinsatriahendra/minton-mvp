'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ProfilPage() {
  const [tab, setTab] = useState(0);
  useEffect(() => { document.title = 'Profil Saya - Minton'; }, []);

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Profil Saya</h1>
        <div className="header-actions">
          <button className="btn-primary-dash">Simpan Perubahan</button>
        </div>
      </header>
      <div className="page-body">
        <style jsx>{`
          .profile-header {
            display: flex;
            align-items: center;
            gap: 32px;
            margin-bottom: 40px;
            padding: 32px;
            background: linear-gradient(135deg, #1d1d1d 0%, #111 100%);
            border: 1px solid var(--border-color);
            border-radius: 20px;
          }
          .profile-avatar-large {
            width: 120px;
            height: 120px;
            background: var(--primary-lime);
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 800;
            color: #000;
            position: relative;
          }
          .edit-avatar {
            position: absolute;
            bottom: -8px;
            right: -8px;
            width: 36px;
            height: 36px;
            background: #252525;
            border: 2px solid var(--primary-lime);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-lime);
            cursor: pointer;
            font-size: 14px;
          }
          .profile-meta h2 {
            font-size: 28px;
            margin-bottom: 8px;
          }
          .profile-meta p {
            color: var(--text-gray);
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .settings-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 32px;
          }
          .settings-tabs {
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--border-color);
          }
          .tab-btn {
            background: none;
            border: none;
            padding: 12px 4px;
            color: var(--text-gray);
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            position: relative;
            font-family: inherit;
          }
          .tab-btn.active {
            color: var(--primary-lime);
          }
          .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--primary-lime);
          }
          .form-section {
            margin-bottom: 32px;
          }
          .form-section h3 {
            font-size: 18px;
            margin-bottom: 20px;
            color: var(--primary-lime);
          }
          .gold-member-card {
            background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 45%, #b38728 100%);
            border: none;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(191, 149, 63, 0.3);
            color: #1a1608;
          }
          .gold-member-card h4 {
            color: #000;
            font-weight: 800;
          }
          .gold-member-card p {
            color: rgba(0, 0, 0, 0.7);
          }
          .gold-member-card .btn-gold {
            background: #1a1608;
            color: #fcf6ba;
            border: none;
            font-weight: 700;
          }
          .gold-member-card .btn-gold:hover {
            background: #000;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          .gold-member-card::after {
            content: '';
            position: absolute;
            top: -20%;
            right: -10%;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.4);
            filter: blur(40px);
            border-radius: 50%;
            pointer-events: none;
          }
          @media (max-width: 768px) {
            .settings-grid { grid-template-columns: 1fr; }
            .profile-header { flex-direction: column; text-align: center; }
          }
        `}</style>

        <div className="profile-header">
          <div className="profile-avatar-large">
            BS
            <div className="edit-avatar"><i className="fa-solid fa-camera"></i></div>
          </div>
          <div className="profile-meta">
            <h2>Bagas Saputra</h2>
            <p>
              <span><i className="fa-solid fa-envelope"></i> bagas.saputra@email.com</span>
              <span><i className="fa-solid fa-phone"></i> +62 812 3456 7890</span>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="badge badge-gold">Member Gold</span>
              <span className="badge badge-pro">Semi-Pro</span>
            </div>
          </div>
        </div>

        <div className="settings-grid">
          <div className="main-settings">
            <div className="settings-tabs">
              <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>Informasi Pribadi</button>
              <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>Keamanan</button>
              <button className={`tab-btn ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>Notifikasi</button>
            </div>

            {tab === 0 && (
              <div className="content-card">
                <div className="form-section">
                  <h3>Biodata</h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Depan</label>
                      <input type="text" className="form-input" defaultValue="Bagas" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nama Belakang</label>
                      <input type="text" className="form-input" defaultValue="Saputra" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alamat Email</label>
                    <input type="email" className="form-input" defaultValue="bagas.saputra@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor Telepon</label>
                    <input type="tel" className="form-input" defaultValue="081234567890" />
                  </div>
                </div>

                <div className="form-section" style={{ marginBottom: 0 }}>
                  <h3>Domisili</h3>
                  <div className="form-group">
                    <label className="form-label">Kota</label>
                    <select className="form-select">
                      <option>Surabaya</option>
                      <option>Sidoarjo</option>
                      <option>Gresik</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {tab === 1 && (
              <div className="content-card">
                <p style={{ color: '#aaa' }}>Pengaturan keamanan akan segera hadir.</p>
              </div>
            )}

            {tab === 2 && (
              <div className="content-card">
                <p style={{ color: '#aaa' }}>Pengaturan notifikasi akan segera hadir.</p>
              </div>
            )}
          </div>

          <div className="side-panel">
            <div className="content-card">
              <span className="content-card-title">Statistik Pemain</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-gray)', fontSize: 14 }}>Win Rate</span>
                  <span style={{ fontWeight: 700 }}>68%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#252525', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: 'var(--primary-lime)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ color: 'var(--text-gray)', fontSize: 14 }}>Stamina</span>
                  <span style={{ fontWeight: 700 }}>85%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#252525', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'var(--primary-lime)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ color: 'var(--text-gray)', fontSize: 14 }}>Power</span>
                  <span style={{ fontWeight: 700 }}>74%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#252525', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '74%', height: '100%', background: 'var(--primary-lime)' }} />
                </div>
              </div>
            </div>

            <div className="content-card gold-member-card">
              <h4 style={{ marginBottom: 12, fontSize: 15 }}>Minton Gold Member</h4>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>Berlaku hingga 12 Des 2024. Nikmati akses prioritas booking lapangan!</p>
              <button className="btn-secondary-dash btn-gold" style={{ width: '100%', marginTop: 16, fontSize: 12 }}>Kelola Langganan</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}

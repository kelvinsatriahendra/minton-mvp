
'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ProfilPage() {
  const [tab, setTab] = useState(0);
  const tabs = ['Akun', 'Notifikasi', 'Keamanan'];

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Profil Saya</h1>
      </header>
      <div className="page-body">
        <style>{`
          .profile-top { display: flex; align-items: center; gap: 32px; margin-bottom: 40px; background: #1d1d1d; border: 1px solid #333; border-radius: 20px; padding: 32px; }
          .profile-avatar-wrap { position: relative; width: 100px; height: 100px; }
          .profile-avatar-wrap img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
          .profile-avatar-overlay { position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; background: #bdd124; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; cursor: pointer; border: 3px solid #1d1d1d; }
          .profile-info h2 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
          .profile-info p { color: #aaa; font-size: 14px; }
          .profile-tabs { display: flex; gap: 32px; border-bottom: 1px solid #333; margin-bottom: 32px; }
          .profile-tab { padding: 12px 4px; color: #aaa; font-weight: 600; font-size: 14px; cursor: pointer; position: relative; transition: 0.2s; }
          .profile-tab.active { color: #bdd124; }
          .profile-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #bdd124; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .form-group { margin-bottom: 20px; }
          .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: #aaa; }
          .form-group input, .form-group select { width: 100%; padding: 12px 16px; background: #111; border: 1px solid #333; border-radius: 10px; color: #fff; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; }
          .form-group input:focus { border-color: #bdd124; }
          @media (max-width: 768px) {
            .profile-top { flex-direction: column; text-align: center; }
            .form-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="profile-top">
          <div className="profile-avatar-wrap">
            <img src="/asset/testimoni-rina.png" alt="avatar" />
            <div className="profile-avatar-overlay"><i className="fa-solid fa-camera"></i></div>
          </div>
          <div className="profile-info">
            <h2>Bagas Saputra</h2>
            <p>bagas.saputra@email.com</p>
            <p style={{ marginTop: 8 }}><span className="badge badge-booked">Member Gold</span></p>
          </div>
        </div>
        <div className="profile-tabs">
          {tabs.map((t, i) => (
            <div key={i} className={`profile-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</div>
          ))}
        </div>
        {tab === 0 && (
          <div className="content-card">
            <div className="form-grid">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" defaultValue="Bagas Saputra" />
              </div>
              <div className="form-group">
                <label>Nomor Whatsapp</label>
                <input type="text" defaultValue="081234567890" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="bagas.saputra@email.com" />
              </div>
              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input type="date" defaultValue="1998-05-12" />
              </div>
              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select defaultValue="L">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="form-group">
                <label>Kota</label>
                <input type="text" defaultValue="Surabaya" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button className="btn-primary-dash">Simpan Perubahan</button>
              <button className="btn-secondary-dash">Batal</button>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="content-card">
            <p style={{ color: '#aaa' }}>Pengaturan notifikasi akan segera hadir.</p>
          </div>
        )}
        {tab === 2 && (
          <div className="content-card">
            <p style={{ color: '#aaa' }}>Pengaturan keamanan akan segera hadir.</p>
          </div>
        )}
      </div>
    </DashboardSidebar>
  );
}

'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getProfileData, updateProfileData, updatePasswordAction, updateNotificationPrefs, getUserStats } from './actions';

export default function ProfilPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [namaDepan, setNamaDepan] = useState('');
const [level, setLevel] = useState('Pemula');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [email, setEmail] = useState('');
  const [kota, setKota] = useState('Surabaya');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const [notifBooking, setNotifBooking] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifJadwal, setNotifJadwal] = useState(true);
  const [notifSuccess, setNotifSuccess] = useState(false);

  const initial = (namaDepan.charAt(0) + namaBelakang.charAt(0)).toUpperCase() || 'U';

  useEffect(() => {
    document.title = 'Profil Saya - Minton';
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    const data = await getProfileData();
const stats = await getUserStats();
if (stats) {
  setLevel(stats.level);
}
    if (data) {
      const names = data.nama_lengkap.split(' ');
      setNamaDepan(names[0] || '');
      setNamaBelakang(names.slice(1).join(' ') || '');
      setEmail(data.email);
      setKota(data.kota || 'Surabaya');
      setNotifBooking(data.notifPrefs.email_booking);
      setNotifPromo(data.notifPrefs.email_promo);
      setNotifJadwal(data.notifPrefs.pengingat_jadwal);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set('namaDepan', namaDepan);
    formData.set('namaBelakang', namaBelakang);
    formData.set('kota', kota);

    const result = await updateProfileData(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  async function handleChangePassword() {
    setPwError(null);
    setPwSuccess(false);
    const result = await updatePasswordAction(currentPassword, newPassword, confirmPassword);
    if (result.error) {
      setPwError(result.error);
    } else {
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  async function handleSaveNotif() {
    setNotifSuccess(false);
    const prefs = { email_booking: notifBooking, email_promo: notifPromo, pengingat_jadwal: notifJadwal };
    await updateNotificationPrefs(prefs);
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 3000);
  }

  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Profil Saya</h1>
        <div className="header-actions">
          {success && (
            <span style={{ color: 'var(--primary-lime)', fontSize: 14, marginRight: 12 }}>Tersimpan!</span>
          )}
          {tab === 0 && (
            <button className="btn-primary-dash" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          )}
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
          .profile-meta h2 { font-size: 28px; margin-bottom: 8px; }
          .profile-meta p { color: var(--text-gray); font-size: 15px; display: flex; align-items: center; gap: 12px; }
          .settings-grid { display: grid; grid-template-columns: 1fr 350px; gap: 32px; }
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
          .tab-btn.active { color: var(--primary-lime); }
          .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--primary-lime);
          }
          .form-section { margin-bottom: 32px; }
          .form-section h3 { font-size: 18px; margin-bottom: 20px; color: var(--primary-lime); }
          .gold-member-card {
            background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 45%, #b38728 100%);
            border: none;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(191, 149, 63, 0.3);
            color: #1a1608;
          }
          .gold-member-card h4 { color: #000; font-weight: 800; }
          .gold-member-card p { color: rgba(0, 0, 0, 0.7); }
          .gold-member-card .btn-gold { background: #1a1608; color: #fcf6ba; border: none; font-weight: 700; }
          .gold-member-card .btn-gold:hover { background: #000; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
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
          .toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
            border-bottom: 1px solid var(--border-color);
          }
          .toggle-row:last-child { border-bottom: none; }
          .toggle-info h5 { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #fff; }
          .toggle-info p { font-size: 12px; color: var(--text-gray); }
          .toggle-switch {
            width: 48px;
            height: 26px;
            background: #333;
            border-radius: 13px;
            position: relative;
            cursor: pointer;
            transition: 0.3s;
            flex-shrink: 0;
          }
          .toggle-switch.active { background: var(--primary-lime); }
          .toggle-switch::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            transition: 0.3s;
          }
          .toggle-switch.active::after { left: 25px; }
          @media (max-width: 768px) {
            .settings-grid { grid-template-columns: 1fr; }
            .profile-header { flex-direction: column; text-align: center; }
          }
        `}</style>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--primary-lime)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <p style={{ color: '#aaa' }}>Memuat profil...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-avatar-large">
                {initial}
                <div className="edit-avatar"><i className="fa-solid fa-camera"></i></div>
              </div>
              <div className="profile-meta">
                <h2>{namaDepan} {namaBelakang}</h2>
                  <p>
                    <span><i className="fa-solid fa-envelope"></i> {email}</span>
                  </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="badge badge-gold">Member Gold</span>
                  <span className="badge badge-pro">{level}</span>
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
                    {error && (
                      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        {error}
                      </div>
                    )}

                    <div className="form-section">
                      <h3>Biodata</h3>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Nama Depan</label>
                          <input type="text" className="form-input" value={namaDepan} onChange={e => setNamaDepan(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Nama Belakang</label>
                          <input type="text" className="form-input" value={namaBelakang} onChange={e => setNamaBelakang(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Alamat Email</label>
                        <input type="email" className="form-input" value={email} disabled style={{ opacity: 0.6 }} />
                      </div>
                    </div>

                    <div className="form-section" style={{ marginBottom: 0 }}>
                      <h3>Domisili</h3>
                      <div className="form-group">
                        <label className="form-label">Kota</label>
                        <select className="form-select" value={kota} onChange={e => setKota(e.target.value)}>
                          <option value="Surabaya">Surabaya</option>
                          <option value="Sidoarjo">Sidoarjo</option>
                          <option value="Gresik">Gresik</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 1 && (
                  <div className="content-card">
                    {pwError && (
                      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        {pwError}
                      </div>
                    )}
                    {pwSuccess && (
                      <div style={{ backgroundColor: 'rgba(189, 209, 36, 0.1)', border: '1px solid var(--primary-lime)', color: 'var(--primary-lime)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        Kata sandi berhasil diubah!
                      </div>
                    )}

                    <div className="form-section">
                      <h3>Ubah Kata Sandi</h3>
                      <div className="form-group">
                        <label className="form-label">Kata Sandi Saat Ini</label>
                        <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Masukkan kata sandi saat ini" />
                      </div>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Kata Sandi Baru</label>
                          <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 8 karakter" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Konfirmasi Kata Sandi Baru</label>
                          <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi baru" />
                        </div>
                      </div>
                      <button className="btn-primary-dash" onClick={handleChangePassword} style={{ marginTop: 8 }}>
                        Ubah Kata Sandi
                      </button>
                    </div>
                  </div>
                )}

                {tab === 2 && (
                  <div className="content-card">
                    {notifSuccess && (
                      <div style={{ backgroundColor: 'rgba(189, 209, 36, 0.1)', border: '1px solid var(--primary-lime)', color: 'var(--primary-lime)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        Preferensi notifikasi disimpan!
                      </div>
                    )}

                    <div className="form-section" style={{ marginBottom: 0 }}>
                      <h3>Notifikasi Email</h3>

                      <div className="toggle-row">
                        <div className="toggle-info">
                          <h5>Konfirmasi Booking</h5>
                          <p>Dapatkan notifikasi saat booking dikonfirmasi</p>
                        </div>
                        <div className={`toggle-switch ${notifBooking ? 'active' : ''}`} onClick={() => setNotifBooking(!notifBooking)} />
                      </div>

                      <div className="toggle-row">
                        <div className="toggle-info">
                          <h5>Promo & Penawaran</h5>
                          <p>Info promo spesial dan penawaran terbaru</p>
                        </div>
                        <div className={`toggle-switch ${notifPromo ? 'active' : ''}`} onClick={() => setNotifPromo(!notifPromo)} />
                      </div>

                      <div className="toggle-row">
                        <div className="toggle-info">
                          <h5>Pengingat Jadwal</h5>
                          <p>Pengingat H-1 sebelum jadwal booking</p>
                        </div>
                        <div className={`toggle-switch ${notifJadwal ? 'active' : ''}`} onClick={() => setNotifJadwal(!notifJadwal)} />
                      </div>

                      <button className="btn-primary-dash" onClick={handleSaveNotif} style={{ marginTop: 20 }}>
                        Simpan Pengaturan
                      </button>
                    </div>
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
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>Nikmati akses prioritas booking lapangan!</p>
                  <button className="btn-secondary-dash btn-gold" style={{ width: '100%', marginTop: 16, fontSize: 12 }}>Kelola Langganan</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardSidebar>
  );
}

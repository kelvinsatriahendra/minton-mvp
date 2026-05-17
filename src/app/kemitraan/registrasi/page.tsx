"use client";
import { useEffect, useActionState, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { registerMitraAction } from './actions';

const FACILITIES_LIST = [
  { id: "wifi", label: "WiFi", icon: "wifi" },
  { id: "parkir", label: "Parkir Luas", icon: "car" },
  { id: "ruang_ganti", label: "Ruang Ganti", icon: "faucet-detergent" },
  { id: "kantin", label: "Kantin", icon: "utensils" },
  { id: "mushola", label: "Mushola", icon: "mosque" },
  { id: "shower", label: "Shower Area", icon: "shower" }
];

export default function RegistrasiPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerMitraAction, null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => { 
    document.title = 'Registrasi Mitra - Minton'; 
  }, []);

  useEffect(() => {
    if (state?.success) {
      router.push('/kemitraan/dashboard-mitra');
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <>
      <header className="navbar">
        <div className="container nav-wrapper">
          <div className="logo">
            <Link href="/"><img src="/asset/logo.png" alt="logo" /></Link>
          </div>
          <nav>
            <Link href="/kemitraan">Kembali ke Kemitraan</Link>
          </nav>
        </div>
      </header>

      <div className="reg-container">
        <div className="reg-header">
          <h1>Daftarkan <span style={{ color: "var(--primary-lime)" }}>GOR Anda</span></h1>
          <p>Lengkapi data di bawah untuk bergabung dalam ekosistem digital Minton.</p>
        </div>

        <div className="reg-body">
          {state?.message && !state.success && (
            <div style={{ padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
              {state.message}
            </div>
          )}

          <form action={formAction}>
            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-building"></i> Informasi GOR & Akun
              </div>
              <div className="grid-inputs">
                <div className="form-group">
                  <label>Nama GOR / Lapangan</label>
                  <input type="text" name="gor_name" placeholder="Contoh: GOR Sudirman Jaya" required />
                  {state?.errors?.gor_name && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.gor_name[0]}</span>}
                </div>
                <div className="form-group">
                  <label>Nama Pemilik / Pengelola</label>
                  <input type="text" name="owner_name" placeholder="Nama Lengkap" required />
                  {state?.errors?.owner_name && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.owner_name[0]}</span>}
                </div>
                <div className="form-group">
                  <label>Email Bisnis (Untuk Login)</label>
                  <input type="email" name="email" placeholder="gor@email.com" required />
                  {state?.errors?.email && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.email[0]}</span>}
                </div>
                <div className="form-group full" style={{ position: 'relative' }}>
                  <label>Kata Sandi (Untuk Login Dashboard)</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={passwordVisible ? "text" : "password"} 
                      name="password"
                      placeholder="Minimal 6 karakter" 
                      required 
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      <i className={`fa-regular ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {state?.errors?.password && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.password[0]}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-location-dot"></i> Detail Lokasi
              </div>
              <div className="grid-inputs">
                <div className="form-group full">
                  <label>Alamat Lengkap GOR</label>
                  <textarea name="address" rows={3} placeholder="Jl. Raya Utama No. 123..." required></textarea>
                  {state?.errors?.address && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.address[0]}</span>}
                </div>
                <div className="form-group">
                  <label>Kota / Kabupaten</label>
                  <input type="text" name="city" placeholder="Contoh: Surabaya" required />
                  {state?.errors?.city && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.city[0]}</span>}
                </div>
                <div className="form-group">
                  <label>Link Google Maps (Opsional)</label>
                  <input type="url" name="maps_url" placeholder="https://maps.google.com/..." />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <i className="fa-solid fa-star"></i> Fasilitas & Lapangan
              </div>
              <div className="grid-inputs" style={{ marginBottom: "20px" }}>
                <div className="form-group">
                  <label>Jumlah Lapangan</label>
                  <input type="number" name="court_count" min={1} placeholder="1" required />
                  {state?.errors?.court_count && <span style={{ color: 'red', fontSize: '12px' }}>{state.errors.court_count[0]}</span>}
                </div>
                <div className="form-group">
                  <label>Jenis Lantai</label>
                  <select name="floor_type">
                    <option value="Vinyl (Standard BWF)">Vinyl (Standard BWF)</option>
                    <option value="Parquet / Kayu">Parquet / Kayu</option>
                    <option value="Semen / Beton">Semen / Beton</option>
                    <option value="Karpet Biasa">Karpet Biasa</option>
                  </select>
                </div>
              </div>

              <label style={{ marginBottom: "15px", display: "block" }}>Fasilitas Tersedia:</label>
              <div className="facility-grid">
                {FACILITIES_LIST.map((fac, i) => (
                  <div className="facility-item" key={i}>
                    <input type="checkbox" name={`facility_${fac.id}`} value={fac.label} id={`f${i}`} />
                    <label htmlFor={`f${i}`} className="facility-label">
                      <i className={`fa-solid fa-${fac.icon}`}></i>{" "}
                      {fac.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-submit-reg" disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
              {isPending ? 'Memproses Pendaftaran...' : 'Daftarkan Sekarang'} <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>

      <footer className="footer" style={{ padding: "40px 0" }}>
        <div className="container" style={{ textAlign: "center", color: "#555", fontSize: "14px" }}>
          <p>&copy; 2026 Minton Partnership Program. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo-footer">
            <Link href="/"><img src="/asset/logo.png" alt="logo-footer" /></Link>
          </div>
          <p style={{ color: '#aaa', fontSize: '14px', marginTop: '20px', maxWidth: '300px' }}>
            Platform booking lapangan badminton terbesar dan terpercaya di Indonesia.
          </p>
        </div>

        <div>
          <h4>Perusahaan</h4>
          <Link href="#">Tentang Kami</Link>
          <Link href="#">Kebijakan Privasi</Link>
          <Link href="#">Syarat & Ketentuan</Link>
        </div>

        <div>
          <h4>Ekosistem</h4>
          <Link href="/sewa-lapangan">Sewa Lapangan</Link>
          <Link href="/main-bareng">Main Bareng</Link>
          <Link href="/kemitraan">Kemitraan</Link>
          <Link href="/komunitas">Komunitas</Link>
        </div>

        <div>
          <h4>Hubungi Kami</h4>
          <Link href="#"><i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i> support@minton.id</Link>
          <Link href="#"><i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i> +62 812-3456-7890</Link>
        </div>

        <div className="social-media">
          <Link href="#"><img src="/asset/facebook.png" alt="facebook" /></Link>
          <Link href="#"><img src="/asset/instagram.png" alt="instagram" /></Link>
          <Link href="#"><img src="/asset/linkedin.png" alt="linkedin" /></Link>
          <Link href="#"><img src="/asset/youtube.png" alt="youtube" /></Link>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid #333', marginTop: '40px', paddingTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '12px' }}>&copy; 2026 Minton Indonesia. All Rights Reserved.</p>
      </div>
    </footer>
  );
}


import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .footer {
          padding: 60px 0 40px;
          border-top: 1px solid #333;
          margin-top: 80px;
          background-color: #000;
        }
        .footer-grid {
          width: 90%;
          max-width: 1600px;
          margin: auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 60px;
        }
        .logo-footer img {
          height: 28px;
        }
        .footer h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #fff;
        }
        .footer a {
          color: #aaa;
          font-size: 14px;
          text-decoration: none;
          display: block;
          margin-bottom: 12px;
          transition: color 0.2s, padding-left 0.2s;
        }
        .footer a:hover {
          color: var(--primary-lime);
          padding-left: 4px;
        }
        .social-media {
          display: flex;
          gap: 20px;
        }
        .social-media img {
          width: 24px;
          height: 24px;
          transition: transform 0.25s ease, filter 0.25s;
          cursor: pointer;
        }
        .social-media img:hover {
          transform: translateY(-5px) scale(1.1);
          filter: brightness(1.4);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .social-media {
            justify-content: center;
          }
        }
      `}} />
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="logo-footer">
              <Link href="/"><img src="/asset/logo.png" alt="logo-footer" /></Link>
            </div>
          </div>

          <div>
            <h4>Perusahaan</h4>
            <Link href="#">Tentang Kami</Link>
            <Link href="#">Kebijakan Privasi</Link>
            <Link href="#">Syarat & Ketentuan</Link>
          </div>

          <div>
            <h4>Ekosistem</h4>
            <Link href="/sewa-lapangan">Direktori Lapangan</Link>
          </div>

          <div>
            <h4>Hubungi Kami</h4>
            <Link href="#">Kontak</Link>
          </div>

          <div className="social-media">
            <img src="/asset/facebook.png" alt="facebook" />
            <img src="/asset/instagram.png" alt="instagram" />
            <img src="/asset/linkedin.png" alt="linkedin" />
            <img src="/asset/youtube.png" alt="youtube" />
          </div>
        </div>
      </footer>
    </>
  );
}


'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

export default function MintonPayPage() {
  return (
    <DashboardSidebar>
      <header className="page-header">
        <h1>Minton Pay</h1>
        <div className="header-actions">
          <button className="btn-secondary-dash"><i className="fa-solid fa-shield-halved"></i> Keamanan</button>
        </div>
      </header>
      <div className="page-body">
        <style>{`
          .pay-header { background: linear-gradient(135deg,#1d1d1d,#111); border: 1px solid #333; border-radius: 20px; padding: 32px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; position: relative; overflow: hidden; }
          .pay-header::after { content: ''; position: absolute; right: -50px; top: -50px; width: 200px; height: 200px; background: #bdd124; opacity: 0.05; border-radius: 50%; }
          .balance-info h2 { font-size: 14px; color: #aaa; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .balance-amount { font-size: 36px; font-weight: 800; }
          .pay-actions { display: flex; gap: 16px; }
          .pay-btn { display: flex; flex-direction: column; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); border: 1px solid #333; padding: 16px 24px; border-radius: 16px; cursor: pointer; transition: 0.3s; min-width: 110px; }
          .pay-btn:hover { background: rgba(189,209,36,0.1); border-color: #bdd124; transform: translateY(-4px); }
          .pay-btn i { font-size: 20px; color: #bdd124; }
          .pay-btn span { font-size: 13px; font-weight: 600; }
          .transaction-section { display: grid; grid-template-columns: 1fr 350px; gap: 32px; }
          .history-list { display: flex; flex-direction: column; gap: 8px; }
          .history-item { display: flex; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.2s; }
          .history-item:hover { background: rgba(255,255,255,0.02); }
          .history-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-right: 16px; }
          .history-details { flex: 1; }
          .history-details h4 { font-size: 15px; margin-bottom: 4px; }
          .history-details p { font-size: 12px; color: #aaa; }
          .history-amount { text-align: right; font-weight: 700; }
          .amount-minus { color: #ff5252; }
          .amount-plus { color: #bdd124; }
          .payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
          .method-card { border: 1px solid #333; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
          .method-card:hover { border-color: #bdd124; background: rgba(189,209,36,0.05); }
          .method-card i { font-size: 20px; color: #aaa; }
          .method-card span { font-size: 13px; }
          .promo-card { background: rgba(189,209,36,0.05); border-color: #bdd124; display: flex; gap: 16px; align-items: center; }
          @media (max-width: 768px) {
            .transaction-section { grid-template-columns: 1fr; }
            .pay-header { flex-direction: column; gap: 24px; text-align: center; }
          }
        `}</style>
        <div className="pay-header">
          <div className="balance-info">
            <h2>Saldo Anda</h2>
            <div className="balance-amount">Rp 750.000</div>
            <p style={{ color: '#aaa', fontSize: 13, marginTop: 8 }}><i className="fa-solid fa-circle-check" style={{ color: '#bdd124' }}></i> Akun Terverifikasi</p>
          </div>
          <div className="pay-actions">
            <div className="pay-btn"><i className="fa-solid fa-plus"></i><span>Top Up</span></div>
            <div className="pay-btn"><i className="fa-solid fa-paper-plane"></i><span>Transfer</span></div>
            <div className="pay-btn"><i className="fa-solid fa-clock-rotate-left"></i><span>Riwayat</span></div>
          </div>
        </div>
        <div className="transaction-section">
          <div className="content-card">
            <span className="content-card-title">Transaksi Terakhir</span>
            <div className="history-list">
              <div className="history-item">
                <div className="history-icon"><i className="fa-solid fa-shuttlecock"></i></div>
                <div className="history-details">
                  <h4>Main Bareng: GOR Sudirman</h4>
                  <p>Hari ini • 14:20</p>
                </div>
                <div className="history-amount amount-minus">- Rp 30.000</div>
              </div>
              <div className="history-item">
                <div className="history-icon"><i className="fa-solid fa-wallet"></i></div>
                <div className="history-details">
                  <h4>Top Up via BCA Virtual Account</h4>
                  <p>Kemarin • 09:15</p>
                </div>
                <div className="history-amount amount-plus">+ Rp 500.000</div>
              </div>
              <div className="history-item">
                <div className="history-icon"><i className="fa-solid fa-calendar-check"></i></div>
                <div className="history-details">
                  <h4>Sewa Lapangan: Kalam Kudus</h4>
                  <p>08 Mei 2024 • 18:30</p>
                </div>
                <div className="history-amount amount-minus">- Rp 120.000</div>
              </div>
              <div className="history-item">
                <div className="history-icon"><i className="fa-solid fa-shuttlecock"></i></div>
                <div className="history-details">
                  <h4>Refund: Main Bareng Surabaya Hall</h4>
                  <p>07 Mei 2024 • 11:00</p>
                </div>
                <div className="history-amount amount-plus">+ Rp 30.000</div>
              </div>
            </div>
            <button className="btn-secondary-dash" style={{ width: '100%', marginTop: 24 }}>Lihat Semua Transaksi</button>
          </div>
          <div>
            <div className="content-card">
              <span className="content-card-title">Metode Top Up</span>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>Pilih metode pembayaran favorit Anda untuk isi saldo.</p>
              <div className="payment-methods">
                <div className="method-card"><i className="fa-solid fa-building-columns"></i><span>Transfer Bank</span></div>
                <div className="method-card"><i className="fa-solid fa-credit-card"></i><span>Kartu Kredit</span></div>
                <div className="method-card"><i className="fa-solid fa-store"></i><span>Retail Outlets</span></div>
                <div className="method-card"><i className="fa-solid fa-qrcode"></i><span>QRIS</span></div>
              </div>
            </div>
            <div className="content-card promo-card">
              <div style={{ width: 40, height: 40, background: '#bdd124', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <i className="fa-solid fa-gift"></i>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#bdd124' }}>Promo Minton Pay</h4>
                <p style={{ fontSize: 12, color: '#aaa' }}>Cashback 10% untuk sewa lapangan setiap akhir pekan!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}

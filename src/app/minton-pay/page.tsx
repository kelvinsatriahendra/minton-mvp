'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getWallet, topUp, transfer, getAllTransactions } from './actions';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  if (days === 0) return `Hari ini • ${time}`;
  if (days === 1) return `Kemarin • ${time}`;
  return `${date} • ${time}`;
}

function formatAmount(n: number) {
  return n.toLocaleString('id-ID');
}

function txIcon(type: string) {
  switch (type) {
    case 'topup': return 'fa-solid fa-wallet';
    case 'payment': return 'fa-solid fa-shuttlecock';
    case 'transfer_out': return 'fa-solid fa-paper-plane';
    case 'transfer_in': return 'fa-solid fa-arrow-down';
    case 'refund': return 'fa-solid fa-rotate-left';
    default: return 'fa-solid fa-receipt';
  }
}

function txLabel(type: string, description: string) {
  if (description) return description;
  switch (type) {
    case 'topup': return 'Top Up Saldo';
    case 'payment': return 'Pembayaran';
    case 'transfer_out': return 'Transfer Keluar';
    case 'transfer_in': return 'Transfer Masuk';
    case 'refund': return 'Refund';
    default: return 'Transaksi';
  }
}

export default function MintonPayPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [topUpModal, setTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  const [transferModal, setTransferModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  const [allTxModal, setAllTxModal] = useState(false);
  const [allTx, setAllTx] = useState<any[]>([]);
  const [allTxLoading, setAllTxLoading] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { document.title = 'Minton Pay - Minton'; }, []);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  useEffect(() => {
    (async () => {
      const email = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*=\s*([^;]*).*$)|^.*$/, '$1');
      setUserEmail(email);
      if (!email) { setLoading(false); return; }
      const data = await getWallet(email);
      setBalance(data.balance);
      setTransactions(data.transactions);
      setLoading(false);
    })();
  }, []);

  const handleTopUp = useCallback(async () => {
    if (!userEmail) {
      setNotification({ message: 'Silakan login terlebih dahulu.', type: 'error' });
      return;
    }
    const amount = parseInt(topUpAmount.replace(/\D/g, ''));
    if (!amount || amount < 1000) {
      setNotification({ message: 'Minimal top-up Rp 1.000', type: 'error' });
      return;
    }
    setTopUpLoading(true);
    const result = await topUp(userEmail, amount);
    setNotification({ message: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      const data = await getWallet(userEmail);
      setBalance(data.balance);
      setTransactions(data.transactions);
      setTopUpModal(false);
      setTopUpAmount('');
    }
    setTopUpLoading(false);
  }, [userEmail, topUpAmount]);

  const handleTransfer = useCallback(async () => {
    if (!userEmail) {
      setNotification({ message: 'Silakan login terlebih dahulu.', type: 'error' });
      return;
    }
    const amount = parseInt(transferAmount.replace(/\D/g, ''));
    if (!amount || amount < 1000) {
      setNotification({ message: 'Minimal transfer Rp 1.000', type: 'error' });
      return;
    }
    if (!transferEmail.includes('@')) {
      setNotification({ message: 'Email tujuan tidak valid', type: 'error' });
      return;
    }
    setTransferLoading(true);
    const result = await transfer(userEmail, amount, transferEmail);
    setNotification({ message: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      const data = await getWallet(userEmail);
      setBalance(data.balance);
      setTransactions(data.transactions);
      setTransferModal(false);
      setTransferEmail('');
      setTransferAmount('');
    }
    setTransferLoading(false);
  }, [userEmail, transferAmount, transferEmail]);

  const handleAllTransactions = useCallback(async () => {
    setAllTxLoading(true);
    const data = await getAllTransactions(userEmail);
    setAllTx(data);
    setAllTxModal(true);
    setAllTxLoading(false);
  }, [userEmail]);

  function closeModal() {
    setTopUpModal(false);
    setTransferModal(false);
    setAllTxModal(false);
    document.body.style.overflow = 'auto';
  }

  function openTopUpModal() {
    setTopUpAmount('');
    setTopUpModal(true);
    document.body.style.overflow = 'hidden';
  }

  function openTransferModal() {
    setTransferEmail('');
    setTransferAmount('');
    setTransferModal(true);
    document.body.style.overflow = 'hidden';
  }

  return (
    <DashboardSidebar>
      <style>{`
        .pay-header { background: linear-gradient(135deg,#1d1d1d,#111); border: 1px solid #333; border-radius: 20px; padding: 32px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; position: relative; overflow: hidden; }
        .pay-header::after { content: ''; position: absolute; right: -50px; top: -50px; width: 200px; height: 200px; background: var(--primary-lime); opacity: 0.05; border-radius: 50%; }
        .balance-info h2 { font-size: 14px; color: #aaa; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .balance-amount { font-size: 36px; font-weight: 800; }
        .pay-actions { display: flex; gap: 16px; }
        .pay-btn { display: flex; flex-direction: column; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); border: 1px solid #333; padding: 16px 24px; border-radius: 16px; cursor: pointer; transition: 0.3s; min-width: 110px; }
        .pay-btn:hover { background: rgba(189,209,36,0.1); border-color: var(--primary-lime); transform: translateY(-4px); }
        .pay-btn i { font-size: 20px; color: var(--primary-lime); }
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
        .amount-plus { color: var(--primary-lime); }
        .payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .method-card { border: 1px solid #333; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
        .method-card:hover { border-color: var(--primary-lime); background: rgba(189,209,36,0.05); }
        .method-card i { font-size: 20px; color: #aaa; }
        .method-card span { font-size: 13px; }
        .promo-card { background: rgba(189,209,36,0.05); border-color: var(--primary-lime); display: flex; gap: 16px; align-items: center; }
        .modal-overlay-mp { display: flex; position: fixed; z-index: 2000; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); justify-content: center; align-items: center; }
        .modal-content-mp { background-color: #1c1c1c; border: 1px solid #333; width: 90%; max-width: 440px; border-radius: 20px; padding: 32px; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto; }
        .modal-content-mp h3 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .modal-content-mp .modal-subtitle { font-size: 13px; color: #aaa; margin-bottom: 24px; }
        .modal-close { position: absolute; top: 16px; right: 20px; background: transparent; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .modal-close:hover { color: #fff; }
        .modal-input { width: 100%; padding: 14px; border: 1px solid #333; border-radius: 12px; background: #111; color: #fff; font-size: 16px; outline: none; margin-bottom: 16px; }
        .modal-input:focus { box-shadow: 0 0 0 2px var(--primary-lime); }
        .modal-input-lg { font-size: 28px; font-weight: 700; text-align: center; padding: 20px; }
        .modal-btn { width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
        .modal-btn-primary { background: var(--primary-lime); color: #000; }
        .modal-btn-primary:hover { background: #d4e92a; }
        .modal-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-btn-secondary { background: transparent; border: 1px solid #333; color: #fff; margin-top: 8px; }
        .modal-btn-secondary:hover { background: rgba(255,255,255,0.05); }
        .balance-label { font-size: 13px; color: #aaa; margin-bottom: 4px; }
        .balance-val { font-size: 18px; font-weight: 700; }
        .notification-toast-mp { position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 3000; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease; }
        .notification-toast-mp.success { background: #16a34a; color: #fff; }
        .notification-toast-mp.error { background: #dc2626; color: #fff; }
        @media (max-width: 768px) {
          .transaction-section { grid-template-columns: 1fr; }
          .pay-header { flex-direction: column; gap: 24px; text-align: center; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>

      <header className="page-header">
        <h1>Minton Pay</h1>
        <div className="header-actions">
          <button className="btn-secondary-dash"><i className="fa-solid fa-shield-halved"></i> Keamanan</button>
        </div>
      </header>
      <div className="page-body">
        <div className="pay-header">
          <div className="balance-info">
            <h2>Saldo Anda</h2>
            <div className="balance-amount">
              {loading ? 'Memuat...' : `Rp ${formatAmount(balance)}`}
            </div>
            <p style={{ color: '#aaa', fontSize: 13, marginTop: 8 }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary-lime)' }}></i> Akun Terverifikasi
            </p>
          </div>
          <div className="pay-actions">
            <div className="pay-btn" onClick={openTopUpModal}>
              <i className="fa-solid fa-plus"></i><span>Top Up</span>
            </div>
            <div className="pay-btn" onClick={openTransferModal}>
              <i className="fa-solid fa-paper-plane"></i><span>Transfer</span>
            </div>
            <div className="pay-btn" onClick={handleAllTransactions}>
              <i className="fa-solid fa-clock-rotate-left"></i><span>Riwayat</span>
            </div>
          </div>
        </div>
        <div className="transaction-section">
          <div className="content-card">
            <span className="content-card-title">Transaksi Terakhir</span>
            <div className="history-list">
              {loading ? (
                <div className="history-item" style={{ justifyContent: 'center', padding: '24px', color: '#888' }}>
                  Memuat transaksi...
                </div>
              ) : transactions.length === 0 ? (
                <div className="history-item" style={{ justifyContent: 'center', padding: '24px', color: '#888' }}>
                  Belum ada transaksi
                </div>
              ) : (
                transactions.map((tx: any) => (
                  <div key={tx.id} className="history-item">
                    <div className="history-icon"><i className={txIcon(tx.type)}></i></div>
                    <div className="history-details">
                      <h4>{txLabel(tx.type, tx.description)}</h4>
                      <p>{formatDate(tx.created_at)}</p>
                    </div>
                    <div className={`history-amount ${tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund' ? 'amount-plus' : 'amount-minus'}`}>
                      {tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund' ? '+' : '-'} Rp {formatAmount(tx.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="btn-secondary-dash" style={{ width: '100%', marginTop: 24 }} onClick={handleAllTransactions}>
              Lihat Semua Transaksi
            </button>
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
              <div style={{ width: 40, height: 40, background: 'var(--primary-lime)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <i className="fa-solid fa-gift"></i>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-lime)' }}>Promo Minton Pay</h4>
                <p style={{ fontSize: 12, color: '#aaa' }}>Cashback 10% untuk sewa lapangan setiap akhir pekan!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`notification-toast-mp ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {topUpModal && (
        <div className="modal-overlay-mp" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-content-mp">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Top Up Saldo</h3>
            <p className="modal-subtitle">Masukkan nominal yang ingin ditambahkan ke saldo Minton Pay Anda.</p>
            <div className="balance-label">Jumlah Top Up</div>
            <input
              type="text"
              className="modal-input modal-input-lg"
              placeholder="Rp 0"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {[50000, 100000, 200000, 500000].map((nom) => (
                <button
                  key={nom}
                  style={{ flex: 1, minWidth: 80, padding: '10px', border: '1px solid #333', borderRadius: 8, background: 'transparent', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}
                  onClick={() => setTopUpAmount(String(nom))}
                >
                  Rp {formatAmount(nom)}
                </button>
              ))}
            </div>
            <button className="modal-btn modal-btn-primary" onClick={handleTopUp} disabled={topUpLoading || !topUpAmount}>
              {topUpLoading ? 'Memproses...' : 'Top Up Sekarang'}
            </button>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Batal</button>
          </div>
        </div>
      )}

      {transferModal && (
        <div className="modal-overlay-mp" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-content-mp">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Transfer Saldo</h3>
            <p className="modal-subtitle">Kirim saldo Minton Pay ke pengguna lain.</p>
            <div className="balance-label">Email Tujuan</div>
            <input
              type="email"
              className="modal-input"
              placeholder="Masukkan email tujuan"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
            />
            <div className="balance-label">Jumlah Transfer</div>
            <input
              type="text"
              className="modal-input modal-input-lg"
              placeholder="Rp 0"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
              Saldo Anda: Rp {formatAmount(balance)}
            </div>
            <button className="modal-btn modal-btn-primary" onClick={handleTransfer} disabled={transferLoading || !transferAmount || !transferEmail}>
              {transferLoading ? 'Memproses...' : 'Transfer Sekarang'}
            </button>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Batal</button>
          </div>
        </div>
      )}

      {allTxModal && (
        <div className="modal-overlay-mp" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-content-mp" style={{ maxWidth: 560 }}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Semua Transaksi</h3>
            <p className="modal-subtitle">Riwayat lengkap transaksi Minton Pay Anda.</p>
            {allTxLoading ? (
              <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Memuat...</p>
            ) : allTx.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Belum ada transaksi</p>
            ) : (
              <div className="history-list">
                {allTx.map((tx: any) => (
                  <div key={tx.id} className="history-item">
                    <div className="history-icon"><i className={txIcon(tx.type)}></i></div>
                    <div className="history-details">
                      <h4>{txLabel(tx.type, tx.description)}</h4>
                      <p>{formatDate(tx.created_at)}</p>
                    </div>
                    <div className={`history-amount ${tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund' ? 'amount-plus' : 'amount-minus'}`}>
                      {tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund' ? '+' : '-'} Rp {formatAmount(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="modal-btn modal-btn-secondary" onClick={closeModal} style={{ marginTop: 16 }}>Tutup</button>
          </div>
        </div>
      )}
    </DashboardSidebar>
  );
}

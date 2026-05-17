'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getNotificationsAction, markAsReadAction, markAllAsReadAction } from './actions';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function loadNotifications() {
    const result = await getNotificationsAction();
    setNotifications(result.notifications);
    setUnreadCount(result.unreadCount);
  }

  async function handleMarkRead(id: string) {
    await markAsReadAction(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    await markAllAsReadAction();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'baru saja';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}j`;
    const days = Math.floor(hrs / 24);
    return `${days}h`;
  }

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="fa-regular fa-bell"></i>
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifikasi</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="mark-all-read">
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Belum ada notifikasi</div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-message">{n.message}</div>
                    <div className="notif-time">{timeAgo(n.created_at)}</div>
                  </div>
                  {n.link && (
                    <Link href={n.link} className="notif-link">
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .notification-bell { position: relative; }
        .bell-btn { background: none; border: none; color: var(--text-white); font-size: 20px; cursor: pointer; position: relative; padding: 8px; }
        .bell-btn:hover { color: var(--primary-lime); }
        .bell-badge { position: absolute; top: 2px; right: 2px; background: #ef4444; color: #fff; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .notif-dropdown { position: absolute; top: 100%; right: 0; width: 360px; max-height: 480px; background: var(--bg-card); border: 1px solid #333; border-radius: 12px; overflow: hidden; z-index: 100; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #333; }
        .notif-header h4 { margin: 0; font-size: 16px; }
        .mark-all-read { background: none; border: none; color: var(--primary-lime); font-size: 12px; cursor: pointer; }
        .mark-all-read:hover { text-decoration: underline; }
        .notif-list { overflow-y: auto; max-height: 400px; }
        .notif-item { display: flex; align-items: flex-start; gap: 8px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s; }
        .notif-item:hover { background: rgba(255,255,255,0.05); }
        .notif-item.unread { background: rgba(189,209,36,0.05); border-left: 3px solid var(--primary-lime); }
        .notif-content { flex: 1; min-width: 0; }
        .notif-title { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
        .notif-message { font-size: 12px; color: var(--text-gray); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .notif-time { font-size: 11px; color: #666; margin-top: 4px; }
        .notif-link { color: var(--primary-lime); font-size: 14px; padding: 4px; margin-top: 4px; }
        .notif-empty { padding: 32px; text-align: center; color: var(--text-gray); font-size: 14px; }
        @media (max-width: 768px) { .notif-dropdown { width: 300px; right: -80px; } }
      `}</style>
    </div>
  );
}

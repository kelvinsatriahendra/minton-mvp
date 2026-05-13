'use client';

export default function LogoutButton() {
  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: '10px 24px',
        backgroundColor: '#222',
        color: '#f44336',
        borderRadius: '10px',
        border: '1px solid #333',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: '0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#2a2a2a';
        e.currentTarget.style.borderColor = '#f44336';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#222';
        e.currentTarget.style.borderColor = '#333';
      }}
    >
      <i className="fa-solid fa-right-from-bracket"></i> Logout
    </button>
  );
}

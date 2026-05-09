'use client';

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear cookies
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-[#333] hover:bg-[#444] text-red-400 rounded-lg transition-colors flex items-center gap-2"
    >
      <i className="fa-solid fa-right-from-bracket"></i> Logout
    </button>
  );
}

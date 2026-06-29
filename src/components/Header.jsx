import React from 'react';

export default function Header({
  balance, currentUser, onShowAuth, onShowConfig, onShowProfile,
  showNotif, onToggleNotif, notifications, onClearNotif, onMenuClick
}) {
  const un = currentUser?.user_metadata?.username || currentUser?.email || 'Guest';
  const initial = un.charAt(0).toUpperCase();

  return (
    <header className="site-header">
      <div className="h-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <i className='bx bx-menu'></i>
        </button>
        <div className="bread">Home <span>/ Buffalo Slot</span></div>
      </div>
      <div className="h-right">
        <div className="h-user" onClick={onShowProfile} style={{cursor:'pointer'}}>
          <div className="avatar">{initial}</div>
          <span id="hUserName">{un}</span>
        </div>
        <div className="h-balance">
          <i className='bx bxs-coin'></i>
          <span id="balanceDisplay">{Math.floor(balance).toLocaleString()}</span>
        </div>
        <button className="auth-btn" onClick={onShowAuth}>
          <i className={`bx ${currentUser ? 'bx-log-out' : 'bx-user'}`}></i>
          {currentUser ? 'LOGOUT' : 'LOGIN'}
        </button>
        <button className="bell-btn" title="Notifications" onClick={onToggleNotif}>
          <i className='bx bx-bell'></i>
          {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
        </button>
        <button className="setting-btn" id="settingBtn" title="Supabase Setup" onClick={onShowConfig}>
          <i className='bx bx-cog'></i>
        </button>
      </div>

      {showNotif && (
        <>
          <div className="notif-drop">
            <div className="notif-header">Notifications</div>
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications</div>
            ) : (
              notifications.map((n, i) => (
                <div className="notif-item" key={i}>{n}</div>
              ))
            )}
          </div>
          <div className="notif-backdrop" onClick={onToggleNotif} />
        </>
      )}
    </header>
  );
}

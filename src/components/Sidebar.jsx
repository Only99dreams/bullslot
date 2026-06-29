import React from 'react';

const NAV_SECTIONS = [
  { label: 'Menu', items: [
    { id: 'home', icon: 'bx-home', label: 'Home' },
    { id: 'popular', icon: 'bx-fire', label: 'Popular' },
    { id: 'new', icon: 'bx-star', label: 'New' },
  ]},
  { label: 'Games', items: [
    { id: 'slots', icon: 'bx-grid-alt', label: 'Slots' },
    { id: 'live', icon: 'bx-play-circle', label: 'Live' },
    { id: 'crash', icon: 'bx-rocket', label: 'Crash' },
    { id: 'table', icon: 'bx-card', label: 'Table' },
  ]},
  { label: 'Programs', items: [
    { id: 'vip', icon: 'bx-diamond', label: 'VIP Club' },
    { id: 'affiliate', icon: 'bx-link', label: 'Affiliate' },
    { id: 'support', icon: 'bx-support', label: 'Support' },
  ]},
];

export default function Sidebar({ mobileOpen, onClose, currentUser, onShowAdmin, onShowDeposit, onShowWithdraw, onShowProfile, onShowAuth }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">B</div>
          <div className="logo-text"><span>BU</span>FALO</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section, si) => (
            <React.Fragment key={si}>
              <div className="nav-label" style={si > 0 ? {marginTop:'6px'} : {}}>{section.label}</div>
              {section.items.map(item => (
                <a key={item.id} className={item.id === 'home' ? 'active' : ''}>
                  <i className={`bx ${item.icon}`}></i><span>{item.label}</span>
                </a>
              ))}
            </React.Fragment>
          ))}
          <div className="nav-label" style={{marginTop:'6px'}}>Finance</div>
          <button className="sidebar-action deposit" onClick={onShowDeposit}>
            <i className='bx bx-down-arrow-circle'></i><span>Deposit</span>
          </button>
          <button className="sidebar-action withdraw" onClick={onShowWithdraw}>
            <i className='bx bx-up-arrow-circle'></i><span>Withdraw</span>
          </button>
          <button className="sidebar-action profile" onClick={onShowProfile}>
            <i className='bx bx-receipt'></i><span>My History</span>
          </button>
          {currentUser && (
            <>
              <div className="nav-label" style={{marginTop:'6px'}}>Admin</div>
              <button className="sidebar-action admin" onClick={onShowAdmin} style={{display:'flex'}}>
                <i className='bx bx-shield'></i><span>Admin Panel</span>
              </button>
            </>
          )}
        </nav>
        <div className="sidebar-foot">
          <button onClick={onShowAuth}>
            <i className='bx bx-log-out'></i><span>{currentUser ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

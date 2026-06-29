import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CasinoLobby from './components/CasinoLobby';
import ConfigOverlay from './components/ConfigOverlay';
import AuthModal from './components/AuthModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import AdminPanel from './components/AdminPanel';
import ProfileModal from './components/ProfileModal';

function AppContent() {
  const { supabaseConfigured, loading, currentUser } = useAuth();
  const [showConfig, setShowConfig] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !supabaseConfigured) setShowConfig(true);
  }, [loading, supabaseConfigured]);

  const addNotification = useCallback((msg) => {
    setNotifications(prev => [...prev, msg]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAuth(false); setShowDeposit(false); setShowWithdraw(false);
        setShowAdmin(false); setShowProfile(false); setShowNotif(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const requireAuth = useCallback((action) => {
    if (!currentUser) {
      if (!supabaseConfigured) setShowConfig(true);
      else setShowAuth(true);
      return false;
    }
    return true;
  }, [currentUser, supabaseConfigured]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="site-wrap">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentUser={currentUser}
        onShowAdmin={() => setShowAdmin(true)}
        onShowDeposit={() => {
          if (!currentUser) { if (!supabaseConfigured) setShowConfig(true); else setShowAuth(true); return; }
          setShowDeposit(true);
        }}
        onShowWithdraw={() => {
          if (!currentUser) { if (!supabaseConfigured) setShowConfig(true); else setShowAuth(true); return; }
          setShowWithdraw(true);
        }}
        onShowProfile={() => {
          if (!currentUser) { if (!supabaseConfigured) setShowConfig(true); else setShowAuth(true); return; }
          setShowProfile(true);
        }}
        onShowAuth={() => {
          if (!supabaseConfigured) setShowConfig(true);
          else setShowAuth(true);
        }}
      />

      <div className="main-area">
        <Header
          balance={balance}
          currentUser={currentUser}
          onShowAuth={() => {
            if (!supabaseConfigured) setShowConfig(true);
            else setShowAuth(true);
          }}
          onShowConfig={() => setShowConfig(true)}
          onShowProfile={() => {
            if (currentUser) setShowProfile(true);
            else if (!supabaseConfigured) setShowConfig(true);
            else setShowAuth(true);
          }}
          showNotif={showNotif}
          onToggleNotif={() => setShowNotif(prev => !prev)}
          notifications={notifications}
          onClearNotif={clearNotifications}
          onMenuClick={() => setMobileOpen(prev => !prev)}
        />

        <div className="content-wrap">
          <CasinoLobby
            balance={balance}
            setBalance={setBalance}
            addNotification={addNotification}
            currentUser={currentUser}
            onRequireAuth={requireAuth}
          />
        </div>
      </div>

      {showConfig && <ConfigOverlay onClose={() => setShowConfig(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

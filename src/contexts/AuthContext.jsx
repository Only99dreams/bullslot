import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initSupabase, restoreSession, loginUser, registerUser, logoutUser as supaLogout, loadSupaConfig, saveSupaConfig, getProfile, syncBalance } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const cfg = loadSupaConfig();
        if (cfg) {
          const ok = initSupabase(cfg.url, cfg.key);
          if (ok) {
            setSupabaseConfigured(true);
            const sessionData = await restoreSession();
            if (sessionData) {
              setCurrentUser(sessionData.user);
              setCurrentProfile(sessionData.profile);
            }
          }
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginUser(email, password);
    if (result.data && !result.error) {
      setCurrentUser(result.data.user);
      setCurrentProfile(result.profile);
    }
    return result;
  }, []);

  const register = useCallback(async (email, username, password) => {
    const result = await registerUser(email, username, password);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await syncBalance(0);
    await supaLogout();
    setCurrentUser(null);
    setCurrentProfile(null);
  }, []);

  const configureSupabase = useCallback((url, key) => {
    saveSupaConfig(url, key);
    const ok = initSupabase(url, key);
    if (ok) setSupabaseConfigured(true);
    return ok;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (currentUser) {
      const p = await getProfile(currentUser.id);
      if (p) setCurrentProfile(p);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    currentProfile,
    supabaseConfigured,
    loading,
    login,
    register,
    logout,
    configureSupabase,
    refreshProfile,
    setCurrentUser,
    setCurrentProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

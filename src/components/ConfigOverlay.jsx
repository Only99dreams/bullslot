import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ConfigOverlay({ onClose }) {
  const { configureSupabase, supabaseConfigured } = useAuth();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!url.trim() || !key.trim()) {
      setError('Please enter both URL and key');
      return;
    }
    const ok = configureSupabase(url.trim(), key.trim());
    if (ok) {
      onClose();
    } else {
      setError('Invalid Supabase configuration. Check your URL and anon key.');
    }
  };

  // If already configured, just close
  if (supabaseConfigured) {
    onClose();
    return null;
  }

  return (
    <div className="modal-overlay show">
      <div className="modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <h2>SUPABASE SETUP</h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
          Enter your Supabase project URL and anon key to enable deposits, withdrawals, and admin features.
          <br />
          <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>
            Get them here
          </a>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            placeholder="https://yourproject.supabase.co"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); }}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
          />
          <input
            placeholder="anon public key"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
          />
          {error && <div style={{ color: '#ef4444', fontSize: '12px' }}>{error}</div>}
          <button
            onClick={handleSave}
            style={{ background: '#818cf8', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            SAVE & CONNECT
          </button>
        </div>
      </div>
    </div>
  );
}

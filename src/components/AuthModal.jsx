import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [regEmail, setRegEmail] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regError, setRegError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail.trim() || !loginPass.trim()) {
      setLoginError('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    const result = await login(loginEmail.trim(), loginPass.trim());
    setSubmitting(false);
    if (result.error) {
      setLoginError(result.error);
    } else {
      onClose();
    }
  };

  const handleRegister = async () => {
    setRegError('');
    if (!regEmail.trim() || !regUser.trim() || !regPass.trim()) {
      setRegError('Please fill in all fields');
      return;
    }
    if (regPass.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    const result = await register(regEmail.trim(), regUser.trim(), regPass.trim());
    setSubmitting(false);
    if (result.error) {
      setRegError(result.error);
    } else {
      alert('Registration successful! Check your email to confirm.');
      setTab('login');
    }
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', gap: 0, marginBottom: '20px',
          background: '#1e293b', borderRadius: '8px', overflow: 'hidden'
        }}>
          <button
            className="auth-tab"
            style={{
              flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
              background: tab === 'login' ? '#334155' : 'transparent',
              color: tab === 'login' ? '#e2e8f0' : '#64748b',
              transition: 'all 0.15s'
            }}
            onClick={() => setTab('login')}
          >
            LOGIN
          </button>
          <button
            className="auth-tab"
            style={{
              flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
              background: tab === 'register' ? '#334155' : 'transparent',
              color: tab === 'register' ? '#e2e8f0' : '#64748b',
              transition: 'all 0.15s'
            }}
            onClick={() => setTab('register')}
          >
            REGISTER
          </button>
        </div>

        {tab === 'login' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email" placeholder="Email"
              value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError(''); }}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password" placeholder="Password"
              value={loginPass} onChange={e => { setLoginPass(e.target.value); setLoginError(''); }}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {loginError && <div style={{ color: '#ef4444', fontSize: '12px' }}>{loginError}</div>}
            <button
              onClick={handleLogin} disabled={submitting}
              style={{ background: '#818cf8', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email" placeholder="Email"
              value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegError(''); }}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              placeholder="Username"
              value={regUser} onChange={e => { setRegUser(e.target.value); setRegError(''); }}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              type="password" placeholder="Password (6+ chars)"
              value={regPass} onChange={e => { setRegPass(e.target.value); setRegError(''); }}
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
            {regError && <div style={{ color: '#ef4444', fontSize: '12px' }}>{regError}</div>}
            <button
              onClick={handleRegister} disabled={submitting}
              style={{ background: '#818cf8', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

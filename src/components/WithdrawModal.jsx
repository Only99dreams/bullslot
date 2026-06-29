import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { submitWithdrawal } from '../services/supabase';

export default function WithdrawModal({ onClose }) {
  const { currentUser, refreshProfile } = useAuth();
  const currency = 'USDT';

  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!wallet.trim()) {
      setError('Please enter your wallet address');
      return;
    }
    if (!amount || parseFloat(amount) < 1) {
      setError('Minimum withdrawal is $1');
      return;
    }
    setSubmitting(true);
    const result = await submitWithdrawal(currentUser.id, currency, amount, wallet.trim());
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Withdrawal requested! Waiting for admin approval.');
      await refreshProfile();
    }
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <h2>WITHDRAW</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CURRENCY</label>
            <div style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fbbf24', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>
              USDT (TRC20)
            </div>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>YOUR USDT TRC20 ADDRESS</label>
            <input
              placeholder="Enter your USDT TRC20 wallet address"
              value={wallet} onChange={e => { setWallet(e.target.value); setError(''); }}
              style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>AMOUNT (USD)</label>
            <input
              type="number" min="1" placeholder="50"
              value={amount} onChange={e => { setAmount(e.target.value); setError(''); }}
              style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          {error && <div style={{ color: '#ef4444', fontSize: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#22c55e', fontSize: '12px' }}>{success}</div>}
          <button
            onClick={handleSubmit} disabled={submitting}
            style={{ background: '#818cf8', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT WITHDRAWAL'}
          </button>
        </div>
      </div>
    </div>
  );
}

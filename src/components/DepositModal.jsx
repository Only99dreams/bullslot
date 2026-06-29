import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { submitDeposit } from '../services/supabase';

const USDT_ADDRESS = 'TLAg5WpYVBPi3eahJ4paZSNW6tzfEqVYM1';

export default function DepositModal({ onClose }) {
  const { currentUser, refreshProfile } = useAuth();
  const currency = 'USDT';
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(USDT_ADDRESS).catch(() => {});
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!amount || parseFloat(amount) < 1) {
      setError('Minimum deposit is $1');
      return;
    }
    if (!txHash.trim()) {
      setError('Please enter your transaction hash');
      return;
    }
    setSubmitting(true);
    const result = await submitDeposit(currentUser.id, currency, amount, txHash.trim());
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Deposit submitted! Waiting for admin approval.');
      await refreshProfile();
    }
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <h2>DEPOSIT</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CURRENCY</label>
            <div style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fbbf24', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>
              USDT (TRC20)
            </div>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>AMOUNT (USD)</label>
            <input
              type="number" min="1" placeholder="50"
              value={amount} onChange={e => { setAmount(e.target.value); setError(''); }}
              style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>SEND TO ADDRESS</label>
            <div style={{ background: '#1e293b', borderRadius: '6px', padding: '10px', fontSize: '11px', color: '#fbbf24', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '8px' }}>
              {USDT_ADDRESS}
            </div>
            <button
              onClick={handleCopy}
              style={{ background: '#334155', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              COPY
            </button>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>TRANSACTION HASH (TXID)</label>
            <input
              placeholder="Paste your transaction hash here"
              value={txHash} onChange={e => { setTxHash(e.target.value); setError(''); }}
              style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          {error && <div style={{ color: '#ef4444', fontSize: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#22c55e', fontSize: '12px' }}>{success}</div>}
          <button
            onClick={handleSubmit} disabled={submitting}
            style={{ background: '#818cf8', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT DEPOSIT'}
          </button>
        </div>
      </div>
    </div>
  );
}

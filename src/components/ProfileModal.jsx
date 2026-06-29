import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/supabase';

export default function ProfileModal({ onClose }) {
  const { currentUser, currentProfile } = useAuth();
  const [transactions, setTransactions] = useState({ deposits: [], withdrawals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (currentUser) {
        const data = await getTransactions(currentUser.id);
        setTransactions(data);
      }
      setLoading(false);
    }
    load();
  }, [currentUser]);

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h2>MY TRANSACTIONS</h2>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#1e293b', borderRadius: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>Username</div>
          <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>
            {currentProfile?.username || currentUser?.email}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>Balance</div>
          <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 700 }}>
            ${currentProfile?.balance ? Math.floor(currentProfile.balance).toLocaleString() : '0'}
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>Loading transactions...</p>
        ) : (
          <>
            {transactions.deposits.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Deposits</h3>
                {transactions.deposits.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#1e293b', borderRadius: '6px', marginBottom: '4px', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>
                      {d.currency} · ${d.amount} · {new Date(d.created_at).toLocaleDateString()}
                    </span>
                    <span style={{
                      color: d.status === 'approved' ? '#22c55e' : d.status === 'rejected' ? '#ef4444' : '#fbbf24',
                      fontWeight: 600
                    }}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {transactions.withdrawals.length > 0 && (
              <div>
                <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Withdrawals</h3>
                {transactions.withdrawals.map((w, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#1e293b', borderRadius: '6px', marginBottom: '4px', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>
                      {w.currency} · ${w.amount} · {new Date(w.created_at).toLocaleDateString()}
                    </span>
                    <span style={{
                      color: w.status === 'approved' ? '#22c55e' : w.status === 'rejected' ? '#ef4444' : '#fbbf24',
                      fontWeight: 600
                    }}>
                      {w.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {transactions.deposits.length === 0 && transactions.withdrawals.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '13px' }}>No transactions yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

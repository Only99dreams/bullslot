import React, { useState, useEffect } from 'react';
import { getAdminData, approveTransaction, rejectTransaction, updateUserBalance } from '../services/supabase';

export default function AdminPanel({ onClose }) {
  const [tab, setTab] = useState('deposits');
  const [data, setData] = useState({ deposits: [], withdrawals: [], users: [] });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const d = await getAdminData();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (type, id) => {
    await approveTransaction(type, id);
    loadData();
  };

  const handleReject = async (type, id) => {
    await rejectTransaction(type, id);
    loadData();
  };

  const canShow = data.deposits.length > 0 || data.withdrawals.length > 0 || data.users.length > 0;

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
        <h2>ADMIN PANEL</h2>

        <div style={{ display: 'flex', gap: 0, marginBottom: '16px', background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
          {['deposits', 'withdrawals', 'users'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '12px', fontWeight: 600,
                background: tab === t ? '#334155' : 'transparent',
                color: tab === t ? '#e2e8f0' : '#64748b',
                textTransform: 'uppercase'
              }}
            >
              {t}
              {t === 'deposits' && data.deposits.length > 0 && ` (${data.deposits.length})`}
              {t === 'withdrawals' && data.withdrawals.length > 0 && ` (${data.withdrawals.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>Loading...</p>
        ) : !canShow ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>No pending transactions.</p>
        ) : tab === 'deposits' && data.deposits.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>No pending deposits.</p>
        ) : tab === 'withdrawals' && data.withdrawals.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>No pending withdrawals.</p>
        ) : null}

        {tab === 'deposits' && data.deposits.map((d, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <strong style={{ color: '#e2e8f0', fontSize: '13px' }}>{d.profiles?.username || 'Unknown'}</strong>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
                {d.currency} · ${d.amount} · {new Date(d.created_at).toLocaleDateString()}
                {d.tx_hash && <span> · TX: {d.tx_hash.substring(0, 12)}...</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleApprove('deposit', d.id)}
                style={{ background: '#22c55e', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                APPROVE
              </button>
              <button onClick={() => handleReject('deposit', d.id)}
                style={{ background: '#ef4444', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                REJECT
              </button>
            </div>
          </div>
        ))}

        {tab === 'withdrawals' && data.withdrawals.map((w, i) => (
          <div key={i} style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <strong style={{ color: '#e2e8f0', fontSize: '13px' }}>{w.profiles?.username || 'Unknown'}</strong>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
                {w.currency} · ${w.amount} · {new Date(w.created_at).toLocaleDateString()}
                {w.wallet_address && <span> · Wallet: {w.wallet_address.substring(0, 12)}...</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleApprove('withdrawal', w.id)}
                style={{ background: '#22c55e', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                APPROVE
              </button>
              <button onClick={() => handleReject('withdrawal', w.id)}
                style={{ background: '#ef4444', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                REJECT
              </button>
            </div>
          </div>
        ))}

        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '500px' }}>
            <div style={{ display: 'flex', padding: '8px 12px', color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              <span style={{ flex: 2 }}>Username</span>
              <span style={{ flex: 2 }}>Email</span>
              <span style={{ flex: 1 }}>Balance</span>
              <span style={{ flex: 1 }}>Admin</span>
              <span style={{ flex: 2 }}>Actions</span>
            </div>
            {data.users.map((u, i) => (
              <div key={i} style={{ background: '#1e293b', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', fontSize: '12px', gap: '4px' }}>
                <span style={{ flex: 2, color: '#e2e8f0' }}>{u.username || '—'}</span>
                <span style={{ flex: 2, color: '#94a3b8', fontSize: '11px' }}>{u.email || '—'}</span>
                <span style={{ flex: 1, color: '#fbbf24' }}>${u.balance || 0}</span>
                <span style={{ flex: 1, color: u.is_admin ? '#22c55e' : '#64748b', fontSize: '11px' }}>
                  {u.is_admin ? '✓' : '—'}
                </span>
                <span style={{ flex: 2, display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <input type="number" defaultValue="" placeholder="Amt" id={'bal-' + u.id}
                    style={{ width: '60px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', padding: '4px 6px', color: '#e2e8f0', fontSize: '11px', fontFamily: 'inherit', outline: 'none' }}
                  />
                  <button onClick={async () => {
                    const inp = document.getElementById('bal-' + u.id);
                    const amt = parseFloat(inp?.value);
                    if (!amt || amt <= 0) return;
                    const newBal = (u.balance || 0) + amt;
                    await updateUserBalance(u.id, newBal);
                    loadData();
                  }}
                    style={{ background: '#22c55e', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    +ADD
                  </button>
                  <button onClick={async () => {
                    const inp = document.getElementById('bal-' + u.id);
                    const amt = parseFloat(inp?.value);
                    if (!amt || amt <= 0) return;
                    const newBal = Math.max(0, (u.balance || 0) - amt);
                    await updateUserBalance(u.id, newBal);
                    loadData();
                  }}
                    style={{ background: '#ef4444', border: 'none', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    −SUB
                  </button>
                </span>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

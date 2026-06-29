import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

export function getSupabaseClient() {
  return supabaseClient;
}

export function loadSupaConfig() {
  try {
    const u = localStorage.getItem('supaUrl') || import.meta.env.VITE_SUPABASE_URL;
    const k = localStorage.getItem('supaKey') || import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (u && k && u !== 'https://your-project.supabase.co' && k !== 'your-anon-key-here') return { url: u, key: k };
  } catch (e) { /* ignore */ }
  return null;
}

export function saveSupaConfig(url, key) {
  try {
    localStorage.setItem('supaUrl', url);
    localStorage.setItem('supaKey', key);
  } catch (e) { /* ignore */ }
}

export function initSupabase(url, key) {
  try {
    supabaseClient = createClient(url, key);
    return true;
  } catch (e) { console.error('Supabase init error:', e); return false; }
}

async function fetchMyProfile(userId) {
  try {
    const { data, error } = await supabaseClient.rpc('get_my_profile');
    if (!error && data) {
      const p = Array.isArray(data) ? data[0] : data;
      if (p) return p;
    }
  } catch (e) { /* fall through */ }
  if (userId) {
    try {
      const { data } = await supabaseClient.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) return data;
    } catch (e) { /* ignore */ }
  }
  return null;
}

export async function restoreSession() {
  if (!supabaseClient) return;
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (session) {
      const profile = await fetchMyProfile(session.user.id);
      return { user: session.user, profile };
    }
  } catch (e) { console.error('Session restore error:', e); }
  return null;
}

export async function registerUser(email, username, password) {
  if (!supabaseClient) return { error: 'Supabase not configured' };
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email, password,
      options: { data: { username } }
    });
    if (error) return { error: error.message };
    if (data?.user) {
      const { error: profileError } = await supabaseClient.from('profiles').insert({
        id: data.user.id,
        username,
        email,
        balance: 1000
      }).single();
      if (profileError) console.error('Profile creation error:', profileError);
    }
    return { data };
  } catch (e) { return { error: e.message }; }
}

export async function loginUser(email, password) {
  if (!supabaseClient) return { error: 'Supabase not configured' };
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const profile = await fetchMyProfile(data.user.id);
    return { data, profile };
  } catch (e) { return { error: e.message }; }
}

export async function logoutUser() {
  if (!supabaseClient) return;
  try { await supabaseClient.auth.signOut(); } catch (e) { /* ignore */ }
}

export async function syncBalance(balance) {
  if (!supabaseClient) return;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;
    await supabaseClient.rpc('update_balance', { user_id: session.user.id, new_balance: balance });
  } catch (e) { /* ignore */ }
}

export async function getProfile(userId) {
  if (!supabaseClient || !userId) return null;
  return fetchMyProfile(userId);
}

export async function submitDeposit(userId, currency, amount, txHash) {
  if (!supabaseClient || !userId) return { error: 'Not logged in' };
  try {
    const { error } = await supabaseClient.from('deposits').insert({
      user_id: userId, currency, amount: parseFloat(amount), tx_hash: txHash, status: 'pending'
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (e) { return { error: e.message }; }
}

export async function submitWithdrawal(userId, currency, amount, walletAddress) {
  if (!supabaseClient || !userId) return { error: 'Not logged in' };
  try {
    const { error } = await supabaseClient.from('withdrawals').insert({
      user_id: userId, currency, amount: parseFloat(amount), wallet_address: walletAddress, status: 'pending'
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (e) { return { error: e.message }; }
}

export async function getTransactions(userId) {
  if (!supabaseClient || !userId) return { deposits: [], withdrawals: [] };
  try {
    const { data, error } = await supabaseClient.rpc('get_my_transactions');
    if (!error && data) return data;
  } catch (e) { /* fall through */ }
  return { deposits: [], withdrawals: [] };
}

export async function getAdminData() {
  if (!supabaseClient) return { deposits: [], withdrawals: [], users: [] };
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return { deposits: [], withdrawals: [], users: [] };
    const profile = await fetchMyProfile(session.user.id);
    const isAdmin = profile?.is_admin === true;
    if (!isAdmin) return { deposits: [], withdrawals: [], users: [] };

    const { data, error } = await supabaseClient.rpc('get_admin_data');
    if (!error && data) return data;
  } catch (e) { /* ignore */ }
  return { deposits: [], withdrawals: [], users: [] };
}

export async function approveTransaction(type, id) {
  if (!supabaseClient) return;
  try {
    const { data: txData } = await supabaseClient.from(type + 's').select('user_id, amount').eq('id', id).single();
    if (!txData) return;
    await supabaseClient.from(type + 's').update({ status: 'approved' }).eq('id', id);
    let newBal = 0;
    try {
      const { data: prof } = await supabaseClient.from('profiles').select('balance').eq('id', txData.user_id).single();
      if (prof) {
        newBal = type === 'deposit'
          ? parseFloat(prof.balance) + parseFloat(txData.amount)
          : Math.max(0, parseFloat(prof.balance) - parseFloat(txData.amount));
      }
    } catch (e) { /* ignore */ }
    if (newBal > 0) {
      await supabaseClient.rpc('update_balance', { user_id: txData.user_id, new_balance: newBal });
    }
  } catch (e) { /* ignore */ }
}

export async function rejectTransaction(type, id) {
  if (!supabaseClient) return;
  try { await supabaseClient.from(type + 's').update({ status: 'rejected' }).eq('id', id); }
  catch (e) { /* ignore */ }
}

export async function updateUserBalance(userId, newBalance) {
  if (!supabaseClient) return { error: 'Not connected' };
  try {
    const { error } = await supabaseClient.rpc('update_balance', { user_id: userId, new_balance: newBalance });
    if (error) return { error: error.message };
    return { success: true };
  } catch (e) { return { error: e.message }; }
}

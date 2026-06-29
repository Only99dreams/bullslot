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

export async function restoreSession() {
  if (!supabaseClient) return;
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (session) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      return { user: session.user, profile: profile || null };
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
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    return { data, profile: profile || null };
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
    await supabaseClient.from('profiles').update({ balance }).eq('id', session.user.id);
  } catch (e) { /* ignore */ }
}

export async function getProfile(userId) {
  if (!supabaseClient || !userId) return null;
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch (e) { return null; }
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
    const [depositsRes, withdrawalsRes] = await Promise.all([
      supabaseClient.from('deposits').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
      supabaseClient.from('withdrawals').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
    ]);
    return {
      deposits: depositsRes.data || [],
      withdrawals: withdrawalsRes.data || []
    };
  } catch (e) { return { deposits: [], withdrawals: [] }; }
}

export async function getAdminData() {
  if (!supabaseClient) return { deposits: [], withdrawals: [], users: [] };
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return { deposits: [], withdrawals: [], users: [] };
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles').select('is_admin').eq('id', session.user.id).single();
    if (profileError || !profile?.is_admin) return { deposits: [], withdrawals: [], users: [] };

    const [depRes, withRes, usersRes] = await Promise.all([
      supabaseClient.from('deposits').select('*, profiles(username)').eq('status', 'pending').order('created_at', { ascending: false }),
      supabaseClient.from('withdrawals').select('*, profiles(username)').eq('status', 'pending').order('created_at', { ascending: false }),
      supabaseClient.from('profiles').select('*').order('created_at', { ascending: false })
    ]);
    return {
      deposits: depRes.data || [],
      withdrawals: withRes.data || [],
      users: usersRes.data || []
    };
  } catch (e) { return { deposits: [], withdrawals: [], users: [] }; }
}

export async function approveTransaction(type, id) {
  if (!supabaseClient) return;
  try { await supabaseClient.from(type + 's').update({ status: 'approved' }).eq('id', id); }
  catch (e) { /* ignore */ }
}

export async function rejectTransaction(type, id) {
  if (!supabaseClient) return;
  try { await supabaseClient.from(type + 's').update({ status: 'rejected' }).eq('id', id); }
  catch (e) { /* ignore */ }
}

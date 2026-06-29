const KEYS = {
  SUPABASE_URL: 'supaUrl',
  SUPABASE_KEY: 'supaKey',
};

export function loadSupaConfig() {
  try {
    const u = localStorage.getItem(KEYS.SUPABASE_URL) || import.meta.env.VITE_SUPABASE_URL;
    const k = localStorage.getItem(KEYS.SUPABASE_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (u && k && u !== 'https://your-project.supabase.co' && k !== 'your-anon-key-here') {
      return { url: u, key: k };
    }
  } catch (e) { /* ignore */ }
  return null;
}

export function saveSupaConfig(url, key) {
  try {
    localStorage.setItem(KEYS.SUPABASE_URL, url);
    localStorage.setItem(KEYS.SUPABASE_KEY, key);
  } catch (e) { /* ignore */ }
}

export function getStoredCredential(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function setStoredCredential(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

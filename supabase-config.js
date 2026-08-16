/* ============================================================
   SIP & PLAY — SUPABASE CONFIGURATION & CLIENT HELPER
   ============================================================ */

'use strict';

const SUPABASE_STORAGE_URL_KEY = 'sip_supabase_url';
const SUPABASE_STORAGE_ANON_KEY = 'sip_supabase_anon_key';

window.SipSupabase = {
  // Get stored credentials or defaults
  getCredentials: () => {
    return {
      url: localStorage.getItem(SUPABASE_STORAGE_URL_KEY) || '',
      anonKey: localStorage.getItem(SUPABASE_STORAGE_ANON_KEY) || ''
    };
  },

  // Save credentials
  saveCredentials: (url, anonKey) => {
    if (url) localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url.trim());
    if (anonKey) localStorage.setItem(SUPABASE_STORAGE_ANON_KEY, anonKey.trim());
  },

  // Clear credentials
  clearCredentials: () => {
    localStorage.removeItem(SUPABASE_STORAGE_URL_KEY);
    localStorage.removeItem(SUPABASE_STORAGE_ANON_KEY);
  },

  // Check if Supabase credentials are configured
  isConfigured: () => {
    const creds = window.SipSupabase.getCredentials();
    return Boolean(creds.url && creds.anonKey);
  },

  // Get initialized Supabase client
  getClient: () => {
    if (!window.supabase) {
      console.warn('Supabase JS SDK not loaded.');
      return null;
    }
    const creds = window.SipSupabase.getCredentials();
    if (!creds.url || !creds.anonKey) {
      return null;
    }
    try {
      return window.supabase.createClient(creds.url, creds.anonKey);
    } catch (err) {
      console.error('Error creating Supabase client:', err);
      return null;
    }
  },

  // Test Supabase Connection
  testConnection: async () => {
    const client = window.SipSupabase.getClient();
    if (!client) return { success: false, message: 'Supabase credentials not configured.' };
    try {
      const { data, error } = await client.from('products').select('id').limit(1);
      if (error) throw error;
      return { success: true, message: 'Connected to Supabase successfully.' };
    } catch (err) {
      return { success: false, message: err.message || 'Connection failed.' };
    }
  }
};

import { createClient } from '@supabase/supabase-js';

// Prefer using Vite environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
// If they are not provided, fall back to the values you gave (useful for quick local testing).
// IMPORTANT: embedding anon keys in source is not recommended for production — move these to
// environment variables (.env) and restart the dev server.
const FALLBACK_PROJECT_ID = 'wtvyyixlvazybthjninu';
const FALLBACK_SUPABASE_URL = `https://${FALLBACK_PROJECT_ID}.supabase.co`;
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dnl5aXhsdmF6eWJ0aGpuaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDgyMzUsImV4cCI6MjA3NTgyNDIzNX0.z0vvF7ZpIBstj_eUAPpwYWT89EvtESOK-W62Ncc725w';

// Use Vite env vars when present, otherwise use the fallbacks above.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon Key missing.');
  throw new Error('Supabase URL and Anon Key are required. Add them to your .env (prefixed with VITE_) or provide fallbacks.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
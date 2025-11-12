import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  // Do not throw — make this module safe to import when env vars are missing.
  // Helpful for local dev when env isn't present or when you use localStorage fallbacks.
  // Developers should add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project root `.env` if they want Supabase enabled.
  // eslint-disable-next-line no-console
  console.warn('Supabase client disabled: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.')
}

export { supabase }

// A lightweight, non-destructive sync: fetch remote data and write to localStorage
// only if the corresponding localStorage key is empty. This keeps local edits safe.
export async function syncFromSupabase() {
  if (!supabase) return false;

  try {
    // Projects
    const { data: projects, error: pErr } = await supabase.from('projects').select('*');
    if (pErr) console.warn('Supabase projects fetch error:', pErr.message || pErr);
    if (Array.isArray(projects) && projects.length > 0 && !localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Certificates
    const { data: certificates, error: cErr } = await supabase.from('certificates').select('*');
    if (cErr) console.warn('Supabase certificates fetch error:', cErr.message || cErr);
    if (Array.isArray(certificates) && certificates.length > 0 && !localStorage.getItem('certificates')) {
      localStorage.setItem('certificates', JSON.stringify(certificates));
    }

    // Comments - table name may vary; try 'comments' then 'comment'
    let comments = null;
    let cmErr = null;
    try {
      const res = await supabase.from('comments').select('*');
      comments = res.data;
      cmErr = res.error;
    } catch (e) {
      // ignore
    }
    if ((!comments || comments.length === 0) && !cmErr) {
      try {
        const res2 = await supabase.from('comment').select('*');
        comments = res2.data;
        cmErr = res2.error;
      } catch (e) {}
    }
    if (cmErr) console.warn('Supabase comments fetch error:', cmErr.message || cmErr);
    if (Array.isArray(comments) && comments.length > 0 && !localStorage.getItem('portfolio_comments')) {
      localStorage.setItem('portfolio_comments', JSON.stringify(comments));
      // Emit a storage-like event so components that read at mount pick up changes (not cross-window)
      try { window.dispatchEvent(new Event('supabase-sync')); } catch (e) {}
    }

    console.log('Supabase sync complete');
    return true;
  } catch (err) {
    console.warn('Supabase sync failed', err);
    return false;
  }
}
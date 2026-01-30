// Admin Supabase Client - Uses Service Role Key to Bypass RLS
// Use this for admin operations that need to bypass Row Level Security
// ⚠️ WARNING: Service role bypasses ALL RLS policies - use carefully!
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing required environment variables:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_SERVICE_ROLE_KEY\n\n' +
    'Add these to your .env file.'
  );
}

// Create admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// For reference: Service role can:
// - Bypass ALL row-level security policies
// - Access all data regardless of RLS rules
// - Perform admin operations (create users, etc.)
//
// Security Best Practices:
// 1. Never expose service role key in client-side code for public apps
// 2. Only use for internal admin tools or server-side operations
// 3. Keep VITE_SUPABASE_SERVICE_ROLE_KEY in .env (never commit to git)
// 4. Use regular supabase client (with anon key) for public-facing features

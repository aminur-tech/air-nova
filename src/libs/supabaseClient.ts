import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.'
  );
}

// Dedicated frontend client wrapper using the non-privileged anonymous token
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Saves session tokens directly into browser local storage
    autoRefreshToken: true,
    detectSessionInUrl: true, // Critical for intercepting Google OAuth callback hashes
  },
});
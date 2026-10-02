import { createClient } from '@supabase/supabase-js';

export class SupabaseConfigurationError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Replit Secrets, then restart the app.'
    );
    this.name = 'SupabaseConfigurationError';
  }
}

let supabaseClient;

export function getSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseConfigurationError();
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}
import { createBrowserClient } from '@supabase/ssr';
import { config } from '../config';

// Singleton pattern for browser client to avoid multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  return supabaseClient;
}

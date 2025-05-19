import { createClient } from '@supabase/supabase-js';
import config from './config';

export const supabase = createClient(
  config.api.supabaseUrl, 
  config.api.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
); 
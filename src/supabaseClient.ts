import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase não configurado: verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidos no arquivo .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not configured');
}

if (!supabaseKey) {
  throw new Error('Neither SUPABASE_SERVICE_KEY nor SUPABASE_KEY is configured');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  supabaseKey
);

export default supabase;

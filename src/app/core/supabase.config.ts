import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const SUPABASE_URL = environment.supabaseConfig.url;
const SUPABASE_ANON_KEY = environment.supabaseConfig.key;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
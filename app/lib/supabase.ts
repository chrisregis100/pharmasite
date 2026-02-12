import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;


if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

console.log(supabaseUrl);


export const supabase = createClient(
  supabaseUrl,
  supabaseKey!,
);






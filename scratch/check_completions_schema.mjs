import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k) process.env[k.trim()]=v.join('=').trim(); });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'lesson_completions' });
  // If no RPC, try a dummy insert to see error
  const { error: insertErr } = await supabase.from('lesson_completions').insert({ user_id: '00000000-0000-0000-0000-000000000000', lesson_id: 'test' });
  console.log('Insert Error:', insertErr?.message);
}

checkSchema();

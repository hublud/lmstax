import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k) process.env[k.trim()]=v.join('=').trim(); });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testJoin() {
  const id = '81ac024c-b2a2-4793-8d62-1ee25928f892';
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      instructor:users!courses_created_by_fkey (
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error('Join Error:', error.message);
  } else {
    console.log('Join Success:', data ? 'Course found' : 'Course not found');
    if (data) console.log('Instructor:', data.instructor?.full_name);
  }
}

testJoin();

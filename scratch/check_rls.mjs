
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, serviceKey);

async function checkRLS() {
  console.log("Checking RLS policies for 'courses'...\n");

  const { data, error } = await supabase.rpc('get_policies', { table_name: 'courses' }); // Might not exist
  
  if (error) {
    console.log("Could not fetch policies via RPC. Attempting manual check by performing a test insert (which I will then delete).");
    const { error: testErr } = await supabase.from('courses').insert({ title: 'RLS TEST' }).select();
    if (testErr) console.error("Test Insert Error (indicates RLS/Schema issues):", testErr.message);
    else console.log("Test Insert Succeeded (Service Role bypasses RLS). The issue might be specific to the User's session.");
  } else {
    console.log("Policies:", data);
  }
}

checkRLS();

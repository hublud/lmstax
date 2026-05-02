
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

async function checkSchema() {
  console.log("Checking table structures...\n");

  // Check profiles
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(1);
  if (pErr) console.error("Profiles Table Error:", pErr.message);
  else console.log("Profiles Columns:", Object.keys(profiles[0] || {}).join(", ") || "EMPTY TABLE");

  // Check users
  const { data: users, error: uErr } = await supabase.from('users').select('*').limit(1);
  if (uErr) console.error("Users Table Error:", uErr.message);
  else console.log("Users Columns:", Object.keys(users[0] || {}).join(", ") || "EMPTY TABLE");
}

checkSchema();

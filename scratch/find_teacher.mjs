
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

if (!url || !serviceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkSpecificEmail() {
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching auth users:", authError);
    return;
  }

  const email = 'teacher_test@taxnigeria.com';
  const user = users.find(u => u.email === email);
  if (user) {
    console.log(`Found user: ${email} (ID: ${user.id})`);
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log("Profile:", profile);
  } else {
    console.log(`User ${email} does not exist.`);
  }
}

checkSpecificEmail();

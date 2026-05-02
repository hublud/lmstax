
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

async function verify() {
  const email = 'teacher_test@taxnigeria.com';
  console.log(`Checking database for ${email}...\n`);

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const authUser = users.find(u => u.email === email);

  if (!authUser) {
    console.log("❌ User not found in Auth.");
    return;
  }

  console.log(`Auth ID: ${authUser.id}`);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
  console.log("Profiles Table Role:", profile?.role || "NOT FOUND");

  const { data: dbUser } = await supabase.from('users').select('*').eq('auth_id', authUser.id).maybeSingle();
  console.log("Users Table Role:", dbUser?.role || "NOT FOUND");
  console.log("Subscription Tier:", dbUser?.subscription_tier || "NOT FOUND");
}

verify();

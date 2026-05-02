
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

async function setPasswords() {
  const password = "taxnigeria123";
  const accounts = [
    { email: 'student_test@taxnigeria.com', name: 'Test Student', role: 'student', tier: 'free' },
    { email: 'teacher_test@taxnigeria.com', name: 'Test Teacher', role: 'teacher', tier: 'staff' },
    { email: 'informhublud@gmail.com', name: 'Hublud Admin', role: 'admin', tier: 'taxexpert' }
  ];

  console.log("Deep updating test accounts (Profiles + Users)...");

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error(listError);

  for (const acc of accounts) {
    let user = users.find(u => u.email === acc.email);

    if (!user) {
      console.log(`Creating ${acc.email}...`);
      const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role }
      });
      if (createError) { console.error(`Error creating ${acc.email}:`, createError.message); continue; }
      user = newUser;
    } else {
      console.log(`Updating auth for ${acc.email}...`);
      await supabase.auth.admin.updateUserById(user.id, {
        password: password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role }
      });
    }

    // 1. Sync with 'profiles' table (controls Sidebar labels)
    console.log(`Syncing Profile for ${acc.email}...`);
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (!profile) {
      await supabase.from('profiles').insert({ id: user.id, full_name: acc.name, role: acc.role });
    } else {
      await supabase.from('profiles').update({ full_name: acc.name, role: acc.role }).eq('id', user.id);
    }

    // 2. Sync with 'users' table (controls Access Rights / Role Guard)
    console.log(`Syncing Access for ${acc.email}...`);
    const { data: dbUser } = await supabase.from('users').select('*').eq('auth_id', user.id).maybeSingle();
    if (!dbUser) {
      await supabase.from('users').insert({
        auth_id: user.id,
        email: acc.email,
        full_name: acc.name,
        role: acc.role,
        subscription_tier: acc.tier
      });
    } else {
      await supabase.from('users').update({
        subscription_tier: acc.tier,
        role: acc.role,
        full_name: acc.name
      }).eq('auth_id', user.id);
    }
    
    console.log(`✅ ${acc.email} is fully ready.`);
  }

  console.log("\n🚀 ALL ACCOUNTS SYNCHRONIZED!");
}

setPasswords();

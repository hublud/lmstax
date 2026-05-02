
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

async function setupAccounts() {
  const accounts = [
    { email: 'teacher@taxnigeria.com', password: 'Password123!', name: 'TaxNG Instructor', role: 'teacher' },
    { email: 'student@taxnigeria.com', password: 'Password123!', name: 'TaxNG Student', role: 'student' }
  ];

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error(listError);

  for (const acc of accounts) {
    console.log(`Setting up ${acc.email}...`);
    let user = users.find(u => u.email === acc.email);

    if (!user) {
      const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role }
      });
      if (createError) { console.error(createError); continue; }
      user = newUser;
    } else {
      await supabase.auth.admin.updateUserById(user.id, {
        password: acc.password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role }
      });
    }

    // Handle Profile
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (!profile) {
      await supabase.from('profiles').insert({ id: user.id, full_name: acc.name, role: acc.role });
    } else {
      await supabase.from('profiles').update({ role: acc.role, full_name: acc.name }).eq('id', user.id);
    }
  }

  console.log("\n✅ ACCOUNTS READY");
  console.log("Teacher: teacher@taxnigeria.com / Password123!");
  console.log("Student: student@taxnigeria.com / Password123!");
}

setupAccounts();

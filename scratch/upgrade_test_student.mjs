import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k) process.env[k.trim()]=v.join('=').trim(); });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function upgradeUser() {
  const email = 'student_test@taxnigeria.com';
  
  // 1. Find user in Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error('User not found in Auth:', email);
    return;
  }
  
  console.log('Found user:', user.id);
  
  // 2. Update user in 'users' table
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_tier: 'TaxExpert' })
    .eq('auth_id', user.id);
    
  if (error) {
    console.error('Error updating profile:', error);
  } else {
    console.log('Successfully upgraded student_test@taxnigeria.com to TaxExpert tier.');
  }
}

upgradeUser();

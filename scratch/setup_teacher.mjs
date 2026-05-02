
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

async function createOrUpdateTeacher() {
  const email = 'teacher@taxnigeria.com';
  const password = 'Password123!';
  const fullName = 'TaxNG Instructor';

  console.log(`Checking for user: ${email}...`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  let user = users.find(u => u.email === email);

  if (!user) {
    console.log("Creating new teacher user...");
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'teacher'
      }
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return;
    }
    user = newUser;
    console.log("User created successfully.");
  } else {
    console.log("User already exists. Updating password and metadata...");
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'teacher'
      }
    });

    if (updateError) {
      console.error("Error updating user:", updateError);
      return;
    }
    console.log("User updated successfully.");
  }

  // Ensure profile exists with correct role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error("Error fetching profile:", profileError);
  }

  if (!profile) {
    console.log("Creating profile...");
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        role: 'teacher'
      });
    if (insertError) console.error("Error inserting profile:", insertError);
    else console.log("Profile created.");
  } else {
    console.log("Updating profile role...");
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ role: 'teacher' })
      .eq('id', user.id);
    if (updateProfileError) console.error("Error updating profile:", updateProfileError);
    else console.log("Profile updated.");
  }

  console.log("\n--- TEACHER LOGIN CREDENTIALS ---");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("---------------------------------\n");
}

createOrUpdateTeacher();


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

async function listTables() {
  console.log("Listing all tables in public schema...\n");

  const { data, error } = await supabase.rpc('get_tables'); // Attempt RPC if exists
  
  if (error) {
    // Fallback: Try fetching from common names
    const commonNames = ['course_categories', 'tags', 'tax_categories', 'roles', 'subscriptions'];
    for (const name of commonNames) {
        const { error: e } = await supabase.from(name).select('*').limit(1);
        if (!e) console.log(`- Table Found: ${name}`);
    }
    console.log("\nNote: Standard table listing via API is limited. Checking common names above.");
  } else {
    console.log("Tables:", data);
  }
}

listTables();

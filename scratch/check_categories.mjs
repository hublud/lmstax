
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

async function checkCategories() {
  console.log("Checking categories table...\n");

  const { data: cats, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error("Categories Table Error:", error.message);
  } else {
    console.log(`Found ${cats.length} categories.`);
    if (cats.length > 0) {
      console.log("Columns:", Object.keys(cats[0]).join(", "));
      cats.forEach(c => {
        console.log(`- ${c.name} (Active: ${c.is_active}, ID: ${c.id})`);
      });
    }
  }
}

checkCategories();

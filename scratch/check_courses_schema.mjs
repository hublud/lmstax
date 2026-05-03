
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
  console.log("Checking courses table structure...\n");

  const { data: courses, error } = await supabase.from('courses').select('*').limit(1);
  if (error) {
    console.error("Courses Table Error:", error.message);
  } else {
    console.log("Courses Columns:", Object.keys(courses[0] || {}).join(", ") || "EMPTY TABLE");
    if (courses.length === 0) {
        console.log("\nTable is empty. Checking table info via RPC or other means is restricted, but I will try to fetch one row without filters.");
    }
  }
}

checkSchema();


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

async function checkNotNull() {
  console.log("Checking for more mandatory columns in 'courses'...\n");

  const { error } = await supabase.from('courses').insert({ 
    title: 'SCHEMA TEST V2',
    content: '{}'
  });
  
  if (error) {
    console.log("Database Error:", error.message);
  } else {
    console.log("Insert succeeded with title and content. No other mandatory columns.");
  }
}

checkNotNull();

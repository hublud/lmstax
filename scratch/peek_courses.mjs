
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

async function peek() {
  console.log("Peeking at existing courses...\n");

  const { data: courses, error } = await supabase.from('courses').select('*').limit(5);
  if (error) {
    console.error("Error:", error.message);
  } else {
    courses.forEach(c => {
      console.log(`Course: ${c.title}`);
      console.log(`- Tags: ${c.tags}`);
      console.log(`- Content: ${c.content?.slice(0, 100)}...`);
      console.log(`---`);
    });
  }
}

peek();

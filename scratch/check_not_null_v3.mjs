
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
  console.log("Checking for remaining mandatory columns in 'courses'...\n");

  const testUserId = 'dd3eb937-417e-44ba-93ef-d776347d5ab6'; // Teacher ID

  const { error } = await supabase.from('courses').insert({ 
    title: 'SCHEMA TEST V3',
    content: '{}',
    created_by: testUserId,
    outlines: '[]',
    learning_objectives: '[]'
  });
  
  if (error) {
    console.log("Database Error:", error.message);
  } else {
    console.log("Insert succeeded with all basic fields. This combination works!");
    // Clean up
    await supabase.from('courses').delete().eq('title', 'SCHEMA TEST V3');
  }
}

checkNotNull();

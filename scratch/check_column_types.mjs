
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

async function checkTypes() {
  console.log("Checking data types for 'courses' columns...\n");

  const { data, error } = await supabase.rpc('get_column_types', { table_name: 'courses' }); // Might not exist
  
  if (error) {
    // Try to get one existing row and check the type of fields
    const { data: courses } = await supabase.from('courses').select('outlines, learning_objectives').limit(1);
    if (courses && courses.length > 0) {
        console.log("Existing row data types:");
        console.log("- Outlines type:", typeof courses[0].outlines, Array.isArray(courses[0].outlines) ? "(Array)" : "");
        console.log("- Learning Objectives type:", typeof courses[0].learning_objectives, Array.isArray(courses[0].learning_objectives) ? "(Array)" : "");
        console.log("Sample Outlines:", courses[0].outlines);
    } else {
        console.log("No existing courses to inspect.");
    }
  } else {
    console.log("Column Types:", data);
  }
}

checkTypes();

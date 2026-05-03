
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

async function checkCurriculum() {
  console.log("Checking curriculum tables...\n");

  const { data: m, error: mErr } = await supabase.from('modules').select('*').limit(1);
  if (mErr) console.error("Modules Table Error:", mErr.message);
  else console.log("Modules Columns:", Object.keys(m[0] || {}).join(", ") || "EMPTY TABLE");

  const { data: l, error: lErr } = await supabase.from('lessons').select('*').limit(1);
  if (lErr) console.error("Lessons Table Error:", lErr.message);
  else console.log("Lessons Columns:", Object.keys(l[0] || {}).join(", ") || "EMPTY TABLE");
}

checkCurriculum();

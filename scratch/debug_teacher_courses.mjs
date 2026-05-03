import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k) process.env[k.trim()]=v.join('=').trim(); });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTeacherCourses() {
  const email = 'teacher_test@taxnigeria.com';
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  
  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User Found:', user.full_name, 'Auth ID:', user.auth_id);

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('created_by', user.auth_id);

  if (error) {
    console.error('Error fetching courses:', error.message);
  } else {
    console.log('Courses found for this user:', courses.length);
    courses.forEach(c => {
      console.log(`- [${c.id}] ${c.title} (Status: ${c.status})`);
    });
  }
}

checkTeacherCourses();

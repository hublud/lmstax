import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k) process.env[k.trim()]=v.join('=').trim(); });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixRLS() {
  console.log('=== FIXING RLS POLICIES FOR COURSES TABLE ===\n');

  // We need to run raw SQL to create RLS policies.
  // Supabase JS client doesn't support DDL directly, so we use the REST API with service key.
  
  const policies = [
    {
      name: 'Allow teachers and admins to insert courses',
      sql: `
        CREATE POLICY IF NOT EXISTS "teachers_can_insert_courses"
        ON public.courses
        FOR INSERT
        TO authenticated
        WITH CHECK (
          auth.uid() = created_by
          AND (
            EXISTS (
              SELECT 1 FROM public.users
              WHERE users.auth_id = auth.uid()
              AND users.role IN ('teacher', 'admin')
            )
          )
        );
      `
    },
    {
      name: 'Allow teachers and admins to update their own courses',
      sql: `
        CREATE POLICY IF NOT EXISTS "teachers_can_update_courses"
        ON public.courses
        FOR UPDATE
        TO authenticated
        USING (
          auth.uid() = created_by
          AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.auth_id = auth.uid()
            AND users.role IN ('teacher', 'admin')
          )
        );
      `
    },
    {
      name: 'Allow everyone to read published courses',
      sql: `
        CREATE POLICY IF NOT EXISTS "anyone_can_read_published_courses"
        ON public.courses
        FOR SELECT
        TO authenticated
        USING (status = 'published' OR auth.uid() = created_by);
      `
    },
  ];

  // Use supabase.rpc or direct SQL via the postgres connection
  for (const policy of policies) {
    console.log(`Creating policy: "${policy.name}"...`);
    const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
    if (error) {
      // If exec_sql doesn't exist, we'll note it
      if (error.message.includes('exec_sql')) {
        console.log('  exec_sql RPC not available. Will use alternative approach.');
      } else {
        console.error('  Error:', error.message);
      }
    } else {
      console.log('  ✅ Created!');
    }
  }

  // Alternative: Check current RLS status
  console.log('\n--- Checking current RLS status on courses table ---');
  const { data: rlsCheck, error: rlsErr } = await supabase
    .rpc('exec_sql', { sql: "SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'courses';" });
  
  if (rlsErr) {
    console.log('Cannot check policies via RPC. Will generate SQL for manual execution.');
    console.log('\n=== PLEASE RUN THIS SQL IN SUPABASE DASHBOARD > SQL EDITOR ===\n');
    console.log(`-- Enable RLS (if not already enabled)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow teachers and admins to INSERT their own courses
CREATE POLICY "teachers_can_insert_courses"
ON public.courses FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.auth_id = auth.uid()
    AND users.role IN ('teacher', 'admin')
  )
);

-- Allow teachers and admins to UPDATE their own courses
CREATE POLICY "teachers_can_update_courses"
ON public.courses FOR UPDATE TO authenticated
USING (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.auth_id = auth.uid()
    AND users.role IN ('teacher', 'admin')
  )
);

-- Allow authenticated users to SELECT published courses (or their own)
CREATE POLICY "anyone_can_read_courses"
ON public.courses FOR SELECT TO authenticated
USING (status = 'published' OR auth.uid() = created_by);

-- Allow admins to see ALL courses
CREATE POLICY "admins_can_read_all_courses"
ON public.courses FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);`);
  }
}

fixRLS();

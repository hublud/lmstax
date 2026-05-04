-- Fix for PGRST116 Error during login
-- This error occurs because the 'users' table has Row Level Security (RLS) enabled,
-- but lacks a policy allowing users to read their own row using their 'auth_id'.

    -- 1. Ensure RLS is enabled (it likely already is)
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    -- 2. Drop the policy if it already exists to avoid errors
    DROP POLICY IF EXISTS "Users can view their own record" ON public.users;

    -- 3. Create a policy allowing authenticated users to select their own row where auth_id matches their UUID
    CREATE POLICY "Users can view their own record" 
    ON public.users 
    FOR SELECT 
    TO authenticated
    USING (auth_id = auth.uid());

-- Optional: If users need to update their own record, you can add an UPDATE policy as well
-- CREATE POLICY "Users can update their own record" 
-- ON public.users 
-- FOR UPDATE 
-- TO authenticated
-- USING (auth_id = auth.uid())
-- WITH CHECK (auth_id = auth.uid());

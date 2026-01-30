-- COMPLETE FIX FOR AUTHENTICATED USER RLS ISSUE
-- This script fixes RLS policies for authenticated admin users
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: DIAGNOSTICS - Run this first
-- ============================================

-- Check your current authentication status
SELECT
    'Current User Info' as check_type,
    current_user as postgres_user,
    current_role as postgres_role,
    auth.role() as supabase_role,
    auth.uid() as user_id;

-- IMPORTANT:
-- - If auth.role() returns 'anon' → You're not authenticated
-- - If auth.role() returns 'authenticated' → You ARE authenticated
-- - If auth.uid() returns NULL → You're not logged in
-- - If auth.uid() returns a UUID → You ARE logged in

-- Check if RLS is enabled on blog_posts
SELECT
    'RLS Status' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'blog_posts';

-- List ALL current policies on blog_posts
SELECT
    'Current Policies' as check_type,
    policyname,
    cmd as operation,
    roles,
    CASE
        WHEN qual IS NULL THEN 'true (no restriction)'
        ELSE qual
    END as using_clause,
    CASE
        WHEN with_check IS NULL THEN 'N/A'
        ELSE with_check
    END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'blog_posts'
ORDER BY cmd, policyname;

-- ============================================
-- STEP 2: COMPLETE POLICY RESET
-- ============================================

-- Drop ALL existing policies (handles any edge cases)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'blog_posts'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_posts', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: CREATE CORRECT POLICIES FOR AUTHENTICATED USERS
-- ============================================

-- Policy 1: Anonymous users can ONLY view published posts
CREATE POLICY "anon_select_published"
ON public.blog_posts
FOR SELECT
TO anon
USING (is_published = true);

-- Policy 2: Authenticated users can view ALL posts (including drafts)
CREATE POLICY "authenticated_select_all"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated users can INSERT new posts
CREATE POLICY "authenticated_insert"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Authenticated users can UPDATE any post
CREATE POLICY "authenticated_update"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Authenticated users can DELETE any post
CREATE POLICY "authenticated_delete"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 4: VERIFICATION
-- ============================================

-- Verify all 5 policies are created correctly
SELECT
    'Final Policy List' as check_type,
    policyname,
    cmd as operation,
    roles,
    CASE
        WHEN qual IS NULL THEN 'true'
        ELSE qual
    END as using_clause,
    CASE
        WHEN with_check IS NULL THEN 'N/A'
        ELSE with_check
    END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'blog_posts'
ORDER BY cmd, policyname;

-- Expected output: 5 policies
-- 1. anon_select_published (SELECT for anon, is_published = true)
-- 2. authenticated_select_all (SELECT for authenticated, true)
-- 3. authenticated_insert (INSERT for authenticated, true)
-- 4. authenticated_update (UPDATE for authenticated, true/true)
-- 5. authenticated_delete (DELETE for authenticated, true)

-- ============================================
-- STEP 5: TEST INSERT (only works if authenticated)
-- ============================================

-- This will ONLY work if you're currently authenticated
-- If you get RLS error here, you're not authenticated
-- If it works, your RLS is configured correctly!

-- Uncomment to test:
-- INSERT INTO public.blog_posts (
--     title, slug, excerpt, content, author,
--     published_date, is_published, post_type,
--     meta_description, tags, meta_keywords,
--     views_count, is_external
-- ) VALUES (
--     'Test Post from SQL',
--     'test-post-' || floor(random() * 10000)::text,
--     'This is a test excerpt',
--     'This is test content',
--     'Admin',
--     NOW(),
--     false,
--     'article',
--     'Test meta description',
--     ARRAY['test'],
--     ARRAY['test', 'sql'],
--     0,
--     false
-- )
-- RETURNING id, title, slug, is_published;

-- ============================================
-- TROUBLESHOOTING GUIDE
-- ============================================

-- If you still get RLS errors after running this script:
--
-- 1. CHECK YOUR AUTHENTICATION STATUS:
--    - Run: SELECT auth.role(), auth.uid();
--    - If role is 'anon' or uid is NULL → You're not logged in
--    - Solution: Log in through your admin panel first
--
-- 2. CHECK YOUR APP'S SESSION:
--    - Open browser console
--    - Run: JSON.parse(localStorage.getItem('supabase.auth.token'))
--    - If null → Session expired or not set
--    - Solution: Log out and log in again
--
-- 3. CHECK SUPABASE CLIENT CONFIGURATION:
--    - Verify you're using VITE_SUPABASE_ANON_KEY (not service role)
--    - Verify auth options include persistSession: true
--    - Verify autoRefreshToken: true
--
-- 4. CHECK YOUR ADMIN USER EXISTS:
--    - Go to Supabase Dashboard → Authentication → Users
--    - Verify your admin user is created
--    - Verify email is confirmed
--
-- 5. CLEAR CACHE AND RESTART:
--    - Clear browser localStorage
--    - Clear browser cookies
--    - Restart dev server
--    - Log in again

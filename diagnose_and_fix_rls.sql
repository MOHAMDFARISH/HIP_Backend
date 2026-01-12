-- COMPREHENSIVE RLS DIAGNOSTIC AND FIX FOR blog_posts
-- This script will help diagnose and fix the RLS issue

-- ============================================
-- STEP 1: DIAGNOSTIC - Check current state
-- ============================================

-- Check if RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'blog_posts';
-- Expected: rowsecurity = true

-- Check current role
SELECT current_user, current_role;

-- Check authentication status
SELECT auth.role();
SELECT auth.uid();

-- List ALL existing policies on blog_posts
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'blog_posts'
ORDER BY policyname;

-- ============================================
-- STEP 2: FIX - Complete policy reset
-- ============================================

-- Drop ALL existing policies (including any we might have missed)
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
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create COMPLETE set of policies
-- ============================================

-- Policy 1: Public (anonymous) users can view published posts only
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon
USING (is_published = true);

-- Policy 2: Authenticated users can view ALL posts (including drafts)
CREATE POLICY "Authenticated users can view all blog posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated users can insert posts (no restrictions)
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Authenticated users can update any post with any values
CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Authenticated users can delete any post
CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 4: VERIFICATION
-- ============================================

-- Verify all 5 policies are created
SELECT
    policyname,
    roles,
    cmd as operation,
    CASE
        WHEN qual IS NULL THEN 'No restriction'
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
-- SELECT (2 policies): one for anon, one for authenticated
-- INSERT (1 policy): for authenticated
-- UPDATE (1 policy): for authenticated
-- DELETE (1 policy): for authenticated

-- ============================================
-- STEP 5: TEST (optional - uncomment to test)
-- ============================================

-- Test INSERT as authenticated user (this should work if you're authenticated)
-- INSERT INTO public.blog_posts (
--     title, slug, excerpt, content, author,
--     published_date, is_published, post_type
-- ) VALUES (
--     'Test Post', 'test-post', 'Test excerpt', 'Test content',
--     'Test Author', NOW(), false, 'article'
-- );

-- If the above INSERT fails, check:
-- 1. Are you authenticated? Run: SELECT auth.uid();
-- 2. If auth.uid() returns NULL, you're not authenticated
-- 3. You need to authenticate through Supabase client first

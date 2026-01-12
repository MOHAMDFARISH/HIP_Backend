-- QUICK FIX: Remove conflicting blog_posts policies and create correct ones
-- Run this immediately to fix the unpublish error

-- Step 1: Drop ALL blog_posts policies
DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- Step 2: Create ONLY the correct policies

-- Allow public to read published posts
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Allow authenticated users to INSERT (no restrictions on what they insert)
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE (can change ANY field including is_published)
CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- Step 3: Verify policies are correct
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'blog_posts'
ORDER BY policyname;

-- You should see EXACTLY 4 policies:
-- 1. Authenticated users can delete blog posts
-- 2. Authenticated users can insert blog posts
-- 3. Authenticated users can update blog posts (USING: true, WITH CHECK: true)
-- 4. Public can view published blog posts

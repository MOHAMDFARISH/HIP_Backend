-- EMERGENCY FIX FOR REVIEWS RLS - Run this NOW in Supabase SQL Editor
-- This will fix the "new row violates row-level security policy" error

-- Step 1: Check current auth status
SELECT
    'Your Auth Status' as info,
    auth.role() as role,
    auth.uid() as user_id,
    CASE
        WHEN auth.role() = 'authenticated' THEN '✓ Authenticated - this should work'
        ELSE '✗ NOT authenticated - log in to admin panel first'
    END as status;

-- Step 2: Drop ALL existing review policies
DROP POLICY IF EXISTS "Public can view published reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view published reviews" ON public.reviews;

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Step 4: Create CORRECT policies

-- Public can view published reviews
CREATE POLICY "anon_select_published_reviews"
ON public.reviews FOR SELECT
TO anon
USING (is_published = true);

-- Authenticated admins can view ALL reviews
CREATE POLICY "authenticated_select_all_reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can INSERT reviews
CREATE POLICY "authenticated_insert_reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can UPDATE reviews (INCLUDING unpublish!)
-- This is the key fix - WITH CHECK (true) allows setting is_published = false
CREATE POLICY "authenticated_update_reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can DELETE reviews
CREATE POLICY "authenticated_delete_reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);

-- Step 5: Verify policies are correct
SELECT
    'Review Policies' as info,
    policyname,
    cmd as operation,
    roles,
    CASE
        WHEN qual IS NULL THEN 'true'
        WHEN qual LIKE '%is_published%' THEN 'is_published = true'
        ELSE qual
    END as using_clause,
    CASE
        WHEN with_check IS NULL THEN 'N/A'
        WHEN with_check = 'true' THEN 'true (allows unpublish!)'
        ELSE with_check
    END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reviews'
ORDER BY cmd, policyname;

-- Expected: 5 policies
-- - anon_select_published_reviews (SELECT for anon)
-- - authenticated_select_all_reviews (SELECT for authenticated)
-- - authenticated_insert_reviews (INSERT for authenticated)
-- - authenticated_update_reviews (UPDATE for authenticated, WITH CHECK: true)
-- - authenticated_delete_reviews (DELETE for authenticated)

-- Success!
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'REVIEWS RLS FIXED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'You can now unpublish reviews!';
    RAISE NOTICE 'Next: Restart dev server and try again';
END $$;

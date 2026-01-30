-- EMERGENCY FIX FOR MEDIA_ITEMS RLS - Run this NOW in Supabase SQL Editor
-- This will fix the "new row violates row-level security policy" error when unpublishing media

-- Step 1: Check current auth status
SELECT
    'Your Auth Status' as info,
    auth.role() as role,
    auth.uid() as user_id,
    CASE
        WHEN auth.role() = 'authenticated' THEN '✓ Authenticated - this should work'
        ELSE '✗ NOT authenticated - log in to admin panel first'
    END as status;

-- Step 2: Drop ALL existing media_items policies
DROP POLICY IF EXISTS "Public can view published media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can view media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can view all media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can insert media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can update media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can delete media items" ON public.media_items;
DROP POLICY IF EXISTS "anon_select_published_media" ON public.media_items;
DROP POLICY IF EXISTS "authenticated_select_all_media" ON public.media_items;
DROP POLICY IF EXISTS "authenticated_insert_media" ON public.media_items;
DROP POLICY IF EXISTS "authenticated_update_media" ON public.media_items;
DROP POLICY IF EXISTS "authenticated_delete_media" ON public.media_items;

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Step 4: Create CORRECT policies

-- Public can view published media
CREATE POLICY "anon_select_published_media"
ON public.media_items FOR SELECT
TO anon
USING (is_published = true);

-- Authenticated admins can view ALL media
CREATE POLICY "authenticated_select_all_media"
ON public.media_items FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can INSERT media
CREATE POLICY "authenticated_insert_media"
ON public.media_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can UPDATE media (INCLUDING unpublish!)
-- This is the key fix - WITH CHECK (true) allows setting is_published = false
CREATE POLICY "authenticated_update_media"
ON public.media_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can DELETE media
CREATE POLICY "authenticated_delete_media"
ON public.media_items FOR DELETE
TO authenticated
USING (true);

-- Step 5: Verify policies are correct
SELECT
    'Media Items Policies' as info,
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
WHERE schemaname = 'public' AND tablename = 'media_items'
ORDER BY cmd, policyname;

-- Expected: 5 policies
-- - anon_select_published_media (SELECT for anon)
-- - authenticated_select_all_media (SELECT for authenticated)
-- - authenticated_insert_media (INSERT for authenticated)
-- - authenticated_update_media (UPDATE for authenticated, WITH CHECK: true)
-- - authenticated_delete_media (DELETE for authenticated)

-- Success!
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MEDIA_ITEMS RLS FIXED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'You can now unpublish media items!';
    RAISE NOTICE 'Next: Restart dev server and try again';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: After this, run fix_all_rls_policies.sql';
    RAISE NOTICE 'to fix ALL tables at once and prevent future issues!';
END $$;

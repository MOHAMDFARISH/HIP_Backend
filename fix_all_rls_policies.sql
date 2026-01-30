-- COMPREHENSIVE RLS FIX FOR ALL ADMIN TABLES
-- This fixes RLS policies for authenticated admin users across all tables
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: DIAGNOSTICS
-- ============================================

-- Check your current authentication status
SELECT
    'Auth Status Check' as diagnostic,
    current_user as postgres_user,
    auth.role() as supabase_role,
    auth.uid() as user_id,
    CASE
        WHEN auth.role() = 'authenticated' THEN '✓ You are authenticated'
        WHEN auth.role() = 'anon' THEN '✗ You are NOT authenticated - log in first'
        ELSE '? Unknown authentication state'
    END as status;

-- Check RLS status for all tables
SELECT
    'RLS Status' as diagnostic,
    tablename,
    CASE
        WHEN rowsecurity THEN '✓ Enabled'
        ELSE '✗ Disabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock')
ORDER BY tablename;

-- Count policies per table
SELECT
    'Policy Count' as diagnostic,
    tablename,
    COUNT(*) as policy_count,
    string_agg(DISTINCT cmd::text, ', ') as operations
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- STEP 2: COMPLETE POLICY RESET
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignment_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on these tables
DO $$
DECLARE
    r RECORD;
    table_list TEXT[] := ARRAY['orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock'];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY table_list LOOP
        FOR r IN (
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = tbl
        ) LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, tbl);
            RAISE NOTICE 'Dropped policy % on table %', r.policyname, tbl;
        END LOOP;
    END LOOP;
END $$;

-- ============================================
-- STEP 3: CREATE CORRECT POLICIES - ORDERS
-- ============================================

-- Public can create orders (for customer purchases on website)
CREATE POLICY "public_insert_orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admins can view all orders
CREATE POLICY "authenticated_select_orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can update orders
CREATE POLICY "authenticated_update_orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete orders
CREATE POLICY "authenticated_delete_orders"
ON public.orders FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 4: CREATE CORRECT POLICIES - BLOG_POSTS
-- ============================================

-- Public can view published posts
CREATE POLICY "anon_select_published_posts"
ON public.blog_posts FOR SELECT
TO anon
USING (is_published = true);

-- Authenticated admins can view all posts (including drafts)
CREATE POLICY "authenticated_select_all_posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can insert posts
CREATE POLICY "authenticated_insert_posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can update posts
CREATE POLICY "authenticated_update_posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete posts
CREATE POLICY "authenticated_delete_posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 5: CREATE CORRECT POLICIES - MEDIA_ITEMS
-- ============================================

-- Public can view published media
CREATE POLICY "anon_select_published_media"
ON public.media_items FOR SELECT
TO anon
USING (is_published = true);

-- Authenticated admins can view all media (including unpublished)
CREATE POLICY "authenticated_select_all_media"
ON public.media_items FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can insert media
CREATE POLICY "authenticated_insert_media"
ON public.media_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can update media
CREATE POLICY "authenticated_update_media"
ON public.media_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete media
CREATE POLICY "authenticated_delete_media"
ON public.media_items FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 6: CREATE CORRECT POLICIES - REVIEWS
-- ============================================

-- Public can view published reviews
CREATE POLICY "anon_select_published_reviews"
ON public.reviews FOR SELECT
TO anon
USING (is_published = true);

-- Authenticated admins can view all reviews
CREATE POLICY "authenticated_select_all_reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- Authenticated admins can insert reviews
CREATE POLICY "authenticated_insert_reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can update reviews
CREATE POLICY "authenticated_update_reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated admins can delete reviews
CREATE POLICY "authenticated_delete_reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 7: CREATE CORRECT POLICIES - GIFTS
-- ============================================

-- Only authenticated admins can access gifts
CREATE POLICY "authenticated_select_gifts"
ON public.gifts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_gifts"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_gifts"
ON public.gifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_delete_gifts"
ON public.gifts FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 8: CREATE CORRECT POLICIES - CONSIGNMENT_SHOPS
-- ============================================

CREATE POLICY "authenticated_select_consignment_shops"
ON public.consignment_shops FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_consignment_shops"
ON public.consignment_shops FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_consignment_shops"
ON public.consignment_shops FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_delete_consignment_shops"
ON public.consignment_shops FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 9: CREATE CORRECT POLICIES - INVENTORY_STOCK
-- ============================================

CREATE POLICY "authenticated_select_inventory"
ON public.inventory_stock FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_inventory"
ON public.inventory_stock FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_inventory"
ON public.inventory_stock FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_delete_inventory"
ON public.inventory_stock FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 10: VERIFICATION
-- ============================================

-- Verify all policies are created
SELECT
    'Policy Summary' as check_type,
    tablename,
    COUNT(*) as total_policies,
    COUNT(*) FILTER (WHERE cmd = 'SELECT') as select_policies,
    COUNT(*) FILTER (WHERE cmd = 'INSERT') as insert_policies,
    COUNT(*) FILTER (WHERE cmd = 'UPDATE') as update_policies,
    COUNT(*) FILTER (WHERE cmd = 'DELETE') as delete_policies
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock')
GROUP BY tablename
ORDER BY tablename;

-- Expected results:
-- orders: 4 policies (1 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- blog_posts: 5 policies (2 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- media_items: 5 policies (2 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- reviews: 5 policies (2 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- gifts: 4 policies (1 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- consignment_shops: 4 policies (1 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)
-- inventory_stock: 4 policies (1 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE)

-- Detailed view of all policies
SELECT
    'Policy Details' as check_type,
    tablename,
    policyname,
    cmd as operation,
    roles,
    CASE
        WHEN qual IS NULL THEN 'true'
        WHEN qual LIKE '%is_published%' THEN 'is_published = true'
        ELSE LEFT(qual, 50)
    END as using_clause,
    CASE
        WHEN with_check IS NULL THEN 'N/A'
        WHEN with_check = 'true' THEN 'true'
        ELSE LEFT(with_check, 50)
    END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'blog_posts', 'media_items', 'reviews', 'gifts', 'consignment_shops', 'inventory_stock')
ORDER BY tablename, cmd, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS POLICIES UPDATED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Review the verification results above';
    RAISE NOTICE '2. Restart your dev server';
    RAISE NOTICE '3. Clear browser cache and re-login';
    RAISE NOTICE '4. Try creating/updating media items, blog posts, etc.';
    RAISE NOTICE '';
    RAISE NOTICE 'All authenticated admin operations should now work!';
    RAISE NOTICE '========================================';
END $$;

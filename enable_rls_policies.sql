-- Enable Row Level Security on all tables
-- This script sets up secure RLS policies for authenticated users

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignment_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DROP EXISTING POLICIES (if any)
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;

DROP POLICY IF EXISTS "Authenticated users can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

DROP POLICY IF EXISTS "Authenticated users can view media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can insert media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can update media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can delete media items" ON public.media_items;

DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;

DROP POLICY IF EXISTS "Authenticated users can view gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can insert gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can update gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can delete gifts" ON public.gifts;

DROP POLICY IF EXISTS "Authenticated users can view consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can insert consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can update consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can delete consignment shops" ON public.consignment_shops;

DROP POLICY IF EXISTS "Authenticated users can view inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can insert inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can update inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can delete inventory stock" ON public.inventory_stock;

-- ============================================================================
-- CREATE POLICIES FOR ORDERS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR BLOG_POSTS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view blog posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR MEDIA_ITEMS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view media items"
ON public.media_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert media items"
ON public.media_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media items"
ON public.media_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media items"
ON public.media_items FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR REVIEWS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR GIFTS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view gifts"
ON public.gifts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert gifts"
ON public.gifts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gifts"
ON public.gifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gifts"
ON public.gifts FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR CONSIGNMENT_SHOPS TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view consignment shops"
ON public.consignment_shops FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert consignment shops"
ON public.consignment_shops FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update consignment shops"
ON public.consignment_shops FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete consignment shops"
ON public.consignment_shops FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR INVENTORY_STOCK TABLE
-- ============================================================================

CREATE POLICY "Authenticated users can view inventory stock"
ON public.inventory_stock FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert inventory stock"
ON public.inventory_stock FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update inventory stock"
ON public.inventory_stock FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inventory stock"
ON public.inventory_stock FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify RLS is enabled and policies are created
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- View all policies
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

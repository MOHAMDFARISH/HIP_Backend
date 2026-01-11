-- Enable Row Level Security on all tables
-- This script sets up secure RLS policies with PUBLIC order creation

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
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;

DROP POLICY IF EXISTS "Authenticated users can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

DROP POLICY IF EXISTS "Authenticated users can view media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can insert media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can update media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can delete media items" ON public.media_items;
DROP POLICY IF EXISTS "Public can view published media items" ON public.media_items;

DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view published reviews" ON public.reviews;

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
-- IMPORTANT: Public website needs to create orders!
-- ============================================================================

-- Allow ANYONE (public) to create orders (for customer purchases)
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated admins can view all orders
CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

-- Only authenticated admins can update orders
CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated admins can delete orders
CREATE POLICY "Authenticated users can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR BLOG_POSTS TABLE
-- Public can read published posts, admins can manage all
-- ============================================================================

-- Public can view published blog posts (for website)
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Authenticated admins can view ALL blog posts (including drafts)
CREATE POLICY "Authenticated users can view all blog posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

-- Only authenticated admins can create blog posts
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated admins can update blog posts
CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated admins can delete blog posts
CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR MEDIA_ITEMS TABLE
-- Public can view published media, admins can manage all
-- ============================================================================

-- Public can view published media items
CREATE POLICY "Public can view published media items"
ON public.media_items FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Authenticated admins can view ALL media items
CREATE POLICY "Authenticated users can view all media items"
ON public.media_items FOR SELECT
TO authenticated
USING (true);

-- Only authenticated admins can create media items
CREATE POLICY "Authenticated users can insert media items"
ON public.media_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated admins can update media items
CREATE POLICY "Authenticated users can update media items"
ON public.media_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated admins can delete media items
CREATE POLICY "Authenticated users can delete media items"
ON public.media_items FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR REVIEWS TABLE
-- Public can view published reviews, admins can manage all
-- ============================================================================

-- Public can view published reviews
CREATE POLICY "Public can view published reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Authenticated admins can view ALL reviews
CREATE POLICY "Authenticated users can view all reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- Only authenticated admins can create reviews
CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated admins can update reviews
CREATE POLICY "Authenticated users can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated admins can delete reviews
CREATE POLICY "Authenticated users can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- CREATE POLICIES FOR GIFTS TABLE
-- Only authenticated admins can access
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
-- Only authenticated admins can access
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
-- Only authenticated admins can access
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

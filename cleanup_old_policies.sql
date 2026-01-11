-- ============================================================================
-- CRITICAL: Remove ALL existing RLS policies before applying new ones
-- This script removes old/conflicting policies that create security holes
-- ============================================================================

-- Remove ALL policies from orders table
DROP POLICY IF EXISTS "Allow public read access" ON public.orders;
DROP POLICY IF EXISTS "Allow public update access" ON public.orders;
DROP POLICY IF EXISTS "Service role has full access" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;

-- Remove ALL policies from blog_posts table
DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- Remove ALL policies from media_items table
DROP POLICY IF EXISTS "Allow authenticated users to manage media" ON public.media_items;
DROP POLICY IF EXISTS "Allow public read access to published media" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can view media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can view all media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can insert media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can update media items" ON public.media_items;
DROP POLICY IF EXISTS "Authenticated users can delete media items" ON public.media_items;
DROP POLICY IF EXISTS "Public can view published media items" ON public.media_items;

-- Remove ALL policies from reviews table
DROP POLICY IF EXISTS "Allow authenticated users to manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public read access to published reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view published reviews" ON public.reviews;

-- Remove ALL policies from gifts table
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can view gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can insert gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can update gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can delete gifts" ON public.gifts;

-- Remove ALL policies from consignment_shops table
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can view consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can insert consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can update consignment shops" ON public.consignment_shops;
DROP POLICY IF EXISTS "Authenticated users can delete consignment shops" ON public.consignment_shops;

-- Remove ALL policies from inventory_stock table
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can view inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can insert inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can update inventory stock" ON public.inventory_stock;
DROP POLICY IF EXISTS "Authenticated users can delete inventory stock" ON public.inventory_stock;

-- Verify all policies are removed
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- If the above query returns any rows, you still have policies!
-- They should all be gone before applying new policies.

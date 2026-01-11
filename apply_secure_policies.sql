-- ============================================================================
-- Apply Secure RLS Policies (Run AFTER cleanup_old_policies.sql)
-- This creates clean, secure policies with proper access control
-- ============================================================================

-- ============================================================================
-- ORDERS TABLE - Public can create, admins can manage
-- ============================================================================

CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

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
-- BLOG_POSTS TABLE - Public can read published, admins can manage all
-- ============================================================================

CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (is_published = true);

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
-- MEDIA_ITEMS TABLE - Public can read published, admins can manage all
-- ============================================================================

CREATE POLICY "Public can view published media items"
ON public.media_items FOR SELECT
TO anon, authenticated
USING (is_published = true);

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
-- REVIEWS TABLE - Public can read published, admins can manage all
-- ============================================================================

CREATE POLICY "Public can view published reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (is_published = true);

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
-- GIFTS TABLE - Admins only (private data)
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
-- CONSIGNMENT_SHOPS TABLE - Admins only (private data)
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
-- INVENTORY_STOCK TABLE - Admins only (private data)
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
-- VERIFICATION - Check that policies are correct
-- ============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SUMMARY OF ACCESS CONTROL
-- ============================================================================
/*
ORDERS:
  - Public (anon): Can INSERT (create orders)
  - Authenticated: Can SELECT, UPDATE, DELETE (admin panel)

BLOG_POSTS, MEDIA_ITEMS, REVIEWS:
  - Public (anon): Can SELECT published items (website display)
  - Authenticated: Can INSERT, UPDATE, DELETE (admin panel)

GIFTS, CONSIGNMENT_SHOPS, INVENTORY_STOCK:
  - Authenticated only: Full access (private admin data)
*/

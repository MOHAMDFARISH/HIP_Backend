-- ============================================================================
-- Page Metadata Table Migration
-- Creates a table for managing SEO metadata for different pages
-- Run this in your Supabase SQL editor
-- ============================================================================

-- ============================================================================
-- CREATE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.page_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id VARCHAR(100) NOT NULL UNIQUE,
  page_name VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  og_type VARCHAR(50) DEFAULT 'website',
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  favicon_url TEXT,
  robots VARCHAR(100) DEFAULT 'index, follow',
  structured_data JSONB,
  custom_head_tags TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add comment to table
COMMENT ON TABLE public.page_metadata IS 'Stores SEO metadata for website pages';

-- Create index on page_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_metadata_page_id ON public.page_metadata(page_id);
CREATE INDEX IF NOT EXISTS idx_page_metadata_is_active ON public.page_metadata(is_active);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Public can read active page metadata (for website to fetch SEO data)
CREATE POLICY "Public can view active page metadata"
ON public.page_metadata FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Authenticated users (admins) can view all page metadata including inactive
CREATE POLICY "Authenticated users can view all page metadata"
ON public.page_metadata FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert page metadata
CREATE POLICY "Authenticated users can insert page metadata"
ON public.page_metadata FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update page metadata
CREATE POLICY "Authenticated users can update page metadata"
ON public.page_metadata FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete page metadata
CREATE POLICY "Authenticated users can delete page metadata"
ON public.page_metadata FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- SEED DATA (Optional - Common pages)
-- ============================================================================

-- Insert default metadata entries for common pages
-- Uncomment and modify as needed

/*
INSERT INTO public.page_metadata (page_id, page_name, page_title, meta_description, og_type)
VALUES
  ('home', 'Home Page', 'Welcome to Our Website', 'Discover our amazing products and services.', 'website'),
  ('about', 'About Us', 'About Our Company', 'Learn more about our mission, values, and team.', 'website'),
  ('contact', 'Contact Us', 'Get in Touch', 'Contact us for inquiries, support, or feedback.', 'website'),
  ('book', 'The Book', 'Our Book Title', 'Discover the inspiring story of our book.', 'book')
ON CONFLICT (page_id) DO NOTHING;
*/

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'page_metadata'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'page_metadata'
ORDER BY policyname;

-- ============================================================================
-- SUMMARY
-- ============================================================================
/*
PAGE_METADATA:
  - Public (anon): Can SELECT active entries (website fetches SEO data)
  - Authenticated: Can SELECT all, INSERT, UPDATE, DELETE (admin panel)

Fields:
  - page_id: Unique identifier (e.g., 'home', 'about', 'contact')
  - page_name: Human-readable name
  - page_title: Browser tab title
  - meta_description: SEO description
  - meta_keywords: Array of SEO keywords
  - og_title/og_description/og_image/og_type: Open Graph social sharing
  - twitter_card/twitter_title/twitter_description/twitter_image: Twitter Card
  - canonical_url: Canonical URL for the page
  - favicon_url: Page-specific favicon (if different from default)
  - robots: Search engine directives (index, follow, etc.)
  - structured_data: JSON-LD structured data for rich snippets
  - custom_head_tags: Raw HTML to inject in <head>
  - is_active: Whether this metadata is currently in use
*/

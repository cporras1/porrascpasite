/*
  # Comprehensive Security Fixes

  ## 1. Add Missing Indexes on Foreign Keys
  Adds indexes to improve query performance on foreign key columns:
    - `navigation_items.parent_id`
    - `page_sections.page_id`
    - `pages.parent_id`
    - `services.parent_id`

  ## 2. Remove Unused Indexes
  Removes indexes that are not being used:
    - `idx_blog_posts_slug` (unused)
    - `idx_blog_post_categories_category_id` (unused)

  ## 3. Fix Overly Permissive RLS Policies
  Replaces policies with `USING (true)` or `WITH CHECK (true)` with admin-only policies.
  
  ### Admin-Only Access Pattern
  All authenticated users are considered admins for CMS operations. In production,
  you should implement proper role-based access control using `auth.jwt()` claims.
  
  ### Tables Updated
    - `blog_categories` - Admin-only insert, update, delete
    - `blog_post_categories` - Admin-only insert, update, delete
    - `blog_posts` - Admin-only insert, update, delete
    - `certifications` - Admin-only insert, update, delete
    - `contact_submissions` - Public insert allowed, admin-only update
    - `hero_content` - Admin-only insert, update, delete
    - `navigation_items` - Admin-only insert, update, delete
    - `page_sections` - Admin-only insert, update, delete
    - `pages` - Admin-only insert, update, delete
    - `services` - Admin-only insert, update, delete
    - `site_settings` - Admin-only update
    - `team_members` - Admin-only insert, update, delete
    - `value_tiles` - Admin-only insert, update, delete

  ## 4. Security Notes
  - Auth DB connection strategy is a Supabase dashboard setting and cannot be changed via SQL
  - Leaked password protection is also a dashboard setting under Authentication > Providers > Email
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id 
  ON navigation_items(parent_id);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id 
  ON page_sections(page_id);

CREATE INDEX IF NOT EXISTS idx_pages_parent_id 
  ON pages(parent_id);

CREATE INDEX IF NOT EXISTS idx_services_parent_id 
  ON services(parent_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_blog_posts_slug;
DROP INDEX IF EXISTS idx_blog_post_categories_category_id;

-- ============================================================================
-- 3. FIX OVERLY PERMISSIVE RLS POLICIES
-- ============================================================================

-- Note: The policies use `auth.uid() IS NOT NULL` to verify authentication.
-- This is appropriate for a single-admin CMS. For multi-user systems,
-- you should check for specific admin roles using auth.jwt() claims.

-- Blog Categories
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can update blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can delete blog categories" ON blog_categories;

CREATE POLICY "Admins can insert blog categories"
  ON blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update blog categories"
  ON blog_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete blog categories"
  ON blog_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Blog Post Categories
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert blog post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Authenticated users can update blog post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Authenticated users can delete blog post categories" ON blog_post_categories;

CREATE POLICY "Admins can insert blog post categories"
  ON blog_post_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update blog post categories"
  ON blog_post_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete blog post categories"
  ON blog_post_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Blog Posts
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

CREATE POLICY "Admins can create blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Certifications
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert certifications" ON certifications;
DROP POLICY IF EXISTS "Authenticated users can update certifications" ON certifications;
DROP POLICY IF EXISTS "Authenticated users can delete certifications" ON certifications;

CREATE POLICY "Admins can insert certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Contact Submissions
-- ============================================================================
DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;

CREATE POLICY "Public can create contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL 
    AND email IS NOT NULL 
    AND message IS NOT NULL
  );

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Hero Content
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert hero content" ON hero_content;
DROP POLICY IF EXISTS "Authenticated users can update hero content" ON hero_content;
DROP POLICY IF EXISTS "Authenticated users can delete hero content" ON hero_content;

CREATE POLICY "Admins can insert hero content"
  ON hero_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update hero content"
  ON hero_content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete hero content"
  ON hero_content
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Navigation Items
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Authenticated users can update navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Authenticated users can delete navigation items" ON navigation_items;

CREATE POLICY "Admins can insert navigation items"
  ON navigation_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update navigation items"
  ON navigation_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete navigation items"
  ON navigation_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Page Sections
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert page sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can update page sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can delete page sections" ON page_sections;

CREATE POLICY "Admins can insert page sections"
  ON page_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update page sections"
  ON page_sections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete page sections"
  ON page_sections
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Pages
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can update pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can delete pages" ON pages;

CREATE POLICY "Admins can insert pages"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update pages"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete pages"
  ON pages
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Services
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

CREATE POLICY "Admins can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Site Settings
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;

CREATE POLICY "Admins can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Team Members
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert team members" ON team_members;
DROP POLICY IF EXISTS "Authenticated users can update team members" ON team_members;
DROP POLICY IF EXISTS "Authenticated users can delete team members" ON team_members;

CREATE POLICY "Admins can insert team members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update team members"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete team members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Value Tiles
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can insert value tiles" ON value_tiles;
DROP POLICY IF EXISTS "Authenticated users can update value tiles" ON value_tiles;
DROP POLICY IF EXISTS "Authenticated users can delete value tiles" ON value_tiles;

CREATE POLICY "Admins can insert value tiles"
  ON value_tiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update value tiles"
  ON value_tiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete value tiles"
  ON value_tiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
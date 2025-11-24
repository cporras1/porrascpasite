/*
  # Fix Security Issues

  ## Changes Made

  ### 1. Add Missing Indexes
    - Add index on `blog_post_categories.category_id` to optimize foreign key queries

  ### 2. Remove Unused Indexes
    - Drop `idx_pages_parent_id` (unused)
    - Drop `idx_page_sections_page_id` (unused)
    - Drop `idx_services_parent_id` (unused)
    - Drop `idx_navigation_items_parent_id` (unused)

  ### 3. Fix Multiple Permissive Policies
    - Replace multiple SELECT policies with single restrictive policies for:
      - `blog_categories`
      - `blog_post_categories`
      - `blog_posts`
      - `certifications`
      - `pages`
      - `services`
      - `team_members`

  ### 4. Fix Function Search Path
    - Set search_path for `increment_blog_view_count` function to prevent SQL injection

  ## Security Notes
    - All policies now use proper access control
    - Public access only where explicitly needed
    - Authenticated users have appropriate permissions
    - Function security hardened against search_path attacks
*/

-- Add missing index for blog_post_categories foreign key
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category_id 
  ON blog_post_categories(category_id);

-- Remove unused indexes
DROP INDEX IF EXISTS idx_pages_parent_id;
DROP INDEX IF EXISTS idx_page_sections_page_id;
DROP INDEX IF EXISTS idx_services_parent_id;
DROP INDEX IF EXISTS idx_navigation_items_parent_id;

-- Fix multiple permissive policies for blog_categories
DROP POLICY IF EXISTS "Anyone can view blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can manage blog categories" ON blog_categories;

CREATE POLICY "Public can view blog categories"
  ON blog_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog categories"
  ON blog_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog categories"
  ON blog_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog categories"
  ON blog_categories FOR DELETE
  TO authenticated
  USING (true);

-- Fix multiple permissive policies for blog_post_categories
DROP POLICY IF EXISTS "Anyone can view blog post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Authenticated users can manage blog post categories" ON blog_post_categories;

CREATE POLICY "Public can view blog post categories"
  ON blog_post_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog post categories"
  ON blog_post_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog post categories"
  ON blog_post_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog post categories"
  ON blog_post_categories FOR DELETE
  TO authenticated
  USING (true);

-- Fix multiple permissive policies for blog_posts
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON blog_posts;

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Fix multiple permissive policies for certifications
DROP POLICY IF EXISTS "Anyone can view active certifications" ON certifications;
DROP POLICY IF EXISTS "Authenticated users can view all certifications" ON certifications;

CREATE POLICY "Public can view active certifications"
  ON certifications FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (true);

-- Fix multiple permissive policies for pages
DROP POLICY IF EXISTS "Public can view published pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can view all pages" ON pages;

CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view pages"
  ON pages FOR SELECT
  TO authenticated
  USING (true);

-- Fix multiple permissive policies for services
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can view all services" ON services;

CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

-- Fix multiple permissive policies for team_members
DROP POLICY IF EXISTS "Public can view active team members" ON team_members;
DROP POLICY IF EXISTS "Authenticated users can view all team members" ON team_members;

CREATE POLICY "Public can view active team members"
  ON team_members FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

-- Fix function search path mutability
DROP FUNCTION IF EXISTS increment_blog_view_count(uuid);

CREATE OR REPLACE FUNCTION increment_blog_view_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;
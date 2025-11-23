/*
  # Create blog schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null) - URL-friendly version of title
      - `excerpt` (text) - Short summary for listings
      - `content` (text, not null) - Full HTML content with formatting
      - `featured_image_url` (text) - Hero image for the post
      - `author_name` (text, not null) - Name of the author
      - `is_featured` (boolean, default false) - Feature flag for homepage
      - `is_published` (boolean, default false) - Published status
      - `view_count` (integer, default 0) - Track clicks/views
      - `published_at` (timestamptz) - Publication date
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `slug` (text, unique, not null)
      - `created_at` (timestamptz, default now())
    
    - `blog_post_categories`
      - Junction table for many-to-many relationship
      - `blog_post_id` (uuid, references blog_posts)
      - `category_id` (uuid, references blog_categories)
      - Primary key on both columns

  2. Security
    - Enable RLS on all blog tables
    - Public read access for published posts
    - Authenticated admin users can create/update posts
    - Track view counts without authentication

  3. Indexes
    - Index on slug for fast lookups
    - Index on is_published and published_at for filtering
    - Index on view_count for popularity sorting
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  author_name text NOT NULL DEFAULT 'Admin',
  is_featured boolean DEFAULT false NOT NULL,
  is_published boolean DEFAULT false NOT NULL,
  view_count integer DEFAULT 0 NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_post_categories (
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(view_count DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view blog categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view blog post categories"
  ON blog_post_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog post categories"
  ON blog_post_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION increment_blog_view_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;
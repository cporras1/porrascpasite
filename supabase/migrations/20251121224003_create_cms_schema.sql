/*
  # CMS Schema for Porras CPA Website

  1. New Tables
    - `site_settings`
      - Global site configuration (logo, colors, fonts, contact info)
      - Single row configuration table
    
    - `pages`
      - All website pages with metadata
      - Hierarchical structure for parent-child relationships
      - SEO fields included
    
    - `page_sections`
      - Dynamic sections within pages
      - Supports multiple content types (hero, text, services, contact form)
      - Order-based rendering
    
    - `services`
      - Service offerings organized by category
      - Supports hierarchical structure
    
    - `team_members`
      - Staff profiles and credentials
    
    - `contact_submissions`
      - Form submissions from visitors
    
    - `navigation_items`
      - Custom navigation menu management

  2. Security
    - Enable RLS on all tables
    - Public read access for site content
    - Authenticated admin-only write access
*/

-- Site Settings Table (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Porras CPA, P.C.',
  tagline text DEFAULT 'Professional Accounting & Tax Services',
  logo_url text,
  primary_color text DEFAULT '#1e40af',
  secondary_color text DEFAULT '#3b82f6',
  accent_color text DEFAULT '#60a5fa',
  font_heading text DEFAULT 'Inter',
  font_body text DEFAULT 'Inter',
  phone text DEFAULT '(915) 774-0023',
  fax text DEFAULT '(888) 900-1821',
  email text DEFAULT 'cesar.porras@porrascpa.com',
  address_line1 text DEFAULT 'Canutillo',
  address_line2 text DEFAULT 'TX 79835',
  facebook_url text,
  linkedin_url text,
  twitter_url text,
  footer_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text,
  parent_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  is_published boolean DEFAULT true,
  show_in_nav boolean DEFAULT true,
  nav_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Page Sections Table
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  section_type text NOT NULL,
  title text,
  content text,
  image_url text,
  button_text text,
  button_link text,
  background_color text,
  section_order integer DEFAULT 0,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  full_content text,
  icon text,
  parent_id uuid REFERENCES services(id) ON DELETE SET NULL,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  photo_url text,
  email text,
  phone text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  best_time_to_call text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Navigation Items Table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  nav_order integer DEFAULT 0,
  is_external boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public Read Access
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Public can view page sections"
  ON page_sections FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = page_sections.page_id
      AND pages.is_published = true
    )
  );

CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view active team members"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view navigation items"
  ON navigation_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies - Authenticated Admin Write Access
CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage page sections"
  ON page_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage navigation items"
  ON navigation_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (
  site_name,
  tagline,
  primary_color,
  secondary_color,
  accent_color,
  phone,
  fax,
  email,
  address_line1,
  address_line2,
  facebook_url,
  linkedin_url,
  footer_text
) VALUES (
  'Porras CPA, P.C.',
  'Professional Accounting & Tax Services',
  '#1e40af',
  '#3b82f6',
  '#60a5fa',
  '(915) 774-0023',
  '(888) 900-1821',
  'cesar.porras@porrascpa.com',
  'Canutillo',
  'TX 79835',
  'http://www.facebook.com/PorrasCPA',
  'http://www.linkedin.com/company/porrascpa',
  '© 2025 Porras CPA, P.C. All rights reserved.'
);

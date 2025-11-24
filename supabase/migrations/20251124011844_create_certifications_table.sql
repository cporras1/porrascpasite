/*
  # Create Certifications Table

  1. New Tables
    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text) - Certification title
      - `description` (text) - Certification description
      - `badge_url` (text, nullable) - URL to badge image
      - `display_order` (integer) - Order for display
      - `is_active` (boolean) - Whether to show the certification
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `certifications` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Purpose
    - Allow dynamic management of certifications
    - Support unlimited number of certifications
    - Enable full CRUD operations through admin panel
*/

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  badge_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (only active certifications)
CREATE POLICY "Anyone can view active certifications"
  ON certifications
  FOR SELECT
  USING (is_active = true);

-- Policy for authenticated users to read all certifications
CREATE POLICY "Authenticated users can view all certifications"
  ON certifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to insert certifications
CREATE POLICY "Authenticated users can insert certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update certifications
CREATE POLICY "Authenticated users can update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete certifications
CREATE POLICY "Authenticated users can delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_certifications_display_order 
  ON certifications(display_order);

-- Migrate existing data from site_settings
INSERT INTO certifications (title, description, badge_url, display_order, is_active)
SELECT 
  ccifp_title,
  ccifp_description,
  ccifp_badge_url,
  0,
  show_ccifp
FROM site_settings
WHERE ccifp_title IS NOT NULL
LIMIT 1;

INSERT INTO certifications (title, description, badge_url, display_order, is_active)
SELECT 
  dopecfo_title,
  dopecfo_description,
  dopecfo_badge_url,
  1,
  show_dopecfo
FROM site_settings
WHERE dopecfo_title IS NOT NULL
LIMIT 1;
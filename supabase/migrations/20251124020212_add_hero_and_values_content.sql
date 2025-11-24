/*
  # Add Hero and Values Content Tables

  1. New Tables
    - `hero_content`
      - `id` (uuid, primary key)
      - `heading` (text) - Main hero heading
      - `tagline` (text) - Hero tagline/subtitle
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `value_tiles`
      - `id` (uuid, primary key)
      - `title` (text) - Value tile title
      - `description` (text) - Value tile description
      - `icon` (text) - Icon name from lucide-react
      - `icon_url` (text, nullable) - Custom uploaded icon URL
      - `display_order` (integer) - Order of display
      - `is_active` (boolean) - Whether tile is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Updates to site_settings
    - Add `values_tagline` column for the "Our Values" section subtitle

  3. Security
    - Enable RLS on all new tables
    - Public can read active content
    - Only authenticated users can modify content

  4. Initial Data
    - Seed with current hardcoded content
*/

-- Add values_tagline to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'values_tagline'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN values_tagline text DEFAULT 'At our firm, we are committed to outstanding service to our clients';
  END IF;
END $$;

-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  heading text NOT NULL DEFAULT 'Professional Accounting & Tax Services',
  tagline text NOT NULL DEFAULT 'Combining expertise, experience, and dedication to provide outstanding service to our clients in El Paso and surrounding areas.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hero content"
  ON hero_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert hero content"
  ON hero_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero content"
  ON hero_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete hero content"
  ON hero_content
  FOR DELETE
  TO authenticated
  USING (true);

-- Create value_tiles table
CREATE TABLE IF NOT EXISTS value_tiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Shield',
  icon_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE value_tiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active value tiles"
  ON value_tiles
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert value tiles"
  ON value_tiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update value tiles"
  ON value_tiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete value tiles"
  ON value_tiles
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default hero content
INSERT INTO hero_content (heading, tagline)
SELECT 
  'Professional Accounting & Tax Services',
  'Combining expertise, experience, and dedication to provide outstanding service to our clients in El Paso and surrounding areas.'
WHERE NOT EXISTS (SELECT 1 FROM hero_content LIMIT 1);

-- Insert default value tiles
INSERT INTO value_tiles (title, description, icon, display_order)
SELECT * FROM (
  VALUES
    ('Professionalism', 'By combining our expertise, experience and the energy of our staff, each client receives close personal and professional attention. We are considered one of the leading firms in our area.', 'Shield', 1),
    ('Responsiveness', 'We provide comprehensive financial services to individuals and businesses. We grow through client referrals and are known for competent advice and fast, accurate personnel.', 'Zap', 2),
    ('Quality', 'Our primary goal is to be a trusted advisor providing insightful financial advice. We are committed to continuous professional education to help clients make informed financial decisions.', 'Award', 3)
) AS v(title, description, icon, display_order)
WHERE NOT EXISTS (SELECT 1 FROM value_tiles LIMIT 1);

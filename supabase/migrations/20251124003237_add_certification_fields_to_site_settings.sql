/*
  # Add Certification Fields to Site Settings

  1. Changes
    - Add `show_ccifp` boolean field (default true)
    - Add `ccifp_title` text field for customizable title
    - Add `ccifp_description` text field for customizable description
    - Add `show_dopecfo` boolean field (default false)
    - Add `dopecfo_title` text field for customizable title
    - Add `dopecfo_description` text field for customizable description

  2. Purpose
    - Allow admin to manage certification section content
    - Enable/disable certifications individually
    - Customize titles and descriptions for each certification
*/

-- Add certification fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'show_ccifp'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN show_ccifp boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'ccifp_title'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN ccifp_title text DEFAULT 'Certified Construction Industry Financial Professional';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'ccifp_description'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN ccifp_description text DEFAULT 'Our team holds specialized certifications including CCIFP (Certified Construction Industry Financial Professional), demonstrating our expertise in serving construction businesses and their unique accounting needs.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'show_dopecfo'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN show_dopecfo boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'dopecfo_title'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN dopecfo_title text DEFAULT 'DopeCFO VIP Pro Member';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'dopecfo_description'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN dopecfo_description text DEFAULT 'As a DopeCFO VIP Pro Member, we have access to cutting-edge financial strategies and best practices to better serve our clients.';
  END IF;
END $$;
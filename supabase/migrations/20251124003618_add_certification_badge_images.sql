/*
  # Add Certification Badge Images

  1. Changes
    - Add `ccifp_badge_url` text field for CCIFP badge image URL
    - Add `dopecfo_badge_url` text field for DopeCFO badge image URL

  2. Purpose
    - Allow admin to upload and display certification badge images
    - Enhance visual presentation of certifications section
*/

-- Add badge image URL fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'ccifp_badge_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN ccifp_badge_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'dopecfo_badge_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN dopecfo_badge_url text;
  END IF;
END $$;
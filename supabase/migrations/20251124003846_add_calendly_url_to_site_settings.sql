/*
  # Add Calendly URL to Site Settings

  1. Changes
    - Add `calendly_url` text field for Calendly calendar integration URL

  2. Purpose
    - Allow admin to configure Calendly scheduling integration
    - Enable embedded calendar booking in contact section
*/

-- Add Calendly URL field to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'calendly_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN calendly_url text;
  END IF;
END $$;
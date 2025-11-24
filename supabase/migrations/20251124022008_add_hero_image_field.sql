/*
  # Add Hero Image Field

  1. Changes
    - Add `hero_image_url` column to `hero_content` table
    - This will store the URL of an optional hero background/feature image

  2. Notes
    - The image can be uploaded to Supabase storage
    - Field is nullable to make it optional
*/

-- Add hero_image_url to hero_content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_content' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE hero_content ADD COLUMN hero_image_url text;
  END IF;
END $$;

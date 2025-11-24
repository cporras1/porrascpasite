/*
  # Add hero image opacity field

  1. Changes
    - Add `hero_image_opacity` column to `hero_content` table
    - Default value of 0.3 (30% opacity for text visibility)
    - Allows values between 0.0 (fully transparent) and 1.0 (fully opaque)

  2. Purpose
    - Enable admins to adjust hero image transparency
    - Improve text readability over background images
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_content' AND column_name = 'hero_image_opacity'
  ) THEN
    ALTER TABLE hero_content ADD COLUMN hero_image_opacity numeric DEFAULT 0.3;
  END IF;
END $$;
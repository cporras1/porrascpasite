/*
  # Add Hero Image Position and Scale Fields

  1. Changes
    - Add `hero_image_scale` column to store zoom level (1.0 = 100%)
    - Add `hero_image_position_x` column to store horizontal position (0-100%)
    - Add `hero_image_position_y` column to store vertical position (0-100%)

  2. Notes
    - Default scale is 1.0 (no zoom)
    - Default position is 50%, 50% (centered)
    - These values allow users to pan and zoom the hero image
*/

-- Add image position and scale fields to hero_content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_content' AND column_name = 'hero_image_scale'
  ) THEN
    ALTER TABLE hero_content ADD COLUMN hero_image_scale numeric DEFAULT 1.0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_content' AND column_name = 'hero_image_position_x'
  ) THEN
    ALTER TABLE hero_content ADD COLUMN hero_image_position_x numeric DEFAULT 50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_content' AND column_name = 'hero_image_position_y'
  ) THEN
    ALTER TABLE hero_content ADD COLUMN hero_image_position_y numeric DEFAULT 50;
  END IF;
END $$;

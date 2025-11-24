/*
  # Update hero image opacity default value

  1. Changes
    - Update existing rows with opacity 0.3 to 0.5
    - Change default value for `hero_image_opacity` column to 0.5

  2. Purpose
    - The opacity controls the overlay, not the image
    - 0.5 (50%) provides better balance between image visibility and text readability
*/

-- Update existing rows that have the old default
UPDATE hero_content 
SET hero_image_opacity = 0.5 
WHERE hero_image_opacity = 0.3;

-- Update the column default for new rows
ALTER TABLE hero_content 
ALTER COLUMN hero_image_opacity SET DEFAULT 0.5;
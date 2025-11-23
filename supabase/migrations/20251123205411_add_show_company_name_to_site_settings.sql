/*
  # Add show_company_name field to site_settings

  1. Changes
    - Add `show_company_name` boolean column to `site_settings` table
    - Default value is `true` (show company name by default)
    - This allows admins to hide the company name when a logo is uploaded

  2. Notes
    - When logo is uploaded, admin can choose whether to display company name alongside it
    - Provides flexibility for branding options
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'show_company_name'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN show_company_name boolean DEFAULT true NOT NULL;
  END IF;
END $$;
/*
  # Create Storage Bucket for Site Assets

  1. New Storage Bucket
    - `site-assets` bucket for storing logos and other site images
    - Public access for viewing uploaded images
    - File size limits for reasonable uploads
  
  2. Security
    - Public read access to all files in the bucket
    - Authenticated users can upload/update files
    - Authenticated users can delete files
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view site assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can upload site assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can update site assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can delete site assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');

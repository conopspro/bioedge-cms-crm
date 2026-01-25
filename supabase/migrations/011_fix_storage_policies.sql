-- Migration: Fix storage bucket RLS policies
-- The original policies didn't specify a role, so uploads were blocked

-- Drop existing policies (they may have wrong syntax)
DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload contact avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for article images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for company logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for contact avatars" ON storage.objects;

-- Recreate SELECT policies for public read access
CREATE POLICY "Public read access for article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

CREATE POLICY "Public read access for company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

CREATE POLICY "Public read access for contact avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'contact-avatars');

-- Create INSERT policies that allow all users (authenticated and anon)
-- This is needed because the app may use anon key for uploads
CREATE POLICY "Allow uploads to article images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Allow uploads to company logos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Allow uploads to contact avatars"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'contact-avatars');

-- Also add UPDATE and DELETE policies for managing files
CREATE POLICY "Allow updates to article images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'article-images');

CREATE POLICY "Allow updates to company logos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'company-logos');

CREATE POLICY "Allow updates to contact avatars"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'contact-avatars');

CREATE POLICY "Allow deletes from article images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'article-images');

CREATE POLICY "Allow deletes from company logos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'company-logos');

CREATE POLICY "Allow deletes from contact avatars"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'contact-avatars');

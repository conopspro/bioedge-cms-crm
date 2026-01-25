-- Migration: Add image fields to articles, companies, and contacts
-- Run this in your Supabase SQL editor

-- ============================================
-- 1. ARTICLES - Featured/Social Share Images
-- ============================================
-- featured_image_url: Main article image (1200x630 for social sharing)
-- featured_image_alt: Alt text for accessibility/SEO

ALTER TABLE articles
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

COMMENT ON COLUMN articles.featured_image_url IS 'Featured image URL (recommended: 1200x630 for social sharing)';
COMMENT ON COLUMN articles.featured_image_alt IS 'Alt text for the featured image';

-- ============================================
-- 2. COMPANIES - Logo Images
-- ============================================
-- logo_url: Company logo (400x400 square, centered)
-- logo_storage_path: Path in Supabase storage (if self-hosted)

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS logo_storage_path TEXT;

COMMENT ON COLUMN companies.logo_url IS 'Company logo URL (recommended: 400x400 square)';
COMMENT ON COLUMN companies.logo_storage_path IS 'Supabase storage path for self-hosted logos';

-- ============================================
-- 3. CONTACTS - Profile Images
-- ============================================
-- avatar_url: Contact profile picture
-- linkedin_avatar_url: LinkedIn profile image (auto-fetched)

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_avatar_url TEXT;

COMMENT ON COLUMN contacts.avatar_url IS 'Contact profile picture URL';
COMMENT ON COLUMN contacts.linkedin_avatar_url IS 'LinkedIn profile image URL (auto-fetched from LinkedIn)';

-- ============================================
-- 4. COMPANY_LEADERS - Already has image_url
-- ============================================
-- The company_leaders table already has an image_url field
-- No changes needed

-- ============================================
-- 5. Create Supabase Storage Buckets (optional)
-- ============================================
-- Run these in Supabase Dashboard > Storage or via SQL

-- Create buckets for self-hosted images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('article-images', 'article-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('company-logos', 'company-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('contact-avatars', 'contact-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public read access
CREATE POLICY "Public read access for article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Public read access for company logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

CREATE POLICY "Public read access for contact avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-avatars');

-- Storage policies for authenticated uploads (adjust as needed)
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload contact avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-avatars');

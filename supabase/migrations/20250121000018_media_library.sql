-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================
-- Central media management system for all uploaded images
-- Similar to Shopify's media library

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File info
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- Metadata
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  width INTEGER,
  height INTEGER,

  -- Organization
  folder TEXT DEFAULT 'general', -- 'events', 'companies', 'contacts', 'articles', 'sliders', 'general'
  alt_text TEXT,
  caption TEXT,
  tags TEXT[], -- array of tags for searching

  -- Usage tracking
  usage_count INTEGER DEFAULT 0,

  -- Timestamps
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX idx_media_library_tags ON media_library USING GIN(tags);

-- ============================================================================
-- Update triggers
-- ============================================================================

DROP TRIGGER IF EXISTS update_media_library_updated_at ON media_library;
CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON media_library
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media" ON media_library
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media" ON media_library
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- Storage bucket for media
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the media bucket
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media files" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

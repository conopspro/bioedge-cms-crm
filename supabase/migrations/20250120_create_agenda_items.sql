-- =============================================
-- Agenda Items Table
-- =============================================
-- Universal content library for sessions, panels, talks, etc.
-- These are timeless content pieces that can be scheduled at events.

-- Status for agenda items
CREATE TYPE agenda_item_status AS ENUM ('draft', 'published', 'archived');

-- Main agenda items table
CREATE TABLE IF NOT EXISTS agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT, -- ~100 words
  long_description TEXT,  -- ~400 words

  -- Related entities (optional)
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,

  -- Recording (YouTube)
  recording_url TEXT,
  recording_embed TEXT,
  recording_metadata JSONB, -- YouTube metadata (videoId, channel, duration, thumbnail, etc.)

  -- Status
  status agenda_item_status DEFAULT 'draft',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX idx_agenda_items_slug ON agenda_items(slug);
CREATE INDEX idx_agenda_items_status ON agenda_items(status);
CREATE INDEX idx_agenda_items_contact ON agenda_items(contact_id);
CREATE INDEX idx_agenda_items_company ON agenda_items(company_id);
CREATE INDEX idx_agenda_items_article ON agenda_items(article_id);

-- Auto-update updated_at
CREATE TRIGGER update_agenda_items_updated_at
  BEFORE UPDATE ON agenda_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON agenda_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public read for published items
CREATE POLICY "Allow public read for published" ON agenda_items
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Comments
COMMENT ON TABLE agenda_items IS 'Universal content library for sessions, panels, talks - can be scheduled at events';
COMMENT ON COLUMN agenda_items.short_description IS 'Brief description (~100 words) for listings and cards';
COMMENT ON COLUMN agenda_items.long_description IS 'Full description (~400 words) for detail page';
COMMENT ON COLUMN agenda_items.recording_url IS 'YouTube URL for session recording';
COMMENT ON COLUMN agenda_items.recording_metadata IS 'YouTube video metadata (videoId, channel, duration, thumbnail)';

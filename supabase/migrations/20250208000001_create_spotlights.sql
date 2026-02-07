-- =============================================
-- Spotlights Module
-- =============================================
-- Curated YouTube video library for longevity content from external creators.
-- Mirrors the presentations table structure for consistency.

-- ============================================================================
-- SPOTLIGHTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS spotlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT, -- ~100 words
  long_description TEXT,  -- ~400 words

  -- Session type (reuses existing enum)
  session_type session_type DEFAULT 'presentation',

  -- Related entities (optional)
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,

  -- Recording (YouTube)
  recording_url TEXT,
  recording_embed TEXT,
  recording_metadata JSONB, -- YouTube metadata (videoId, channel, duration, thumbnail, etc.)

  -- YouTube URL for thumbnail fallback
  youtube_url TEXT,

  -- Status (reuses existing enum)
  status presentation_status DEFAULT 'draft',

  -- Featured flag
  is_featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_spotlights_slug ON spotlights(slug);
CREATE INDEX idx_spotlights_status ON spotlights(status);
CREATE INDEX idx_spotlights_session_type ON spotlights(session_type);
CREATE INDEX idx_spotlights_contact ON spotlights(contact_id);
CREATE INDEX idx_spotlights_company ON spotlights(company_id);
CREATE INDEX idx_spotlights_article ON spotlights(article_id);
CREATE INDEX IF NOT EXISTS idx_spotlights_featured ON spotlights(is_featured) WHERE is_featured = true;

-- Auto-update updated_at
CREATE TRIGGER update_spotlights_updated_at
  BEFORE UPDATE ON spotlights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE spotlights ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "spotlights_authenticated_all" ON spotlights
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public read for published items
CREATE POLICY "spotlights_public_read_published" ON spotlights
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Comments
COMMENT ON TABLE spotlights IS 'Curated YouTube video library for longevity content from external creators';
COMMENT ON COLUMN spotlights.short_description IS 'Brief description (~100 words) for listings and cards';
COMMENT ON COLUMN spotlights.long_description IS 'Full description (~400 words) for detail page';
COMMENT ON COLUMN spotlights.recording_url IS 'YouTube URL for video';
COMMENT ON COLUMN spotlights.recording_metadata IS 'YouTube video metadata (videoId, channel, duration, thumbnail)';
COMMENT ON COLUMN spotlights.youtube_url IS 'YouTube video URL - thumbnail will be used as featured image if no image is set';

-- ============================================================================
-- SPOTLIGHT_PANELISTS TABLE
-- ============================================================================

CREATE TABLE spotlight_panelists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotlight_id UUID NOT NULL REFERENCES spotlights(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- Role (reuses existing enum)
  role panelist_role NOT NULL DEFAULT 'presenter',

  -- Optional overrides (if different from contact's company/article)
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,

  -- Display order
  display_order INTEGER NOT NULL DEFAULT 0,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Ensure unique contact per spotlight
  UNIQUE(spotlight_id, contact_id)
);

-- Indexes
CREATE INDEX idx_spotlight_panelists_spotlight_id ON spotlight_panelists(spotlight_id);
CREATE INDEX idx_spotlight_panelists_contact_id ON spotlight_panelists(contact_id);
CREATE INDEX idx_spotlight_panelists_company_id ON spotlight_panelists(company_id);
CREATE INDEX idx_spotlight_panelists_role ON spotlight_panelists(role);

-- Updated_at trigger
CREATE TRIGGER update_spotlight_panelists_updated_at
  BEFORE UPDATE ON spotlight_panelists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE spotlight_panelists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view spotlight panelists"
  ON spotlight_panelists FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage spotlight panelists"
  ON spotlight_panelists FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- HELPFUL VIEW
-- ============================================================================

CREATE VIEW spotlight_panelists_view AS
SELECT
  sp.id,
  sp.spotlight_id,
  sp.contact_id,
  sp.role,
  sp.display_order,
  sp.notes,
  sp.created_at,
  -- Contact details
  c.first_name,
  c.last_name,
  c.title,
  c.avatar_url,
  c.linkedin_url,
  c.bio,
  c.slug as contact_slug,
  -- Company (use override if set, otherwise contact's company)
  COALESCE(sp.company_id, c.company_id) as company_id,
  COALESCE(co_override.name, co_contact.name) as company_name,
  COALESCE(co_override.logo_url, co_contact.logo_url) as company_logo,
  COALESCE(co_override.slug, co_contact.slug) as company_slug,
  -- Article (use override if set)
  sp.article_id,
  a.title as article_title,
  a.slug as article_slug,
  -- Spotlight details for context
  s.title as spotlight_title,
  s.slug as spotlight_slug
FROM spotlight_panelists sp
JOIN contacts c ON c.id = sp.contact_id
LEFT JOIN companies co_override ON co_override.id = sp.company_id
LEFT JOIN companies co_contact ON co_contact.id = c.company_id
LEFT JOIN articles a ON a.id = sp.article_id
JOIN spotlights s ON s.id = sp.spotlight_id
ORDER BY sp.spotlight_id, sp.display_order;

-- Comments
COMMENT ON TABLE spotlight_panelists IS 'Links multiple contacts (speakers/creators) to a spotlight';
COMMENT ON COLUMN spotlight_panelists.role IS 'Role of this contact in the spotlight (presenter, host, guest, etc.)';
COMMENT ON COLUMN spotlight_panelists.company_id IS 'Override company (if different from contact default)';
COMMENT ON COLUMN spotlight_panelists.article_id IS 'Related article for this person (optional)';
COMMENT ON COLUMN spotlight_panelists.display_order IS 'Order of display (1 = first)';
COMMENT ON VIEW spotlight_panelists_view IS 'Denormalized view of spotlight panelists with contact, company, and article details';

-- ============================================================================
-- ADD YOUTUBE CHANNEL URL TO CONTACTS
-- ============================================================================

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS youtube_channel_url TEXT;

COMMENT ON COLUMN contacts.youtube_channel_url IS 'YouTube channel URL for this contact';

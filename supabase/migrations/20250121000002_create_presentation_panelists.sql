-- Create presentation_panelists table for multi-speaker presentations (panels)
-- This allows linking multiple contacts to a single presentation with roles and ordering

-- ============================================================================
-- ENUM TYPE
-- ============================================================================

CREATE TYPE panelist_role AS ENUM (
  'moderator',
  'panelist',
  'presenter',
  'host',
  'guest'
);

-- ============================================================================
-- PRESENTATION_PANELISTS TABLE
-- ============================================================================

CREATE TABLE presentation_panelists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL REFERENCES agenda_items(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- Role on this presentation
  role panelist_role NOT NULL DEFAULT 'panelist',

  -- Optional overrides (if different from contact's company/article)
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,

  -- Display order (1 = first, moderator often first)
  display_order INTEGER NOT NULL DEFAULT 0,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Ensure unique contact per presentation
  UNIQUE(presentation_id, contact_id)
);

-- Indexes
CREATE INDEX idx_presentation_panelists_presentation_id ON presentation_panelists(presentation_id);
CREATE INDEX idx_presentation_panelists_contact_id ON presentation_panelists(contact_id);
CREATE INDEX idx_presentation_panelists_company_id ON presentation_panelists(company_id);
CREATE INDEX idx_presentation_panelists_role ON presentation_panelists(role);

-- Updated_at trigger
CREATE TRIGGER update_presentation_panelists_updated_at
  BEFORE UPDATE ON presentation_panelists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE presentation_panelists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presentation panelists"
  ON presentation_panelists FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage presentation panelists"
  ON presentation_panelists FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- HELPFUL VIEW
-- ============================================================================

-- View for panelists with full contact and company details
CREATE VIEW presentation_panelists_view AS
SELECT
  pp.id,
  pp.presentation_id,
  pp.contact_id,
  pp.role,
  pp.display_order,
  pp.notes,
  pp.created_at,
  -- Contact details
  c.first_name,
  c.last_name,
  c.title,
  c.avatar_url,
  c.linkedin_url,
  c.bio,
  c.slug as contact_slug,
  -- Company (use override if set, otherwise contact's company)
  COALESCE(pp.company_id, c.company_id) as company_id,
  COALESCE(co_override.name, co_contact.name) as company_name,
  COALESCE(co_override.logo_url, co_contact.logo_url) as company_logo,
  COALESCE(co_override.slug, co_contact.slug) as company_slug,
  -- Article (use override if set)
  pp.article_id,
  a.title as article_title,
  a.slug as article_slug,
  -- Presentation details for context
  ai.title as presentation_title,
  ai.slug as presentation_slug
FROM presentation_panelists pp
JOIN contacts c ON c.id = pp.contact_id
LEFT JOIN companies co_override ON co_override.id = pp.company_id
LEFT JOIN companies co_contact ON co_contact.id = c.company_id
LEFT JOIN articles a ON a.id = pp.article_id
JOIN agenda_items ai ON ai.id = pp.presentation_id
ORDER BY pp.presentation_id, pp.display_order;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE presentation_panelists IS 'Links multiple contacts (panelists/speakers) to a presentation';
COMMENT ON COLUMN presentation_panelists.role IS 'Role of this contact in the presentation (moderator, panelist, etc.)';
COMMENT ON COLUMN presentation_panelists.company_id IS 'Override company (if different from contact''s default company)';
COMMENT ON COLUMN presentation_panelists.article_id IS 'Related article for this panelist (optional)';
COMMENT ON COLUMN presentation_panelists.display_order IS 'Order of display (1 = first, typically moderator)';
COMMENT ON VIEW presentation_panelists_view IS 'Denormalized view of panelists with contact, company, and article details';

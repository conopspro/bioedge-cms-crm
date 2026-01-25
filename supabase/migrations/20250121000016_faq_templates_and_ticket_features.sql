-- ============================================================================
-- FAQ TEMPLATES (Universal FAQs)
-- ============================================================================
-- Reusable FAQ items that can be linked to multiple events
-- Supports dynamic placeholders like {{event_name}}, {{event_date}}, {{venue_name}}

CREATE TABLE IF NOT EXISTS faq_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  -- Categorization
  category TEXT, -- 'registration', 'venue', 'schedule', 'general', etc.

  -- Ordering
  display_order INTEGER DEFAULT 0,

  -- Visibility
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faq_templates_category ON faq_templates(category);
CREATE INDEX idx_faq_templates_active ON faq_templates(is_active);

-- ============================================================================
-- EVENT FAQ LINKS
-- ============================================================================
-- Links FAQ templates to specific events with optional overrides

CREATE TABLE IF NOT EXISTS event_faq_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  faq_template_id UUID NOT NULL REFERENCES faq_templates(id) ON DELETE CASCADE,

  -- Optional overrides (if null, use template values)
  question_override TEXT,
  answer_override TEXT,

  -- Event-specific ordering
  display_order INTEGER DEFAULT 0,

  -- Visibility for this event
  is_visible BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, faq_template_id)
);

CREATE INDEX idx_event_faq_links_event_id ON event_faq_links(event_id);

-- ============================================================================
-- Update event_faqs to support both custom and template-linked FAQs
-- ============================================================================

ALTER TABLE event_faqs ADD COLUMN IF NOT EXISTS faq_template_id UUID REFERENCES faq_templates(id) ON DELETE SET NULL;
ALTER TABLE event_faqs ADD COLUMN IF NOT EXISTS is_from_template BOOLEAN DEFAULT false;

-- ============================================================================
-- Add ticket tier features improvements
-- ============================================================================

-- Add missing columns to event_ticket_features if they don't exist
ALTER TABLE event_ticket_features ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;
ALTER TABLE event_ticket_features ADD COLUMN IF NOT EXISTS tooltip TEXT;

-- ============================================================================
-- Update triggers
-- ============================================================================

DROP TRIGGER IF EXISTS update_faq_templates_updated_at ON faq_templates;
CREATE TRIGGER update_faq_templates_updated_at
  BEFORE UPDATE ON faq_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_faq_links_updated_at ON event_faq_links;
CREATE TRIGGER update_event_faq_links_updated_at
  BEFORE UPDATE ON event_faq_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE faq_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_faq_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active FAQ templates" ON faq_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage FAQ templates" ON faq_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view visible FAQ links" ON event_faq_links
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage FAQ links" ON event_faq_links
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Insert some default FAQ templates
-- ============================================================================

INSERT INTO faq_templates (question, answer, category, display_order) VALUES
  ('What is included in my ticket?', 'Your ticket includes access to all keynote sessions, panel discussions, networking events, and meals during the conference. Check your specific ticket tier for additional benefits like workshop access or VIP experiences.', 'registration', 1),
  ('Can I get a refund if I can''t attend?', 'Refund policies vary by event. Generally, full refunds are available up to 30 days before the event, 50% refunds up to 14 days before, and no refunds within 14 days of the event. Tickets are typically transferable to another attendee.', 'registration', 2),
  ('Is there parking available at the venue?', 'Parking information varies by venue. Please check the venue section for specific parking details, including nearby garages and estimated costs.', 'venue', 3),
  ('What is the dress code?', 'Business casual is recommended for most sessions. Some evening networking events may have specific dress codes noted in the event schedule.', 'general', 4),
  ('Will sessions be recorded?', 'Select sessions may be recorded and made available to attendees after the event. Not all sessions will be recorded due to speaker preferences.', 'general', 5),
  ('How do I connect with other attendees?', 'Download our event app to view the attendee directory, schedule meetings, and participate in discussion groups. Networking sessions are also built into the agenda.', 'general', 6),
  ('What COVID-19 safety measures are in place?', 'We follow all local health guidelines and venue requirements. Specific measures will be communicated closer to the event date.', 'general', 7),
  ('Can I attend virtually?', 'Virtual attendance options vary by event. Check the ticket options to see if a virtual pass is available.', 'registration', 8)
ON CONFLICT DO NOTHING;

-- Campaign Events junction table
-- Links campaigns to one or more events they are promoting

CREATE TABLE IF NOT EXISTS campaign_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  -- Prevent duplicate event in same campaign
  UNIQUE(campaign_id, event_id)
);

-- Indexes for common lookups
CREATE INDEX idx_campaign_events_campaign_id ON campaign_events(campaign_id);
CREATE INDEX idx_campaign_events_event_id ON campaign_events(event_id);

-- Row Level Security
ALTER TABLE campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage campaign_events"
  ON campaign_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to campaign_events"
  ON campaign_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

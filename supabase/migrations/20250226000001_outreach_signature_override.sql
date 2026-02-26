-- Add per-campaign signature override to outreach_campaigns.
-- When set, this overrides the sender profile's signature at send time,
-- allowing General Emails to use a different signature from other modules.

ALTER TABLE outreach_campaigns
  ADD COLUMN IF NOT EXISTS signature_override TEXT DEFAULT NULL;

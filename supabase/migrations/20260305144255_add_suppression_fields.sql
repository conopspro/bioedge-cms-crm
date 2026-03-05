-- Add bounce, unsubscribe, and reply tracking fields to contact tables
-- bounced_at / unsubscribed_at: used to exclude contacts from future campaigns
-- last_replied_at: set when email.received webhook fires for a matching sender

ALTER TABLE outreach_contacts
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_replied_at TIMESTAMPTZ;

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_replied_at TIMESTAMPTZ;

ALTER TABLE clinic_contacts
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_replied_at TIMESTAMPTZ;

ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- Partial indexes for efficient filtering (only index non-null rows)
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_bounced
  ON outreach_contacts(bounced_at) WHERE bounced_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_unsubscribed
  ON outreach_contacts(unsubscribed_at) WHERE unsubscribed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_bounced
  ON contacts(bounced_at) WHERE bounced_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_unsubscribed
  ON contacts(unsubscribed_at) WHERE unsubscribed_at IS NOT NULL;

-- Add 'delayed' status to recipient tables
-- Must drop and recreate CHECK constraints (Postgres does not support ALTER CONSTRAINT)

ALTER TABLE outreach_campaign_recipients
  DROP CONSTRAINT IF EXISTS outreach_campaign_recipients_status_check;
ALTER TABLE outreach_campaign_recipients
  ADD CONSTRAINT outreach_campaign_recipients_status_check
  CHECK (status IN (
    'pending', 'generated', 'approved',
    'sent', 'delivered', 'opened', 'clicked',
    'bounced', 'failed', 'suppressed', 'delayed'
  ));

ALTER TABLE clinic_campaign_recipients
  DROP CONSTRAINT IF EXISTS clinic_campaign_recipients_status_check;
ALTER TABLE clinic_campaign_recipients
  ADD CONSTRAINT clinic_campaign_recipients_status_check
  CHECK (status IN (
    'pending', 'generated', 'approved',
    'sent', 'delivered', 'opened', 'clicked',
    'bounced', 'failed', 'suppressed', 'delayed'
  ));

-- campaign_recipients uses a text column with no CHECK constraint (status values
-- are enforced at the application layer), so no constraint change needed there.

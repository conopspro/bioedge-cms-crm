-- Add composite index on (clinic_campaign_id, status) for clinic_campaign_recipients.
-- The existing separate indexes on clinic_campaign_id and status are insufficient for
-- queries that filter on both columns simultaneously (approve, review queue, status counts).
-- A composite index lets Postgres satisfy these queries with a single index scan.

CREATE INDEX IF NOT EXISTS idx_clinic_campaign_recipients_campaign_status
  ON clinic_campaign_recipients(clinic_campaign_id, status);

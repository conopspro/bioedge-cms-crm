-- Add source_event field to company_queue
-- Stores the name of the event/conference where these companies were discovered

ALTER TABLE company_queue ADD COLUMN IF NOT EXISTS source_event TEXT;

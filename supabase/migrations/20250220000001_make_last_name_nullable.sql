-- Allow last_name to be NULL for contacts who only have a single name
-- (e.g. Hunter contacts identified only by email local-part)
ALTER TABLE contacts ALTER COLUMN last_name DROP NOT NULL;

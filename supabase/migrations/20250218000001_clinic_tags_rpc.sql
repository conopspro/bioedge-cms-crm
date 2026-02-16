-- RPC function to get distinct clinic tags with counts
-- Used by the public clinic directory to show all available tag filters
CREATE OR REPLACE FUNCTION get_clinic_tags_count()
RETURNS TABLE(tag TEXT, count BIGINT) AS $$
  SELECT unnest(tags) AS tag, COUNT(*) AS count
  FROM clinics
  WHERE is_active = true AND is_draft = false AND tags IS NOT NULL
  GROUP BY tag
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_clinic_tags_count() TO anon, authenticated;

-- Index for zip code search
CREATE INDEX IF NOT EXISTS idx_clinics_zip_code ON clinics(zip_code);

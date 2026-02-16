-- Update get_clinic_tags_count() to exclude brand/franchise names from public tag filters.
-- These are proper names mixed into the tags column during CSV import.
-- They should not appear as filter pills on the directory page.

CREATE OR REPLACE FUNCTION get_clinic_tags_count()
RETURNS TABLE(tag TEXT, count BIGINT) AS $$
  SELECT t.tag, COUNT(*) AS count
  FROM clinics c, unnest(c.tags) AS t(tag)
  WHERE c.is_active = true
    AND c.is_draft = false
    AND c.tags IS NOT NULL
    AND t.tag NOT IN (
      'OsteoStrong',
      'Equinox',
      'Next Health',
      'Serotonin Centers',
      'Upgrade Labs',
      'Fountain Life',
      'Centner Wellness',
      'Riordan Clinic',
      'Ways2Well',
      'Humanaut'
    )
  GROUP BY t.tag
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- RPC functions for clinic directory filters: states, cities, zip geocoding, proximity search

-- 1. Get distinct states with clinic counts
CREATE OR REPLACE FUNCTION get_clinic_states()
RETURNS TABLE(state TEXT, clinic_count BIGINT) AS $$
  SELECT state, COUNT(*) AS clinic_count
  FROM clinics
  WHERE is_active = true AND is_draft = false
    AND state IS NOT NULL AND TRIM(state) <> ''
  GROUP BY state
  ORDER BY state;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_clinic_states() TO anon, authenticated;

-- 2. Get distinct cities for a given state with clinic counts
CREATE OR REPLACE FUNCTION get_clinic_cities(p_state TEXT)
RETURNS TABLE(city TEXT, clinic_count BIGINT) AS $$
  SELECT city, COUNT(*) AS clinic_count
  FROM clinics
  WHERE is_active = true AND is_draft = false
    AND state = p_state
    AND city IS NOT NULL AND TRIM(city) <> ''
  GROUP BY city
  ORDER BY city;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_clinic_cities(TEXT) TO anon, authenticated;

-- 3. Resolve a zip code to approximate lat/lng using clinic data
CREATE OR REPLACE FUNCTION get_zip_coordinates(p_zip TEXT)
RETURNS TABLE(lat DOUBLE PRECISION, lng DOUBLE PRECISION, match_count BIGINT) AS $$
  SELECT
    AVG(latitude)::DOUBLE PRECISION AS lat,
    AVG(longitude)::DOUBLE PRECISION AS lng,
    COUNT(*) AS match_count
  FROM clinics
  WHERE zip_code = p_zip
    AND latitude IS NOT NULL
    AND longitude IS NOT NULL
    AND is_active = true;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_zip_coordinates(TEXT) TO anon, authenticated;

-- 4. Proximity search using Haversine formula with bounding-box pre-filter
CREATE OR REPLACE FUNCTION search_clinics_nearby(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_miles DOUBLE PRECISION DEFAULT 25,
  p_state TEXT DEFAULT NULL,
  p_tag TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 48,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  phone TEXT,
  website TEXT,
  description TEXT,
  tags TEXT[],
  photos TEXT[],
  distance_miles DOUBLE PRECISION,
  total_count BIGINT
) AS $$
  WITH nearby AS (
    SELECT
      c.id, c.name, c.slug, c.city, c.state, c.country,
      c.phone, c.website, c.description, c.tags, c.photos,
      ROUND((
        3959.0 * acos(
          LEAST(1.0, GREATEST(-1.0,
            cos(radians(p_lat)) * cos(radians(c.latitude))
            * cos(radians(c.longitude) - radians(p_lng))
            + sin(radians(p_lat)) * sin(radians(c.latitude))
          ))
        )
      )::numeric, 1)::DOUBLE PRECISION AS distance_miles
    FROM clinics c
    WHERE c.is_active = true
      AND c.is_draft = false
      AND c.latitude IS NOT NULL
      AND c.longitude IS NOT NULL
      -- Bounding box pre-filter to leverage idx_clinics_lat_lng
      AND c.latitude BETWEEN p_lat - (p_radius_miles / 69.0)
                          AND p_lat + (p_radius_miles / 69.0)
      AND c.longitude BETWEEN p_lng - (p_radius_miles / (69.0 * cos(radians(p_lat))))
                            AND p_lng + (p_radius_miles / (69.0 * cos(radians(p_lat))))
      -- Optional filters
      AND (p_state IS NULL OR c.state = p_state)
      AND (p_tag IS NULL OR c.tags @> ARRAY[p_tag])
      AND (p_search IS NULL OR (
        c.name ILIKE '%' || p_search || '%'
        OR c.city ILIKE '%' || p_search || '%'
        OR c.state ILIKE '%' || p_search || '%'
        OR c.description ILIKE '%' || p_search || '%'
      ))
  ),
  filtered AS (
    SELECT * FROM nearby WHERE distance_miles <= p_radius_miles
  )
  SELECT
    f.id, f.name, f.slug, f.city, f.state, f.country,
    f.phone, f.website, f.description, f.tags, f.photos,
    f.distance_miles,
    (SELECT COUNT(*) FROM filtered)::BIGINT AS total_count
  FROM filtered f
  ORDER BY f.distance_miles ASC
  LIMIT p_limit
  OFFSET p_offset;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION search_clinics_nearby(
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  TEXT, TEXT, TEXT, INTEGER, INTEGER
) TO anon, authenticated;

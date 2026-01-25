-- ============================================
-- Add YouTube URL field to presentations
-- ============================================
-- When a presentation has a YouTube video but no featured image,
-- the YouTube thumbnail will be used automatically.

ALTER TABLE presentations
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

COMMENT ON COLUMN presentations.youtube_url IS 'YouTube video URL - thumbnail will be used as featured image if no image is set';

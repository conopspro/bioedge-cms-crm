-- Add section color customization fields to events table
-- Allows customizing background, title, subtitle, text, accent, button, and card colors for each section

-- Section color settings stored as JSONB for flexibility
-- Each section can have: background, title, subtitle, text, accent, button_bg, button_text, card_bg colors
ALTER TABLE events ADD COLUMN IF NOT EXISTS section_colors JSONB DEFAULT '{
  "hero": {
    "background": null,
    "title": "#ffffff",
    "subtitle": "#cccccc",
    "text": "#cccccc",
    "accent": "#c9a227",
    "button_bg": "#c9a227",
    "button_text": "#ffffff",
    "card_bg": "rgba(255,255,255,0.1)"
  },
  "value_props": {
    "background": "#ffffff",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227",
    "card_bg": "#f3f4f6"
  },
  "testimonials": {
    "background": "#f8f9fa",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227",
    "card_bg": "#ffffff"
  },
  "leaders": {
    "background": "#ffffff",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227",
    "card_bg": "#ffffff"
  },
  "tickets": {
    "background": "#0a2540",
    "title": "#ffffff",
    "subtitle": "#c9a227",
    "text": "#cccccc",
    "accent": "#c9a227",
    "button_bg": "#c9a227",
    "button_text": "#ffffff",
    "card_bg": "#ffffff",
    "card_title": "#0a2540",
    "card_text": "#374151"
  },
  "venue": {
    "background": "#ffffff",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227"
  },
  "companies": {
    "background": "#f8f9fa",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227",
    "card_bg": "#ffffff"
  },
  "faq": {
    "background": "#ffffff",
    "title": "#0a2540",
    "subtitle": "#c9a227",
    "text": "#374151",
    "accent": "#c9a227"
  },
  "cta": {
    "background": null,
    "title": "#ffffff",
    "subtitle": "#cccccc",
    "text": "#cccccc",
    "accent": "#c9a227",
    "button_bg": "#c9a227",
    "button_text": "#ffffff"
  }
}'::jsonb;

-- Add comment
COMMENT ON COLUMN events.section_colors IS 'JSONB object containing color settings for each landing page section. Each section can have: background, title, subtitle, text, accent (icons/links), button_bg, button_text, and card_bg colors.';

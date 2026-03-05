-- Add email engagement tracking to contacts and clinics tables.
-- outreach_contacts already has total_opens / total_clicks.
-- This adds the same columns to contacts and clinics so the webhook
-- can track open/click counts for Company Campaigns and Clinic Emails.

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS total_opens  INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_clicks INT NOT NULL DEFAULT 0;

ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS total_opens  INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_clicks INT NOT NULL DEFAULT 0;

-- Atomic increment helper used by the Resend webhook.
-- Safely increments total_opens and/or total_clicks by email address.
-- Uses SECURITY DEFINER so the anon/service role doesn't need UPDATE
-- privileges directly on those columns.
CREATE OR REPLACE FUNCTION increment_email_engagement(
  p_table  TEXT,
  p_email  TEXT,
  p_opens  INT DEFAULT 0,
  p_clicks INT DEFAULT 0
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_table = 'contacts' THEN
    UPDATE contacts
       SET total_opens  = total_opens  + p_opens,
           total_clicks = total_clicks + p_clicks
     WHERE email = p_email;
  ELSIF p_table = 'clinics' THEN
    UPDATE clinics
       SET total_opens  = total_opens  + p_opens,
           total_clicks = total_clicks + p_clicks
     WHERE email = p_email;
  ELSIF p_table = 'outreach_contacts' THEN
    UPDATE outreach_contacts
       SET total_opens  = total_opens  + p_opens,
           total_clicks = total_clicks + p_clicks
     WHERE email = p_email;
  END IF;
END;
$$;

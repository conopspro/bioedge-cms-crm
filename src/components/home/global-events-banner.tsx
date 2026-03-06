import { createClient } from "@/lib/supabase/server"
import { HomepageEvents } from "./homepage-events"

/**
 * GlobalEventsBanner
 *
 * Server component rendered between the nav and page content on every public
 * page (via the (public) layout). Fetches from the same homepage_events table
 * so the data and card styles are always in sync with the homepage section.
 *
 * - Returns null when there are no upcoming featured events (nothing renders).
 * - Auto-adjusts to 1 / 2 / 3 columns based on how many events exist.
 * - Tight vertical padding (py-4) and #f8f9fa background for visual separation.
 */
export async function GlobalEventsBanner() {
  const supabase = await createClient()

  const { data: featuredEvents } = await supabase
    .from("homepage_events")
    .select(`
      id,
      event_id,
      custom_title,
      custom_tagline,
      custom_image_url,
      event:events(
        id, name, slug, tagline, start_date, end_date,
        city, state, venue_name, featured_image_url, status,
        venue:venues(photo_url),
        section_photos:event_section_photos(image_url, section)
      )
    `)
    .eq("is_visible", true)
    .order("display_order", { ascending: true })

  // Filter to only upcoming/active events
  const today = new Date().toISOString().split("T")[0]
  const upcoming = (featuredEvents || []).filter((fe) => {
    const ev = fe.event as any
    return ev && ev.end_date >= today && ["published", "registration_open", "announced", "sold_out"].includes(ev.status)
  })

  if (upcoming.length === 0) return null

  // Auto-set columns based on count (max 3)
  const columns = Math.min(upcoming.length, 3)

  return (
    <HomepageEvents
      label={null}
      title={null}
      events={upcoming as any}
      columns={columns}
      settings={{ bg_color: "#f8f9fa" }}
      className="pb-4"
    />
  )
}

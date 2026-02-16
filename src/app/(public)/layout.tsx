import { PublicHeader } from "@/components/brand/public-header"
import { PublicFooter } from "@/components/brand/public-footer"
import { createClient } from "@/lib/supabase/server"

// Revalidate pages every 60 seconds to reflect database changes
export const revalidate = 60

export interface HeaderEvent {
  name: string
  slug: string
  city: string | null
  start_date: string | null
  end_date: string | null
}

/**
 * Public Layout
 *
 * Clean layout for public-facing pages (articles, etc.)
 * Includes BioEdge branded header and footer.
 * Fetches upcoming published events to display in header.
 * Fetches database-driven navigation items for header and footer.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: events }, { data: headerNavItems }, { data: footerNavItems }] = await Promise.all([
    supabase
      .from("events")
      .select("name, slug, city, start_date, end_date")
      .in("status", ["published", "registration_open", "announced", "sold_out"])
      .gte("end_date", today)
      .order("start_date", { ascending: true })
      .limit(3),
    supabase
      .from("navigation_items")
      .select("id, label, href, is_external, display_order, parent_id")
      .eq("location", "main_header")
      .is("event_id", null)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("navigation_items")
      .select("id, label, href, is_external, display_order, parent_id")
      .eq("location", "main_footer")
      .is("event_id", null)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),
  ])

  const headerEvents: HeaderEvent[] = events || []

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <PublicHeader events={headerEvents} navItems={headerNavItems || undefined} />
      <main className="flex-1">{children}</main>
      <PublicFooter navItems={footerNavItems || undefined} />
    </div>
  )
}

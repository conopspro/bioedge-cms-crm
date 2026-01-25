import { PublicHeader } from "@/components/brand/public-header"
import { PublicFooter } from "@/components/brand/public-footer"
import { createClient } from "@/lib/supabase/server"

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
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch upcoming published/live events for the header
  // Include all "live" statuses: published, registration_open, announced, sold_out
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: events } = await supabase
    .from("events")
    .select("name, slug, city, start_date, end_date")
    .in("status", ["published", "registration_open", "announced", "sold_out"])
    .gte("end_date", today)
    .order("start_date", { ascending: true })
    .limit(3)

  const headerEvents: HeaderEvent[] = events || []

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <PublicHeader events={headerEvents} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

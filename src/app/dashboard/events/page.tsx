import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EventsTable } from "@/components/events/events-table"

/**
 * Events List Page
 *
 * Displays all events in a searchable, sortable table.
 * Server component that fetches data from Supabase.
 */
export default async function EventsPage() {
  const supabase = await createClient()

  // Fetch all events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your summits, conferences, and event landing pages.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Events Table */}
      <EventsTable events={events || []} />
    </div>
  )
}

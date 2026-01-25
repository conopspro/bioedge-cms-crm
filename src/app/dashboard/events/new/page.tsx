import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/events/event-form"

/**
 * Create New Event Page
 *
 * Form for creating a new event.
 */
export default function NewEventPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground">
            Set up a new summit, conference, or event.
          </p>
        </div>
      </div>

      {/* Event Form */}
      <EventForm />
    </div>
  )
}

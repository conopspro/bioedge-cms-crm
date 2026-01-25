"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  name: string
  slug: string
  tagline: string | null
  start_date: string | null
  end_date: string | null
  city: string | null
  state: string | null
  venue_name: string | null
  featured_image_url: string | null
  status: string
  venue?: { photo_url: string | null } | null
  section_photos?: { image_url: string | null; section: string }[] | null
}

interface DashboardEventTabsProps {
  events: Event[]
}

const statusTabs = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  // Parse the date string and treat it as a local date (not UTC)
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  })
}

function EventCard({ event }: { event: Event }) {
  // Get venue photo from event section photos
  const venuePhoto = event.section_photos?.find(p => p.section === 'venue')?.image_url
  // Priority: event featured image > venue section photo > venue table photo
  const displayImage = event.featured_image_url || venuePhoto || event.venue?.photo_url

  return (
    <Link
      href={`/dashboard/events/${event.id}`}
      className="group relative overflow-hidden rounded-xl bg-white border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Featured Image */}
      <div className="relative h-40 overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {event.tagline && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {event.tagline}
          </p>
        )}

        <div className="space-y-1.5 mb-3">
          {event.start_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(event.start_date)}
                {event.end_date && formatDate(event.end_date) !== formatDate(event.start_date) && (
                  <> – {formatDate(event.end_date)}</>
                )}
              </span>
            </div>
          )}
          {(event.city || event.venue_name) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.venue_name || `${event.city}${event.state ? `, ${event.state}` : ""}`}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:underline">
          <span>Manage Event</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ status }: { status: string }) {
  const statusLabels: Record<string, string> = {
    draft: "draft",
    published: "published",
    completed: "completed",
    archived: "archived",
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground mb-4">
        No {statusLabels[status] || status} events
      </p>
      {status === "draft" && (
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      )}
    </div>
  )
}

export function DashboardEventTabs({ events }: DashboardEventTabsProps) {
  const [activeTab, setActiveTab] = useState("published")

  // Group events by status
  const eventsByStatus = statusTabs.reduce((acc, tab) => {
    acc[tab.value] = events.filter((e) => e.status === tab.value)
    return acc
  }, {} as Record<string, Event[]>)

  // Find first tab with events, default to published
  const firstTabWithEvents = statusTabs.find((tab) => eventsByStatus[tab.value].length > 0)?.value || "published"

  return (
    <Tabs defaultValue={firstTabWithEvents} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        {statusTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
            {tab.label}
            {eventsByStatus[tab.value].length > 0 && (
              <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                {eventsByStatus[tab.value].length}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {statusTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {eventsByStatus[tab.value].length === 0 ? (
            <EmptyState status={tab.value} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventsByStatus[tab.value].map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

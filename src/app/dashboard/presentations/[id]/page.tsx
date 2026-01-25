import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PresentationDetailEditor } from "@/components/presentations/presentation-detail-editor"

const statusColors: Record<string, "default" | "secondary" | "success"> = {
  draft: "secondary",
  published: "success",
  archived: "default",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Presentation Detail Page
 *
 * Inline editable detail page for presentation items
 */
export default async function PresentationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch presentation item with related entities and panelists
  const { data: presentationItem, error } = await supabase
    .from("presentations")
    .select(`
      *,
      contact:contacts(id, first_name, last_name, title, avatar_url, slug),
      company:companies(id, name, logo_url, domain, slug),
      article:articles(id, title, slug),
      panelists:presentation_panelists(
        id,
        contact_id,
        role,
        company_id,
        article_id,
        display_order,
        notes,
        contact:contacts(id, first_name, last_name, title, avatar_url, slug, company_id, bio),
        company:companies(id, name, logo_url, slug),
        article:articles(id, title, slug)
      )
    `)
    .eq("id", id)
    .single()

  // Sort panelists by display_order
  if (presentationItem?.panelists) {
    presentationItem.panelists.sort((a: any, b: any) =>
      (a.display_order || 0) - (b.display_order || 0)
    )
  }

  if (error || !presentationItem) {
    notFound()
  }

  // Fetch related entities for dropdowns and event links
  const [companiesResult, contactsResult, articlesResult, eventLinksResult] = await Promise.all([
    supabase.from("companies").select("id, name").order("name"),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, title, show_on_articles")
      .eq("show_on_articles", true)
      .order("last_name"),
    supabase.from("articles").select("id, title").order("title"),
    // Fetch events this presentation is linked to
    supabase
      .from("event_presentations")
      .select(`
        id,
        scheduled_date,
        start_time,
        end_time,
        room,
        track,
        event:events(id, name, slug, start_date, end_date, venue_name, city, state, status)
      `)
      .eq("presentation_id", id),
  ])

  const companies = companiesResult.data || []
  const contacts = contactsResult.data || []
  const articles = articlesResult.data || []
  const eventLinks = eventLinksResult.data || []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/presentations"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Presentations
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{presentationItem.title}</h1>
            <Badge variant={statusColors[presentationItem.status]}>
              {statusLabels[presentationItem.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Event Schedule Info */}
      {eventLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Scheduled at {eventLinks.length === 1 ? "Event" : "Events"}
            </CardTitle>
            <CardDescription>
              This presentation is scheduled at the following {eventLinks.length === 1 ? "event" : "events"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventLinks.map((link: any) => {
                const event = link.event
                if (!event) return null

                const locationParts = [event.venue_name, event.city, event.state].filter(Boolean)
                const locationString = locationParts.join(", ")

                const formatDate = (dateStr: string | null) => {
                  if (!dateStr) return null
                  // Parse as local date to avoid UTC conversion issues
                  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
                  const date = new Date(year, month - 1, day)
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "America/New_York",
                  })
                }

                const formatTime = (timeStr: string | null) => {
                  if (!timeStr) return null
                  try {
                    // Parse directly to avoid UTC conversion issues
                    const timePart = timeStr.includes("T") ? timeStr.split("T")[1]?.split(".")[0] : timeStr
                    if (!timePart) return timeStr
                    const [hours, minutes] = timePart.split(":")
                    const hour = parseInt(hours, 10)
                    const ampm = hour >= 12 ? "PM" : "AM"
                    const displayHour = hour % 12 || 12
                    return `${displayHour}:${minutes} ${ampm}`
                  } catch {
                    return timeStr
                  }
                }

                return (
                  <div key={link.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="font-semibold hover:underline"
                        >
                          {event.name}
                        </Link>
                        <Badge variant={event.status === "registration_open" ? "success" : "secondary"}>
                          {event.status === "registration_open" ? "Registration Open" : event.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {/* Event date range */}
                        {event.start_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(event.start_date)}
                            {event.end_date && event.end_date !== event.start_date && (
                              <> - {formatDate(event.end_date)}</>
                            )}
                          </span>
                        )}

                        {/* Location */}
                        {locationString && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {locationString}
                          </span>
                        )}
                      </div>

                      {/* Specific scheduling for this presentation */}
                      {(link.scheduled_date || link.start_time || link.room || link.track) && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          <span className="font-medium">Your session: </span>
                          {link.scheduled_date && formatDate(link.scheduled_date)}
                          {link.start_time && <> at {formatTime(link.start_time)}</>}
                          {link.end_time && <> - {formatTime(link.end_time)}</>}
                          {link.room && <> in {link.room}</>}
                          {link.track && <> ({link.track})</>}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/events/${event.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Manage Event
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline Editable Content */}
      <PresentationDetailEditor
        presentation={presentationItem}
        contact={presentationItem.contact}
        company={presentationItem.company}
        article={presentationItem.article}
        panelists={presentationItem.panelists || []}
        companies={companies}
        contacts={contacts}
        articles={articles}
      />
    </div>
  )
}

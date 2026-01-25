import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Calendar, MapPin, Users, Building2, Clock, Presentation, Layout } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgendaList } from "@/components/events/agenda-list"
import { CompaniesList } from "@/components/events/companies-list"
import { LeadersList } from "@/components/events/leaders-list"
import { EventForm } from "@/components/events/event-form"
import { EventRoomsList } from "@/components/events/event-rooms-list"
import { EventTracksList } from "@/components/events/event-tracks-list"
import { LandingPageEditor } from "@/components/events/landing-page-editor"
import { TicketTiersList } from "@/components/events/ticket-tiers-list"
import { TestimonialsList } from "@/components/events/testimonials-list"

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * Status badge color mapping
 */
const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info" | "destructive"> = {
  draft: "secondary",
  announced: "info",
  registration_open: "success",
  sold_out: "warning",
  completed: "default",
  cancelled: "destructive",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  announced: "Announced",
  registration_open: "Registration Open",
  sold_out: "Sold Out",
  completed: "Completed",
  cancelled: "Cancelled",
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD"
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

/**
 * Event Detail Page
 *
 * Comprehensive event management page with:
 * - Basic info editing
 * - Presentations tab
 * - Companies (Exhibitors) tab
 * - Leaders (Contacts) tab
 * - Landing Page customization tab
 */
export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event with related data
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !event) {
    console.error("Error fetching event:", error)
    notFound()
  }

  // Fetch event sessions (ad-hoc items like breaks, meals)
  const { data: sessions } = await supabase
    .from("event_sessions")
    .select("*")
    .eq("event_id", id)
    .order("day_number", { ascending: true })
    .order("start_time", { ascending: true })
    .order("position", { ascending: true })

  // Fetch companies (exhibitors/sponsors) with company data
  const { data: eventCompanies } = await supabase
    .from("event_companies")
    .select(`
      *,
      company:companies!event_companies_company_id_fkey(id, name, logo_url, website, description)
    `)
    .eq("event_id", id)
    .order("tier", { ascending: true })
    .order("display_order", { ascending: true })

  // Fetch leaders (contacts) with contact data - separate queries to avoid ambiguity
  const { data: eventContacts } = await supabase
    .from("event_contacts")
    .select(`
      *,
      contact:contacts!event_contacts_contact_id_fkey(
        id, first_name, last_name, title, avatar_url, linkedin_url, company_id
      )
    `)
    .eq("event_id", id)
    .order("display_order", { ascending: true })

  // Fetch companies for contacts separately to avoid relationship ambiguity
  const leadersWithCompanies = await Promise.all(
    (eventContacts || []).map(async (ec) => {
      let company = null
      if (ec.contact?.company_id) {
        const { data: companyData } = await supabase
          .from("companies")
          .select("id, name")
          .eq("id", ec.contact.company_id)
          .single()
        company = companyData
      }
      return {
        ...ec,
        contact: ec.contact ? { ...ec.contact, company } : null
      }
    })
  )

  // Fetch linked presentations with IDs
  const { data: linkedPresentations, count: presentationsCount } = await supabase
    .from("event_presentations")
    .select("id, presentation_id", { count: "exact" })
    .eq("event_id", id)

  // Fetch photo sliders with images
  const { data: sliders } = await supabase
    .from("event_photo_sliders")
    .select(`
      *,
      images:event_slider_images(*)
    `)
    .eq("event_id", id)
    .order("display_order", { ascending: true })

  // Fetch section photos
  const { data: sectionPhotos } = await supabase
    .from("event_section_photos")
    .select("*")
    .eq("event_id", id)
    .order("display_order", { ascending: true })

  // Build location string
  const locationParts = [event.venue_name, event.city, event.state].filter(Boolean)
  const locationString = locationParts.join(", ")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
              <Badge variant={statusColors[event.status] || "default"}>
                {statusLabels[event.status] || event.status}
              </Badge>
            </div>
            {event.tagline && (
              <p className="text-muted-foreground mt-1">{event.tagline}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(event.start_date)}
                {event.end_date && event.end_date !== event.start_date && (
                  <> - {formatDate(event.end_date)}</>
                )}
              </span>
              {locationString && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {locationString}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {event.slug && event.status !== "draft" && (
            <Button variant="outline" asChild>
              <Link href={`/${event.slug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Presentation className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(presentationsCount || 0) + (sessions?.length || 0)}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eventCompanies?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leadersWithCompanies?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {event.start_date ? (() => {
                    const [year, month, day] = event.start_date.split('T')[0].split('-').map(Number)
                    const eventDate = new Date(year, month - 1, day)
                    return Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  })() : "—"}
                </p>
                <p className="text-sm text-muted-foreground">Days Until</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="leaders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="leaders" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Leaders</span>
            <Badge variant="secondary" className="ml-1">{leadersWithCompanies?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="presentations" className="gap-2">
            <Presentation className="h-4 w-4" />
            <span className="hidden sm:inline">Presentations</span>
            <Badge variant="secondary" className="ml-1">{(presentationsCount || 0) + (sessions?.length || 0)}</Badge>
          </TabsTrigger>
          <TabsTrigger value="companies" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Companies</span>
            <Badge variant="secondary" className="ml-1">{eventCompanies?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Event Details</span>
          </TabsTrigger>
          <TabsTrigger value="landing-page" className="gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Landing Page</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaders">
          <LeadersList
            eventId={event.id}
            leaders={leadersWithCompanies || []}
            existingCompanyIds={(eventCompanies || []).map(ec => ec.company_id)}
            existingPresentationIds={(linkedPresentations || []).map(p => p.presentation_id)}
          />
        </TabsContent>

        <TabsContent value="presentations">
          <AgendaList
            eventId={event.id}
            items={sessions || []}
            eventStartDate={event.start_date}
            eventEndDate={event.end_date}
          />
        </TabsContent>

        <TabsContent value="companies">
          <CompaniesList eventId={event.id} companies={eventCompanies || []} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Update the basic information for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventForm event={event} />
            </CardContent>
          </Card>

          <TicketTiersList eventId={event.id} />
          <TestimonialsList eventId={event.id} />
          <EventRoomsList eventId={event.id} />
          <EventTracksList eventId={event.id} />
        </TabsContent>

        <TabsContent value="landing-page">
          <LandingPageEditor
            eventId={event.id}
            initialSettings={event.landing_page_settings}
            initialSectionColors={event.section_colors}
            sliders={(sliders || []).map((s: any) => ({
              ...s,
              images: Array.isArray(s.images) ? s.images : [],
            }))}
            sectionPhotos={sectionPhotos || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

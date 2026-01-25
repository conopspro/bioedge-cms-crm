import Link from "next/link"
import { Building2, Users, FileText, Presentation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { DashboardEventTabs } from "@/components/dashboard/dashboard-event-tabs"

/**
 * Dashboard Home Page
 *
 * Shows overview statistics and event shortcuts.
 * This is the landing page when you navigate to /dashboard.
 */
export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch counts from database
  const [companiesResult, contactsResult, articlesResult, presentationsResult, eventsResult] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("presentations").select("id", { count: "exact", head: true }),
    supabase.from("events").select(`
      *,
      venue:venues(photo_url),
      section_photos:event_section_photos(image_url, section)
    `).order("start_date", { ascending: true }),
  ])

  const companiesCount = companiesResult.count || 0
  const contactsCount = contactsResult.count || 0
  const articlesCount = articlesResult.count || 0
  const presentationsCount = presentationsResult.count || 0
  const events = eventsResult.data || []

  const stats = [
    {
      title: "Total Companies",
      value: companiesCount.toString(),
      description: "Companies in your database",
      icon: Building2,
      href: "/dashboard/companies",
    },
    {
      title: "Total Contacts",
      value: contactsCount.toString(),
      description: "Contacts across all companies",
      icon: Users,
      href: "/dashboard/contacts",
    },
    {
      title: "Articles",
      value: articlesCount.toString(),
      description: "Published and draft articles",
      icon: FileText,
      href: "/dashboard/articles",
    },
    {
      title: "Presentations",
      value: presentationsCount.toString(),
      description: "Talks and presentations",
      icon: Presentation,
      href: "/dashboard/presentations",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to BioEdge CMS. Manage your companies, contacts, and articles.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Event Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Event Shortcuts</h2>
          <Link
            href="/dashboard/events"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all events
          </Link>
        </div>
        <DashboardEventTabs events={events} />
      </div>
    </div>
  )
}

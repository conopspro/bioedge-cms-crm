import Link from "next/link"
import { ExternalLink, Home, Layout, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomepageDetailsForm } from "@/components/homepage/homepage-details-form"
import { HomepageDesignEditor } from "@/components/homepage/homepage-design-editor"

/**
 * Homepage Editor Page
 *
 * Comprehensive homepage management with:
 * - Homepage Details (hero content, meta info)
 * - Homepage Design (sections, order, events)
 */
export default async function HomepageEditorPage() {
  const supabase = await createClient()

  // Fetch homepage settings
  const { data: settings } = await supabase
    .from("homepage_settings")
    .select("*")
    .single()

  // Fetch sections
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("display_order", { ascending: true })

  // Fetch featured events with event details
  const { data: featuredEvents } = await supabase
    .from("homepage_events")
    .select(`
      *,
      event:events(
        id, name, slug, tagline, start_date, end_date,
        city, state, venue_name, featured_image_url, status
      )
    `)
    .order("display_order", { ascending: true })

  // Fetch all events for selection
  const { data: allEvents } = await supabase
    .from("events")
    .select("id, name, slug, city, state, start_date, status, featured_image_url")
    .order("start_date", { ascending: true })

  // Fetch shared sliders for slider sections
  const { data: sharedSliders } = await supabase
    .from("shared_photo_sliders")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Homepage</h1>
              <Badge variant={settings?.is_published ? "success" : "secondary"}>
                {settings?.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Customize your homepage content, layout, and featured events
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Homepage
          </Link>
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="design" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="design" className="gap-2">
            <Layout className="h-4 w-4" />
            <span>Homepage Design</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Settings className="h-4 w-4" />
            <span>Homepage Details</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <HomepageDesignEditor
            initialSections={sections || []}
            initialFeaturedEvents={featuredEvents || []}
            initialHeroSettings={settings ? {
              hero_label: settings.hero_label,
              hero_title: settings.hero_title,
              hero_subtitle: settings.hero_subtitle,
              hero_description: settings.hero_description,
              hero_video_url: settings.hero_video_url,
              hero_image_url: settings.hero_image_url,
              hero_cta_text: settings.hero_cta_text,
              hero_cta_url: settings.hero_cta_url,
              hero_secondary_cta_text: settings.hero_secondary_cta_text,
              hero_secondary_cta_url: settings.hero_secondary_cta_url,
            } : null}
            allEvents={allEvents || []}
            sharedSliders={sharedSliders || []}
          />
        </TabsContent>

        <TabsContent value="details">
          <HomepageDetailsForm initialSettings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

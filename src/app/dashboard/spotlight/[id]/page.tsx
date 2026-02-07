import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { SpotlightDetailEditor } from "@/components/spotlights/spotlight-detail-editor"

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
 * Spotlight Detail Page
 *
 * Inline editable detail page for spotlight items
 */
export default async function SpotlightDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch spotlight item with related entities and panelists
  const { data: spotlightItem, error } = await supabase
    .from("spotlights")
    .select(`
      *,
      contact:contacts(id, first_name, last_name, title, avatar_url, slug),
      company:companies(id, name, logo_url, domain, slug),
      article:articles(id, title, slug),
      panelists:spotlight_panelists(
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
  if (spotlightItem?.panelists) {
    spotlightItem.panelists.sort((a: any, b: any) =>
      (a.display_order || 0) - (b.display_order || 0)
    )
  }

  if (error || !spotlightItem) {
    notFound()
  }

  // Fetch related entities for dropdowns
  const [companiesResult, contactsResult, articlesResult] = await Promise.all([
    supabase.from("companies").select("id, name").order("name"),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, title, show_on_articles")
      .eq("show_on_articles", true)
      .order("last_name"),
    supabase.from("articles").select("id, title").order("title"),
  ])

  const companies = companiesResult.data || []
  const contacts = contactsResult.data || []
  const articles = articlesResult.data || []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/spotlight"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Spotlights
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{spotlightItem.title}</h1>
            <Badge variant={statusColors[spotlightItem.status]}>
              {statusLabels[spotlightItem.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Inline Editable Content */}
      <SpotlightDetailEditor
        spotlight={spotlightItem}
        contact={spotlightItem.contact}
        company={spotlightItem.company}
        article={spotlightItem.article}
        panelists={spotlightItem.panelists || []}
        companies={companies}
        contacts={contacts}
        articles={articles}
      />
    </div>
  )
}

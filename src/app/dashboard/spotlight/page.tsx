import Link from "next/link"
import { Plus, Calendar, Building2, User, FileText, Play, Star } from "lucide-react"
import { FeaturedToggle } from "@/components/ui/featured-toggle"
import { SpotlightDeleteButton } from "@/components/spotlights/spotlight-delete-button"
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

/**
 * Spotlights List Page
 *
 * Lists all spotlight items (curated video library)
 */
export default async function SpotlightsListPage() {
  const supabase = await createClient()

  const { data: spotlightItems, error } = await supabase
    .from("spotlights")
    .select(`
      *,
      contact:contacts(id, first_name, last_name, title, avatar_url),
      company:companies(id, name, logo_url),
      article:articles(id, title)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch spotlight items:", error)
  }

  const items = spotlightItems || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spotlight</h1>
          <p className="text-muted-foreground">
            Curated video library for longevity content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/spotlight/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Spotlight
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter((i) => i.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {items.filter((i) => i.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              With Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {items.filter((i) => i.recording_url).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spotlight Items List */}
      <Card>
        <CardHeader>
          <CardTitle>All Spotlights</CardTitle>
          <CardDescription>
            {items.length} item(s) in your curated library
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <FeaturedToggle
                    entityType="spotlight"
                    entityId={item.id}
                    isFeatured={item.is_featured || false}
                  />
                  <Link
                    href={`/dashboard/spotlight/${item.id}`}
                    className="block flex-1 min-w-0"
                  >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <Badge variant={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                        {item.recording_url && (
                          <Badge variant="outline" className="gap-1">
                            <Play className="h-3 w-3" />
                            Video
                          </Badge>
                        )}
                      </div>
                      {item.short_description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.short_description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {item.contact && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.contact.first_name} {item.contact.last_name}
                          </span>
                        )}
                        {item.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {item.company.name}
                          </span>
                        )}
                        {item.article && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Article linked
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <SpotlightDeleteButton id={item.id} title={item.title} />
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">No spotlights yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first curated video to build your spotlight library
              </p>
              <Button asChild>
                <Link href="/dashboard/spotlight/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Spotlight
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

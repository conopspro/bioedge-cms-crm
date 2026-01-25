import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArticlesTable } from "@/components/articles/articles-table"

/**
 * Articles List Page
 */
export default async function ArticlesPage() {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from("articles")
    .select(`
      *,
      company:companies(id, name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">
            Create and manage your BioEdge magazine articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Articles Table */}
      <ArticlesTable articles={articles || []} />
    </div>
  )
}

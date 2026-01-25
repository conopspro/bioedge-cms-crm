import { createClient } from "@/lib/supabase/server"
import { ArticleForm } from "@/components/articles/article-form"

/**
 * New Article Page
 */
export default async function NewArticlePage() {
  const supabase = await createClient()

  // Fetch companies for the dropdown
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Article</h1>
        <p className="text-muted-foreground">
          Create a new article for BioEdge Magazine.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        <ArticleForm companies={companies || []} mode="create" />
      </div>
    </div>
  )
}

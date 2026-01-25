import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PublishButton } from "@/components/articles/publish-button"
import { ArticleEnhancementsEditor } from "@/components/articles/article-enhancements-editor"
import { KeyPeopleCard } from "@/components/articles/key-people-card"
import { ArticleInlineEditor } from "@/components/articles/article-inline-editor"
import { ArticleCompanyCard } from "@/components/articles/article-company-card"
import { ArticlesEnhanceButton } from "@/components/articles/articles-enhance-button"
import type { ArticleEnhancement } from "@/types/database"

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  draft: "secondary",
  review: "warning",
  published: "success",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
}

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Article Detail Page
 */
export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // First, fetch the article with company (article_enhancements table may not exist yet)
  const { data: article, error } = await supabase
    .from("articles")
    .select(`
      *,
      company:companies(*)
    `)
    .eq("id", id)
    .single()

  if (error || !article) {
    console.error("Error fetching article:", error)
    notFound()
  }

  // Fetch all companies for the company selector
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .order("name")

  // Try to fetch enhancements separately (table may not exist yet)
  let articleEnhancements: ArticleEnhancement[] = []
  try {
    const { data: enhancementData } = await supabase
      .from("article_enhancements")
      .select("*")
      .eq("article_id", id)
      .order("position")
    articleEnhancements = (enhancementData || []) as ArticleEnhancement[]
  } catch (e) {
    // Table doesn't exist yet, that's okay
  }

  // Group enhancements by type for stats
  const youtubeVideos = articleEnhancements.filter((e) => e.type === "youtube")
  const scholarRefs = articleEnhancements.filter((e) => e.type === "scholar")
  const books = articleEnhancements.filter((e) => e.type === "book")
  const links = articleEnhancements.filter((e) => e.type === "link")
  const images = articleEnhancements.filter((e) => e.type === "image")

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/articles"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Link>

      {/* Page Header - Actions Only */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={statusColors[article.status]}>
            {statusLabels[article.status]}
          </Badge>
          {article.ai_enhanced && (
            <Badge variant="info" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Enhanced
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {article.status === "published" && (
            <Button variant="outline" asChild>
              <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </a>
            </Button>
          )}
          {article.status !== "published" && (
            <PublishButton articleId={article.id} currentStatus={article.status} />
          )}
          <ArticlesEnhanceButton
            articleId={article.id}
            label="Enhance with AI"
            variant="outline"
            size="default"
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Content with Inline Editing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inline Editor for Title, Excerpt, Content, Featured Image, Company */}
          <ArticleInlineEditor
            article={article}
            companies={companies || []}
          />

          {/* Enhancements - Editable */}
          <ArticleEnhancementsEditor
            articleId={article.id}
            enhancements={articleEnhancements}
          />
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Company */}
          <ArticleCompanyCard
            articleId={article.id}
            company={article.company}
            companies={companies || []}
          />

          {/* Key People */}
          <KeyPeopleCard
            articleId={article.id}
            companyId={article.company_id}
            keyPeopleContactIds={article.key_people_contact_ids || []}
          />

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.published_at && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published</p>
                    <p className="font-medium">
                      {new Date(article.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(article.updated_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enhancement Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">YouTube Videos</span>
                <span className="font-medium">{youtubeVideos.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scholar Refs</span>
                <span className="font-medium">{scholarRefs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Books</span>
                <span className="font-medium">{books.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Links</span>
                <span className="font-medium">{links.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Images</span>
                <span className="font-medium">{images.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

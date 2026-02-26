"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FileText } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"
import { getArticleImageUrl } from "@/lib/youtube"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url?: string | null
  youtube_url?: string | null
  company: {
    id: string
    name: string
    category: string | null
  } | null
}

interface ArticlesGridProps {
  initialArticles: Article[]
  initialHasMore: boolean
}

export function ArticlesGrid({ initialArticles, initialHasMore }: ArticlesGridProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("q")

  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Reset when filters change
  useEffect(() => {
    setArticles(initialArticles)
    setPage(0)
    setHasMore(initialHasMore)
  }, [initialArticles, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams()
      params.set("page", String(nextPage))
      if (category) params.set("category", category)
      if (search) params.set("q", search)

      const res = await fetch(`/api/directory/articles?${params}`)
      const data = await res.json()

      setArticles((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Failed to load more articles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, category, search])

  if (articles.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="mx-auto mb-4 h-16 w-16 text-navy/20" />
        <h2 className="mb-2 text-xl font-semibold text-navy">
          {category || search ? "No articles found" : "No articles yet"}
        </h2>
        <p className="text-gray-600">
          {category || search ? "Try adjusting your filters." : "Check back soon for new content."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const imageUrl = getArticleImageUrl(article.featured_image_url, article.youtube_url)
          const hasVideo = !article.featured_image_url && article.youtube_url

          return (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)]"
            >
              {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src.includes("maxresdefault")) {
                        target.src = target.src.replace("maxresdefault", "hqdefault")
                      }
                    }}
                  />
                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="rounded-full bg-red-600 p-2 shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                {article.company && (
                  <span className="mb-3 block text-xs font-medium text-electric-blue">
                    {article.company.name}
                  </span>
                )}
                <h2 className="mb-2 text-lg font-bold text-navy transition-colors group-hover:text-electric-blue">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </>
  )
}

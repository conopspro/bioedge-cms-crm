"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Newspaper } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"
import { NewsCard } from "./news-card"

interface NewsArticle {
  id: string
  title: string
  url: string
  source_name: string
  published_at: string | null
  author: string | null
  summary: string | null
  key_points: string[]
  edge_significance: string | null
  edge_categories: string[]
  biological_systems: string[]
}

interface NewsGridProps {
  initialArticles: NewsArticle[]
  initialHasMore: boolean
}

export function NewsGrid({ initialArticles, initialHasMore }: NewsGridProps) {
  const searchParams = useSearchParams()
  const source = searchParams.get("source")
  const edge = searchParams.get("edge")
  const system = searchParams.get("system")
  const search = searchParams.get("q")

  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Reset when filters change (server re-renders initial data)
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
      if (source) params.set("source", source)
      if (edge) params.set("edge", edge)
      if (system) params.set("system", system)
      if (search) params.set("q", search)

      const res = await fetch(`/api/directory/news?${params}`)
      const data = await res.json()

      setArticles((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Failed to load more news:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, source, edge, system, search])

  if (articles.length === 0) {
    return (
      <div className="py-16 text-center">
        <Newspaper className="mx-auto mb-4 h-16 w-16 text-navy/20" />
        <h2 className="mb-2 text-xl font-semibold text-navy">
          {source || edge || system || search ? "No articles found" : "No news yet"}
        </h2>
        <p className="text-gray-600">
          {source || edge || system || search
            ? "Try adjusting your filters."
            : "Check back soon for the latest longevity research."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </>
  )
}

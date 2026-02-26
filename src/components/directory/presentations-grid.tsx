"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Play, User, Building2 } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"
import { YouTubeThumbnail } from "@/components/ui/youtube-thumbnail"

interface Presentation {
  id: string
  title: string
  slug: string | null
  short_description: string | null
  recording_embed: string | null
  youtube_url?: string | null
  contact: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  } | null
  company: {
    id: string
    name: string
    logo_url: string | null
    category: string | null
  } | null
}

interface PresentationsGridProps {
  initialPresentations: Presentation[]
  initialHasMore: boolean
}

export function PresentationsGrid({ initialPresentations, initialHasMore }: PresentationsGridProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("q")

  const [presentations, setPresentations] = useState<Presentation[]>(initialPresentations)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Reset when filters change
  useEffect(() => {
    setPresentations(initialPresentations)
    setPage(0)
    setHasMore(initialHasMore)
  }, [initialPresentations, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams()
      params.set("page", String(nextPage))
      if (category) params.set("category", category)
      if (search) params.set("q", search)

      const res = await fetch(`/api/directory/presentations?${params}`)
      const data = await res.json()

      setPresentations((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Failed to load more presentations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, category, search])

  if (presentations.length === 0) {
    return (
      <div className="py-16 text-center">
        <Play className="mx-auto mb-4 h-16 w-16 text-navy/20" />
        <h2 className="mb-2 text-xl font-semibold text-navy">
          {category || search ? "No presentations found" : "No presentations yet"}
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
        {presentations.map((item) => {
          const thumbnailUrl = item.youtube_url
            ? getYouTubeThumbnailUrl(item.youtube_url)
            : null

          return (
            <Link
              key={item.id}
              href={`/presentations/${item.slug || item.id}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-navy/10 to-electric-blue/10">
                {thumbnailUrl ? (
                  <YouTubeThumbnail
                    url={item.youtube_url!}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Play className="h-12 w-12 text-navy/20" />
                  </div>
                )}
              </div>
              <div className="p-6">
                {/* Speaker & Company */}
                <div className="mb-3 flex items-center gap-3">
                  {item.contact && (
                    <div className="flex items-center gap-2">
                      {item.contact.avatar_url ? (
                        <img
                          src={item.contact.avatar_url}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-electric-blue/20"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-electric-blue">
                        {item.contact.first_name} {item.contact.last_name}
                      </span>
                    </div>
                  )}
                  {item.company && !item.contact && (
                    <div className="flex items-center gap-2">
                      {item.company.logo_url ? (
                        <img
                          src={item.company.logo_url}
                          alt=""
                          className="h-6 w-6 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-navy/10">
                          <Building2 className="h-3 w-3 text-navy/50" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-electric-blue">
                        {item.company.name}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="mb-2 text-lg font-bold text-navy transition-colors group-hover:text-electric-blue">
                  {item.title}
                </h2>

                {item.short_description && (
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {item.short_description}
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

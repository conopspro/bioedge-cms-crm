"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Users } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"

interface Leader {
  id: string
  slug: string | null
  first_name: string
  last_name: string
  title: string | null
  avatar_url: string | null
  linkedin_url: string | null
  bio: string | null
  company: { name: string; logo_url: string | null; category: string | null } | null
}

interface LeadersGridProps {
  initialLeaders: Leader[]
  initialHasMore: boolean
}

export function LeadersGrid({ initialLeaders, initialHasMore }: LeadersGridProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("q")

  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Reset when filters change
  useEffect(() => {
    setLeaders(initialLeaders)
    setPage(0)
    setHasMore(initialHasMore)
  }, [initialLeaders, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams()
      params.set("page", String(nextPage))
      if (category) params.set("category", category)
      if (search) params.set("q", search)

      const res = await fetch(`/api/directory/leaders?${params}`)
      const data = await res.json()

      setLeaders((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Failed to load more leaders:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, category, search])

  if (leaders.length === 0) {
    return (
      <div className="py-16 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-navy/20" />
        <h2 className="mb-2 text-xl font-semibold text-navy">
          {category || search ? "No leaders found" : "No leaders yet"}
        </h2>
        <p className="text-gray-600">
          {category || search ? "Try adjusting your filters." : "Check back soon!"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader) => (
          <Link
            key={leader.id}
            href={`/leaders/${leader.slug || leader.id}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {leader.avatar_url ? (
                  <img
                    src={leader.avatar_url}
                    alt={`${leader.first_name} ${leader.last_name}`}
                    className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-electric-blue/20"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue text-xl font-bold text-white">
                    {leader.first_name?.charAt(0) || "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-navy text-lg transition-colors group-hover:text-electric-blue">
                    {leader.first_name} {leader.last_name}
                  </h2>
                  {leader.company?.name && (
                    <p className="text-sm font-medium text-[#017ab2] mt-1">
                      {leader.company.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
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

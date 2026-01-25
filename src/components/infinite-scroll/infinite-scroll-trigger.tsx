"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  if (!hasMore) return null

  return (
    <div ref={triggerRef} className="flex justify-center py-8">
      {isLoading && (
        <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
      )}
    </div>
  )
}

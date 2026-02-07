"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeaturedToggleProps {
  entityType: "articles" | "contacts" | "companies" | "presentations" | "spotlights"
  entityId: string
  isFeatured: boolean
  className?: string
}

/**
 * Featured Toggle Component
 *
 * A star icon that toggles the is_featured status of an entity.
 * Used to mark items for display on the homepage.
 */
export function FeaturedToggle({
  entityType,
  entityId,
  isFeatured,
  className,
}: FeaturedToggleProps) {
  const router = useRouter()
  const [featured, setFeatured] = useState(isFeatured)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsUpdating(true)
    const newValue = !featured

    try {
      const response = await fetch(`/api/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: newValue }),
      })

      if (response.ok) {
        setFeatured(newValue)
        router.refresh()
      }
    } catch (error) {
      console.error("Error toggling featured:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={cn(
        "p-1 rounded transition-colors",
        featured
          ? "text-gold hover:text-gold/80"
          : "text-gray-300 hover:text-gold/50",
        isUpdating && "opacity-50 cursor-wait",
        className
      )}
      title={featured ? "Remove from homepage" : "Feature on homepage"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all",
          featured && "fill-current"
        )}
      />
    </button>
  )
}

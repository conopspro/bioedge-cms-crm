"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VisibilityToggleProps {
  companyId: string
  isDraft: boolean | null
}

/**
 * One-click visibility toggle for companies
 * Allows quick publish/unpublish without navigating into Pipeline Status
 */
export function VisibilityToggle({ companyId, isDraft }: VisibilityToggleProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isPublished = isDraft === false

  const toggleVisibility = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_draft: !isDraft ? true : false }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error("Failed to toggle visibility")
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error)
    }
    setIsLoading(false)
  }

  return (
    <Button
      variant={isPublished ? "default" : "outline"}
      size="sm"
      onClick={toggleVisibility}
      disabled={isLoading}
      className={isPublished ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isPublished ? (
        <Eye className="h-4 w-4 mr-2" />
      ) : (
        <EyeOff className="h-4 w-4 mr-2" />
      )}
      {isPublished ? "Published" : "Draft"}
    </Button>
  )
}

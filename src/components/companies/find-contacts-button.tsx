"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FindContactsButtonProps {
  companyId: string
  hasDomain: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function FindContactsButton({
  companyId,
  hasDomain,
  variant = "outline",
  size = "sm",
  className,
}: FindContactsButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleClick = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/companies/${companyId}/find-contacts`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to search for contacts",
        })
        return
      }

      setResult({
        success: true,
        message: data.message,
      })

      // Refresh the page to show new contacts
      router.refresh()
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while searching for contacts",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading || !hasDomain}
        className={className}
        title={!hasDomain ? "Add a website to the company first" : "Search Hunter.io for contacts"}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Find Contacts
          </>
        )}
      </Button>
      {result && (
        <p className={`text-xs ${result.success ? "text-green-600" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
      {!hasDomain && (
        <p className="text-xs text-muted-foreground">
          Add a website to enable Hunter search
        </p>
      )}
    </div>
  )
}

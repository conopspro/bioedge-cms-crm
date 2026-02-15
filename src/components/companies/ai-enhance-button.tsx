"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIEnhanceButtonProps {
  companyId: string
  companyName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

/**
 * AI Enhance Button for Companies
 *
 * Single-action company enhancement that:
 * 1. Perplexity AI research for description, differentiators, evidence, systems
 * 2. Hunter.io domain search to find and create contacts
 */
export function AIEnhanceButton({
  companyId,
  companyName,
  variant = "outline",
  size = "default",
  className = "",
}: AIEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    setIsEnhancing(true)
    setResult(null)
    setError(null)

    try {
      console.log(`[ai-enhance] Starting enhancement for ${companyName} (${companyId})`)

      const response = await fetch("/api/enhance-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      })

      const data = await response.json()
      console.log(`[ai-enhance] Response:`, data)

      if (!response.ok) {
        throw new Error(data.error || "Enhancement failed")
      }

      // Build result message
      const parts: string[] = []
      if (data.fieldsUpdated?.length > 0) {
        parts.push(`Updated: ${data.fieldsUpdated.join(", ")}`)
      }
      if (data.contactsCreated > 0) {
        parts.push(`Created ${data.contactsCreated} new contact(s)`)
      }

      setResult(parts.length > 0 ? parts.join(". ") : "No new information found")

      // Hard reload to show updated data (router.refresh() doesn't re-initialize client state)
      window.location.reload()
    } catch (err) {
      console.error(`[ai-enhance] Error:`, err)
      setError(err instanceof Error ? err.message : "Enhancement failed")
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={handleEnhance}
        disabled={isEnhancing}
        className="w-full"
      >
        {isEnhancing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Researching...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Enhance with Perplexity
          </>
        )}
      </Button>

      {result && (
        <p className="text-xs text-green-600 mt-2">{result}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
}

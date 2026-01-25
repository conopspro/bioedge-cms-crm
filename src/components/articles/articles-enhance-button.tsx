"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticlesEnhanceButtonProps {
  companyId?: string
  articleId?: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

/**
 * Articles Enhance Button
 *
 * Triggers AI enhancement for articles, leveraging company/contact context.
 * Can enhance a single article or all articles for a company.
 */
export function ArticlesEnhanceButton({
  companyId,
  articleId,
  label = "Enhance Articles",
  variant = "outline",
  size = "default",
  className = "",
}: ArticlesEnhanceButtonProps) {
  const router = useRouter()
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    if (!companyId && !articleId) {
      setError("Either companyId or articleId is required")
      return
    }

    setIsEnhancing(true)
    setResult(null)
    setError(null)

    try {
      const body: Record<string, string> = {}
      if (companyId) body.companyId = companyId
      if (articleId) body.articleId = articleId

      const response = await fetch("/api/enhance-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Enhancement failed")
      }

      // Build result message
      const successCount = data.results?.filter((r: { success: boolean }) => r.success).length || 0
      const totalCount = data.results?.length || 0

      if (totalCount === 0) {
        setResult("No articles to enhance")
      } else if (successCount === totalCount) {
        const totalEnhancements = data.results.reduce(
          (sum: number, r: { enhancementsCreated: number }) => sum + (r.enhancementsCreated || 0),
          0
        )
        const updates = data.results
          .flatMap((r: { fieldsUpdated: string[] }) => r.fieldsUpdated || [])
          .filter((u: string, i: number, arr: string[]) => arr.indexOf(u) === i)
          .slice(0, 5)

        const parts: string[] = []
        if (updates.length > 0) {
          parts.push(updates.join(", "))
        }
        if (totalEnhancements > 0) {
          parts.push(`${totalEnhancements} media items`)
        }

        setResult(parts.length > 0 ? `Added: ${parts.join(", ")}` : "No new information found")
      } else {
        setResult(`Enhanced ${successCount} of ${totalCount} article(s)`)
      }

      router.refresh()
    } catch (err) {
      console.error("[articles-enhance] Error:", err)
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
            Enhancing...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            {label}
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

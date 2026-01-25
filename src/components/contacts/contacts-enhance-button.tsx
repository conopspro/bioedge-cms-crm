"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactsEnhanceButtonProps {
  companyId?: string
  contactId?: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

/**
 * Contacts Enhance Button
 *
 * Triggers Hunter.io + Perplexity AI research for contacts.
 * Can enhance a single contact or all contacts for a company.
 */
export function ContactsEnhanceButton({
  companyId,
  contactId,
  label = "Enhance Contacts",
  variant = "outline",
  size = "default",
  className = "",
}: ContactsEnhanceButtonProps) {
  const router = useRouter()
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    if (!companyId && !contactId) {
      setError("Either companyId or contactId is required")
      return
    }

    setIsEnhancing(true)
    setResult(null)
    setError(null)

    try {
      const body: Record<string, string> = {}
      if (companyId) body.companyId = companyId
      if (contactId) body.contactId = contactId

      const response = await fetch("/api/enhance-contacts", {
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
        setResult("No contacts to enhance")
      } else if (successCount === totalCount) {
        const updates = data.results
          .flatMap((r: { fieldsUpdated: string[] }) => r.fieldsUpdated || [])
          .filter((u: string, i: number, arr: string[]) => arr.indexOf(u) === i)
          .slice(0, 5)
        setResult(updates.length > 0 ? `Enhanced: ${updates.join(", ")}` : "No new information found")
      } else {
        setResult(`Enhanced ${successCount} of ${totalCount} contact(s)`)
      }

      router.refresh()
    } catch (err) {
      console.error("[contacts-enhance] Error:", err)
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
            <Users className="h-4 w-4 mr-2" />
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

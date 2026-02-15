"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ResearchCompanyButtonProps {
  companyId: string
  companyName: string
  companyWebsite: string | null
  companyEvents?: string[]
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

/**
 * Research Company Button
 *
 * Launches the AI research process for an existing company.
 * Opens a dialog to confirm/edit details before starting research.
 */
export function ResearchCompanyButton({
  companyId,
  companyName,
  companyWebsite,
  companyEvents = [],
  variant = "outline",
  size = "default",
  className = "",
}: ResearchCompanyButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isResearching, setIsResearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company_name: companyName,
    website: companyWebsite || "",
    event: companyEvents[0] || "",
  })

  const handleOpen = () => {
    // Reset form data when opening
    setFormData({
      company_name: companyName,
      website: companyWebsite || "",
      event: companyEvents[0] || "",
    })
    setError(null)
    setIsOpen(true)
  }

  const handleResearch = async () => {
    if (!formData.website) {
      setError("Website is required for research")
      return
    }

    if (!formData.event) {
      setError("Event/Source is required for research")
      return
    }

    setIsResearching(true)
    setError(null)

    try {
      // Ensure website has protocol
      let website = formData.website
      if (website && !website.startsWith("http")) {
        website = "https://" + website
      }

      const response = await fetch("/api/research/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.company_name,
          website,
          event: formData.event,
          existing_company_id: companyId, // Pass the existing company ID
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Research failed")
      }

      // Store results in sessionStorage for the review page
      sessionStorage.setItem("researchResults", JSON.stringify(result))

      // Close dialog and navigate to review page
      setIsOpen(false)
      router.push("/dashboard/research/review")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsResearching(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpen}
        className={`w-full ${className}`}
      >
        <Search className="h-4 w-4 mr-2" />
        Research with Claude
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Research Company</DialogTitle>
            <DialogDescription>
              Run AI research to generate a company brief, article, and warm pitch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL *</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
              <p className="text-xs text-muted-foreground">
                The AI will analyze this website to research the company
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event / Source *</Label>
              <Input
                id="event"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                placeholder="e.g., Biohacking Conference 2024"
              />
              <p className="text-xs text-muted-foreground">
                Where did you find this company?
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isResearching}>
              Cancel
            </Button>
            <Button onClick={handleResearch} disabled={isResearching}>
              {isResearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Start Research
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

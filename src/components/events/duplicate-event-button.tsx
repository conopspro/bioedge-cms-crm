"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Loader2 } from "lucide-react"
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

interface DuplicateEventButtonProps {
  eventId: string
  eventName: string
  eventSlug: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

/**
 * Generate a slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Duplicate Event Button
 *
 * Opens a dialog to confirm duplication and set the new event name/slug.
 * Copies event settings (landing page, colors, ticket tiers, etc.)
 * but NOT content items (leaders, companies, presentations).
 */
export function DuplicateEventButton({
  eventId,
  eventName,
  eventSlug,
  variant = "ghost",
  size = "icon",
}: DuplicateEventButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    newName: `${eventName} (Copy)`,
    newSlug: `${eventSlug}-copy`,
  })

  const handleOpen = () => {
    // Reset form when opening
    setFormData({
      newName: `${eventName} (Copy)`,
      newSlug: `${eventSlug}-copy`,
    })
    setError(null)
    setIsOpen(true)
  }

  const handleNameChange = (name: string) => {
    setFormData({
      newName: name,
      newSlug: generateSlug(name),
    })
  }

  const handleDuplicate = async () => {
    if (!formData.newName.trim()) {
      setError("Event name is required")
      return
    }

    if (!formData.newSlug.trim()) {
      setError("Slug is required")
      return
    }

    setIsDuplicating(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${eventId}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newName: formData.newName.trim(),
          newSlug: formData.newSlug.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to duplicate event")
      }

      // Close dialog and navigate to the new event
      setIsOpen(false)
      router.push(`/dashboard/events/${result.event.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpen}
        title="Duplicate Event"
      >
        <Copy className="h-4 w-4" />
        {size !== "icon" && <span className="ml-2">Duplicate</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Event</DialogTitle>
            <DialogDescription>
              Create a copy of "{eventName}" with all its settings and styling.
              Leaders, companies, and presentations will start fresh.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newName">New Event Name *</Label>
              <Input
                id="newName"
                value={formData.newName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., BioEdge NYC 2027"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newSlug">URL Slug *</Label>
              <Input
                id="newSlug"
                value={formData.newSlug}
                onChange={(e) =>
                  setFormData({ ...formData, newSlug: e.target.value })
                }
                placeholder="e.g., nyc27"
              />
              <p className="text-xs text-muted-foreground">
                This will be the URL: /{formData.newSlug}
              </p>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-2">What gets copied:</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Landing page settings & section visibility</li>
                <li>• Section colors & styling</li>
                <li>• Ticket tiers & features</li>
                <li>• Value propositions</li>
                <li>• FAQ template links</li>
                <li>• Sliders & section photos</li>
              </ul>
              <p className="font-medium mt-3 mb-2">Starts fresh:</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Leaders / Speakers</li>
                <li>• Companies / Sponsors</li>
                <li>• Presentations / Agenda</li>
                <li>• Event dates & venue</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDuplicating}
            >
              Cancel
            </Button>
            <Button onClick={handleDuplicate} disabled={isDuplicating}>
              {isDuplicating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, ChevronDown, ChevronUp, Share2 } from "lucide-react"
import type { Event, EventStatus } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"

interface EventFormProps {
  event?: Event
}

/**
 * Generate slug from event name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Event Form Component
 *
 * Form for creating and editing events.
 * Handles validation and API submission.
 */
export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const isEditing = !!event

  // Form state
  const [name, setName] = useState(event?.name || "")
  const [slug, setSlug] = useState(event?.slug || "")
  const [tagline, setTagline] = useState(event?.tagline || "")
  const [description, setDescription] = useState(event?.description || "")
  const [extendedInfo, setExtendedInfo] = useState(event?.extended_info || "")
  const [venueName, setVenueName] = useState(event?.venue_name || "")
  const [venueAddress, setVenueAddress] = useState(event?.venue_address || "")
  const [city, setCity] = useState(event?.city || "")
  const [state, setState] = useState(event?.state || "")
  const [country, setCountry] = useState(event?.country || "USA")
  const [startDate, setStartDate] = useState(event?.start_date?.split("T")[0] || "")
  const [endDate, setEndDate] = useState(event?.end_date?.split("T")[0] || "")
  const [timezone, setTimezone] = useState(event?.timezone || "America/New_York")
  const [status, setStatus] = useState<EventStatus>(event?.status || "draft")
  const [registrationUrl, setRegistrationUrl] = useState(event?.registration_url || "")
  const [featuredImageUrl, setFeaturedImageUrl] = useState(event?.featured_image_url || "")
  const [ogImageUrl, setOgImageUrl] = useState(event?.og_image_url || "")

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(isEditing)

  // AI Assist state
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiNotes, setAiNotes] = useState("")
  const [showAiNotes, setShowAiNotes] = useState(false)
  const [aiSuccess, setAiSuccess] = useState<string | null>(null)

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(generateSlug(value))
    }
  }

  // AI content generation
  const handleAiGenerate = async () => {
    if (!name.trim()) {
      setError("Please enter an event name first")
      return
    }

    setIsGenerating(true)
    setError(null)
    setAiSuccess(null)

    try {
      const response = await fetch("/api/ai-event-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: name,
          city,
          state,
          country,
          startDate,
          endDate,
          notes: aiNotes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate content")
      }

      const data = await response.json()

      // Update form fields with generated content
      if (data.tagline) setTagline(data.tagline)
      if (data.description) setDescription(data.description)
      if (data.extended_info) setExtendedInfo(data.extended_info)

      setAiSuccess("Content generated! Review and edit as needed.")
      setShowAiNotes(false)
      setAiNotes("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validation
    if (!name.trim()) {
      setError("Event name is required")
      setIsSubmitting(false)
      return
    }

    if (!slug.trim()) {
      setError("Slug is required")
      setIsSubmitting(false)
      return
    }

    try {
      const eventData = {
        name: name.trim(),
        slug: slug.trim(),
        tagline: tagline.trim() || null,
        description: description.trim() || null,
        extended_info: extendedInfo.trim() || null,
        venue_name: venueName.trim() || null,
        venue_address: venueAddress.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        timezone: timezone || null,
        status,
        registration_url: registrationUrl.trim() || null,
        featured_image_url: featuredImageUrl.trim() || null,
        og_image_url: ogImageUrl.trim() || null,
      }

      const url = isEditing
        ? `/api/events/${event.id}`
        : "/api/events"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save event")
      }

      const savedEvent = await response.json()
      router.push(`/dashboard/events/${savedEvent.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            The core details about your event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="BioEdge Longevity Summit NYC 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSlugEdited(true)
                }}
                placeholder="nyc-2026"
              />
              <p className="text-xs text-muted-foreground">
                URL will be: /events/{slug || "your-slug"}
              </p>
            </div>
          </div>

          {/* AI Assist Section */}
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="font-medium">AI Assist</span>
                <span className="text-xs text-muted-foreground">
                  Generate tagline, description & extended info
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAiNotes(!showAiNotes)}
                  className="text-xs"
                >
                  {showAiNotes ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Notes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Add Notes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !name.trim()}
                  size="sm"
                  className="bg-gold hover:bg-gold/90 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
            {showAiNotes && (
              <div className="space-y-2">
                <Label htmlFor="aiNotes" className="text-sm">
                  Notes for AI (optional)
                </Label>
                <Textarea
                  id="aiNotes"
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Add any context to guide the AI: themes, focus areas, target audience, special features, tone preferences..."
                  rows={3}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  These notes help the AI create more relevant and tailored content.
                </p>
              </div>
            )}
            {aiSuccess && (
              <div className="text-sm text-green-700 bg-green-50 rounded px-3 py-2">
                {aiSuccess}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="The premier longevity conference of 2026"
            />
            <p className="text-xs text-muted-foreground">
              A short hook or teaser for the event.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full description of the event..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extendedInfo">Extended Information</Label>
            <Textarea
              id="extendedInfo"
              value={extendedInfo}
              onChange={(e) => setExtendedInfo(e.target.value)}
              placeholder="Additional details, what to expect, etc..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Venue & Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Venue & Dates</CardTitle>
          <CardDescription>
            Where and when the event takes place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="The Grand Ballroom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input
                id="venueAddress"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern</SelectItem>
                  <SelectItem value="America/Chicago">Central</SelectItem>
                  <SelectItem value="America/Denver">Mountain</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Links */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Links</CardTitle>
          <CardDescription>
            Control visibility and registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationUrl">Registration URL</Label>
              <Input
                id="registrationUrl"
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://eventbrite.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            Event imagery for the landing page and social sharing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
              <Input
                id="featuredImageUrl"
                type="url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Main hero image for the event page.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Social Share Image
              </Label>
              {isEditing && event?.id ? (
                <ImageUpload
                  imageType="article"
                  entityType="event"
                  entityId={event.id}
                  value={ogImageUrl || null}
                  onUpload={(url) => setOgImageUrl(url)}
                  onRemove={() => setOgImageUrl("")}
                  cropToFit
                />
              ) : (
                <>
                  <Input
                    id="ogImageUrl"
                    type="url"
                    value={ogImageUrl}
                    onChange={(e) => setOgImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Save the event first to enable image upload.
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}

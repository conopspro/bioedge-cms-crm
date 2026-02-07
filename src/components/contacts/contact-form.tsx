"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Contact } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles, Star } from "lucide-react"
import { ContactEnhancementsEditor } from "./contact-enhancements-editor"
import { ContactsEnhanceButton } from "./contacts-enhance-button"
import { OutreachLogEditor } from "./outreach-log-editor"
import Link from "next/link"

interface EnhancementMetadata {
  thumbnail?: string
  channel?: string
  duration?: string
  authors?: string[]
  journal?: string
  year?: string
  citedBy?: number
  videoId?: string
  rating?: number
}

interface ContactEnhancement {
  id: string
  contact_id: string
  type: "youtube" | "scholar" | "book" | "link" | "image"
  title: string | null
  url: string | null
  embed_code: string | null
  metadata: EnhancementMetadata | null
  position: number
  created_at: string
}

interface OutreachLogEntry {
  id: string
  contact_id: string
  date: string
  type: "email" | "phone" | "linkedin" | "text" | "meeting" | "call" | "other"
  notes: string | null
  response_received: boolean
  created_at: string
}

interface ContactFormProps {
  contact?: Contact & {
    bio?: string | null
    ai_highlights?: string[] | null
    ai_expertise?: string[] | null
    ai_researched_at?: string | null
  }
  companies: { id: string; name: string }[]
  enhancements?: ContactEnhancement[]
  outreachLog?: OutreachLogEntry[]
  mode: "create" | "edit"
}

/**
 * Contact Form Component
 *
 * Reusable form for creating and editing contacts.
 * Uses only fields that exist in the database schema.
 */
export function ContactForm({ contact, companies, enhancements = [], outreachLog = [], mode }: ContactFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get company ID from URL if provided (for creating from company page)
  const companyIdFromUrl = searchParams.get("company")

  // Form state matching actual database schema
  // Note: first_name, last_name, and company_id are required. Email is optional.
  const [formData, setFormData] = useState({
    company_id: contact?.company_id || companyIdFromUrl || null,
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    email: contact?.email || "",
    phone: contact?.phone || null,
    title: contact?.title || null,
    linkedin_url: contact?.linkedin_url || null,
    youtube_channel_url: contact?.youtube_channel_url || null,
    source: contact?.source || null,
    outreach_status: contact?.outreach_status || "not_contacted",
    show_on_articles: contact?.show_on_articles || false,
    notes: contact?.notes || null,
    avatar_url: contact?.avatar_url || null,
    bio: contact?.bio || null,
    ai_highlights: contact?.ai_highlights || [],
    ai_expertise: contact?.ai_expertise || [],
  })

  // State for new expertise/highlight input
  const [newExpertise, setNewExpertise] = useState("")
  const [newHighlight, setNewHighlight] = useState("")

  // Helper to add expertise tag
  const addExpertise = () => {
    if (newExpertise.trim() && !formData.ai_expertise?.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        ai_expertise: [...(prev.ai_expertise || []), newExpertise.trim()]
      }))
      setNewExpertise("")
    }
  }

  // Helper to remove expertise tag
  const removeExpertise = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      ai_expertise: (prev.ai_expertise || []).filter(t => t !== tag)
    }))
  }

  // Helper to add highlight
  const addHighlight = () => {
    if (newHighlight.trim() && !formData.ai_highlights?.includes(newHighlight.trim())) {
      setFormData(prev => ({
        ...prev,
        ai_highlights: [...(prev.ai_highlights || []), newHighlight.trim()]
      }))
      setNewHighlight("")
    }
  }

  // Helper to remove highlight
  const removeHighlight = (highlight: string) => {
    setFormData(prev => ({
      ...prev,
      ai_highlights: (prev.ai_highlights || []).filter(h => h !== highlight)
    }))
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    // Fields that are required (NOT NULL) in the database
    const requiredFields = ["first_name", "last_name"]

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        // Keep empty strings for required fields, convert to null for optional fields
        [name]: requiredFields.includes(name) ? value : (value === "" ? null : value),
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError("First name and last name are required")
      setIsLoading(false)
      return
    }

    if (!formData.company_id) {
      setError("Company is required")
      setIsLoading(false)
      return
    }

    try {
      const url = mode === "create"
        ? "/api/contacts"
        : `/api/contacts/${contact?.id}`

      const method = mode === "create" ? "POST" : "PATCH"

      console.log("Submitting form data:", formData)
      console.log("URL:", url, "Method:", method)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status, response.statusText)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        console.error("Save failed:", data)
        throw new Error(data.error || "Failed to save contact")
      }

      const savedContact = data

      // Redirect to contact detail or company page
      if (companyIdFromUrl && mode === "create") {
        router.push(`/dashboard/companies/${companyIdFromUrl}`)
      } else {
        router.push(`/dashboard/contacts/${savedContact.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Company Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>
            Select the company this contact belongs to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="company_id">Company</Label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id || ""}
              onChange={handleChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">No company assigned</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Leave empty if contact needs review later
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Person Toggle - Prominent placement */}
      <Card className={formData.show_on_articles ? "ring-2 ring-primary" : ""}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${formData.show_on_articles ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <Star className={`h-5 w-5 ${formData.show_on_articles ? "fill-current" : ""}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="show_on_articles" className="text-base font-semibold cursor-pointer">
                  Key Person / Leader
                </Label>
                <input
                  type="checkbox"
                  id="show_on_articles"
                  name="show_on_articles"
                  checked={formData.show_on_articles || false}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Mark as a key person (founder, CEO, chief scientist, etc.) to feature them on company and article pages.
                Key people can have enhanced profiles with bio, expertise, videos, papers, and books.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Basic contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="e.g., VP of Marketing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              value={formData.linkedin_url || ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_channel_url">YouTube Channel</Label>
            <Input
              id="youtube_channel_url"
              name="youtube_channel_url"
              type="url"
              value={formData.youtube_channel_url || ""}
              onChange={handleChange}
              placeholder="https://youtube.com/@channel"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Photo */}
      {mode === "edit" && contact?.id && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>
              Upload a profile photo (400x400px recommended).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              imageType="avatar"
              value={formData.avatar_url}
              entityType="contact"
              entityId={contact.id}
              onUpload={(url) => {
                setFormData((prev) => ({ ...prev, avatar_url: url }))
              }}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, avatar_url: null }))
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Leader Profile (Bio, Expertise, Highlights) */}
      {mode === "edit" && (
        <Card>
          <CardHeader>
            <CardTitle>Leader Profile</CardTitle>
            <CardDescription>
              Professional bio and expertise for public display. Use &quot;Enhance with AI&quot; to auto-populate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Professional biography for public display..."
                rows={4}
              />
            </div>

            {/* Expertise Tags */}
            <div className="space-y-2">
              <Label>Expertise</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.ai_expertise || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeExpertise(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addExpertise()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addExpertise}>
                  Add
                </Button>
              </div>
            </div>

            {/* Career Highlights */}
            <div className="space-y-2">
              <Label>Career Highlights</Label>
              <div className="space-y-2 mb-2">
                {(formData.ai_highlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded border bg-muted/50">
                    <span className="flex-1 text-sm">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(highlight)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add career highlight..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addHighlight()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addHighlight}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outreach Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Outreach</CardTitle>
          <CardDescription>
            Track outreach progress and internal notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="outreach_status">Outreach Status</Label>
              <select
                id="outreach_status"
                name="outreach_status"
                value={formData.outreach_status || "not_contacted"}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="not_contacted">Not Contacted</option>
                <option value="contacted">Contacted</option>
                <option value="responded">Responded</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                name="source"
                value={formData.source || ""}
                onChange={handleChange}
                placeholder="e.g., Hunter.io, LinkedIn, Referral"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Any notes about this contact..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create Contact" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        {mode === "edit" && contact?.id && (
          <ContactsEnhanceButton
            contactId={contact.id}
            label="Enhance with AI"
            variant="outline"
          />
        )}
      </div>
    </form>

    {/* Leader Media - Outside form since it has its own save logic */}
    {mode === "edit" && contact?.id && (
      <div className="mt-6">
        <ContactEnhancementsEditor
          contactId={contact.id}
          enhancements={enhancements}
        />
      </div>
    )}

    {/* Outreach History - Outside form since it has its own save logic */}
    {mode === "edit" && contact?.id && (
      <div className="mt-6">
        <OutreachLogEditor
          contactId={contact.id}
          entries={outreachLog}
        />
      </div>
    )}
    </>
  )
}

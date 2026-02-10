"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Plus, Sparkles, Loader2, ExternalLink } from "lucide-react"
import type { Company, CompanyInsert, BiologicalSystem } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Switch } from "@/components/ui/switch"

interface CompanyFormProps {
  company?: Company
  mode: "create" | "edit"
}

interface CategoryOption {
  value: string
  label: string
}

const ALL_SYSTEMS: BiologicalSystem[] = [
  "Breath", "Circulation", "Consciousness", "Defense",
  "Detoxification", "Digestive", "Emotional", "Energy Production",
  "Hormonal", "Hydration", "Nervous System", "Regeneration",
  "Stress Response", "Structure & Movement", "Temperature"
]

/**
 * Company Form Component
 *
 * Reusable form for creating and editing companies.
 * Now includes events and research-related fields.
 */
export function CompanyForm({ company, mode }: CompanyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhanceResult, setEnhanceResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState("")
  const [descriptionSources, setDescriptionSources] = useState<{ title: string; url: string }[]>(
    (company as any)?.description_sources || []
  )
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/company-categories")
        if (response.ok) {
          const categories = await response.json()
          setCategoryOptions(
            categories.map((cat: { slug: string; name: string }) => ({
              value: cat.slug,
              label: cat.name,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [])

  // Form state with all fields
  const [formData, setFormData] = useState<CompanyInsert & { domain?: string | null }>({
    name: company?.name || "",
    website: company?.website || null,
    domain: company?.domain || null, // Preserve domain field
    description: company?.description || null,
    analysis: company?.analysis || null,
    function_health_tier: company?.function_health_tier || null,
    status: company?.status || "researching",
    // Research & content fields
    events: company?.events || [],
    category: company?.category || null,
    systems_supported: company?.systems_supported || [],
    differentiators: company?.differentiators || null,
    evidence: company?.evidence || null,
    bioedge_fit: company?.bioedge_fit || null,
    warm_pitch: company?.warm_pitch || null,
    research_notes: company?.research_notes || null,
    researched_at: company?.researched_at || null,
    // Hunter.io enrichment fields (populated by AI Enhance)
    employee_count: company?.employee_count || null,
    industry: company?.industry || null,
    company_type: company?.company_type || null,
    founded_year: company?.founded_year || null,
    technologies: company?.technologies || [],
    linkedin_url: company?.linkedin_url || null,
    twitter_url: company?.twitter_url || null,
    facebook_url: company?.facebook_url || null,
    instagram_url: company?.instagram_url || null,
    hunter_enriched_at: company?.hunter_enriched_at || null,
    // Image fields
    logo_url: company?.logo_url || null,
    logo_storage_path: company?.logo_storage_path || null,
    // AI enhancement fields (populated by AI Enhance)
    ai_summary: company?.ai_summary || null,
    ai_talking_points: company?.ai_talking_points || [],
    ai_enhanced_at: company?.ai_enhanced_at || null,
    // Draft mode - defaults to true for new companies
    is_draft: company?.is_draft ?? true,
  })

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }))
  }

  // Handle adding an event
  const addEvent = () => {
    if (newEvent.trim() && !formData.events.includes(newEvent.trim())) {
      setFormData((prev) => ({
        ...prev,
        events: [...prev.events, newEvent.trim()],
      }))
      setNewEvent("")
    }
  }

  // Handle removing an event
  const removeEvent = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e !== event),
    }))
  }

  // Handle toggling a biological system
  const toggleSystem = (system: BiologicalSystem) => {
    setFormData((prev) => {
      const current = prev.systems_supported || []
      const updated = current.includes(system)
        ? current.filter((s) => s !== system)
        : [...current, system]
      return { ...prev, systems_supported: updated }
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = mode === "create"
        ? "/api/companies"
        : `/api/companies/${company?.id}`

      const method = mode === "create" ? "POST" : "PATCH"

      // Remove domain from payload - it will be auto-extracted by the API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { domain, ...dataToSend } = formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save company")
      }

      const savedCompany = await response.json()

      // Redirect to company detail page
      router.push(`/dashboard/companies/${savedCompany.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle AI enhancement
  const handleEnhance = async () => {
    if (!company?.id) return

    setIsEnhancing(true)
    setEnhanceResult(null)
    setError(null)

    console.log(`[company-form] Starting enhancement for company ID: ${company.id}`)

    try {
      const response = await fetch("/api/enhance-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: company.id }),
      })

      console.log(`[company-form] API response status: ${response.status}`)

      const data = await response.json()
      console.log(`[company-form] API response data:`, data)

      if (!response.ok) {
        throw new Error(data.error || "Enhancement failed")
      }

      // Update local state with new data
      if (data.sources) {
        console.log(`[company-form] Updating sources:`, data.sources.length, 'sources')
        setDescriptionSources(data.sources)
      }

      // Update form fields with enhanced data
      if (data.updatedCompany) {
        console.log(`[company-form] Updating form with enhanced data:`, {
          hasDescription: !!data.updatedCompany.description,
          hasDifferentiators: !!data.updatedCompany.differentiators,
          hasEvidence: !!data.updatedCompany.evidence,
          systemsCount: data.updatedCompany.systems_supported?.length || 0,
        })
        setFormData(prev => ({
          ...prev,
          description: data.updatedCompany.description || prev.description,
          differentiators: data.updatedCompany.differentiators || prev.differentiators,
          evidence: data.updatedCompany.evidence || prev.evidence,
          systems_supported: data.updatedCompany.systems_supported || prev.systems_supported,
        }))
      } else {
        console.log(`[company-form] No updatedCompany in response - form fields won't be updated`)
      }

      // Build result message
      const parts: string[] = []
      if (data.fieldsUpdated?.length > 0) {
        parts.push(`Updated: ${data.fieldsUpdated.join(", ")}`)
      }
      if (data.contactsCreated > 0) {
        parts.push(`Created ${data.contactsCreated} new contact(s)`)
      }

      const resultMsg = parts.length > 0 ? parts.join(". ") : "No new information found"
      console.log(`[company-form] Enhancement result: ${resultMsg}`)
      setEnhanceResult(resultMsg)

      // Refresh to get updated data
      router.refresh()
    } catch (err) {
      console.error(`[company-form] Enhancement error:`, err)
      setError(err instanceof Error ? err.message : "Enhancement failed")
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {enhanceResult && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4 text-green-800">
          <div className="font-medium">Enhancement Complete</div>
          <div className="text-sm">{enhanceResult}</div>
        </div>
      )}

      {/* AI Enhancement Card */}
      {mode === "edit" && company?.id && (
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  AI Enhancement
                </h3>
                <p className="text-sm text-muted-foreground">
                  Research this company using AI to populate description, differentiators, evidence, and discover key contacts.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </div>
            {/* Show sources if available */}
            {descriptionSources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gold/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {descriptionSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold/80 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the company&apos;s basic details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Function Health"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select category...</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              Domain will be auto-extracted for Hunter.io enrichment.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief description of what the company does..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Logo */}
      {mode === "edit" && company?.id && (
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
            <CardDescription>
              Upload a logo image (will be scaled to fit 400x400px).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              imageType="logo"
              value={formData.logo_url}
              entityType="company"
              entityId={company.id}
              cropToFit={false}
              onUpload={(url, storagePath) => {
                setFormData((prev) => ({
                  ...prev,
                  logo_url: url,
                  logo_storage_path: storagePath,
                }))
              }}
              onRemove={() => {
                setFormData((prev) => ({
                  ...prev,
                  logo_url: null,
                  logo_storage_path: null,
                }))
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Events */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Track which events you noticed this company at
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="e.g., Biohacking Conference 2024"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addEvent()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addEvent}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.events.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.events.map((event) => (
                <Badge key={event} variant="secondary" className="gap-1">
                  {event}
                  <button
                    type="button"
                    onClick={() => removeEvent(event)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Systems Supported */}
      <Card>
        <CardHeader>
          <CardTitle>Systems Supported</CardTitle>
          <CardDescription>
            Which of the 15 biological systems does this company&apos;s solutions support?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_SYSTEMS.map((system) => (
              <Badge
                key={system}
                variant={formData.systems_supported?.includes(system) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSystem(system)}
              >
                {system}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Status</CardTitle>
          <CardDescription>
            Track the company&apos;s position in your pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_draft">Draft Mode</Label>
              <p className="text-sm text-muted-foreground">
                Draft companies won&apos;t appear on public pages
              </p>
            </div>
            <Switch
              id="is_draft"
              checked={formData.is_draft ?? true}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, is_draft: checked }))
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="researching">Researching</option>
              <option value="article_draft">Article Draft</option>
              <option value="published">Published</option>
              <option value="outreach">Outreach</option>
              <option value="engaged">Engaged</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Research & Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Research & Analysis</CardTitle>
          <CardDescription>
            Your research notes and company analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="differentiators">Key Differentiators</Label>
            <Textarea
              id="differentiators"
              name="differentiators"
              value={formData.differentiators || ""}
              onChange={handleChange}
              placeholder="What sets this company apart from competitors?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence / Credibility</Label>
            <Textarea
              id="evidence"
              name="evidence"
              value={formData.evidence || ""}
              onChange={handleChange}
              placeholder="Clinical studies, expert endorsements, certifications, funding..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bioedge_fit">bioEDGE Fit</Label>
            <Textarea
              id="bioedge_fit"
              name="bioedge_fit"
              value={formData.bioedge_fit || ""}
              onChange={handleChange}
              placeholder="Why does this company align with bioEDGE audience and editorial standards?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis">General Analysis</Label>
            <Textarea
              id="analysis"
              name="analysis"
              value={formData.analysis || ""}
              onChange={handleChange}
              placeholder="Additional analysis notes..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Warm Pitch */}
      <Card>
        <CardHeader>
          <CardTitle>Warm Pitch Email</CardTitle>
          <CardDescription>
            Draft pitch email for outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              id="warm_pitch"
              name="warm_pitch"
              value={formData.warm_pitch || ""}
              onChange={handleChange}
              placeholder="Draft your outreach email..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create Company" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

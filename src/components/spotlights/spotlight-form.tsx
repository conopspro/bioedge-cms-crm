"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Play,
  Loader2,
  Search,
  X,
  Building2,
  User,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  GripVertical,
  Users,
  Trash2,
} from "lucide-react"
import type {
  Spotlight,
  PresentationStatus,
  Company,
  Contact,
  Article,
  PanelistRole,
  SpotlightPanelist,
} from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { SearchSelect } from "@/components/ui/search-select"

// Partial types for the data passed from the page
interface PartialContact {
  id: string
  first_name: string
  last_name: string
  title: string | null
  show_on_articles: boolean | null
  company_id: string | null
  bio?: string | null
}

interface PartialCompany {
  id: string
  name: string
  logo_url?: string | null
  description?: string | null
}

interface PartialArticle {
  id: string
  title: string
  slug: string
  company_id: string
  excerpt?: string | null
}

// Panelist in the form (before saving)
interface FormPanelist {
  id?: string // Only set for existing panelists when editing
  contact_id: string
  role: PanelistRole
  company_id: string | null // Override company
  article_id: string | null // Related article
  display_order: number
}

interface SpotlightFormProps {
  spotlight?: Spotlight & {
    contact?: Contact | null
    company?: Company | null
    article?: Article | null
  }
  existingPanelists?: SpotlightPanelist[]
  companies: PartialCompany[]
  contacts: PartialContact[]
  articles: PartialArticle[]
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

const PANELIST_ROLES: { value: PanelistRole; label: string }[] = [
  { value: "moderator", label: "Moderator" },
  { value: "panelist", label: "Panelist" },
  { value: "presenter", label: "Presenter" },
  { value: "host", label: "Host" },
  { value: "guest", label: "Guest" },
]

/**
 * Spotlight Form Component
 *
 * Form for creating and editing spotlights with AI-assisted content generation.
 * Supports multiple panelists (up to 10) with individual company/article associations.
 */
export function SpotlightForm({
  spotlight,
  existingPanelists = [],
  companies,
  contacts,
  articles,
}: SpotlightFormProps) {
  const router = useRouter()
  const isEditing = !!spotlight

  // Form state
  const [title, setTitle] = useState(spotlight?.title || "")
  const [shortDescription, setShortDescription] = useState(
    spotlight?.short_description || ""
  )
  const [longDescription, setLongDescription] = useState(
    spotlight?.long_description || ""
  )
  const [recordingUrl, setRecordingUrl] = useState(spotlight?.recording_url || "")
  const [recordingMetadata, setRecordingMetadata] = useState<any>(
    spotlight?.recording_metadata || null
  )
  const [status, setStatus] = useState<PresentationStatus>(
    spotlight?.status || "draft"
  )

  // Panelists state - initialize from existing or legacy single contact
  const [panelists, setPanelists] = useState<FormPanelist[]>(() => {
    if (existingPanelists.length > 0) {
      return existingPanelists.map((p) => ({
        id: p.id,
        contact_id: p.contact_id,
        role: p.role,
        company_id: p.company_id,
        article_id: p.article_id,
        display_order: p.display_order,
      }))
    }
    // Migrate legacy single contact/company/article
    if (spotlight?.contact_id) {
      return [{
        contact_id: spotlight.contact_id,
        role: "presenter" as PanelistRole,
        company_id: spotlight.company_id,
        article_id: spotlight.article_id,
        display_order: 0,
      }]
    }
    return []
  })

  // AI state
  const [aiNotes, setAiNotes] = useState("")
  const [showAiNotes, setShowAiNotes] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [showTranscript, setShowTranscript] = useState(false)
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([])
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)
  const [isGeneratingDescriptions, setIsGeneratingDescriptions] = useState(false)

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingVideo, setIsFetchingVideo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to get contact details
  const getContact = (contactId: string) => contacts.find((c) => c.id === contactId)
  const getCompany = (companyId: string | null) => companyId ? companies.find((c) => c.id === companyId) : null
  const getArticle = (articleId: string | null) => articleId ? articles.find((a) => a.id === articleId) : null

  // Get articles filtered by company
  const getFilteredArticles = (companyId: string | null) => {
    if (!companyId) return articles
    return articles.filter((a) => a.company_id === companyId)
  }

  // Check if we have any context for AI
  const hasContext = panelists.length > 0 || aiNotes.trim() || transcript.trim()

  // Build AI context from all panelists
  const buildAiContext = () => {
    const leaders = panelists.map((p) => {
      const contact = getContact(p.contact_id)
      const company = getCompany(p.company_id || contact?.company_id || null)
      const article = getArticle(p.article_id)
      return {
        name: contact ? `${contact.first_name} ${contact.last_name}` : "",
        title: contact?.title,
        bio: contact?.bio,
        role: p.role,
        company: company?.name,
        article: article?.title,
      }
    }).filter((l) => l.name)

    return {
      notes: aiNotes.trim() || undefined,
      transcript: transcript.trim() || undefined,
      leaders: leaders.length > 0 ? leaders : undefined,
      // For backwards compatibility, also send first leader as primary
      leader: leaders[0] || undefined,
      company: leaders[0]?.company ? { name: leaders[0].company } : undefined,
      article: leaders[0]?.article ? { title: leaders[0].article } : undefined,
    }
  }

  // Add a new panelist
  const addPanelist = () => {
    if (panelists.length >= 10) return
    setPanelists([
      ...panelists,
      {
        contact_id: "",
        role: "presenter",
        company_id: null,
        article_id: null,
        display_order: panelists.length,
      },
    ])
  }

  // Remove a panelist
  const removePanelist = (index: number) => {
    const updated = panelists.filter((_, i) => i !== index)
    // Reorder
    setPanelists(updated.map((p, i) => ({ ...p, display_order: i })))
  }

  // Update a panelist field
  const updatePanelist = (index: number, field: keyof FormPanelist, value: any) => {
    const updated = [...panelists]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-populate company when contact changes
    if (field === "contact_id" && value) {
      const contact = contacts.find((c) => c.id === value)
      if (contact?.company_id) {
        updated[index].company_id = contact.company_id
        // Auto-select article if only one exists
        const companyArticles = articles.filter((a) => a.company_id === contact.company_id)
        if (companyArticles.length === 1) {
          updated[index].article_id = companyArticles[0].id
        }
      }
    }

    // Clear article if company changes and article doesn't match
    if (field === "company_id") {
      const currentArticle = updated[index].article_id
      if (currentArticle) {
        const article = articles.find((a) => a.id === currentArticle)
        if (article && article.company_id !== value) {
          updated[index].article_id = null
        }
      }
    }

    setPanelists(updated)
  }

  // Move panelist up/down
  const movePanelist = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === panelists.length - 1)
    ) {
      return
    }
    const newIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...panelists]
    const [removed] = updated.splice(index, 1)
    updated.splice(newIndex, 0, removed)
    setPanelists(updated.map((p, i) => ({ ...p, display_order: i })))
  }

  // Generate title suggestions
  const handleGenerateTitles = async () => {
    setIsGeneratingTitles(true)
    setError(null)
    setTitleSuggestions([])

    try {
      const response = await fetch("/api/ai-presentation-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "titles",
          contentType: "spotlight",
          ...buildAiContext(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate titles")
      }

      const data = await response.json()
      if (data.titles && data.titles.length > 0) {
        setTitleSuggestions(data.titles)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate titles")
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  // Select a suggested title
  const handleSelectTitle = (suggestedTitle: string) => {
    setTitle(suggestedTitle)
    setTitleSuggestions([])
  }

  // Generate descriptions
  const handleGenerateDescriptions = async () => {
    if (!title.trim()) return

    setIsGeneratingDescriptions(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-presentation-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "descriptions",
          contentType: "spotlight",
          title: title.trim(),
          ...buildAiContext(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate descriptions")
      }

      const data = await response.json()

      if (data.short_description) {
        setShortDescription(data.short_description)
      }
      if (data.long_description) {
        setLongDescription(data.long_description)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate descriptions")
    } finally {
      setIsGeneratingDescriptions(false)
    }
  }

  // YouTube video fetch
  const handleFetchVideo = async () => {
    if (!recordingUrl.trim()) return

    const videoId = extractYouTubeId(recordingUrl)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }

    setIsFetchingVideo(true)
    setError(null)

    try {
      const response = await fetch(`/api/youtube-search?videoId=${videoId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch video details")
      }

      const data = await response.json()
      if (data.metadata) {
        setRecordingMetadata(data.metadata)
      }
    } catch (err) {
      console.error("Failed to fetch video:", err)
      setRecordingMetadata({
        videoId,
        channel: "",
        duration: "",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      })
    } finally {
      setIsFetchingVideo(false)
    }
  }

  const handleClearVideo = () => {
    setRecordingUrl("")
    setRecordingMetadata(null)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      setIsSubmitting(false)
      return
    }

    // Validate panelists have contacts selected
    const validPanelists = panelists.filter((p) => p.contact_id)
    if (validPanelists.length === 0) {
      setError("Please add at least one panelist/speaker")
      setIsSubmitting(false)
      return
    }

    try {
      // Auto-generate embed URL from recording URL
      let embedUrl = null
      let metadata = recordingMetadata

      if (recordingUrl.trim()) {
        const videoId = extractYouTubeId(recordingUrl.trim())
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`
          if (!metadata) {
            metadata = {
              videoId,
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }
          }
        }
      }

      // For backwards compatibility, set primary contact/company/article from first panelist
      const primaryPanelist = validPanelists[0]
      const primaryContact = getContact(primaryPanelist.contact_id)

      const spotlightData = {
        title: title.trim(),
        short_description: shortDescription.trim() || null,
        long_description: longDescription.trim() || null,
        // Legacy fields - use first panelist
        contact_id: primaryPanelist.contact_id || null,
        company_id: primaryPanelist.company_id || primaryContact?.company_id || null,
        article_id: primaryPanelist.article_id || null,
        recording_url: recordingUrl.trim() || null,
        recording_embed: embedUrl,
        recording_metadata: metadata,
        // Auto-set youtube_url for thumbnail from recording URL
        youtube_url: recordingUrl.trim() || null,
        status,
        // New panelists array
        panelists: validPanelists.map((p, index) => ({
          id: p.id, // Include ID for updates
          contact_id: p.contact_id,
          role: p.role,
          company_id: p.company_id,
          article_id: p.article_id,
          display_order: index,
        })),
      }

      const url = isEditing ? `/api/spotlights/${spotlight.id}` : "/api/spotlights"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotlightData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save spotlight")
      }

      const saved = await response.json()
      router.push(`/dashboard/spotlights/${saved.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
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

      {/* Panelists/Speakers Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Speakers & Panelists
          </CardTitle>
          <CardDescription>
            Add up to 10 speakers. Each can have their own company and article association.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Panelists List */}
          {panelists.map((panelist, index) => {
            const contact = getContact(panelist.contact_id)
            const companyId = panelist.company_id || contact?.company_id || null
            const filteredArticles = getFilteredArticles(companyId)

            return (
              <div
                key={index}
                className="rounded-lg border bg-muted/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    {panelist.role === "moderator" && (
                      <Badge className="text-xs bg-amber-500">Moderator</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePanelist(index, "up")}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePanelist(index, "down")}
                      disabled={index === panelists.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePanelist(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Leader Selection */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" />
                      Leader *
                    </Label>
                    <SearchSelect
                      options={contacts
                        .filter((c) => c.show_on_articles)
                        .map((c) => ({
                          value: c.id,
                          label: `${c.first_name} ${c.last_name}`,
                          sublabel: c.title || undefined,
                        }))}
                      value={panelist.contact_id}
                      onValueChange={(v) => updatePanelist(index, "contact_id", v)}
                      placeholder="Search leaders..."
                      searchPlaceholder="Type a name..."
                      emptyMessage="No leaders found"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role</Label>
                    <Select
                      value={panelist.role}
                      onValueChange={(v) => updatePanelist(index, "role", v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PANELIST_ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs">
                      <Building2 className="h-3 w-3" />
                      Company
                    </Label>
                    <SearchSelect
                      options={companies.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      value={companyId || ""}
                      onValueChange={(v) => updatePanelist(index, "company_id", v || null)}
                      placeholder="Select company..."
                      searchPlaceholder="Type a name..."
                      emptyMessage="No companies found"
                    />
                  </div>

                  {/* Article */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs">
                      <FileText className="h-3 w-3" />
                      Article
                      {companyId && filteredArticles.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          ({filteredArticles.length})
                        </span>
                      )}
                    </Label>
                    <SearchSelect
                      options={filteredArticles.map((a) => ({
                        value: a.id,
                        label: a.title,
                      }))}
                      value={panelist.article_id || ""}
                      onValueChange={(v) => updatePanelist(index, "article_id", v || null)}
                      placeholder={companyId ? "Select article..." : "Select company first"}
                      searchPlaceholder="Type to search..."
                      emptyMessage={companyId ? "No articles" : "Select company first"}
                      disabled={!companyId}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add Panelist Button */}
          {panelists.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={addPanelist}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {panelists.length === 0 ? "Speaker" : "Another Speaker"}
              <span className="text-muted-foreground ml-2">
                ({panelists.length}/10)
              </span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Spotlight Details</CardTitle>
          <CardDescription>
            Use AI to help generate titles and descriptions based on your speakers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Notes */}
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAiNotes(!showAiNotes)}
              className="text-xs text-muted-foreground h-auto p-0"
            >
              {showAiNotes ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide additional notes for AI
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Add notes to guide AI generation
                </>
              )}
            </Button>

            {showAiNotes && (
              <Textarea
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                placeholder="e.g., Focus on NAD+ supplementation, target audience is health-conscious professionals..."
                rows={2}
                className="mt-2 text-sm"
              />
            )}
          </div>

          {/* Transcript */}
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs text-muted-foreground h-auto p-0"
            >
              {showTranscript ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide transcript
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Paste transcript from YouTube
                </>
              )}
              {!showTranscript && transcript.trim() && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Transcript added
                </Badge>
              )}
            </Button>

            {showTranscript && (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the YouTube transcript here. The AI will use it to extract specific topics, insights, and key points for more accurate descriptions..."
                  rows={6}
                  className="text-sm font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  {transcript.trim() ? `${transcript.trim().split(/\s+/).length.toLocaleString()} words` : "Tip: Open the YouTube video, click ··· below, then \"Show transcript\" to copy it."}
                </p>
              </div>
            )}
          </div>

          {/* Title with AI Suggestions */}
          <div className="rounded-lg border-2 border-[#ff914d]/30 bg-[#ff914d]/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-[#ff914d]/50 text-[#ff914d]">
                  AI Assist
                </Badge>
                <p className="text-sm font-medium">Title</p>
              </div>
              <Sparkles className="h-4 w-4 text-[#ff914d]" />
            </div>

            {/* Show context badges */}
            {hasContext && (
              <div className="flex flex-wrap gap-2">
                {panelists.filter((p) => p.contact_id).map((p, i) => {
                  const contact = getContact(p.contact_id)
                  if (!contact) return null
                  return (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      {contact.first_name} {contact.last_name}
                      {p.role === "moderator" && " (Mod)"}
                    </Badge>
                  )
                })}
                {aiNotes.trim() && (
                  <Badge variant="secondary" className="text-xs">
                    + Notes
                  </Badge>
                )}
                {transcript.trim() && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Transcript
                  </Badge>
                )}
              </div>
            )}

            {/* Generate titles button */}
            <Button
              type="button"
              onClick={handleGenerateTitles}
              disabled={isGeneratingTitles || !hasContext}
              variant="outline"
              className="w-full border-[#ff914d]/50 text-[#ff914d] hover:bg-[#ff914d]/10"
            >
              {isGeneratingTitles ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating titles...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Suggest Titles
                </>
              )}
            </Button>

            {/* Title suggestions */}
            {titleSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Click to select:</p>
                <div className="space-y-2">
                  {titleSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectTitle(suggestion)}
                      className="w-full text-left p-3 rounded-md border bg-background hover:bg-muted/50 hover:border-[#ff914d]/50 transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs text-muted-foreground">
                Or type your own title:
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Future of Longevity Medicine"
              />
            </div>

            {!hasContext && (
              <p className="text-xs text-muted-foreground text-center">
                Add speakers above to enable AI suggestions
              </p>
            )}
          </div>

          {/* Generate Descriptions */}
          <div className="rounded-lg border-2 border-[#ff914d]/30 bg-[#ff914d]/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-[#ff914d]/50 text-[#ff914d]">
                AI Assist
              </Badge>
              <p className="text-sm font-medium">Descriptions</p>
            </div>

            <Button
              type="button"
              onClick={handleGenerateDescriptions}
              disabled={isGeneratingDescriptions || !title.trim()}
              className="w-full bg-[#ff914d] hover:bg-[#ff914d]/90 text-white"
            >
              {isGeneratingDescriptions ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating descriptions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Descriptions
                </>
              )}
            </Button>

            {!title.trim() && (
              <p className="text-xs text-muted-foreground text-center">
                Enter or select a title first
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Short Description (~100 words)
            </Label>
            <Textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary for listings and cards..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {shortDescription.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Long Description */}
          <div className="space-y-2">
            <Label htmlFor="longDescription">
              Long Description (~400 words)
            </Label>
            <Textarea
              id="longDescription"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Full description for the detail page..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              {longDescription.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as PresentationStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recording */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Recording
          </CardTitle>
          <CardDescription>
            Add the YouTube video for this spotlight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recordingUrl">YouTube URL</Label>
            <div className="flex gap-2">
              <Input
                id="recordingUrl"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFetchVideo}
                disabled={!recordingUrl.trim() || isFetchingVideo}
              >
                {isFetchingVideo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {recordingMetadata && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start gap-4">
                {recordingMetadata.thumbnail && (
                  <img
                    src={recordingMetadata.thumbnail}
                    alt=""
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Video Preview</p>
                  {recordingMetadata.channel && (
                    <p className="text-xs text-muted-foreground">
                      {recordingMetadata.channel}
                    </p>
                  )}
                  {recordingMetadata.duration && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {recordingMetadata.duration}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Spotlight"
            : "Create Spotlight"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  User,
  FileText,
  Play,
  ExternalLink,
  Pencil,
  X,
  Check,
  Search,
  Loader2,
  Calendar,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { getYouTubeThumbnailUrl, extractYouTubeVideoId } from "@/lib/youtube"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { PresentationStatus, Company, Contact, Article, YouTubeEnhancementMetadata, PanelistRole } from "@/types/database"

interface Spotlight {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  contact_id: string | null
  company_id: string | null
  article_id: string | null
  recording_url: string | null
  recording_embed: string | null
  recording_metadata: YouTubeEnhancementMetadata | null
  youtube_url: string | null
  status: PresentationStatus
  created_at: string
  updated_at: string
}

interface PanelistWithDetails {
  id: string
  contact_id: string
  role: PanelistRole
  company_id: string | null
  article_id: string | null
  display_order: number
  notes: string | null
  contact: {
    id: string
    first_name: string
    last_name: string
    title: string | null
    avatar_url: string | null
    slug: string | null
    company_id: string | null
    bio: string | null
  } | null
  company: {
    id: string
    name: string
    logo_url: string | null
    slug: string | null
  } | null
  article: {
    id: string
    title: string
    slug: string
  } | null
}

interface SpotlightDetailEditorProps {
  spotlight: Spotlight
  contact: Pick<Contact, "id" | "first_name" | "last_name" | "title" | "avatar_url" | "slug"> | null
  company: Pick<Company, "id" | "name" | "logo_url" | "domain" | "slug"> | null
  article: Pick<Article, "id" | "title" | "slug"> | null
  panelists?: PanelistWithDetails[]
  companies: Pick<Company, "id" | "name">[]
  contacts: Pick<Contact, "id" | "first_name" | "last_name" | "title" | "show_on_articles">[]
  articles: Pick<Article, "id" | "title">[]
}

const roleLabels: Record<PanelistRole, string> = {
  moderator: "Moderator",
  panelist: "Panelist",
  presenter: "Presenter",
  host: "Host",
  guest: "Guest",
}

const statusColors: Record<string, "default" | "secondary" | "success"> = {
  draft: "secondary",
  published: "success",
  archived: "default",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

function EditableCard({
  title,
  description,
  section,
  fields,
  children,
  editContent,
  emptyState,
  editingSection,
  isSaving,
  spotlight,
  onStartEditing,
  onCancelEditing,
  onSave,
}: {
  title: string
  description?: string
  section: string
  fields: string[]
  children: React.ReactNode
  editContent: React.ReactNode
  emptyState?: React.ReactNode
  editingSection: string | null
  isSaving: boolean
  spotlight: Record<string, any>
  onStartEditing: (section: string) => void
  onCancelEditing: () => void
  onSave: (fields: string[]) => void
}) {
  const isEditing = editingSection === section

  const hasContent = fields.some((field) => {
    const value = spotlight[field]
    if (Array.isArray(value)) return value.length > 0
    return !!value
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={onCancelEditing} disabled={isSaving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => onSave(fields)} disabled={isSaving}>
                {isSaving ? "Saving..." : <Check className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => onStartEditing(section)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? editContent : hasContent ? children : emptyState || children}
      </CardContent>
    </Card>
  )
}

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

export function SpotlightDetailEditor({
  spotlight: initialSpotlight,
  contact: initialContact,
  company: initialCompany,
  article: initialArticle,
  panelists: initialPanelists = [],
  companies,
  contacts,
  articles,
}: SpotlightDetailEditorProps) {
  const router = useRouter()
  const [spotlight, setSpotlight] = useState(initialSpotlight)
  const [contact, setContact] = useState(initialContact)
  const [company, setCompany] = useState(initialCompany)
  const [article, setArticle] = useState(initialArticle)
  const [panelists, setPanelists] = useState(initialPanelists)

  // Edit states
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isFetchingVideo, setIsFetchingVideo] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // AI assist states
  const [transcript, setTranscript] = useState("")
  const [showTranscript, setShowTranscript] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Form data
  const [formData, setFormData] = useState({ ...initialSpotlight })

  const startEditing = (section: string) => {
    setFormData({ ...spotlight })
    setEditingSection(section)
  }

  const cancelEditing = () => {
    setFormData({ ...spotlight })
    setEditingSection(null)
  }

  const saveSection = async (fields: string[]) => {
    setIsSaving(true)
    const supabase = createClient()

    const updateData: Record<string, any> = {}
    fields.forEach((field) => {
      updateData[field] = formData[field as keyof typeof formData]
    })

    // Auto-generate embed URL if recording_url is present but embed is missing
    if (fields.includes("recording_url") && updateData.recording_url) {
      const videoId = extractYouTubeId(updateData.recording_url)
      if (videoId) {
        // Always set embed URL from the video ID
        updateData.recording_embed = `https://www.youtube.com/embed/${videoId}`
        // If metadata is missing, create basic metadata
        if (!updateData.recording_metadata) {
          updateData.recording_metadata = {
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          }
        }
      }
    }

    const { error } = await supabase
      .from("spotlights")
      .update(updateData)
      .eq("id", spotlight.id)

    if (!error) {
      setSpotlight({ ...spotlight, ...updateData })

      // Update related entities if changed
      if (fields.includes("contact_id")) {
        const newContact = contacts.find((c) => c.id === formData.contact_id) || null
        setContact(newContact as any)
      }
      if (fields.includes("company_id")) {
        const newCompany = companies.find((c) => c.id === formData.company_id) || null
        setCompany(newCompany as any)
      }
      if (fields.includes("article_id")) {
        const newArticle = articles.find((a) => a.id === formData.article_id) || null
        setArticle(newArticle as any)
      }

      setEditingSection(null)
      router.refresh()
    }
    setIsSaving(false)
  }

  const handleFetchVideo = async () => {
    if (!formData.recording_url?.trim()) return

    const videoId = extractYouTubeId(formData.recording_url)
    if (!videoId) return

    setIsFetchingVideo(true)
    try {
      const response = await fetch(`/api/youtube-search?videoId=${videoId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.metadata) {
          setFormData({
            ...formData,
            recording_metadata: data.metadata,
            recording_embed: `https://www.youtube.com/embed/${videoId}`,
          })
        }
      } else {
        // Fallback
        setFormData({
          ...formData,
          recording_metadata: {
            videoId,
            channel: "",
            duration: "",
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          },
          recording_embed: `https://www.youtube.com/embed/${videoId}`,
        })
      }
    } catch (err) {
      console.error("Failed to fetch video:", err)
    }
    setIsFetchingVideo(false)
  }

  const handleAiGenerate = async () => {
    if (!formData.title?.trim()) return

    setIsGenerating(true)
    try {
      // Build leader context from panelists
      const leaders = panelists
        .filter((p) => p.contact)
        .map((p) => ({
          name: p.contact ? `${p.contact.first_name} ${p.contact.last_name}` : "",
          title: p.contact?.title || undefined,
          bio: p.contact?.bio || undefined,
          role: p.role,
          company: p.company?.name || undefined,
        }))

      const response = await fetch("/api/ai-presentation-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "descriptions",
          contentType: "spotlight",
          title: formData.title.trim(),
          transcript: transcript.trim() || undefined,
          leaders: leaders.length > 0 ? leaders : undefined,
          leader: leaders[0] || undefined,
          company: company ? { name: company.name } : undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          ...formData,
          short_description: data.short_description || formData.short_description,
          long_description: data.long_description || formData.long_description,
        })
      } else {
        console.error("Failed to generate descriptions")
      }
    } catch (err) {
      console.error("AI generation error:", err)
    }
    setIsGenerating(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this spotlight?")) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("spotlights")
      .delete()
      .eq("id", spotlight.id)

    if (!error) {
      router.push("/dashboard/spotlight")
      router.refresh()
    } else {
      console.error("Failed to delete:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column - Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title & Descriptions */}
        <EditableCard
          title="Content"
          description="Title and descriptions"
          section="content"
          fields={["title", "short_description", "long_description"]}
          editingSection={editingSection}
          isSaving={isSaving}
          spotlight={spotlight}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Short Description (~100 words)</Label>
                <Textarea
                  value={formData.short_description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.short_description || "").split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
              <div className="space-y-2">
                <Label>Long Description (~400 words)</Label>
                <Textarea
                  value={formData.long_description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, long_description: e.target.value })
                  }
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.long_description || "").split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              {/* AI Assist */}
              <Separator />
              <div className="rounded-lg border-2 border-[#ff914d]/30 bg-[#ff914d]/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-[#ff914d]/50 text-[#ff914d]">
                    AI Assist
                  </Badge>
                  <p className="text-sm font-medium">Generate descriptions from transcript</p>
                </div>

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

                <Button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !formData.title?.trim()}
                  className="w-full bg-[#ff914d] hover:bg-[#ff914d]/90 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating descriptions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {transcript.trim() ? "Generate from Transcript" : "Generate Descriptions"}
                    </>
                  )}
                </Button>

                {!formData.title?.trim() && (
                  <p className="text-xs text-muted-foreground text-center">
                    Add a title above first
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  This will replace the current descriptions above
                </p>
              </div>
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">No description added</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("content")}>
                Add Description
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">{spotlight.title}</h2>
            {spotlight.short_description && (
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Summary</p>
                <p className="text-sm leading-relaxed text-foreground/90">{spotlight.short_description}</p>
              </div>
            )}
            {spotlight.long_description && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Full Description</p>
                <div className="prose prose-sm max-w-none text-foreground/90">
                  {spotlight.long_description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </EditableCard>

        {/* Recording */}
        <EditableCard
          title="Recording"
          description="YouTube video recording"
          section="recording"
          fields={["recording_url", "recording_embed", "recording_metadata"]}
          editingSection={editingSection}
          isSaving={isSaving}
          spotlight={spotlight}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.recording_url || ""}
                    onChange={(e) => setFormData({ ...formData, recording_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFetchVideo}
                    disabled={!formData.recording_url?.trim() || isFetchingVideo}
                  >
                    {isFetchingVideo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {formData.recording_metadata && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    {formData.recording_metadata.thumbnail && (
                      <img
                        src={formData.recording_metadata.thumbnail}
                        alt=""
                        className="w-32 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Video Preview</p>
                      {formData.recording_metadata.channel && (
                        <p className="text-xs text-muted-foreground">
                          {formData.recording_metadata.channel}
                        </p>
                      )}
                      {formData.recording_metadata.duration && (
                        <p className="text-xs text-muted-foreground">
                          Duration: {formData.recording_metadata.duration}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          recording_url: "",
                          recording_embed: null,
                          recording_metadata: null,
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <Play className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No recording added</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("recording")}>
                Add Recording
              </Button>
            </div>
          }
        >
          {spotlight.recording_embed && (
            <div className="space-y-4">
              {spotlight.recording_embed && (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={spotlight.recording_embed}
                    title="Video recording"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {spotlight.recording_metadata?.channel && (
                  <span>{spotlight.recording_metadata.channel}</span>
                )}
                {spotlight.recording_metadata?.duration && (
                  <>
                    <span>•</span>
                    <span>{spotlight.recording_metadata.duration}</span>
                  </>
                )}
                {spotlight.recording_url && (
                  <a
                    href={spotlight.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline ml-auto"
                  >
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </EditableCard>

      </div>

      {/* Right column - Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {spotlight.status === "published" && (
              <Button variant="outline" asChild className="w-full">
                <a
                  href={`/spotlight/${spotlight.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </a>
              </Button>
            )}
            <Separator className="my-3" />
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <EditableCard
          title="Status"
          section="status"
          fields={["status"]}
          editingSection={editingSection}
          isSaving={isSaving}
          spotlight={spotlight}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as PresentationStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Status</span>
            <Badge variant={statusColors[spotlight.status]}>
              {statusLabels[spotlight.status]}
            </Badge>
          </div>
        </EditableCard>

        {/* Featured Thumbnail */}
        <EditableCard
          title="Featured Thumbnail"
          description="YouTube video for thumbnail image"
          section="youtube_url"
          fields={["youtube_url"]}
          editingSection={editingSection}
          isSaving={isSaving}
          spotlight={spotlight}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>YouTube URL for Thumbnail</Label>
                <Input
                  value={formData.youtube_url || ""}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  The thumbnail from this video will be used as the spotlight&apos;s featured image in listings.
                </p>
              </div>
              {formData.youtube_url && extractYouTubeVideoId(formData.youtube_url) && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={getYouTubeThumbnailUrl(formData.youtube_url, "hqdefault") || ""}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Thumbnail Preview</p>
                      <p className="text-xs text-muted-foreground">
                        This image will be used in spotlight cards and listings.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ ...formData, youtube_url: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No thumbnail set</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("youtube_url")}>
                Add Thumbnail
              </Button>
            </div>
          }
        >
          {spotlight.youtube_url && (
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={getYouTubeThumbnailUrl(spotlight.youtube_url, "hqdefault") || ""}
                  alt="Featured thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Thumbnail from YouTube video
              </p>
            </div>
          )}
        </EditableCard>

        {/* Speakers & Panelists */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Speakers & Panelists</CardTitle>
                <CardDescription>
                  {panelists.length > 0 ? `${panelists.length} speaker${panelists.length > 1 ? 's' : ''}` : 'No speakers assigned'}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/spotlight/new?edit=${spotlight.id}`}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {panelists.length > 0 ? (
              <div className="space-y-3">
                {panelists.map((panelist) => (
                  <div
                    key={panelist.id}
                    className="flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors"
                  >
                    {panelist.contact?.avatar_url ? (
                      <img
                        src={panelist.contact.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/dashboard/contacts/${panelist.contact?.id}`}
                          className="font-medium truncate hover:underline"
                        >
                          {panelist.contact?.first_name} {panelist.contact?.last_name}
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {roleLabels[panelist.role]}
                        </Badge>
                      </div>
                      {panelist.contact?.title && (
                        <p className="text-xs text-muted-foreground truncate">
                          {panelist.contact.title}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {panelist.company && (
                          <Link
                            href={`/dashboard/companies/${panelist.company.id}`}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Building2 className="h-3 w-3" />
                            {panelist.company.name}
                          </Link>
                        )}
                        {panelist.article && (
                          <Link
                            href={`/dashboard/articles/${panelist.article.id}`}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <FileText className="h-3 w-3" />
                            {panelist.article.title.length > 25
                              ? panelist.article.title.substring(0, 25) + '...'
                              : panelist.article.title}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : contact ? (
              /* Fallback to legacy single contact if no panelists */
              <Link
                href={`/dashboard/contacts/${contact.id}`}
                className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors"
              >
                {contact.avatar_url ? (
                  <img
                    src={contact.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {contact.first_name} {contact.last_name}
                  </p>
                  {contact.title && (
                    <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                  )}
                </div>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No speakers assigned. Click Edit to add speakers.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Record Info */}
        <Card>
          <CardHeader>
            <CardTitle>Record Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="font-medium">
                  {new Date(spotlight.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(spotlight.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Slug</span>
                  {editingSection !== "slug" && (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEditing("slug")}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {editingSection === "slug" ? (
                  <div className="mt-1 space-y-2">
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="font-mono text-xs h-8"
                    />
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancelEditing}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="default" size="sm" className="h-7 w-7 p-0" onClick={() => saveSection(["slug"])} disabled={isSaving}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="font-mono text-xs break-all">{spotlight.slug}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Globe,
  FileText,
  Users,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  X,
  Check,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Switch } from "@/components/ui/switch"
import { AIEnhanceButton } from "@/components/companies/ai-enhance-button"
import { ResearchCompanyButton } from "@/components/companies/research-company-button"
import { FindContactsButton } from "@/components/companies/find-contacts-button"
import { ContactsEnhanceButton } from "@/components/contacts/contacts-enhance-button"
import { ArticlesEnhanceButton } from "@/components/articles/articles-enhance-button"
import type { BiologicalSystem, CompanyCategory } from "@/types/database"

interface Company {
  id: string
  name: string
  website: string | null
  domain: string | null
  description: string | null
  differentiators: string | null
  evidence: string | null
  bioedge_fit: string | null
  warm_pitch: string | null
  analysis: string | null
  research_notes: string | null
  status: string
  is_draft: boolean | null
  category: CompanyCategory | null
  systems_supported: BiologicalSystem[]
  events: string[]
  logo_url: string | null
  slug: string | null
  created_at: string
  updated_at: string
}

interface Contact {
  id: string
  first_name: string
  last_name: string
  title: string | null
  email: string | null
  show_on_articles: boolean
}

interface Article {
  id: string
  title: string
  status: string
  published_at: string | null
  created_at: string
}

interface CompanyDetailEditorProps {
  company: Company
  contacts: Contact[]
  articles: Article[]
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

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  researching: "secondary",
  article_draft: "warning",
  published: "info",
  outreach: "default",
  engaged: "success",
}

const statusLabels: Record<string, string> = {
  researching: "Researching",
  article_draft: "Article Draft",
  published: "Published",
  outreach: "Outreach",
  engaged: "Engaged",
}

// Moved outside main component to prevent re-renders causing input focus loss
interface EditableCardProps {
  title: string
  description?: string
  isEditing: boolean
  isSaving: boolean
  hasContent: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  children: ReactNode
  editContent: ReactNode
  emptyState?: ReactNode
}

// Events editor component for inline editing
interface EventsEditorProps {
  events: string[]
  onChange: (events: string[]) => void
}

function EventsEditor({ events, onChange }: EventsEditorProps) {
  const [newEvent, setNewEvent] = useState("")

  const addEvent = () => {
    if (newEvent.trim() && !events.includes(newEvent.trim())) {
      onChange([...events, newEvent.trim()])
      setNewEvent("")
    }
  }

  const removeEvent = (eventToRemove: string) => {
    onChange(events.filter((e) => e !== eventToRemove))
  }

  return (
    <div className="space-y-3">
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
        <Button type="button" variant="outline" size="sm" onClick={addEvent}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {events.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {events.map((event) => (
            <Badge key={event} variant="secondary" className="gap-1 pr-1">
              {event}
              <button
                type="button"
                onClick={() => removeEvent(event)}
                className="ml-1 hover:text-destructive rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {events.length === 0 && (
        <p className="text-xs text-muted-foreground">Press Enter or click + to add an event</p>
      )}
    </div>
  )
}

function EditableCard({
  title,
  description,
  isEditing,
  isSaving,
  hasContent,
  onEdit,
  onCancel,
  onSave,
  children,
  editContent,
  emptyState,
}: EditableCardProps) {
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
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={isSaving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : <Check className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? editContent : (hasContent ? children : emptyState || children)}
      </CardContent>
    </Card>
  )
}

export function CompanyDetailEditor({
  company: initialCompany,
  contacts,
  articles,
}: CompanyDetailEditorProps) {
  const router = useRouter()
  const [company, setCompany] = useState(initialCompany)

  // Edit states
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form data for editing
  const [formData, setFormData] = useState({ ...initialCompany })

  // Categories from database
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])

  // Fetch categories on mount
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

  const startEditing = (section: string) => {
    setFormData({ ...company })
    setEditingSection(section)
  }

  const cancelEditing = () => {
    setFormData({ ...company })
    setEditingSection(null)
  }

  const saveSection = async (fields: string[]) => {
    setIsSaving(true)

    const updateData: Record<string, unknown> = {}
    fields.forEach(field => {
      updateData[field] = formData[field as keyof typeof formData]
    })

    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompany({ ...company, ...updatedCompany })
        setEditingSection(null)
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error("Failed to save:", errorData.error)
      }
    } catch (error) {
      console.error("Failed to save:", error)
    }
    setIsSaving(false)
  }

  const toggleSystem = (system: BiologicalSystem) => {
    const current = formData.systems_supported || []
    const updated = current.includes(system)
      ? current.filter((s) => s !== system)
      : [...current, system]
    setFormData({ ...formData, systems_supported: updated })
  }

  // Helper to render bullet list or paragraph
  const renderListOrParagraph = (text: string | null) => {
    if (!text) return null
    const items = text
      .split(/\n/)
      .map((item: string) => item.replace(/^\s*-\s*/, "").trim())
      .filter((item: string) => item.length > 0)

    if (items.length > 1) {
      return (
        <ul className="space-y-2.5">
          {items.map((item: string, idx: number) => (
            <li key={idx} className="flex gap-2.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    }
    return <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
  }

  // Helper to check if a field has content
  const hasFieldContent = (fields: string[]) => {
    return fields.some(field => {
      const value = company[field as keyof typeof company]
      if (Array.isArray(value)) return value.length > 0
      return !!value
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column - Main info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <EditableCard
          title="Basic Information"
          description="Company name, website, and category"
          isEditing={editingSection === "basic"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["name", "website", "category", "logo_url", "slug"])}
          onEdit={() => startEditing("basic")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["name", "website", "category", "logo_url", "slug"])}
          editContent={
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <ImageUpload
                  imageType="logo"
                  value={formData.logo_url}
                  entityType="company"
                  entityId={company.id}
                  cropToFit={false}
                  onUpload={(url) => {
                    setFormData({ ...formData, logo_url: url })
                  }}
                  onRemove={() => {
                    setFormData({ ...formData, logo_url: null })
                  }}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: (e.target.value || null) as CompanyCategory | null })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select category...</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value || null })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value || null })}
                      placeholder="company-name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const slug = formData.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "")
                        setFormData({ ...formData, slug })
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used in URLs: /companies/{formData.slug || "company-name"}
                  </p>
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-16 w-16 object-contain rounded-lg bg-white p-1"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>
                {company.category && (
                  <Badge variant="secondary" className="mt-1">
                    {categoryOptions.find(c => c.value === company.category)?.label || company.category}
                  </Badge>
                )}
              </div>
            </div>
            {company.website && (
              <>
                <Separator />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  {company.domain || company.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </EditableCard>

        {/* Description */}
        <EditableCard
          title="Company Description"
          description="Overview and background"
          isEditing={editingSection === "description"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["description"])}
          onEdit={() => startEditing("description")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["description"])}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                placeholder="Brief description of what the company does..."
                rows={4}
              />
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">No description added yet</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("description")}>
                Add Description
              </Button>
            </div>
          }
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.description}</p>
        </EditableCard>

        {/* Key Differentiators */}
        <EditableCard
          title="What Sets Them Apart"
          description="Key differentiators and unique value"
          isEditing={editingSection === "differentiators"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["differentiators"])}
          onEdit={() => startEditing("differentiators")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["differentiators"])}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.differentiators || ""}
                onChange={(e) => setFormData({ ...formData, differentiators: e.target.value || null })}
                placeholder="What sets this company apart from competitors? Use bullet points with - for multiple items."
                rows={4}
              />
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No differentiators identified yet</p>
              <AIEnhanceButton
                companyId={company.id}
                companyName={company.name}
                variant="outline"
                size="sm"
              />
            </div>
          }
        >
          {renderListOrParagraph(company.differentiators)}
        </EditableCard>

        {/* Evidence & Credibility */}
        <EditableCard
          title="Evidence & Credibility"
          description="Clinical validation, partnerships, and social proof"
          isEditing={editingSection === "evidence"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["evidence"])}
          onEdit={() => startEditing("evidence")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["evidence"])}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.evidence || ""}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value || null })}
                placeholder="Clinical studies, expert endorsements, certifications, funding... Use bullet points with - for multiple items."
                rows={4}
              />
            </div>
          }
          emptyState={
            <div className="text-center py-6">
              <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No evidence documented yet</p>
              <AIEnhanceButton
                companyId={company.id}
                companyName={company.name}
                variant="outline"
                size="sm"
              />
            </div>
          }
        >
          {renderListOrParagraph(company.evidence)}
        </EditableCard>

        {/* bioEDGE Fit */}
        <EditableCard
          title="bioEDGE Fit"
          description="Why this company aligns with bioEDGE"
          isEditing={editingSection === "bioedge_fit"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["bioedge_fit"])}
          onEdit={() => startEditing("bioedge_fit")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["bioedge_fit"])}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.bioedge_fit || ""}
                onChange={(e) => setFormData({ ...formData, bioedge_fit: e.target.value || null })}
                placeholder="Why does this company align with bioEDGE audience and editorial standards?"
                rows={3}
              />
            </div>
          }
          emptyState={
            <p className="text-sm text-muted-foreground">No bioEDGE fit analysis yet</p>
          }
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.bioedge_fit}</p>
        </EditableCard>

        {/* Warm Pitch */}
        <EditableCard
          title="Warm Pitch Email"
          description="Draft pitch email for outreach"
          isEditing={editingSection === "warm_pitch"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["warm_pitch"])}
          onEdit={() => startEditing("warm_pitch")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["warm_pitch"])}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.warm_pitch || ""}
                onChange={(e) => setFormData({ ...formData, warm_pitch: e.target.value || null })}
                placeholder="Draft your outreach email..."
                rows={6}
              />
            </div>
          }
          emptyState={
            <p className="text-sm text-muted-foreground">No warm pitch drafted yet</p>
          }
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.warm_pitch}</p>
        </EditableCard>

        {/* Research Notes */}
        <EditableCard
          title="Research Notes"
          description="Additional research and analysis"
          isEditing={editingSection === "research"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["analysis", "research_notes"])}
          onEdit={() => startEditing("research")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["analysis", "research_notes"])}
          editContent={
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>General Analysis</Label>
                <Textarea
                  value={formData.analysis || ""}
                  onChange={(e) => setFormData({ ...formData, analysis: e.target.value || null })}
                  placeholder="Additional analysis notes..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Research Notes</Label>
                <Textarea
                  value={formData.research_notes || ""}
                  onChange={(e) => setFormData({ ...formData, research_notes: e.target.value || null })}
                  placeholder="Other research notes..."
                  rows={3}
                />
              </div>
            </div>
          }
          emptyState={
            <p className="text-sm text-muted-foreground">No research notes yet</p>
          }
        >
          <div className="space-y-4">
            {company.analysis && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Analysis</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.analysis}</p>
              </div>
            )}
            {company.research_notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{company.research_notes}</p>
              </div>
            )}
          </div>
        </EditableCard>

        {/* Articles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Articles</CardTitle>
            <CardDescription>{articles.length} article(s) about this company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {articles.length > 0 ? (
                <>
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/dashboard/articles/${article.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {article.published_at
                              ? `Published ${new Date(article.published_at).toLocaleDateString()}`
                              : `Created ${new Date(article.created_at).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{article.status}</Badge>
                    </Link>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/dashboard/articles/new?company=${company.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Article
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No articles yet. Create one to start building content.
                  </p>
                  <Button asChild>
                    <Link href={`/dashboard/articles/new?company=${company.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Article
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column - Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(company.slug || company.domain) && (
              <Button variant="outline" asChild className="w-full">
                <a
                  href={`/companies/${company.slug || company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </a>
              </Button>
            )}
            <Separator className="my-3" />
            <p className="text-xs font-medium text-muted-foreground mb-2">AI Research</p>
            <ResearchCompanyButton
              companyId={company.id}
              companyName={company.name}
              companyWebsite={company.website}
              companyEvents={company.events}
              variant="outline"
            />
            <AIEnhanceButton
              companyId={company.id}
              companyName={company.name}
              variant="outline"
            />
            <ContactsEnhanceButton
              companyId={company.id}
              label="Enhance Contacts"
              variant="outline"
            />
            <ArticlesEnhanceButton
              companyId={company.id}
              label="Enhance Articles"
              variant="outline"
            />
            <Separator className="my-3" />
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/articles/new?company=${company.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                New Article
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/contacts/new?company=${company.id}`}>
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Systems Supported */}
        <EditableCard
          title="Systems Supported"
          description="Biological systems targeted"
          isEditing={editingSection === "systems"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["systems_supported"])}
          onEdit={() => startEditing("systems")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["systems_supported"])}
          editContent={
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
          }
          emptyState={
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">No systems selected yet</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("systems")}>
                Add Systems
              </Button>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            {company.systems_supported?.map((system) => (
              <Badge key={system} variant="secondary">
                {system}
              </Badge>
            ))}
          </div>
        </EditableCard>

        {/* Events */}
        <EditableCard
          title="Events"
          description="Where this company was found"
          isEditing={editingSection === "events"}
          isSaving={isSaving}
          hasContent={hasFieldContent(["events"])}
          onEdit={() => startEditing("events")}
          onCancel={cancelEditing}
          onSave={() => saveSection(["events"])}
          editContent={
            <EventsEditor
              events={formData.events || []}
              onChange={(events) => setFormData({ ...formData, events })}
            />
          }
          emptyState={
            <div className="text-center py-4">
              <Calendar className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-2">No events tracked yet</p>
              <Button variant="outline" size="sm" onClick={() => startEditing("events")}>
                Add Event
              </Button>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            {company.events?.map((event) => (
              <Badge key={event} variant="secondary">
                {event}
              </Badge>
            ))}
          </div>
        </EditableCard>

        {/* Contacts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <CardDescription>{contacts.length} total</CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.slice(0, 5).map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/dashboard/contacts/${contact.id}`}
                    className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.title && (
                        <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                      )}
                    </div>
                    {contact.show_on_articles ? (
                      <Eye className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                    )}
                  </Link>
                ))}
                {contacts.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-1">
                    +{contacts.length - 5} more contacts
                  </p>
                )}
                <div className="pt-2 space-y-2">
                  <FindContactsButton
                    companyId={company.id}
                    hasDomain={!!(company.domain || company.website)}
                    className="w-full"
                  />
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/contacts/new?company=${company.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground mb-2">No contacts yet</p>
                <div className="space-y-2">
                  <FindContactsButton
                    companyId={company.id}
                    hasDomain={!!(company.domain || company.website)}
                    className="w-full"
                  />
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/contacts/new?company=${company.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Link>
                  </Button>
                </div>
              </div>
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
                  {new Date(company.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(company.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

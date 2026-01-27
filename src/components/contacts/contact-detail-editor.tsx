"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Mail,
  Phone,
  Linkedin,
  Star,
  Pencil,
  X,
  Check,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { ContactEnhancementsEditor } from "./contact-enhancements-editor"
import { ContactsEnhanceButton } from "./contacts-enhance-button"
import { OutreachLogEditor } from "./outreach-log-editor"
import { createClient } from "@/lib/supabase/client"

interface Company {
  id: string
  name: string
  domain?: string
}

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  title: string | null
  linkedin_url: string | null
  avatar_url: string | null
  company_id: string | null
  notes: string | null
  source: string | null
  outreach_status: string | null
  show_on_articles: boolean
  slug: string | null
  bio: string | null
  ai_highlights: string[] | null
  ai_expertise: string[] | null
  created_at: string
  updated_at: string
  hunter_confidence?: number
}

interface ContactDetailEditorProps {
  contact: Contact
  company: Company | null
  companies: Company[]
  enhancements: any[]
  outreachLog: any[]
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  not_contacted: "secondary",
  contacted: "warning",
  responded: "info",
  converted: "success",
}

const statusLabels: Record<string, string> = {
  not_contacted: "Not Contacted",
  contacted: "Contacted",
  responded: "Responded",
  converted: "Converted",
}

function EditableCard({
  title,
  description,
  section,
  fields,
  children,
  editContent,
  isEditing,
  isSaving,
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
  isEditing: boolean
  isSaving: boolean
  onStartEditing: (section: string) => void
  onCancelEditing: () => void
  onSave: (fields: string[]) => void
}) {
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
        {isEditing ? editContent : children}
      </CardContent>
    </Card>
  )
}

export function ContactDetailEditor({
  contact: initialContact,
  company: initialCompany,
  companies,
  enhancements,
  outreachLog,
}: ContactDetailEditorProps) {
  const router = useRouter()
  const [contact, setContact] = useState(initialContact)
  const [company, setCompany] = useState(initialCompany)

  // Edit states for each section
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form data for editing
  const [formData, setFormData] = useState({ ...initialContact })

  // Highlights/expertise editing
  const [newHighlight, setNewHighlight] = useState("")
  const [newExpertise, setNewExpertise] = useState("")

  const displayName = `${contact.first_name} ${contact.last_name}`.trim() || "Unknown Contact"

  const startEditing = (section: string) => {
    setFormData({ ...contact })
    setEditingSection(section)
  }

  const cancelEditing = () => {
    setFormData({ ...contact })
    setEditingSection(null)
  }

  const saveSection = async (fields: string[]) => {
    setIsSaving(true)
    const supabase = createClient()

    const updateData: Record<string, any> = {}
    fields.forEach(field => {
      updateData[field] = formData[field as keyof typeof formData]
    })

    const { error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", contact.id)

    if (!error) {
      setContact({ ...contact, ...updateData })
      // Update company if changed
      if (fields.includes("company_id") && formData.company_id !== contact.company_id) {
        const newCompany = companies.find(c => c.id === formData.company_id) || null
        setCompany(newCompany)
      }
      setEditingSection(null)
      router.refresh()
    } else {
      console.error("Failed to save:", error)
    }
    setIsSaving(false)
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      const highlights = [...(formData.ai_highlights || []), newHighlight.trim()]
      setFormData({ ...formData, ai_highlights: highlights })
      setNewHighlight("")
    }
  }

  const removeHighlight = (highlight: string) => {
    const highlights = (formData.ai_highlights || []).filter(h => h !== highlight)
    setFormData({ ...formData, ai_highlights: highlights })
  }

  const addExpertise = () => {
    if (newExpertise.trim()) {
      const expertise = [...(formData.ai_expertise || []), newExpertise.trim()]
      setFormData({ ...formData, ai_expertise: expertise })
      setNewExpertise("")
    }
  }

  const removeExpertise = (tag: string) => {
    const expertise = (formData.ai_expertise || []).filter(e => e !== tag)
    setFormData({ ...formData, ai_expertise: expertise })
  }

  const isEditingSection = (section: string) => editingSection === section

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column - Main info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info Section */}
        <EditableCard
          title="Basic Information"
          description="Name, title, and contact details"
          section="basic"
          fields={["first_name", "last_name", "title", "email", "phone", "avatar_url"]}
          isEditing={isEditingSection("basic")}
          isSaving={isSaving}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <ImageUpload
                  imageType="avatar"
                  value={formData.avatar_url}
                  entityType="contact"
                  entityId={contact.id}
                  onUpload={(url) => setFormData({ ...formData, avatar_url: url })}
                  onRemove={() => setFormData({ ...formData, avatar_url: null })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name || ""}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.last_name || ""}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {contact.avatar_url ? (
                <img
                  src={contact.avatar_url}
                  alt={displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">
                    {contact.first_name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                {contact.title && <p className="text-muted-foreground">{contact.title}</p>}
              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-6">
              {contact.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${contact.email}`} className="font-medium hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a href={`tel:${contact.phone}`} className="font-medium hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </EditableCard>

        {/* LinkedIn / Social */}
        <EditableCard
          title="Social Media"
          description="LinkedIn and other profiles"
          section="social"
          fields={["linkedin_url"]}
          isEditing={isEditingSection("social")}
          isSaving={isSaving}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={formData.linkedin_url || ""}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          }
        >
          {contact.linkedin_url ? (
            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted transition-colors"
            >
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              <span className="text-sm font-medium">LinkedIn Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No LinkedIn profile linked</p>
          )}
        </EditableCard>

        {/* Notes */}
        <EditableCard
          title="Notes"
          description="Internal notes about this contact"
          section="notes"
          fields={["notes"]}
          isEditing={isEditingSection("notes")}
          isSaving={isSaving}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-2">
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about this contact..."
                rows={4}
              />
            </div>
          }
        >
          {contact.notes ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{contact.notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No notes yet</p>
          )}
        </EditableCard>

        {/* Leader Profile (Bio, Highlights, Expertise) */}
        {contact.show_on_articles && (
          <EditableCard
            title="Leader Profile"
            description="Public bio and career highlights"
            section="profile"
            fields={["bio", "ai_highlights", "ai_expertise"]}
            isEditing={isEditingSection("profile")}
            isSaving={isSaving}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onSave={saveSection}
            editContent={
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Professional biography..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expertise</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.ai_expertise || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button type="button" onClick={() => removeExpertise(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="Add expertise..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                    />
                    <Button type="button" variant="outline" onClick={addExpertise}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Career Highlights</Label>
                  <div className="space-y-2 mb-2">
                    {(formData.ai_highlights || []).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded border bg-muted/50">
                        <span className="flex-1 text-sm">{highlight}</span>
                        <button type="button" onClick={() => removeHighlight(highlight)}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add highlight..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    />
                    <Button type="button" variant="outline" onClick={addHighlight}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {contact.bio ? (
                <p className="text-sm leading-relaxed">{contact.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No bio yet. Use "Enhance with AI" to generate.</p>
              )}

              {contact.ai_expertise && contact.ai_expertise.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.ai_expertise.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {contact.ai_highlights && contact.ai_highlights.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Career Highlights</p>
                  <ul className="space-y-2">
                    {contact.ai_highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </EditableCard>
        )}

        {/* Leader Media (Videos, Papers, Books) */}
        <ContactEnhancementsEditor
          contactId={contact.id}
          enhancements={enhancements}
        />

        {/* Outreach History */}
        <OutreachLogEditor
          contactId={contact.id}
          entries={outreachLog}
        />
      </div>

      {/* Right column - Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ContactsEnhanceButton
              contactId={contact.id}
              label="Enhance with AI"
              variant="default"
              className="w-full"
            />
            {contact.email && (
              <Button variant="outline" asChild className="w-full">
                <a href={`mailto:${contact.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </a>
              </Button>
            )}
            {contact.show_on_articles && contact.slug && (
              <Button variant="outline" asChild className="w-full">
                <a href={`/leaders/${contact.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Profile
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Company */}
        <EditableCard
          title="Company"
          description="Associated company"
          section="company"
          fields={["company_id"]}
          isEditing={isEditingSection("company")}
          isSaving={isSaving}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-2">
              <Label>Company</Label>
              <select
                value={formData.company_id || ""}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value || null })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">No company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          }
        >
          {company ? (
            <Link
              href={`/dashboard/companies/${company.id}`}
              className="block rounded-lg p-3 border hover:bg-muted/50 transition-colors -m-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  {company.domain && (
                    <p className="text-sm text-muted-foreground truncate">{company.domain}</p>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No company assigned</p>
          )}
        </EditableCard>

        {/* Status & Settings */}
        <EditableCard
          title="Status & Settings"
          description="Outreach status and visibility"
          section="status"
          fields={["outreach_status", "source", "show_on_articles"]}
          isEditing={isEditingSection("status")}
          isSaving={isSaving}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveSection}
          editContent={
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Outreach Status</Label>
                <select
                  value={formData.outreach_status || "not_contacted"}
                  onChange={(e) => setFormData({ ...formData, outreach_status: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="not_contacted">Not Contacted</option>
                  <option value="contacted">Contacted</option>
                  <option value="responded">Responded</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input
                  value={formData.source || ""}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Hunter.io, LinkedIn"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show_on_articles"
                  checked={formData.show_on_articles || false}
                  onChange={(e) => setFormData({ ...formData, show_on_articles: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="show_on_articles" className="font-normal">
                  Key Person (show on articles)
                </Label>
              </div>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={statusColors[contact.outreach_status || "not_contacted"]}>
                {statusLabels[contact.outreach_status || "not_contacted"]}
              </Badge>
            </div>
            {contact.source && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium">{contact.source}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Key Person</span>
              <Badge variant={contact.show_on_articles ? "default" : "secondary"}>
                {contact.show_on_articles ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </EditableCard>

        {/* Record Info */}
        <Card>
          <CardHeader>
            <CardTitle>Record Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {new Date(contact.updated_at).toLocaleDateString()}
                </span>
              </div>
              {contact.hunter_confidence && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hunter Confidence</span>
                    <span className="font-medium">{contact.hunter_confidence}%</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

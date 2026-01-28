"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface Contact {
  id: string
  first_name: string
  last_name: string
  title?: string | null
  avatar_url?: string | null
  company?: { name: string } | null
}

interface Testimonial {
  id: string
  event_id: string
  contact_id?: string | null
  author_name?: string | null
  author_title?: string | null
  author_company?: string | null
  author_image_url?: string | null
  quote: string
  video_url?: string | null
  display_order: number
  is_visible: boolean
  is_featured: boolean
  contact?: Contact | null
}

interface TestimonialsListProps {
  eventId: string
}

export function TestimonialsList({ eventId }: TestimonialsListProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [contactId, setContactId] = useState<string>("manual")
  const [authorName, setAuthorName] = useState("")
  const [authorTitle, setAuthorTitle] = useState("")
  const [authorCompany, setAuthorCompany] = useState("")
  const [authorImageUrl, setAuthorImageUrl] = useState("")
  const [quote, setQuote] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadTestimonials()
    loadContacts()
  }, [eventId])

  async function loadTestimonials() {
    setLoading(true)
    const { data, error } = await supabase
      .from("event_testimonials")
      .select(`
        *,
        contact:contacts(id, first_name, last_name, title, avatar_url, company:companies(name))
      `)
      .eq("event_id", eventId)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Failed to load testimonials")
      console.error(error)
    } else {
      setTestimonials(data || [])
    }
    setLoading(false)
  }

  async function loadContacts() {
    const { data } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, title, avatar_url, company:companies(name)")
      .order("last_name", { ascending: true })
      .limit(100)

    // Normalize company from array to single object (Supabase returns arrays for relations)
    const normalized = (data || []).map((c: any) => ({
      ...c,
      company: Array.isArray(c.company) ? c.company[0] : c.company,
    }))
    setContacts(normalized)
  }

  function openAddDialog() {
    setEditingTestimonial(null)
    setContactId("manual")
    setAuthorName("")
    setAuthorTitle("")
    setAuthorCompany("")
    setAuthorImageUrl("")
    setQuote("")
    setVideoUrl("")
    setIsVisible(true)
    setIsFeatured(false)
    setDialogOpen(true)
  }

  function openEditDialog(testimonial: Testimonial) {
    setEditingTestimonial(testimonial)
    setContactId(testimonial.contact_id || "manual")
    setAuthorName(testimonial.author_name || "")
    setAuthorTitle(testimonial.author_title || "")
    setAuthorCompany(testimonial.author_company || "")
    setAuthorImageUrl(testimonial.author_image_url || "")
    setQuote(testimonial.quote)
    setVideoUrl(testimonial.video_url || "")
    setIsVisible(testimonial.is_visible)
    setIsFeatured(testimonial.is_featured)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!quote.trim()) {
      console.error("Quote is required")
      return
    }

    if (contactId === "manual" && !authorName.trim()) {
      console.error("Author name is required when not selecting a contact")
      return
    }

    setSaving(true)

    const testimonialData = {
      event_id: eventId,
      contact_id: contactId !== "manual" ? contactId : null,
      author_name: contactId === "manual" ? authorName.trim() : null,
      author_title: contactId === "manual" ? authorTitle.trim() || null : null,
      author_company: contactId === "manual" ? authorCompany.trim() || null : null,
      author_image_url: contactId === "manual" ? authorImageUrl.trim() || null : null,
      quote: quote.trim(),
      video_url: videoUrl.trim() || null,
      is_visible: isVisible,
      is_featured: isFeatured,
    }

    if (editingTestimonial) {
      const { error } = await supabase
        .from("event_testimonials")
        .update(testimonialData)
        .eq("id", editingTestimonial.id)

      if (error) {
        console.error("Failed to update testimonial")
        console.error(error)
      } else {
        console.log("Testimonial updated")
        setDialogOpen(false)
        loadTestimonials()
      }
    } else {
      const maxOrder = Math.max(0, ...testimonials.map(t => t.display_order))
      const { error } = await supabase
        .from("event_testimonials")
        .insert({
          ...testimonialData,
          display_order: maxOrder + 1,
        })

      if (error) {
        console.error("Failed to create testimonial")
        console.error(error)
      } else {
        console.log("Testimonial added")
        setDialogOpen(false)
        loadTestimonials()
      }
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!testimonialToDelete) return

    const { error } = await supabase
      .from("event_testimonials")
      .delete()
      .eq("id", testimonialToDelete.id)

    if (error) {
      console.error("Failed to delete testimonial")
      console.error(error)
    } else {
      console.log("Testimonial deleted")
      loadTestimonials()
    }

    setDeleteDialogOpen(false)
    setTestimonialToDelete(null)
  }

  async function toggleVisibility(testimonial: Testimonial) {
    const { error } = await supabase
      .from("event_testimonials")
      .update({ is_visible: !testimonial.is_visible })
      .eq("id", testimonial.id)

    if (error) {
      console.error("Failed to update testimonial")
    } else {
      loadTestimonials()
    }
  }

  async function toggleFeatured(testimonial: Testimonial) {
    const { error } = await supabase
      .from("event_testimonials")
      .update({ is_featured: !testimonial.is_featured })
      .eq("id", testimonial.id)

    if (error) {
      console.error("Failed to update testimonial")
    } else {
      loadTestimonials()
    }
  }

  function getDisplayName(testimonial: Testimonial): string {
    if (testimonial.contact) {
      return `${testimonial.contact.first_name} ${testimonial.contact.last_name}`
    }
    return testimonial.author_name || "Unknown"
  }

  function getDisplayTitle(testimonial: Testimonial): string {
    if (testimonial.contact) {
      const parts = []
      if (testimonial.contact.title) parts.push(testimonial.contact.title)
      if (testimonial.contact.company?.name) parts.push(testimonial.contact.company.name)
      return parts.join(", ")
    }
    const parts = []
    if (testimonial.author_title) parts.push(testimonial.author_title)
    if (testimonial.author_company) parts.push(testimonial.author_company)
    return parts.join(", ")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>
              Manage testimonials and quotes from past attendees
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No testimonials yet. Click "Add Testimonial" to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  !testimonial.is_visible ? "opacity-50 bg-muted" : "bg-card"
                }`}
              >
                <Quote className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm italic line-clamp-2">"{testimonial.quote}"</p>
                  <p className="text-sm font-medium mt-2">{getDisplayName(testimonial)}</p>
                  {getDisplayTitle(testimonial) && (
                    <p className="text-xs text-muted-foreground">{getDisplayTitle(testimonial)}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {testimonial.is_featured && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}
                    {testimonial.video_url && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        Has Video
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFeatured(testimonial)}
                    title={testimonial.is_featured ? "Unfeature" : "Feature"}
                  >
                    <Star className={`h-4 w-4 ${testimonial.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <Switch
                    checked={testimonial.is_visible}
                    onCheckedChange={() => toggleVisibility(testimonial)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(testimonial)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTestimonialToDelete(testimonial)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>
              Add a quote from an attendee or speaker.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Author</Label>
              <Select value={contactId} onValueChange={setContactId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact or enter manually" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Enter manually</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                      {contact.company?.name && ` (${contact.company.name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {contactId === "manual" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Name *</Label>
                  <Input
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorTitle">Title</Label>
                    <Input
                      id="authorTitle"
                      value={authorTitle}
                      onChange={(e) => setAuthorTitle(e.target.value)}
                      placeholder="CEO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorCompany">Company</Label>
                    <Input
                      id="authorCompany"
                      value={authorCompany}
                      onChange={(e) => setAuthorCompany(e.target.value)}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorImageUrl">Photo URL</Label>
                  <Input
                    id="authorImageUrl"
                    value={authorImageUrl}
                    onChange={(e) => setAuthorImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="This event was incredible..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (optional)</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="visible"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                />
                <Label htmlFor="visible">Visible</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingTestimonial ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this testimonial. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

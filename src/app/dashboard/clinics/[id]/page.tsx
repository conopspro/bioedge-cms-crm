"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Star,
  MapPin,
  Phone,
  Mail,
  Eye,
  Trash2,
  RefreshCw,
  Plus,
  X,
  ExternalLink,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClinicContact } from "@/types/database"

// ─── Form data shape ────────────────────────────────────────────────────────

interface ClinicFormData {
  // Basic
  name: string
  slug: string
  website: string
  domain: string
  description: string
  tags: string
  search_term: string
  // Location
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  metro_area: string
  latitude: string
  longitude: string
  google_maps_url: string
  google_place_id: string
  // Contact
  phone: string
  phone_formatted: string
  email: string
  // Ratings
  google_rating: string
  reviews_count: string
  // Social
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
  twitter: string
  tiktok: string
  threads: string
  // Flags
  is_active: boolean
  is_featured: boolean
  is_draft: boolean
}

interface CustomUrl {
  title: string
  url: string
}

const emptyForm: ClinicFormData = {
  name: "",
  slug: "",
  website: "",
  domain: "",
  description: "",
  tags: "",
  search_term: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  metro_area: "",
  latitude: "",
  longitude: "",
  google_maps_url: "",
  google_place_id: "",
  phone: "",
  phone_formatted: "",
  email: "",
  google_rating: "",
  reviews_count: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  twitter: "",
  tiktok: "",
  threads: "",
  is_active: true,
  is_featured: false,
  is_draft: false,
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
const labelClass = "block text-sm font-medium mb-1"

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hint?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [clinicSlug, setClinicSlug] = useState("")

  // Form state
  const [form, setForm] = useState<ClinicFormData>(emptyForm)
  const [photos, setPhotos] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [customUrls, setCustomUrls] = useState<CustomUrl[]>([])

  // Contacts state
  const [contacts, setContacts] = useState<ClinicContact[]>([])
  const [editingContact, setEditingContact] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "" })
  const [addingContact, setAddingContact] = useState(false)

  const markChanged = useCallback(() => {
    setHasChanges(true)
  }, [])

  const updateField = useCallback(
    <K extends keyof ClinicFormData>(field: K, value: ClinicFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      markChanged()
    },
    [markChanged]
  )

  // ─── Fetch clinic ───────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchClinic() {
      setLoading(true)
      try {
        const res = await fetch(`/api/clinics/${id}`)
        if (!res.ok) {
          alert("Clinic not found")
          router.push("/dashboard/clinics")
          return
        }
        const data = await res.json()

        setClinicSlug(data.slug || "")
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          website: data.website || "",
          domain: data.domain || "",
          description: data.description || "",
          tags: (data.tags || []).join(", "),
          search_term: data.search_term || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          country: data.country || "",
          metro_area: data.metro_area || "",
          latitude: data.latitude != null ? String(data.latitude) : "",
          longitude: data.longitude != null ? String(data.longitude) : "",
          google_maps_url: data.google_maps_url || "",
          google_place_id: data.google_place_id || "",
          phone: data.phone || "",
          phone_formatted: data.phone_formatted || "",
          email: data.email || "",
          google_rating: data.google_rating != null ? String(data.google_rating) : "",
          reviews_count: data.reviews_count != null ? String(data.reviews_count) : "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          youtube: data.youtube || "",
          twitter: data.twitter || "",
          tiktok: data.tiktok || "",
          threads: data.threads || "",
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
          is_draft: data.is_draft ?? false,
        })
        setPhotos(data.photos || [])
        setVideos(data.videos || [])
        setCustomUrls(data.custom_urls || [])
        setContacts(data.clinic_contacts || [])
      } catch (error) {
        console.error("Failed to fetch clinic:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClinic()
  }, [id, router])

  // ─── Save clinic ────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true)
    try {
      const updateData: Record<string, unknown> = {
        name: form.name,
        slug: form.slug || null,
        website: form.website || null,
        domain: form.domain || null,
        description: form.description || null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        search_term: form.search_term || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip_code: form.zip_code || null,
        country: form.country || null,
        metro_area: form.metro_area || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        google_maps_url: form.google_maps_url || null,
        google_place_id: form.google_place_id || null,
        phone: form.phone || null,
        phone_formatted: form.phone_formatted || null,
        email: form.email || null,
        google_rating: form.google_rating ? parseFloat(form.google_rating) : null,
        reviews_count: form.reviews_count ? parseInt(form.reviews_count, 10) : 0,
        facebook: form.facebook || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
        youtube: form.youtube || null,
        twitter: form.twitter || null,
        tiktok: form.tiktok || null,
        threads: form.threads || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_draft: form.is_draft,
        photos: photos.filter(Boolean),
        videos: videos.filter(Boolean),
        custom_urls: customUrls.filter((u) => u.url),
      }

      const res = await fetch(`/api/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (res.ok) {
        const updated = await res.json()
        setClinicSlug(updated.slug || form.slug)
        setHasChanges(false)
      } else {
        const err = await res.json().catch(() => null)
        alert(err?.error || "Failed to save changes")
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete clinic ──────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${form.name}"? This will also delete all clinic contacts.`
      )
    )
      return

    try {
      const res = await fetch(`/api/clinics/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/dashboard/clinics")
      } else {
        alert("Failed to delete clinic")
      }
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  // ─── Contact CRUD ───────────────────────────────────────────────────────

  const saveContact = async () => {
    if (!contactForm.name && !contactForm.email && !contactForm.phone) return

    try {
      if (editingContact) {
        const res = await fetch(`/api/clinics/${id}/contacts`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_id: editingContact, ...contactForm }),
        })
        if (res.ok) {
          const updated = await res.json()
          setContacts((prev) =>
            prev.map((c) => (c.id === editingContact ? updated : c))
          )
        }
      } else {
        const res = await fetch(`/api/clinics/${id}/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactForm),
        })
        if (res.ok) {
          const created = await res.json()
          setContacts((prev) => [...prev, created])
        }
      }
    } catch (error) {
      console.error("Contact save failed:", error)
    }

    setEditingContact(null)
    setAddingContact(false)
    setContactForm({ name: "", email: "", phone: "" })
  }

  const deleteContact = async (contactId: string) => {
    if (!confirm("Delete this contact?")) return
    try {
      const res = await fetch(`/api/clinics/${id}/contacts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contactId }),
      })
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId))
      }
    } catch (error) {
      console.error("Contact delete failed:", error)
    }
  }

  const startEditContact = (contact: ClinicContact) => {
    setEditingContact(contact.id)
    setAddingContact(true)
    setContactForm({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
    })
  }

  // ─── Array field helpers ────────────────────────────────────────────────

  const addPhoto = () => {
    setPhotos((prev) => [...prev, ""])
    markChanged()
  }
  const updatePhoto = (index: number, value: string) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? value : p)))
    markChanged()
  }
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const addVideo = () => {
    setVideos((prev) => [...prev, ""])
    markChanged()
  }
  const updateVideo = (index: number, value: string) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? value : v)))
    markChanged()
  }
  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const addCustomUrl = () => {
    setCustomUrls((prev) => [...prev, { title: "", url: "" }])
    markChanged()
  }
  const updateCustomUrl = (index: number, field: "title" | "url", value: string) => {
    setCustomUrls((prev) =>
      prev.map((u, i) => (i === index ? { ...u, [field]: value } : u))
    )
    markChanged()
  }
  const removeCustomUrl = (index: number) => {
    setCustomUrls((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const location = [form.city, form.state].filter(Boolean).join(", ")

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clinics">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{form.name || "Untitled Clinic"}</h1>
            {location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {clinicSlug && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/clinics/${clinicSlug}`} target="_blank">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View Public
              </Link>
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
          {hasChanges && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-3">
        <Badge variant={form.is_active ? "success" : "secondary"}>
          {form.is_active ? "Active" : "Inactive"}
        </Badge>
        {form.is_featured && <Badge variant="warning">Featured</Badge>}
        {form.is_draft && <Badge variant="outline">Draft</Badge>}
        {form.google_rating && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{form.google_rating}</span>
            {form.reviews_count && (
              <span className="text-sm text-muted-foreground">
                ({form.reviews_count} reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Section 1: Basic Information ────────────────────────────── */}
      <Section title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            value={form.name}
            onChange={(v) => updateField("name", v)}
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(v) => updateField("slug", v)}
            hint="URL path: /clinics/your-slug"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Website"
            value={form.website}
            onChange={(v) => updateField("website", v)}
            placeholder="https://example.com"
          />
          <TextField
            label="Domain"
            value={form.domain}
            onChange={(v) => updateField("domain", v)}
            hint="Auto-extracted from website on import"
          />
        </div>
        <TextAreaField
          label="Description"
          value={form.description}
          onChange={(v) => updateField("description", v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Tags"
            value={form.tags}
            onChange={(v) => updateField("tags", v)}
            placeholder="functional medicine, anti-aging, IV therapy"
            hint="Comma-separated"
          />
          <TextField
            label="Search Term"
            value={form.search_term}
            onChange={(v) => updateField("search_term", v)}
            hint="Original search query used to find this clinic"
          />
        </div>
      </Section>

      {/* ── Section 2: Location ─────────────────────────────────────── */}
      <Section title="Location">
        <TextField
          label="Address"
          value={form.address}
          onChange={(v) => updateField("address", v)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="City"
            value={form.city}
            onChange={(v) => updateField("city", v)}
          />
          <TextField
            label="State"
            value={form.state}
            onChange={(v) => updateField("state", v)}
          />
          <TextField
            label="Zip Code"
            value={form.zip_code}
            onChange={(v) => updateField("zip_code", v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Country"
            value={form.country}
            onChange={(v) => updateField("country", v)}
          />
          <TextField
            label="Metro Area"
            value={form.metro_area}
            onChange={(v) => updateField("metro_area", v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Latitude"
            value={form.latitude}
            onChange={(v) => updateField("latitude", v)}
            type="number"
          />
          <TextField
            label="Longitude"
            value={form.longitude}
            onChange={(v) => updateField("longitude", v)}
            type="number"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Google Maps URL"
            value={form.google_maps_url}
            onChange={(v) => updateField("google_maps_url", v)}
          />
          <TextField
            label="Google Place ID"
            value={form.google_place_id}
            onChange={(v) => updateField("google_place_id", v)}
          />
        </div>
        {form.google_maps_url && (
          <a
            href={form.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Google Maps
          </a>
        )}
      </Section>

      {/* ── Section 3: Contact ──────────────────────────────────────── */}
      <Section title="Contact Information">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(v) => updateField("phone", v)}
          />
          <TextField
            label="Phone (Formatted)"
            value={form.phone_formatted}
            onChange={(v) => updateField("phone_formatted", v)}
            hint="Display format, e.g. (555) 123-4567"
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
            hint="Internal only — never shown publicly"
          />
        </div>
      </Section>

      {/* ── Section 4: Ratings & Reviews ────────────────────────────── */}
      <Section title="Ratings & Reviews">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Google Rating"
            value={form.google_rating}
            onChange={(v) => updateField("google_rating", v)}
            type="number"
            placeholder="4.5"
            hint="0.0 – 5.0"
          />
          <TextField
            label="Reviews Count"
            value={form.reviews_count}
            onChange={(v) => updateField("reviews_count", v)}
            type="number"
            placeholder="0"
          />
        </div>
      </Section>

      {/* ── Section 5: Media ────────────────────────────────────────── */}
      <Section title="Media">
        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Photos</label>
            <Button variant="outline" size="sm" onClick={addPhoto}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Photo
            </Button>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No photos added</p>
          ) : (
            <div className="space-y-2">
              {photos.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updatePhoto(i, e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removePhoto(i)}
                  >
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Videos</label>
            <Button variant="outline" size="sm" onClick={addVideo}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Video
            </Button>
          </div>
          {videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos added</p>
          ) : (
            <div className="space-y-2">
              {videos.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateVideo(i, e.target.value)}
                    placeholder="https://youtube.com/embed/..."
                    className={inputClass}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeVideo(i)}
                  >
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom URLs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Custom URLs</label>
            <Button variant="outline" size="sm" onClick={addCustomUrl}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add URL
            </Button>
          </div>
          {customUrls.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom URLs added</p>
          ) : (
            <div className="space-y-2">
              {customUrls.map((cu, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cu.title}
                    onChange={(e) => updateCustomUrl(i, "title", e.target.value)}
                    placeholder="Title"
                    className={`${inputClass} w-1/3`}
                  />
                  <input
                    type="text"
                    value={cu.url}
                    onChange={(e) => updateCustomUrl(i, "url", e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeCustomUrl(i)}
                  >
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ── Section 6: Social Media ─────────────────────────────────── */}
      <Section title="Social Media">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Facebook"
            value={form.facebook}
            onChange={(v) => updateField("facebook", v)}
            placeholder="https://facebook.com/..."
          />
          <TextField
            label="Instagram"
            value={form.instagram}
            onChange={(v) => updateField("instagram", v)}
            placeholder="https://instagram.com/..."
          />
          <TextField
            label="LinkedIn"
            value={form.linkedin}
            onChange={(v) => updateField("linkedin", v)}
            placeholder="https://linkedin.com/company/..."
          />
          <TextField
            label="YouTube"
            value={form.youtube}
            onChange={(v) => updateField("youtube", v)}
            placeholder="https://youtube.com/..."
          />
          <TextField
            label="Twitter / X"
            value={form.twitter}
            onChange={(v) => updateField("twitter", v)}
            placeholder="https://x.com/..."
          />
          <TextField
            label="TikTok"
            value={form.tiktok}
            onChange={(v) => updateField("tiktok", v)}
            placeholder="https://tiktok.com/@..."
          />
          <TextField
            label="Threads"
            value={form.threads}
            onChange={(v) => updateField("threads", v)}
            placeholder="https://threads.net/@..."
          />
        </div>
      </Section>

      {/* ── Section 7: Visibility ───────────────────────────────────── */}
      <Section title="Visibility">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="rounded border"
            />
            Active (visible in directory)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => updateField("is_featured", e.target.checked)}
              className="rounded border"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_draft}
              onChange={(e) => updateField("is_draft", e.target.checked)}
              className="rounded border"
            />
            Draft (hidden from public)
          </label>
        </div>
      </Section>

      {/* ── Section 8: Clinic Contacts ──────────────────────────────── */}
      <Section title={`Contacts (${contacts.length})`}>
        {contacts.length === 0 && !addingContact && (
          <p className="text-sm text-muted-foreground">
            No contacts yet. These are internal contacts (e.g. from Hunter.io).
          </p>
        )}

        {/* Existing contacts */}
        {contacts.map((contact) =>
          editingContact === contact.id ? null : (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              <div>
                {contact.name && (
                  <p className="text-sm font-medium">{contact.name}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {contact.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                  )}
                  {contact.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEditContact(contact)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          )
        )}

        {/* Add / Edit contact form */}
        {addingContact && (
          <div className="rounded-md border border-dashed p-4 space-y-3">
            <p className="text-sm font-medium">
              {editingContact ? "Edit Contact" : "New Contact"}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Name"
                className={inputClass}
              />
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Phone"
                className={inputClass}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveContact}>
                {editingContact ? "Update" : "Add Contact"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAddingContact(false)
                  setEditingContact(null)
                  setContactForm({ name: "", email: "", phone: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!addingContact && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAddingContact(true)
              setEditingContact(null)
              setContactForm({ name: "", email: "", phone: "" })
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Contact
          </Button>
        )}
      </Section>

      {/* Sticky save bar */}
      {hasChanges && (
        <div className="sticky bottom-4 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="shadow-lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}

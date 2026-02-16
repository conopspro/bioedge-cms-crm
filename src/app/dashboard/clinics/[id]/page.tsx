"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Star,
  MapPin,
  Globe,
  Phone,
  Mail,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Clinic, ClinicContact } from "@/types/database"

interface ClinicWithContacts extends Clinic {
  clinic_contacts?: ClinicContact[]
}

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [clinic, setClinic] = useState<ClinicWithContacts | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Editable fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [tags, setTags] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    async function fetchClinic() {
      setLoading(true)
      try {
        const res = await fetch(`/api/clinics/${id}`)
        if (res.ok) {
          const data = await res.json()
          setClinic(data)
          // Populate form
          setName(data.name || "")
          setDescription(data.description || "")
          setAddress(data.address || "")
          setCity(data.city || "")
          setState(data.state || "")
          setZipCode(data.zip_code || "")
          setCountry(data.country || "")
          setPhone(data.phone || "")
          setEmail(data.email || "")
          setWebsite(data.website || "")
          setTags((data.tags || []).join(", "))
          setIsActive(data.is_active)
          setIsFeatured(data.is_featured)
        } else {
          alert("Clinic not found")
          router.push("/dashboard/clinics")
        }
      } catch (error) {
        console.error("Failed to fetch clinic:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClinic()
  }, [id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updateData = {
        name,
        description: description || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null,
        country: country || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_active: isActive,
        is_featured: isFeatured,
      }

      const res = await fetch(`/api/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (res.ok) {
        const updated = await res.json()
        setClinic((prev) => (prev ? { ...prev, ...updated } : prev))
        setHasChanges(false)
      } else {
        alert("Failed to save changes")
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${clinic?.name}"? This will also delete all clinic contacts.`
      )
    ) {
      return
    }
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

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!clinic) return null

  const contacts = clinic.clinic_contacts || []
  const location = [city, state].filter(Boolean).join(", ")

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
            <h1 className="text-2xl font-bold">{clinic.name}</h1>
            {location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clinics/${clinic.slug}`} target="_blank">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Public
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
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

      {/* Rating & Status badges */}
      <div className="flex items-center gap-4">
        {clinic.google_rating && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{clinic.google_rating}</span>
            <span className="text-sm text-muted-foreground">
              ({clinic.reviews_count} reviews)
            </span>
          </div>
        )}
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
        {isFeatured && <Badge variant="warning">Featured</Badge>}
      </div>

      {/* Basic Info */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              markChanged()
            }}
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value)
              markChanged()
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="functional medicine, anti-aging, IV therapy"
          />
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Location</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              markChanged()
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              markChanged()
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {clinic.latitude && clinic.longitude && (
          <p className="text-xs text-muted-foreground">
            Coordinates: {clinic.latitude}, {clinic.longitude}
          </p>
        )}

        {clinic.google_maps_url && (
          <a
            href={clinic.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" />
            View on Google Maps
          </a>
        )}
      </div>

      {/* Contact Info */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contact Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email (internal only)</label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                markChanged()
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Visibility</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => {
                setIsActive(e.target.checked)
                markChanged()
              }}
              className="rounded border"
            />
            Active (visible in directory)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => {
                setIsFeatured(e.target.checked)
                markChanged()
              }}
              className="rounded border"
            />
            Featured
          </label>
        </div>
      </div>

      {/* Clinic Contacts (Hunter) */}
      {contacts.length > 0 && (
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Contacts ({contacts.length})
          </h2>
          <div className="space-y-3">
            {contacts.map((contact) => (
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media (read-only display) */}
      {(clinic.facebook || clinic.instagram || clinic.linkedin || clinic.youtube || clinic.twitter || clinic.tiktok) && (
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-3">Social Media</h2>
          <div className="flex flex-wrap gap-2">
            {clinic.facebook && (
              <a href={clinic.facebook} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">Facebook</Badge>
              </a>
            )}
            {clinic.instagram && (
              <a href={clinic.instagram} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">Instagram</Badge>
              </a>
            )}
            {clinic.linkedin && (
              <a href={clinic.linkedin} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">LinkedIn</Badge>
              </a>
            )}
            {clinic.youtube && (
              <a href={clinic.youtube} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">YouTube</Badge>
              </a>
            )}
            {clinic.twitter && (
              <a href={clinic.twitter} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">Twitter/X</Badge>
              </a>
            )}
            {clinic.tiktok && (
              <a href={clinic.tiktok} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline">TikTok</Badge>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

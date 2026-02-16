"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
const labelClass = "block text-sm font-medium mb-1"

export default function NewClinicPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Core fields for creation
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("US")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [tags, setTags] = useState("")

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Clinic name is required")
      return
    }

    setSaving(true)
    try {
      const createData: Record<string, unknown> = {
        name: name.trim(),
        website: website || null,
        description: description || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null,
        country: country || null,
        phone: phone || null,
        email: email || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }

      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      })

      if (res.ok) {
        const created = await res.json()
        router.push(`/dashboard/clinics/${created.id}`)
      } else {
        const err = await res.json().catch(() => null)
        alert(err?.error || "Failed to create clinic")
      }
    } catch (error) {
      console.error("Create failed:", error)
      alert("Failed to create clinic")
    } finally {
      setSaving(false)
    }
  }

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
          <h1 className="text-2xl font-bold">Add New Clinic</h1>
        </div>
        <Button onClick={handleCreate} disabled={saving || !name.trim()}>
          {saving ? (
            <>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Create Clinic
            </>
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Fill in the basics to create the clinic, then edit the full details on the next page.
      </p>

      {/* Basic Info */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Clinic name"
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="functional medicine, anti-aging, IV therapy"
            className={inputClass}
          />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Location</h2>
        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground mt-1">Internal only — never shown publicly</p>
          </div>
        </div>
      </div>

      {/* Create button at bottom */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} disabled={saving || !name.trim()} size="lg">
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Clinic
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

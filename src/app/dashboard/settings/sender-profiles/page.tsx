"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Contact,
  Mail,
  Pencil,
  Phone,
  Plus,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { SenderProfile } from "@/types/database"

interface FormData {
  name: string
  email: string
  title: string
  phone: string
  signature: string
}

const emptyForm: FormData = {
  name: "",
  email: "",
  title: "",
  phone: "",
  signature: "",
}

/**
 * Auto-generate a signature from profile fields if signature is blank.
 */
function generateSignature(form: FormData): string {
  const lines = [form.name]
  if (form.title) lines.push(form.title)
  if (form.phone) lines.push(form.phone)
  lines.push("bioedgelongevity.com")
  return lines.join("\n")
}

export default function SenderProfilesPage() {
  const [profiles, setProfiles] = useState<SenderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Add dialog
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addForm, setAddForm] = useState<FormData>(emptyForm)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfiles()
  }, [])

  async function loadProfiles() {
    try {
      const res = await fetch("/api/sender-profiles")
      if (res.ok) {
        const data = await res.json()
        setProfiles(data)
      }
    } catch (err) {
      console.error("Failed to load sender profiles:", err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (profile: SenderProfile) => {
    setEditingId(profile.id)
    setEditForm({
      name: profile.name,
      email: profile.email,
      title: profile.title || "",
      phone: profile.phone || "",
      signature: profile.signature || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/sender-profiles/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          title: editForm.title || null,
          phone: editForm.phone || null,
          signature: editForm.signature || null,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setProfiles((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        )
        cancelEdit()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save")
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!addForm.name || !addForm.email) return
    setCreating(true)
    setError(null)

    const signature =
      addForm.signature || generateSignature(addForm)

    try {
      const res = await fetch("/api/sender-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          title: addForm.title || null,
          phone: addForm.phone || null,
          signature,
        }),
      })

      if (res.ok) {
        const created = await res.json()
        setProfiles((prev) => [...prev, created])
        setShowAddDialog(false)
        setAddForm(emptyForm)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to create")
      }
    } catch {
      setError("Network error")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Sender Profiles
          </h1>
          <p className="text-muted-foreground">
            Manage email sender identities for campaigns.
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sender Profile
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading sender profiles...
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16">
          <Contact className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-lg font-semibold mb-2">No sender profiles</h2>
          <p className="text-muted-foreground mb-4">
            Create a sender profile to start sending campaign emails.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Profile
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => {
            const isEditing = editingId === profile.id

            if (isEditing) {
              return (
                <Card key={profile.id} className="border-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Edit Sender Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Email *</Label>
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g. Founder, bioEDGE Longevity"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Phone</Label>
                        <Input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="e.g. 321-276-4752"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email Signature</Label>
                      <Textarea
                        value={editForm.signature}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            signature: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Multi-line signature appended to campaign emails"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={saving || !editForm.name || !editForm.email}
                      >
                        <Save className="mr-1 h-3 w-3" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card key={profile.id} className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {profile.name}
                      </CardTitle>
                      {profile.title && (
                        <CardDescription>{profile.title}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => startEdit(profile)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.signature && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Signature
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">
                        {profile.signature}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Sender Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sender Profile</DialogTitle>
            <DialogDescription>
              Create a new email sender identity for campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Sandy Martin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="sandy@bioedgelongevity.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-title">Title</Label>
                <Input
                  id="add-title"
                  value={addForm.title}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Founder, bioEDGE Longevity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  value={addForm.phone}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="321-276-4752"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-signature">
                Email Signature
              </Label>
              <Textarea
                id="add-signature"
                value={addForm.signature}
                onChange={(e) =>
                  setAddForm((prev) => ({
                    ...prev,
                    signature: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Leave blank to auto-generate from name, title, and phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setAddForm(emptyForm)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !addForm.name || !addForm.email}
            >
              {creating ? "Creating..." : "Create Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

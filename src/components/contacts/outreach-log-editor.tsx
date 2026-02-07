"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Trash2, Pencil, MessageSquare, Mail, Phone, Users, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

type OutreachEntryType = "email" | "phone" | "linkedin" | "text" | "meeting" | "call" | "other"

interface OutreachLogEntry {
  id: string
  contact_id: string
  date: string
  type: OutreachEntryType
  notes: string | null
  response_received: boolean
  created_at: string
}

interface OutreachLogEditorProps {
  contactId: string
  entries: OutreachLogEntry[]
}

const typeConfig: Record<string, { label: string; icon: typeof Mail; color: string }> = {
  email: { label: "Email", icon: Mail, color: "text-blue-500" },
  phone: { label: "Phone", icon: Phone, color: "text-green-500" },
  call: { label: "Phone", icon: Phone, color: "text-green-500" },
  linkedin: { label: "LinkedIn", icon: MessageSquare, color: "text-[#0A66C2]" },
  text: { label: "Text", icon: Smartphone, color: "text-teal-500" },
  meeting: { label: "Meeting", icon: Users, color: "text-purple-500" },
  other: { label: "Other", icon: MessageSquare, color: "text-gray-500" },
}

const defaultFormState = {
  date: new Date().toISOString().split("T")[0],
  type: "email" as OutreachEntryType,
  notes: "",
  response_received: false,
}

export function OutreachLogEditor({ contactId, entries }: OutreachLogEditorProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultFormState)

  const resetForm = () => {
    setFormData(defaultFormState)
    setIsAdding(false)
    setEditingId(null)
  }

  const startAdd = () => {
    setEditingId(null)
    setFormData(defaultFormState)
    setIsAdding(true)
  }

  const startEdit = (entry: OutreachLogEntry) => {
    setIsAdding(false)
    setEditingId(entry.id)
    setFormData({
      date: entry.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      type: entry.type,
      notes: entry.notes || "",
      response_received: entry.response_received,
    })
  }

  const handleSave = async () => {
    if (!formData.notes.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    if (editingId) {
      // Update existing entry
      const { error } = await supabase
        .from("outreach_log")
        .update({
          date: formData.date,
          type: formData.type,
          notes: formData.notes.trim(),
          response_received: formData.response_received,
        })
        .eq("id", editingId)

      if (!error) {
        resetForm()
        router.refresh()
      } else {
        console.error("Failed to update outreach log:", error)
      }
    } else {
      // Insert new entry
      const { error } = await supabase.from("outreach_log").insert({
        contact_id: contactId,
        date: formData.date,
        type: formData.type,
        notes: formData.notes.trim(),
        response_received: formData.response_received,
      })

      if (!error) {
        resetForm()
        router.refresh()
      } else {
        console.error("Failed to add outreach log:", error)
      }
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this outreach entry?")) return

    const supabase = createClient()
    const { error } = await supabase.from("outreach_log").delete().eq("id", id)

    if (!error) {
      if (editingId === id) resetForm()
      router.refresh()
    } else {
      console.error("Failed to delete outreach log:", error)
    }
  }

  const isFormOpen = isAdding || editingId !== null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Outreach History
            </CardTitle>
            <CardDescription>
              {entries.length} logged interaction(s)
            </CardDescription>
          </div>
          {!isFormOpen && (
            <Button variant="outline" size="sm" onClick={startAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Add / Edit Entry Form */}
        {isFormOpen && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="outreach-date">Date</Label>
                <Input
                  id="outreach-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outreach-type">Type</Label>
                <select
                  id="outreach-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as OutreachEntryType })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outreach-notes">Notes</Label>
              <Textarea
                id="outreach-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="What happened in this interaction..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="response-received"
                checked={formData.response_received}
                onChange={(e) => setFormData({ ...formData, response_received: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="response-received" className="font-normal">
                Response received
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSubmitting || !formData.notes.trim()}>
                {isSubmitting
                  ? (editingId ? "Saving..." : "Adding...")
                  : (editingId ? "Save Changes" : "Add Entry")
                }
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Entries */}
        {entries.length > 0 ? (
          <ul className="space-y-4">
            {entries.map((entry) => {
              const config = typeConfig[entry.type] || typeConfig.other
              const Icon = config.icon
              const isBeingEdited = editingId === entry.id
              return (
                <li key={entry.id} className={`flex gap-4 group ${isBeingEdited ? "opacity-50" : ""}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{config.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date + "T00:00:00").toLocaleDateString()}
                      </span>
                      {entry.response_received && (
                        <Badge variant="success" className="text-xs">
                          Response
                        </Badge>
                      )}
                    </div>
                    {entry.notes && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : !isFormOpen ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No outreach logged yet.
            </p>
            <Button variant="outline" size="sm" onClick={startAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

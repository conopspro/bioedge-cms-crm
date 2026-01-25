"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Trash2, MessageSquare, Mail, Phone, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface OutreachLogEntry {
  id: string
  contact_id: string
  date: string
  type: "email" | "phone" | "linkedin" | "meeting" | "other"
  notes: string | null
  response_received: boolean
  created_at: string
}

interface OutreachLogEditorProps {
  contactId: string
  entries: OutreachLogEntry[]
}

const typeConfig = {
  email: { label: "Email", icon: Mail, color: "text-blue-500" },
  phone: { label: "Phone", icon: Phone, color: "text-green-500" },
  linkedin: { label: "LinkedIn", icon: MessageSquare, color: "text-[#0A66C2]" },
  meeting: { label: "Meeting", icon: Users, color: "text-purple-500" },
  other: { label: "Other", icon: MessageSquare, color: "text-gray-500" },
}

export function OutreachLogEditor({ contactId, entries }: OutreachLogEditorProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "email" as "email" | "phone" | "linkedin" | "meeting" | "other",
    notes: "",
    response_received: false,
  })

  const handleAdd = async () => {
    if (!newEntry.notes.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from("outreach_log").insert({
      contact_id: contactId,
      date: newEntry.date,
      type: newEntry.type,
      notes: newEntry.notes.trim(),
      response_received: newEntry.response_received,
    })

    if (!error) {
      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        type: "email",
        notes: "",
        response_received: false,
      })
      setIsAdding(false)
      router.refresh()
    } else {
      console.error("Failed to add outreach log:", error)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this outreach entry?")) return

    const supabase = createClient()
    const { error } = await supabase.from("outreach_log").delete().eq("id", id)

    if (!error) {
      router.refresh()
    } else {
      console.error("Failed to delete outreach log:", error)
    }
  }

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
          {!isAdding && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Add New Entry Form */}
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="outreach-date">Date</Label>
                <Input
                  id="outreach-date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outreach-type">Type</Label>
                <select
                  id="outreach-type"
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as typeof newEntry.type })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
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
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                placeholder="What happened in this interaction..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="response-received"
                checked={newEntry.response_received}
                onChange={(e) => setNewEntry({ ...newEntry, response_received: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="response-received" className="font-normal">
                Response received
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={isSubmitting || !newEntry.notes.trim()}>
                {isSubmitting ? "Adding..." : "Add Entry"}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
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
              return (
                <li key={entry.id} className="flex gap-4 group">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{config.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : !isAdding ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No outreach logged yet.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

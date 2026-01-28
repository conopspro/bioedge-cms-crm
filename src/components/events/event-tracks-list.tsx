"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Tag, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EventTrack {
  id: string
  event_id: string
  name: string
  description: string | null
  color: string | null
  position: number
}

interface EventTracksListProps {
  eventId: string
}

export function EventTracksList({ eventId }: EventTracksListProps) {
  const [tracks, setTracks] = useState<EventTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTrack, setEditingTrack] = useState<EventTrack | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#6366f1") // Default indigo

  // Load tracks
  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/events/${eventId}/tracks`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTracks(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [eventId])

  const openAddDialog = () => {
    setEditingTrack(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (track: EventTrack) => {
    setEditingTrack(track)
    setName(track.name)
    setDescription(track.description || "")
    setColor(track.color || "#6366f1")
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingTrack) {
        // Update existing track
        const response = await fetch(`/api/events/${eventId}/tracks/${editingTrack.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            color: color || null,
          }),
        })

        if (response.ok) {
          const updatedTrack = await response.json()
          setTracks(tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)))
          setIsDialogOpen(false)
          resetForm()
        }
      } else {
        // Add new track
        const response = await fetch(`/api/events/${eventId}/tracks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            color: color || null,
            position: tracks.length,
          }),
        })

        if (response.ok) {
          const newTrack = await response.json()
          setTracks([...tracks, newTrack])
          setIsDialogOpen(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error("Error saving track:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm("Delete this track? Any presentations assigned to it will become unassigned.")) return

    try {
      const response = await fetch(`/api/events/${eventId}/tracks/${trackId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTracks(tracks.filter((t) => t.id !== trackId))
      }
    } catch (error) {
      console.error("Error deleting track:", error)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setColor("#6366f1")
    setEditingTrack(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Event Tracks
            </CardTitle>
            <CardDescription>
              Define tracks or categories for organizing presentations (e.g., "Business", "Technical", "Wellness")
              {tracks.length > 0 && ` • ${tracks.length} track${tracks.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </div>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Track
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading tracks...</p>
        ) : tracks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tracks defined yet. Add tracks to categorize presentations by theme or topic.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 cursor-pointer flex-1" onClick={() => openEditDialog(track)}>
                  {track.color && (
                    <div
                      className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: track.color }}
                    />
                  )}
                  <div className="space-y-1">
                    <span className="font-medium">{track.name}</span>
                    {track.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {track.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(track)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTrack(track.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTrack ? "Edit Track" : "Add Track"}</DialogTitle>
            <DialogDescription>
              {editingTrack ? "Update the details for this track." : "Create a track or category for organizing presentations."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="trackName">Name *</Label>
              <Input
                id="trackName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Business Track"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-14 h-9 p-1 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes about this track..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? "Saving..." : editingTrack ? "Update" : "Add Track"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, MapPin, Users, Pencil } from "lucide-react"
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

interface EventRoom {
  id: string
  event_id: string
  name: string
  description: string | null
  capacity: number | null
  position: number
}

interface EventRoomsListProps {
  eventId: string
}

export function EventRoomsList({ eventId }: EventRoomsListProps) {
  const [rooms, setRooms] = useState<EventRoom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingRoom, setEditingRoom] = useState<EventRoom | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [capacity, setCapacity] = useState("")

  // Load rooms
  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/events/${eventId}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [eventId])

  const openAddDialog = () => {
    setEditingRoom(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (room: EventRoom) => {
    setEditingRoom(room)
    setName(room.name)
    setDescription(room.description || "")
    setCapacity(room.capacity?.toString() || "")
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingRoom) {
        // Update existing room
        const response = await fetch(`/api/events/${eventId}/rooms/${editingRoom.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            capacity: capacity ? parseInt(capacity) : null,
          }),
        })

        if (response.ok) {
          const updatedRoom = await response.json()
          setRooms(rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)))
          setIsDialogOpen(false)
          resetForm()
        }
      } else {
        // Add new room
        const response = await fetch(`/api/events/${eventId}/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            capacity: capacity ? parseInt(capacity) : null,
            position: rooms.length,
          }),
        })

        if (response.ok) {
          const newRoom = await response.json()
          setRooms([...rooms, newRoom])
          setIsDialogOpen(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error("Error saving room:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Delete this room? Any presentations assigned to it will become unassigned.")) return

    try {
      const response = await fetch(`/api/events/${eventId}/rooms/${roomId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRooms(rooms.filter((r) => r.id !== roomId))
      }
    } catch (error) {
      console.error("Error deleting room:", error)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setCapacity("")
    setEditingRoom(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Event Rooms / Stages
            </CardTitle>
            <CardDescription>
              Define rooms or stages for scheduling presentations (e.g., "Main Stage", "Workshop Room A")
              {rooms.length > 0 && ` • ${rooms.length} room${rooms.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </div>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No rooms defined yet. Add rooms to enable room selection when scheduling presentations.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 cursor-pointer flex-1" onClick={() => openEditDialog(room)}>
                  <span className="font-medium">{room.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {room.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {room.capacity}
                      </span>
                    )}
                    {room.description && (
                      <span className="truncate max-w-[150px]">{room.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(room)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRoom(room.id)}
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
            <DialogTitle>{editingRoom ? "Edit Room / Stage" : "Add Room / Stage"}</DialogTitle>
            <DialogDescription>
              {editingRoom ? "Update the details for this room or stage." : "Create a named room or stage for scheduling presentations."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Name *</Label>
              <Input
                id="roomName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Main Stage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes about this room..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? "Saving..." : editingRoom ? "Update" : "Add Room"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Trash2, Clock, Calendar, MapPin, Users, Play, ExternalLink, Pencil, X, Check } from "lucide-react"
import type { SessionType, Presentation } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"

// Types for event sessions (ad-hoc)
interface EventSession {
  id: string
  event_id: string
  title: string
  description: string | null
  session_type: SessionType
  day_number: number
  start_time: string | null
  end_time: string | null
  location: string | null
  position: number
}

// Types for linked presentations
interface EventPresentation {
  id: string
  event_id: string
  presentation_id: string
  scheduled_date: string | null
  start_time: string | null
  end_time: string | null
  room: string | null
  event_room_id: string | null
  track: string | null
  event_track_id: string | null
  status: string
  is_featured: boolean
  display_order: number
  presentation: {
    id: string
    title: string
    slug: string
    short_description: string | null
    session_type: SessionType
    status: string
    recording_url: string | null
    contact?: {
      id: string
      first_name: string
      last_name: string
      title: string | null
      avatar_url: string | null
    } | null
    company?: {
      id: string
      name: string
      logo_url: string | null
    } | null
    panelists?: Array<{
      id: string
      role: string
      display_order: number
      contact: {
        id: string
        first_name: string
        last_name: string
        title: string | null
        avatar_url: string | null
      }
    }>
  }
}

// Types for event rooms
interface EventRoom {
  id: string
  name: string
  capacity: number | null
}

// Types for event tracks
interface EventTrack {
  id: string
  name: string
  color: string | null
}

interface AgendaListProps {
  eventId: string
  items: EventSession[]
  eventStartDate?: string | null
  eventEndDate?: string | null
}

const sessionTypeColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  keynote: "success",
  panel: "info",
  workshop: "warning",
  fireside_chat: "success",
  presentation: "default",
  demo: "info",
  networking: "secondary",
  break: "secondary",
  meal: "secondary",
  registration: "secondary",
  other: "default",
}

const sessionTypeLabels: Record<string, string> = {
  keynote: "Keynote",
  panel: "Panel",
  workshop: "Workshop",
  fireside_chat: "Fireside Chat",
  presentation: "Presentation",
  demo: "Demo",
  networking: "Networking",
  break: "Break",
  meal: "Meal",
  registration: "Registration",
  other: "Other",
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return ""
  // Handle both full timestamp and time-only formats
  // Parse directly to avoid UTC conversion issues
  try {
    // If it's a full timestamp, extract just the time part
    const timePart = timeStr.includes("T") ? timeStr.split("T")[1]?.split(".")[0] : timeStr
    if (!timePart) return timeStr

    const [hours, minutes] = timePart.split(":")
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return timeStr
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  // Parse as local date to avoid UTC conversion issues
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  })
}

// Generate array of dates between start and end
function getEventDates(startDate: string | null, endDate: string | null): string[] {
  if (!startDate) return []
  const dates: string[] = []
  // Parse as local dates to avoid UTC conversion issues
  const [startYear, startMonth, startDay] = startDate.split('T')[0].split('-').map(Number)
  const start = new Date(startYear, startMonth - 1, startDay)

  let end = start
  if (endDate) {
    const [endYear, endMonth, endDay] = endDate.split('T')[0].split('-').map(Number)
    end = new Date(endYear, endMonth - 1, endDay)
  }

  const current = new Date(start)
  while (current <= end) {
    // Format as YYYY-MM-DD
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    dates.push(dateStr)
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function AgendaList({ eventId, items, eventStartDate, eventEndDate }: AgendaListProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogTab, setDialogTab] = useState<"presentation" | "adhoc">("presentation")

  // Linked presentations
  const [linkedPresentations, setLinkedPresentations] = useState<EventPresentation[]>([])
  const [availablePresentations, setAvailablePresentations] = useState<Presentation[]>([])
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(false)

  // Event rooms and tracks
  const [eventRooms, setEventRooms] = useState<EventRoom[]>([])
  const [eventTracks, setEventTracks] = useState<EventTrack[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    scheduled_date: "",
    start_time: "",
    end_time: "",
    event_room_id: "",
    room: "",
    event_track_id: "",
    track: "",
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Form state for linking presentation
  const [selectedPresentationId, setSelectedPresentationId] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [room, setRoom] = useState("")
  const [track, setTrack] = useState("")

  // Form state for ad-hoc session
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sessionType, setSessionType] = useState<SessionType>("break")
  const [dayNumber, setDayNumber] = useState("1")
  const [adHocStartTime, setAdHocStartTime] = useState("")
  const [adHocEndTime, setAdHocEndTime] = useState("")
  const [location, setLocation] = useState("")

  // Event dates for the date selector
  const eventDates = useMemo(() => getEventDates(eventStartDate || null, eventEndDate || null), [eventStartDate, eventEndDate])

  // Load linked presentations
  useEffect(() => {
    fetch(`/api/events/${eventId}/presentations`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLinkedPresentations(data)
        }
      })
      .catch(console.error)
  }, [eventId])

  // Load event rooms and tracks
  useEffect(() => {
    setIsLoadingRooms(true)
    Promise.all([
      fetch(`/api/events/${eventId}/rooms`).then((res) => res.json()),
      fetch(`/api/events/${eventId}/tracks`).then((res) => res.json()),
    ])
      .then(([roomsData, tracksData]) => {
        if (Array.isArray(roomsData)) {
          setEventRooms(roomsData)
        }
        if (Array.isArray(tracksData)) {
          setEventTracks(tracksData)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingRooms(false))
  }, [eventId])

  // Load available presentations when dialog opens
  useEffect(() => {
    if (isDialogOpen && availablePresentations.length === 0) {
      setIsLoadingPresentations(true)
      fetch("/api/presentations?status=published")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailablePresentations(data)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingPresentations(false))
    }
  }, [isDialogOpen, availablePresentations.length])

  // Filter out already linked presentations and convert to searchable options
  const unlinkedPresentationOptions: SearchableSelectOption[] = useMemo(() => {
    return availablePresentations
      .filter((p) => !linkedPresentations.some((lp) => lp.presentation_id === p.id))
      .map((presentation) => ({
        value: presentation.id,
        label: presentation.title,
        sublabel: presentation.short_description || undefined,
        badge: sessionTypeLabels[presentation.session_type] || presentation.session_type,
        badgeVariant: sessionTypeColors[presentation.session_type] || "default",
      }))
  }, [availablePresentations, linkedPresentations])

  // Group ad-hoc items by day
  const itemsByDay = items.reduce((acc, item) => {
    const day = item.day_number || 1
    if (!acc[day]) acc[day] = []
    acc[day].push(item)
    return acc
  }, {} as Record<number, EventSession[]>)

  const days = Object.keys(itemsByDay).map(Number).sort((a, b) => a - b)

  // Start editing a presentation's schedule
  const handleStartEdit = (ep: EventPresentation) => {
    setEditingId(ep.id)
    setEditForm({
      scheduled_date: ep.scheduled_date || "",
      start_time: ep.start_time || "",
      end_time: ep.end_time || "",
      event_room_id: ep.event_room_id || "",
      room: ep.room || "",
      event_track_id: ep.event_track_id || "",
      track: ep.track || "",
    })
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      scheduled_date: "",
      start_time: "",
      end_time: "",
      event_room_id: "",
      room: "",
      event_track_id: "",
      track: "",
    })
  }

  // Save inline edit
  const handleSaveEdit = async (epId: string) => {
    setIsSavingEdit(true)
    try {
      const response = await fetch(`/api/events/${eventId}/presentations/${epId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduled_date: editForm.scheduled_date || null,
          start_time: editForm.start_time || null,
          end_time: editForm.end_time || null,
          event_room_id: editForm.event_room_id || null,
          room: editForm.room.trim() || null,
          event_track_id: editForm.event_track_id || null,
          track: editForm.track.trim() || null,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        // Update local state
        setLinkedPresentations(prev =>
          prev.map(p => p.id === epId ? { ...p, ...updated } : p)
        )
        handleCancelEdit()
      }
    } catch (error) {
      console.error("Error saving schedule:", error)
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleLinkPresentation = async () => {
    if (!selectedPresentationId) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/${eventId}/presentations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentation_id: selectedPresentationId,
          scheduled_date: scheduledDate || null,
          start_time: startTime || null,
          end_time: endTime || null,
          room: room.trim() || null,
          track: track.trim() || null,
          display_order: linkedPresentations.length,
        }),
      })

      if (response.ok) {
        const newLink = await response.json()
        setLinkedPresentations([...linkedPresentations, newLink])
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error linking presentation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddAdHocItem = async () => {
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/${eventId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          session_type: sessionType,
          day_number: parseInt(dayNumber),
          start_time: adHocStartTime || null,
          end_time: adHocEndTime || null,
          location: location.trim() || null,
          position: items.length,
        }),
      })

      if (response.ok) {
        resetForm()
        setIsDialogOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error adding session:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnlinkPresentation = async (linkId: string) => {
    if (!confirm("Remove this presentation from the event?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/presentations/${linkId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLinkedPresentations(linkedPresentations.filter((p) => p.id !== linkId))
      }
    } catch (error) {
      console.error("Error unlinking presentation:", error)
    }
  }

  const handleDeleteAdHocItem = async (itemId: string) => {
    if (!confirm("Delete this session?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/sessions/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  const resetForm = () => {
    setSelectedPresentationId("")
    setScheduledDate("")
    setStartTime("")
    setEndTime("")
    setRoom("")
    setTrack("")
    setTitle("")
    setDescription("")
    setSessionType("break")
    setDayNumber("1")
    setAdHocStartTime("")
    setAdHocEndTime("")
    setLocation("")
  }

  const totalSessions = linkedPresentations.length + items.length

  // Get room name by ID
  const getRoomName = (roomId: string | null, roomText: string | null): string => {
    if (roomId && eventRooms.length > 0) {
      const room = eventRooms.find(r => r.id === roomId)
      return room?.name || roomText || ""
    }
    return roomText || ""
  }

  const getTrackInfo = (trackId: string | null, trackText: string | null): { name: string; color: string | null } | null => {
    if (trackId && eventTracks.length > 0) {
      const track = eventTracks.find(t => t.id === trackId)
      if (track) return { name: track.name, color: track.color }
    }
    if (trackText) return { name: trackText, color: null }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Agenda</CardTitle>
            <CardDescription>
              {linkedPresentations.length} presentations, {items.length} other sessions
              {eventRooms.length > 0 && ` • ${eventRooms.length} rooms`}
              {eventTracks.length > 0 && ` • ${eventTracks.length} tracks`}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add to Agenda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add to Agenda</DialogTitle>
                <DialogDescription>
                  Link an existing presentation or add a break/networking session.
                </DialogDescription>
              </DialogHeader>

              <Tabs value={dialogTab} onValueChange={(v) => setDialogTab(v as "presentation" | "adhoc")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="presentation">Link Presentation</TabsTrigger>
                  <TabsTrigger value="adhoc">Add Break/Other</TabsTrigger>
                </TabsList>

                <TabsContent value="presentation" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Presentation *</Label>
                    {unlinkedPresentationOptions.length === 0 && !isLoadingPresentations ? (
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>No available presentations to link.</p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/dashboard/presentations/new">Create Presentation</Link>
                        </Button>
                      </div>
                    ) : (
                      <SearchableSelect
                        options={unlinkedPresentationOptions}
                        value={selectedPresentationId}
                        onValueChange={setSelectedPresentationId}
                        placeholder="Search for a presentation..."
                        searchPlaceholder="Type to search presentations..."
                        emptyMessage="No presentations found."
                        isLoading={isLoadingPresentations}
                      />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Scheduling is optional. You can add presentations now and schedule them later using the edit button.
                  </p>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLinkPresentation} disabled={isSubmitting || !selectedPresentationId}>
                      {isSubmitting ? "Linking..." : "Link Presentation"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="adhoc" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Coffee Break"
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={sessionType} onValueChange={(v) => setSessionType(v as SessionType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="break">Break</SelectItem>
                          <SelectItem value="meal">Meal</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="registration">Registration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select value={dayNumber} onValueChange={setDayNumber}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Day 1</SelectItem>
                          <SelectItem value="2">Day 2</SelectItem>
                          <SelectItem value="3">Day 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-3">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={adHocStartTime}
                        onChange={(e) => setAdHocStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={adHocEndTime}
                        onChange={(e) => setAdHocEndTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Lobby"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAdHocItem} disabled={isSubmitting || !title.trim()}>
                      {isSubmitting ? "Adding..." : "Add Item"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {totalSessions === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No agenda items yet. Add presentations or breaks above.
          </p>
        ) : (
          <div className="space-y-8">
            {/* Linked Presentations */}
            {linkedPresentations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Presentations ({linkedPresentations.length})
                </h3>
                <div className="space-y-3">
                  {linkedPresentations.map((ep) => (
                    <div key={ep.id} className="rounded-lg border bg-card overflow-hidden">
                      {/* Main presentation row */}
                      <div
                        className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${editingId === ep.id ? 'bg-muted/30' : ''}`}
                      >
                        <div className="flex flex-col items-center text-center min-w-[80px] text-sm">
                          {ep.scheduled_date ? (
                            <>
                              <span className="text-muted-foreground">{formatDate(ep.scheduled_date)}</span>
                              {ep.start_time && (
                                <span className="font-medium">{formatTime(ep.start_time)}</span>
                              )}
                              {ep.end_time && (
                                <span className="text-xs text-muted-foreground">to {formatTime(ep.end_time)}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs">Not scheduled</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={sessionTypeColors[ep.presentation.session_type] || "default"} className="text-xs">
                              {sessionTypeLabels[ep.presentation.session_type] || ep.presentation.session_type}
                            </Badge>
                            {ep.is_featured && (
                              <Badge variant="success" className="text-xs">Featured</Badge>
                            )}
                            {ep.presentation.recording_url && (
                              <Play className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <Link
                            href={`/dashboard/presentations/${ep.presentation.id}`}
                            className="font-medium hover:underline"
                          >
                            {ep.presentation.title}
                          </Link>

                          {/* Show speakers */}
                          {ep.presentation.panelists && ep.presentation.panelists.length > 0 ? (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex -space-x-2">
                                {ep.presentation.panelists.slice(0, 3).map((p) => (
                                  p.contact.avatar_url ? (
                                    <img
                                      key={p.id}
                                      src={p.contact.avatar_url}
                                      alt={`${p.contact.first_name} ${p.contact.last_name}`}
                                      className="w-6 h-6 rounded-full border-2 border-background"
                                    />
                                  ) : (
                                    <div key={p.id} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                      {p.contact.first_name.charAt(0)}
                                    </div>
                                  )
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {ep.presentation.panelists.map((p) => `${p.contact.first_name} ${p.contact.last_name}`).join(", ")}
                              </span>
                            </div>
                          ) : ep.presentation.contact && (
                            <div className="flex items-center gap-2 mt-2">
                              {ep.presentation.contact.avatar_url ? (
                                <img
                                  src={ep.presentation.contact.avatar_url}
                                  alt={`${ep.presentation.contact.first_name} ${ep.presentation.contact.last_name}`}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                  {ep.presentation.contact.first_name.charAt(0)}
                                </div>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {ep.presentation.contact.first_name} {ep.presentation.contact.last_name}
                              </span>
                            </div>
                          )}

                          {/* Location info */}
                          {(ep.room || ep.event_room_id || ep.track || ep.event_track_id) && (
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {(ep.room || ep.event_room_id) && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {getRoomName(ep.event_room_id, ep.room)}
                                </span>
                              )}
                              {(() => {
                                const trackInfo = getTrackInfo(ep.event_track_id, ep.track)
                                if (trackInfo) {
                                  return (
                                    <span className="flex items-center gap-1">
                                      {trackInfo.color && (
                                        <span
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: trackInfo.color }}
                                        />
                                      )}
                                      {trackInfo.name}
                                    </span>
                                  )
                                }
                                return null
                              })()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingId === ep.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveEdit(ep.id)}
                                disabled={isSavingEdit}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                disabled={isSavingEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartEdit(ep)}
                                title="Edit schedule"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/presentations/${ep.presentation.id}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUnlinkPresentation(ep.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline edit form */}
                      {editingId === ep.id && (
                        <div className="px-4 pb-4 pt-2 border-t bg-muted/20">
                          <div className="grid gap-4 md:grid-cols-5">
                            {/* Date selector */}
                            <div className="space-y-1">
                              <Label className="text-xs">Date</Label>
                              {eventDates.length > 0 ? (
                                <Select
                                  value={editForm.scheduled_date}
                                  onValueChange={(v) => setEditForm({ ...editForm, scheduled_date: v })}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select date" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {eventDates.map((date) => (
                                      <SelectItem key={date} value={date}>
                                        {formatDate(date)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  type="date"
                                  value={editForm.scheduled_date}
                                  onChange={(e) => setEditForm({ ...editForm, scheduled_date: e.target.value })}
                                  className="h-9"
                                />
                              )}
                            </div>

                            {/* Start time */}
                            <div className="space-y-1">
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={editForm.start_time}
                                onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                                className="h-9"
                              />
                            </div>

                            {/* End time */}
                            <div className="space-y-1">
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={editForm.end_time}
                                onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                                className="h-9"
                              />
                            </div>

                            {/* Room selector */}
                            <div className="space-y-1">
                              <Label className="text-xs">Room</Label>
                              {eventRooms.length > 0 ? (
                                <Select
                                  value={editForm.event_room_id}
                                  onValueChange={(v) => setEditForm({ ...editForm, event_room_id: v, room: "" })}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {eventRooms.map((room) => (
                                      <SelectItem key={room.id} value={room.id}>
                                        {room.name}
                                        {room.capacity && (
                                          <span className="text-muted-foreground ml-1">
                                            ({room.capacity})
                                          </span>
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={editForm.room}
                                  onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                                  placeholder="Room name"
                                  className="h-9"
                                />
                              )}
                            </div>

                            {/* Track selector */}
                            <div className="space-y-1">
                              <Label className="text-xs">Track</Label>
                              {eventTracks.length > 0 ? (
                                <Select
                                  value={editForm.event_track_id}
                                  onValueChange={(v) => setEditForm({ ...editForm, event_track_id: v, track: "" })}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select track" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {eventTracks.map((track) => (
                                      <SelectItem key={track.id} value={track.id}>
                                        <span className="flex items-center gap-2">
                                          {track.color && (
                                            <span
                                              className="w-2 h-2 rounded-full flex-shrink-0"
                                              style={{ backgroundColor: track.color }}
                                            />
                                          )}
                                          {track.name}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={editForm.track}
                                  onChange={(e) => setEditForm({ ...editForm, track: e.target.value })}
                                  placeholder="e.g. Business"
                                  className="h-9"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad-hoc Sessions (breaks, meals, etc.) */}
            {items.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Breaks & Other ({items.length})
                </h3>
                {days.map((day) => (
                  <div key={day} className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Day {day}</h4>
                    <div className="space-y-2">
                      {itemsByDay[day].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground text-sm min-w-[80px]">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(item.start_time) || "TBD"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.title}</span>
                              <Badge variant={sessionTypeColors[item.session_type] || "secondary"} className="text-xs">
                                {sessionTypeLabels[item.session_type] || item.session_type}
                              </Badge>
                            </div>
                            {item.location && (
                              <p className="text-xs text-muted-foreground">{item.location}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAdHocItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

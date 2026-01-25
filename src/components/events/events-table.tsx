"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, Calendar, MapPin } from "lucide-react"
import type { Event } from "@/types/database"
import { DuplicateEventButton } from "./duplicate-event-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

/**
 * Status badge color mapping
 */
const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info" | "destructive"> = {
  draft: "secondary",
  announced: "info",
  registration_open: "success",
  sold_out: "warning",
  completed: "default",
  cancelled: "destructive",
}

/**
 * Status display labels
 */
const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  completed: "Completed",
  archived: "Archived",
}

interface EventsTableProps {
  events: Event[]
}

/**
 * Format date for display in Eastern timezone
 */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  // Parse the date string and treat it as a local date (not UTC)
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  })
}

/**
 * Events Table Component
 *
 * Displays events in a sortable, filterable table.
 * Includes actions for view, edit, and delete.
 */
export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filter events based on search and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle delete with confirmation
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all agenda items, exhibitors, and leaders.`)) {
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event")
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredEvents.length} of {events.length} events
      </p>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {events.length === 0 ? (
                    <div className="text-muted-foreground">
                      No events yet.{" "}
                      <Link
                        href="/dashboard/events/new"
                        className="text-primary underline"
                      >
                        Create your first event
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No events match your filters.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="font-medium hover:underline"
                    >
                      {event.name}
                    </Link>
                    {event.tagline && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {event.tagline}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date && (
                        <> - {formatDate(event.end_date)}</>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.city ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {event.city}{event.state && `, ${event.state}`}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[event.status] || "default"}>
                      {statusLabels[event.status] || event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Manage Event"
                      >
                        <Link href={`/dashboard/events/${event.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      {event.slug && event.status !== "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View Public Page"
                        >
                          <Link href={`/${event.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <DuplicateEventButton
                        eventId={event.id}
                        eventName={event.name}
                        eventSlug={event.slug}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(event.id, event.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

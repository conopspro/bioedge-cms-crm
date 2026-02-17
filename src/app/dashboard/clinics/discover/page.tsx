"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Globe,
  Star,
  Check,
  X,
  Mail,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Tag presets for Google Places search
const TAG_PRESETS = [
  "Longevity Clinic",
  "Functional Medicine",
  "Anti-Aging Clinic",
  "Biohacking",
  "Cryotherapy",
  "IV Therapy",
  "NAD+ Therapy",
  "Peptide Therapy",
  "Stem Cell Therapy",
  "Hormone Therapy",
  "Wellness Spa",
  "Med Spa",
  "Integrative Medicine",
  "Regenerative Medicine",
  "Hyperbaric Oxygen Therapy",
  "Red Light Therapy",
]

interface QueueItem {
  id: string
  name: string
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  website: string | null
  google_rating: number | null
  reviews_count: number
  email: string | null
  search_tag: string
  search_location: string
  perplexity_status: string
  status: string
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Top 50 US metro area suggestions for the location input
const METRO_SUGGESTIONS = [
  "New York metro area",
  "Los Angeles metro area",
  "Chicago metro area",
  "Dallas-Fort Worth metro area",
  "Houston metro area",
  "Washington, D.C. metro area",
  "Philadelphia metro area",
  "Greater Miami",
  "Atlanta metro area",
  "Greater Boston",
  "San Francisco Bay Area",
  "Greater Phoenix",
  "Riverside-San Bernardino metro area",
  "Detroit metro area",
  "Greater Seattle",
  "Minneapolis-St. Paul",
  "San Diego metro area",
  "Tampa Bay Area",
  "Denver metro area",
  "St. Louis metro area",
  "Baltimore metro area",
  "Orlando metro area",
  "Charlotte metro area",
  "San Antonio metro area",
  "Portland, OR metro area",
  "Sacramento metro area",
  "Pittsburgh metro area",
  "Las Vegas metro area",
  "Austin, TX metro area",
  "Cincinnati metro area",
  "Kansas City metro area",
  "Columbus, OH metro area",
  "Indianapolis metro area",
  "Cleveland metro area",
  "San Jose metro area",
  "Nashville metro area",
  "Virginia Beach-Norfolk metro area",
  "Providence metro area",
  "Milwaukee metro area",
  "Jacksonville, FL metro area",
  "Oklahoma City metro area",
  "Raleigh-Durham metro area",
  "Memphis metro area",
  "Richmond, VA metro area",
  "Louisville metro area",
  "New Orleans metro area",
  "Salt Lake City metro area",
  "Hartford metro area",
  "Birmingham, AL metro area",
  "Scottsdale-Mesa, AZ",
]

export default function DiscoverClinicsPage() {
  // Search state
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [searchLocation, setSearchLocation] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    inserted: number
    skipped: number
    tagsSearched: number
    nextPageToken: string | null
  } | null>(null)
  const [searchProgress, setSearchProgress] = useState<string | null>(null)
  const [pageToken, setPageToken] = useState<string | null>(null)

  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [lookupProgress, setLookupProgress] = useState<string | null>(null)

  // Fetch queue
  const fetchQueue = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("limit", "50")
        if (statusFilter && statusFilter !== "all") params.set("status", statusFilter)
        const res = await fetch(`/api/clinic-queue?${params.toString()}`)
        if (res.ok) {
          const result = await res.json()
          setQueue(result.data)
          setPagination(result.pagination)
        }
      } catch (error) {
        console.error("Failed to fetch queue:", error)
      } finally {
        setLoading(false)
      }
    },
    [statusFilter]
  )

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // Toggle a tag on/off
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const selectAllTags = () => {
    if (selectedTags.size === TAG_PRESETS.length) {
      setSelectedTags(new Set())
    } else {
      setSelectedTags(new Set(TAG_PRESETS))
    }
  }

  // Search Google Places — loops through each selected tag sequentially
  const handleSearch = async (nextPage = false) => {
    if (selectedTags.size === 0 || !searchLocation) return
    setSearching(true)
    setSearchResult(null)
    setSearchProgress(null)

    const tags = Array.from(selectedTags)
    let totalInserted = 0
    let totalSkipped = 0
    let lastNextPageToken: string | null = null

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      setSearchProgress(`Searching "${tag}" (${i + 1}/${tags.length})...`)

      try {
        const res = await fetch("/api/clinics/search-places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag,
            location: searchLocation,
            pageToken: nextPage && i === 0 ? pageToken : undefined,
          }),
        })
        if (res.ok) {
          const result = await res.json()
          totalInserted += result.inserted
          totalSkipped += result.skipped
          // Only track nextPageToken for single-tag searches
          if (tags.length === 1) {
            lastNextPageToken = result.nextPageToken
          }
        } else {
          const err = await res.json()
          console.error(`Search failed for "${tag}":`, err.error)
        }
      } catch {
        console.error(`Search failed for "${tag}"`)
      }

      // Small delay between tags to avoid rate limiting
      if (i < tags.length - 1) {
        await new Promise((r) => setTimeout(r, 500))
      }
    }

    setSearchResult({
      inserted: totalInserted,
      skipped: totalSkipped,
      tagsSearched: tags.length,
      nextPageToken: lastNextPageToken,
    })
    setPageToken(lastNextPageToken)
    setSearchProgress(null)
    setSearching(false)
    fetchQueue(1)
  }

  // Bulk actions
  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selected.size === 0) return
    const label = action === "approve" ? "approve" : action === "reject" ? "reject" : "delete"
    if (!confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selected.size} items?`)) return

    setBulkProcessing(true)
    try {
      const res = await fetch("/api/clinic-queue/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selected) }),
      })
      if (res.ok) {
        const result = await res.json()
        setSelected(new Set())
        fetchQueue(pagination.page)
        if (result.errors?.length > 0) {
          alert(`Completed with ${result.errors.length} errors:\n${result.errors.slice(0, 5).join("\n")}`)
        }
      } else {
        alert("Action failed")
      }
    } catch {
      alert("Action failed")
    } finally {
      setBulkProcessing(false)
    }
  }

  // Email lookup
  const handleEmailLookup = async () => {
    const pendingIds = Array.from(selected).filter((id) => {
      const item = queue.find((q) => q.id === id)
      return item && item.website && item.perplexity_status === "pending"
    })
    if (pendingIds.length === 0) {
      alert("No selected items with websites and pending email status")
      return
    }

    setBulkProcessing(true)
    // Process in batches of 5
    const batchSize = 5
    let totalFound = 0
    let totalProcessed = 0

    for (let i = 0; i < pendingIds.length; i += batchSize) {
      const batch = pendingIds.slice(i, i + batchSize)
      setLookupProgress(`Looking up emails: ${i + 1}–${Math.min(i + batchSize, pendingIds.length)} of ${pendingIds.length}...`)

      try {
        const res = await fetch("/api/clinic-queue/lookup-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: batch }),
        })
        if (res.ok) {
          const result = await res.json()
          totalFound += result.found
          totalProcessed += result.processed
        }
      } catch {
        // continue with next batch
      }

      // Delay between batches
      if (i + batchSize < pendingIds.length) {
        await new Promise((r) => setTimeout(r, 3000))
      }
    }

    setLookupProgress(null)
    setBulkProcessing(false)
    setSelected(new Set())
    fetchQueue(pagination.page)
    alert(`Email lookup complete: ${totalFound} found out of ${totalProcessed} processed`)
  }

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === queue.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(queue.map((q) => q.id)))
    }
  }

  // Status badge color
  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-700">Approved</Badge>
      case "imported":
        return <Badge variant="success">Imported</Badge>
      case "rejected":
        return <Badge variant="secondary">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const perplexityBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-xs text-muted-foreground">—</span>
      case "searching":
        return <Badge variant="outline"><Loader2 className="h-3 w-3 animate-spin mr-1" />Searching</Badge>
      case "found":
        return <Badge variant="success">Found</Badge>
      case "not_found":
        return <Badge variant="secondary">Not found</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <span className="text-xs text-muted-foreground">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clinics">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discover Clinics</h1>
            <p className="text-muted-foreground">
              Search Google Places and manage the review queue
            </p>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Search Google Places</h2>

        {/* Tag Multi-Select */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Tags / Categories</label>
            <button
              type="button"
              onClick={selectAllTags}
              className="text-xs text-electric-blue hover:underline"
            >
              {selectedTags.size === TAG_PRESETS.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TAG_PRESETS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                  selectedTags.has(tag)
                    ? "bg-electric-blue text-white border-electric-blue"
                    : "bg-background text-foreground border-border hover:border-electric-blue/50 hover:bg-muted"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.size > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedTags.size} tag{selectedTags.size !== 1 ? "s" : ""} selected
              {selectedTags.size > 1 && " — each tag will be searched separately"}
            </p>
          )}
        </div>

        {/* Location + Search */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[300px]">
            <label className="text-sm font-medium mb-1 block">Location</label>
            <input
              type="text"
              placeholder='City, state, or metro area (e.g., "San Francisco Bay Area")'
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              list="metro-suggestions"
            />
            <datalist id="metro-suggestions">
              {METRO_SUGGESTIONS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <p className="mt-1 text-xs text-muted-foreground">
              Tip: Use metro areas for broader coverage (e.g., &quot;Dallas-Fort Worth metro area&quot;, &quot;Greater Boston&quot;, &quot;San Francisco Bay Area&quot;)
            </p>
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={searching || selectedTags.size === 0 || !searchLocation}
          >
            {searching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {searching ? (searchProgress || "Searching...") : "Search"}
          </Button>
        </div>

        {/* Search results summary */}
        {searchResult && (
          <div className="mt-4 flex items-center gap-4">
            <p className="text-sm">
              {searchResult.tagsSearched > 1 && (
                <span className="text-muted-foreground">{searchResult.tagsSearched} tags searched — </span>
              )}
              <span className="font-medium text-green-600">{searchResult.inserted} new</span>{" "}
              added to queue,{" "}
              <span className="text-muted-foreground">{searchResult.skipped} already in database</span>
            </p>
            {searchResult.nextPageToken && selectedTags.size === 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch(true)}
                disabled={searching}
              >
                Load More Results
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkAction("approve")}
              disabled={bulkProcessing}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkAction("reject")}
              disabled={bulkProcessing}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEmailLookup}
              disabled={bulkProcessing}
            >
              <Mail className="mr-1 h-3.5 w-3.5" />
              {lookupProgress || "Lookup Emails"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction("delete")}
              disabled={bulkProcessing}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
          {bulkProcessing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      )}

      {/* Queue Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="imported">Imported</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => fetchQueue(pagination.page)}>
          <RefreshCw className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          {pagination.total.toLocaleString()} items in queue
        </span>
      </div>

      {/* Queue Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No items in queue</h3>
          <p className="text-muted-foreground mt-1">
            Search Google Places above to discover new clinics.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selected.size === queue.length && queue.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Email Status</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Tag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => {
                  const location = [item.city, item.state].filter(Boolean).join(", ")
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm">{location || "—"}</TableCell>
                      <TableCell className="text-center">
                        {item.google_rating ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{item.google_rating}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-electric-blue hover:underline"
                          >
                            Visit
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.email || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {perplexityBadge(item.perplexity_status)}
                      </TableCell>
                      <TableCell className="text-center">
                        {statusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.search_tag}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchQueue(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchQueue(pagination.page + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

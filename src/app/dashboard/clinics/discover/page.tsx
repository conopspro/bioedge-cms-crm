"use client"

import { useEffect, useState, useCallback, useRef } from "react"
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
  MapPin,
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

// Tag presets for Google Places search (alphabetical)
const TAG_PRESETS = [
  "Anti-Aging Clinic",
  "Biohacking",
  "Cryotherapy",
  "EBO2",
  "Exosome Therapy",
  "Functional Medicine",
  "Functional Neurology",
  "Hormone Therapy",
  "Hyperbaric Oxygen Therapy",
  "Integrative Medicine",
  "IV Therapy",
  "Longevity Clinic",
  "Med Spa",
  "Methylene Blue Therapy",
  "Microcurrent Therapy",
  "NAD+ Therapy",
  "Ozone Therapy",
  "PEMF Therapy",
  "Peptide Therapy",
  "PRP Therapy",
  "Red Light Therapy",
  "Regenerative Medicine",
  "Shockwave Therapy",
  "Stem Cell Therapy",
  "Structural Therapy",
  "Vibroacoustic Therapy",
  "VO2 Max Testing",
  "Wellness Spa",
]

// Metro sub-areas: when a user picks a metro, we search each sub-area separately
// to get much deeper coverage than a single "metro area" query
const METRO_SUB_AREAS: Record<string, string[]> = {
  "New York metro area": [
    "Manhattan, NY",
    "Brooklyn, NY",
    "Queens, NY",
    "Bronx, NY",
    "Staten Island, NY",
    "Long Island, NY",
    "The Hamptons, NY",
    "Westchester County, NY",
    "Jersey City, NJ",
    "Hoboken, NJ",
    "Newark, NJ",
    "White Plains, NY",
    "Stamford, CT",
  ],
  "Los Angeles metro area": [
    "Los Angeles, CA",
    "Beverly Hills, CA",
    "Santa Monica, CA",
    "West Hollywood, CA",
    "Pasadena, CA",
    "Burbank, CA",
    "Long Beach, CA",
    "Malibu, CA",
    "Culver City, CA",
    "Glendale, CA",
    "Calabasas, CA",
    "Manhattan Beach, CA",
    "Brentwood, Los Angeles, CA",
  ],
  "Chicago metro area": [
    "Chicago, IL",
    "Evanston, IL",
    "Oak Park, IL",
    "Naperville, IL",
    "Schaumburg, IL",
    "Highland Park, IL",
    "Lake Forest, IL",
    "Hinsdale, IL",
    "Winnetka, IL",
  ],
  "Dallas-Fort Worth metro area": [
    "Dallas, TX",
    "Fort Worth, TX",
    "Plano, TX",
    "Frisco, TX",
    "Arlington, TX",
    "McKinney, TX",
    "Southlake, TX",
    "Highland Park, TX",
    "Allen, TX",
  ],
  "Houston metro area": [
    "Houston, TX",
    "The Woodlands, TX",
    "Sugar Land, TX",
    "Katy, TX",
    "Pearland, TX",
    "League City, TX",
    "Cypress, TX",
    "Memorial, Houston, TX",
  ],
  "Washington, D.C. metro area": [
    "Washington, D.C.",
    "Arlington, VA",
    "Alexandria, VA",
    "Bethesda, MD",
    "McLean, VA",
    "Chevy Chase, MD",
    "Tysons, VA",
    "Reston, VA",
    "Rockville, MD",
  ],
  "San Francisco Bay Area": [
    "San Francisco, CA",
    "Oakland, CA",
    "San Jose, CA",
    "Palo Alto, CA",
    "Berkeley, CA",
    "Walnut Creek, CA",
    "Mill Valley, CA",
    "Sausalito, CA",
    "Menlo Park, CA",
    "Mountain View, CA",
    "Los Gatos, CA",
    "San Mateo, CA",
  ],
  "Greater Miami": [
    "Miami, FL",
    "Miami Beach, FL",
    "Coral Gables, FL",
    "Brickell, Miami, FL",
    "Coconut Grove, Miami, FL",
    "Fort Lauderdale, FL",
    "Boca Raton, FL",
    "West Palm Beach, FL",
    "Aventura, FL",
    "Key Biscayne, FL",
  ],
  "Greater Boston": [
    "Boston, MA",
    "Cambridge, MA",
    "Brookline, MA",
    "Newton, MA",
    "Wellesley, MA",
    "Concord, MA",
    "Lexington, MA",
    "Salem, MA",
    "Needham, MA",
  ],
  "Greater Phoenix": [
    "Phoenix, AZ",
    "Scottsdale, AZ",
    "Paradise Valley, AZ",
    "Tempe, AZ",
    "Mesa, AZ",
    "Chandler, AZ",
    "Gilbert, AZ",
    "Peoria, AZ",
  ],
  "Greater Seattle": [
    "Seattle, WA",
    "Bellevue, WA",
    "Kirkland, WA",
    "Redmond, WA",
    "Mercer Island, WA",
    "Issaquah, WA",
    "Bothell, WA",
    "Edmonds, WA",
  ],
  "Atlanta metro area": [
    "Atlanta, GA",
    "Buckhead, Atlanta, GA",
    "Decatur, GA",
    "Alpharetta, GA",
    "Roswell, GA",
    "Marietta, GA",
    "Sandy Springs, GA",
    "Brookhaven, GA",
  ],
  "Denver metro area": [
    "Denver, CO",
    "Cherry Creek, Denver, CO",
    "Boulder, CO",
    "Littleton, CO",
    "Englewood, CO",
    "Greenwood Village, CO",
    "Lone Tree, CO",
    "Parker, CO",
  ],
  "Tampa Bay Area": [
    "Tampa, FL",
    "St. Petersburg, FL",
    "Clearwater, FL",
    "Sarasota, FL",
    "Lakewood Ranch, FL",
    "Brandon, FL",
    "Wesley Chapel, FL",
  ],
  "San Diego metro area": [
    "San Diego, CA",
    "La Jolla, CA",
    "Del Mar, CA",
    "Encinitas, CA",
    "Carlsbad, CA",
    "Coronado, CA",
    "Chula Vista, CA",
  ],
  "Nashville metro area": [
    "Nashville, TN",
    "Franklin, TN",
    "Brentwood, TN",
    "Murfreesboro, TN",
    "Hendersonville, TN",
    "Green Hills, Nashville, TN",
  ],
  "Austin, TX metro area": [
    "Austin, TX",
    "Round Rock, TX",
    "Cedar Park, TX",
    "Lakeway, TX",
    "West Lake Hills, TX",
    "Dripping Springs, TX",
  ],
  "Raleigh-Durham metro area": [
    "Raleigh, NC",
    "Durham, NC",
    "Chapel Hill, NC",
    "Cary, NC",
    "Wake Forest, NC",
    "Apex, NC",
  ],
  "Las Vegas metro area": [
    "Las Vegas, NV",
    "Henderson, NV",
    "Summerlin, Las Vegas, NV",
    "Green Valley, Henderson, NV",
    "Spring Valley, Las Vegas, NV",
  ],
  "Minneapolis-St. Paul": [
    "Minneapolis, MN",
    "St. Paul, MN",
    "Edina, MN",
    "Wayzata, MN",
    "Minnetonka, MN",
    "Bloomington, MN",
    "Plymouth, MN",
  ],
  "Portland, OR metro area": [
    "Portland, OR",
    "Lake Oswego, OR",
    "Beaverton, OR",
    "West Linn, OR",
    "Tigard, OR",
    "Vancouver, WA",
  ],
  "Charlotte metro area": [
    "Charlotte, NC",
    "Ballantyne, Charlotte, NC",
    "South End, Charlotte, NC",
    "Huntersville, NC",
    "Cornelius, NC",
    "Lake Norman, NC",
  ],
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

export default function DiscoverClinicsPage() {
  // Search state
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [searchLocation, setSearchLocation] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    inserted: number
    skipped: number
    tagsMerged: number
    searchesRun: number
  } | null>(null)
  const [searchProgress, setSearchProgress] = useState<string | null>(null)

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
  const [allProgress, setAllProgress] = useState<string | null>(null)
  const abortRef = useRef(false)

  // Fetch queue
  const fetchQueue = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("limit", "100")
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

  /**
   * Resolve the location into sub-areas if it matches a known metro,
   * otherwise return it as a single-item array.
   */
  const resolveLocations = (location: string): string[] => {
    // Check if the entered location matches a metro with sub-areas
    const subAreas = METRO_SUB_AREAS[location]
    if (subAreas) return subAreas
    return [location]
  }

  // Search Google Places — loops through tags × locations (with metro expansion)
  // API now auto-paginates (up to 3 pages / ~60 results per query)
  const handleSearch = async () => {
    if (selectedTags.size === 0 || !searchLocation) return
    setSearching(true)
    setSearchResult(null)
    setSearchProgress(null)

    const tags = Array.from(selectedTags)
    const locations = resolveLocations(searchLocation.trim())
    const totalCombos = tags.length * locations.length

    let totalInserted = 0
    let totalSkipped = 0
    let totalTagsMerged = 0
    let searchesRun = 0

    for (let t = 0; t < tags.length; t++) {
      const tag = tags[t]
      for (let l = 0; l < locations.length; l++) {
        const location = locations[l]
        searchesRun++

        const label = locations.length > 1
          ? `"${tag}" in ${location} (${searchesRun}/${totalCombos})`
          : `"${tag}" (${t + 1}/${tags.length})`
        setSearchProgress(label)

        try {
          const res = await fetch("/api/clinics/search-places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag, location }),
          })
          if (res.ok) {
            const result = await res.json()
            totalInserted += result.inserted
            totalSkipped += result.skipped
            totalTagsMerged += result.tagsMerged || 0

            // Update running totals in real time
            const parts = [`${searchesRun}/${totalCombos}`]
            if (totalInserted > 0) parts.push(`${totalInserted} new`)
            if (totalTagsMerged > 0) parts.push(`${totalTagsMerged} tags merged`)
            parts.push(`${totalSkipped} skipped`)
            setSearchProgress(`${label} — ${parts.slice(1).join(", ")}`)
          } else {
            const err = await res.json()
            console.error(`Search failed for "${tag}" in ${location}:`, err.error)
          }
        } catch {
          console.error(`Search failed for "${tag}" in ${location}`)
        }

        // Small delay between searches to avoid rate limiting
        if (searchesRun < totalCombos) {
          await new Promise((r) => setTimeout(r, 500))
        }
      }
    }

    setSearchResult({
      inserted: totalInserted,
      skipped: totalSkipped,
      tagsMerged: totalTagsMerged,
      searchesRun,
    })
    setSearchProgress(null)
    setSearching(false)
    fetchQueue(1)
  }

  // Check if the current location has sub-area expansion
  const hasSubAreas = METRO_SUB_AREAS[searchLocation.trim()] !== undefined
  const subAreaCount = hasSubAreas ? METRO_SUB_AREAS[searchLocation.trim()].length : 0

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

  // Lookup ALL emails (server-side batching, no selection needed)
  const handleLookupAllEmails = async () => {
    if (!confirm("This will look up emails for ALL pending queue items with websites. This may use significant Perplexity API credits. Continue?")) return

    setBulkProcessing(true)
    abortRef.current = false
    let totalProcessed = 0
    let totalFound = 0
    let totalNotFound = 0
    let totalErrors = 0
    let remaining = -1

    while (remaining !== 0 && !abortRef.current) {
      try {
        setAllProgress(
          remaining > 0
            ? `Looking up emails: ${totalProcessed} done, ${totalFound} found, ${remaining} remaining...`
            : `Looking up emails: starting...`
        )

        const res = await fetch("/api/clinic-queue/lookup-email-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchSize: 10 }),
        })

        if (!res.ok) {
          const err = await res.json()
          alert(`Error: ${err.error || "Unknown error"}`)
          break
        }

        const result = await res.json()
        totalProcessed += result.processed
        totalFound += result.found
        totalNotFound += result.notFound
        totalErrors += result.errors
        remaining = result.remaining

        setAllProgress(
          `Looking up emails: ${totalProcessed} done, ${totalFound} found, ${remaining} remaining...`
        )

        if (remaining === 0) break

        // Brief pause between batches
        await new Promise((r) => setTimeout(r, 1000))
      } catch {
        alert("Email lookup failed unexpectedly")
        break
      }
    }

    setAllProgress(null)
    setBulkProcessing(false)
    abortRef.current = false
    fetchQueue(pagination.page)
    alert(
      `Email lookup complete!\n\n${totalProcessed} processed\n${totalFound} emails found\n${totalNotFound} not found\n${totalErrors} errors`
    )
  }

  // Approve ALL pending queue items (server-side batching)
  const handleApproveAll = async (filterPerplexity?: string) => {
    const label = filterPerplexity === "found"
      ? "ALL pending items with found emails"
      : "ALL pending items"
    if (!confirm(`Approve and import ${label} into the clinics table? This cannot be undone.`)) return

    setBulkProcessing(true)
    abortRef.current = false
    let totalProcessed = 0
    let totalErrors: string[] = []
    let remaining = -1

    while (remaining !== 0 && !abortRef.current) {
      try {
        setAllProgress(
          remaining > 0
            ? `Approving: ${totalProcessed} imported, ${remaining} remaining...`
            : `Approving: starting...`
        )

        const res = await fetch("/api/clinic-queue/bulk-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve",
            batchSize: 50,
            ...(filterPerplexity ? { filter: { perplexity_status: filterPerplexity } } : {}),
          }),
        })

        if (!res.ok) {
          const err = await res.json()
          alert(`Error: ${err.error || "Unknown error"}`)
          break
        }

        const result = await res.json()
        totalProcessed += result.processed
        totalErrors = totalErrors.concat(result.errors || [])
        remaining = result.remaining

        setAllProgress(
          `Approving: ${totalProcessed} imported, ${remaining} remaining...`
        )

        if (remaining === 0) break
      } catch {
        alert("Approve all failed unexpectedly")
        break
      }
    }

    setAllProgress(null)
    setBulkProcessing(false)
    abortRef.current = false
    setSelected(new Set())
    fetchQueue(pagination.page)

    if (totalErrors.length > 0) {
      alert(
        `Approved ${totalProcessed} items with ${totalErrors.length} errors:\n${totalErrors.slice(0, 5).join("\n")}${totalErrors.length > 5 ? `\n... and ${totalErrors.length - 5} more` : ""}`
      )
    } else {
      alert(`Successfully imported ${totalProcessed} clinics!`)
    }
  }

  // Stop an in-progress "all" operation
  const handleStopAll = () => {
    abortRef.current = true
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
            {hasSubAreas ? (
              <div className="mt-2 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/30 px-3 py-2">
                <MapPin className="h-4 w-4 text-electric-blue mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-medium text-electric-blue">Deep search enabled</span>
                  <span className="text-muted-foreground">
                    {" — "}will search {subAreaCount} sub-areas: {METRO_SUB_AREAS[searchLocation.trim()].slice(0, 4).join(", ")}
                    {subAreaCount > 4 && `, +${subAreaCount - 4} more`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Tip: Select a metro area for deep sub-area search (boroughs, suburbs, neighborhoods)
              </p>
            )}
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
              <span className="text-muted-foreground">{searchResult.searchesRun} searches run — </span>
              <span className="font-medium text-green-600">{searchResult.inserted} new</span>{" "}
              added to queue
              {searchResult.tagsMerged > 0 && (
                <>, <span className="font-medium text-blue-600">{searchResult.tagsMerged} tags merged</span></>
              )}
              , <span className="text-muted-foreground">{searchResult.skipped} already in database</span>
            </p>
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

      {/* Bulk "All" Actions Bar */}
      {pagination.total > 0 && statusFilter === "pending" && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
          {allProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-electric-blue" />
              <span className="text-sm font-medium flex-1">{allProgress}</span>
              <Button size="sm" variant="outline" onClick={handleStopAll}>
                Stop
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                Bulk actions (all {pagination.total.toLocaleString()} pending):
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLookupAllEmails}
                disabled={bulkProcessing}
              >
                <Mail className="mr-1 h-3.5 w-3.5" />
                Lookup All Emails
              </Button>
              <Button
                size="sm"
                onClick={() => handleApproveAll("found")}
                disabled={bulkProcessing}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Approve All (with email)
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleApproveAll()}
                disabled={bulkProcessing}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Approve All
              </Button>
            </>
          )}
        </div>
      )}

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
                        <div className="flex flex-wrap gap-1">
                          {item.search_tag.split(", ").map((t: string) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {t.trim()}
                            </Badge>
                          ))}
                        </div>
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

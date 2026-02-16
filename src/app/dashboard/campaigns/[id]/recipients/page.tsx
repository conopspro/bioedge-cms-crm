"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  RefreshCw,
  Search,
  UserPlus,
  AlertTriangle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface ContactResult {
  id: string
  first_name: string
  last_name: string
  email: string | null
  title: string | null
  seniority: string | null
  outreach_status: string
  company_id: string | null
  company: { id: string; name: string } | null
}

interface CompanyOption {
  id: string
  name: string
}

interface CategoryOption {
  slug: string
  name: string
}

interface EventOption {
  id: string
  name: string
}

interface CooldownWarning {
  contact_id: string
  campaign_name: string
  days_ago: number
  contact_name: string
}

export default function AddRecipientsPage() {
  const params = useParams()
  const campaignId = params.id as string

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [edgeFilter, setEdgeFilter] = useState<string>("all")
  const [notWithinFilter, setNotWithinFilter] = useState<string>("all")
  const [convertedFilter, setConvertedFilter] = useState<string>("all")
  const [catchAllFilter, setCatchAllFilter] = useState<string>("all")
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all")
  const [titleFilter, setTitleFilter] = useState("")
  const [hasEmail, setHasEmail] = useState(true)
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [outreachTimeRange, setOutreachTimeRange] = useState<string>("all")

  // Data state
  const [contacts, setContacts] = useState<ContactResult[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [existingRecipientIds, setExistingRecipientIds] = useState<
    Set<string>
  >(new Set())
  const [adding, setAdding] = useState(false)
  const [addedCount, setAddedCount] = useState(0)
  const [cooldownWarnings, setCooldownWarnings] = useState<CooldownWarning[]>(
    []
  )
  const [campaignName, setCampaignName] = useState("")

  // Load filter options on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        const [companiesRes, categoriesRes, eventsRes, campaignRes] =
          await Promise.all([
            fetch("/api/companies?sort=name&order=asc"),
            fetch("/api/company-categories"),
            fetch("/api/events"),
            fetch(`/api/campaigns/${campaignId}`),
          ])

        if (companiesRes.ok) {
          const data = await companiesRes.json()
          setCompanies(
            data.map((c: { id: string; name: string }) => ({
              id: c.id,
              name: c.name,
            }))
          )
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data)
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json()
          setEvents(
            data.map((e: { id: string; name: string }) => ({
              id: e.id,
              name: e.name,
            }))
          )
        }

        if (campaignRes.ok) {
          const campaign = await campaignRes.json()
          setCampaignName(campaign.name)
          // Extract existing recipient contact IDs
          const existingIds = new Set(
            (campaign.campaign_recipients || []).map(
              (r: { contact_id: string }) => r.contact_id
            )
          ) as Set<string>
          setExistingRecipientIds(existingIds)
        }
      } catch (error) {
        console.error("Failed to load filter options:", error)
      }
    }
    loadOptions()
  }, [campaignId])

  // Search contacts when filters change
  const searchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (searchQuery) params.set("search", searchQuery)
      if (companyFilter && companyFilter !== "all")
        params.set("company_id", companyFilter)
      if (categoryFilter && categoryFilter !== "all")
        params.set("category", categoryFilter)
      if (edgeFilter && edgeFilter !== "all")
        params.set("edge_category", edgeFilter)
      if (notWithinFilter && notWithinFilter !== "all")
        params.set("not_within", notWithinFilter)
      if (convertedFilter && convertedFilter !== "all")
        params.set("converted", convertedFilter)
      if (catchAllFilter && catchAllFilter !== "all")
        params.set("catch_all", catchAllFilter)
      if (seniorityFilter && seniorityFilter !== "all")
        params.set("seniority", seniorityFilter)
      if (titleFilter) params.set("title_search", titleFilter)
      if (hasEmail) params.set("has_email", "true")
      if (eventFilter && eventFilter !== "all")
        params.set("event_id", eventFilter)
      if (outreachTimeRange && outreachTimeRange !== "all")
        params.set("outreach", outreachTimeRange)

      const res = await fetch(
        `/api/campaigns/${campaignId}/available-contacts?${params.toString()}`
      )
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts || [])
        setCooldownWarnings(data.cooldown_warnings || [])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }, [
    searchQuery,
    companyFilter,
    categoryFilter,
    edgeFilter,
    notWithinFilter,
    convertedFilter,
    catchAllFilter,
    seniorityFilter,
    titleFilter,
    hasEmail,
    eventFilter,
    outreachTimeRange,
    campaignId,
  ])

  useEffect(() => {
    const timeout = setTimeout(searchContacts, 300)
    return () => clearTimeout(timeout)
  }, [searchContacts])

  const toggleSelect = (contactId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(contactId)) {
        next.delete(contactId)
      } else {
        next.add(contactId)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    const availableContacts = contacts.filter(
      (c) => !existingRecipientIds.has(c.id) && c.email
    )
    if (selectedIds.size === availableContacts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(availableContacts.map((c) => c.id)))
    }
  }

  const handleAddSelected = async () => {
    if (selectedIds.size === 0) return
    setAdding(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_ids: Array.from(selectedIds) }),
      })

      if (res.ok) {
        const data = await res.json()
        setAddedCount((prev) => prev + data.added)
        // Update existing set
        setExistingRecipientIds((prev) => {
          const next = new Set(prev)
          selectedIds.forEach((id) => next.add(id))
          return next
        })
        setSelectedIds(new Set())
      }
    } catch (error) {
      console.error("Failed to add recipients:", error)
    } finally {
      setAdding(false)
    }
  }

  const handleAddAllMatching = async () => {
    const availableContacts = contacts.filter(
      (c) => !existingRecipientIds.has(c.id) && c.email
    )
    if (availableContacts.length === 0) return

    setAdding(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_ids: availableContacts.map((c) => c.id),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setAddedCount((prev) => prev + data.added)
        setExistingRecipientIds((prev) => {
          const next = new Set(prev)
          availableContacts.forEach((c) => next.add(c.id))
          return next
        })
        setSelectedIds(new Set())
      }
    } catch (error) {
      console.error("Failed to add recipients:", error)
    } finally {
      setAdding(false)
    }
  }

  const availableCount = contacts.filter(
    (c) => !existingRecipientIds.has(c.id) && c.email
  ).length

  const cooldownMap = new Map(
    cooldownWarnings.map((w) => [w.contact_id, w])
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/campaigns/${campaignId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Add Recipients
          </h1>
          <p className="text-muted-foreground">
            {campaignName
              ? `Select contacts for "${campaignName}"`
              : "Select contacts for this campaign"}
          </p>
        </div>
        {addedCount > 0 && (
          <Badge variant="success" className="text-sm">
            <Check className="mr-1 h-3 w-3" />
            {addedCount} added
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Narrow down contacts to find the right recipients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2 lg:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Has Email toggle */}
            <div className="flex items-end pb-2 gap-3">
              <Switch
                checked={hasEmail}
                onCheckedChange={setHasEmail}
                id="has-email"
              />
              <Label htmlFor="has-email" className="text-sm">
                Has email only
              </Label>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* EDGE Framework */}
            <div className="space-y-2">
              <Label>EDGE Framework</Label>
              <Select value={edgeFilter} onValueChange={setEdgeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="eliminate">Eliminate</SelectItem>
                  <SelectItem value="decode">Decode</SelectItem>
                  <SelectItem value="gain">Gain</SelectItem>
                  <SelectItem value="execute">Execute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Not Contacted Within */}
            <div className="space-y-2">
              <Label>Not Contacted Within</Label>
              <Select
                value={notWithinFilter}
                onValueChange={setNotWithinFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Converted */}
            <div className="space-y-2">
              <Label>Converted</Label>
              <Select
                value={convertedFilter}
                onValueChange={setConvertedFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="only">Converted Only</SelectItem>
                  <SelectItem value="exclude">Exclude Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Catch-All */}
            <div className="space-y-2">
              <Label>Catch-All</Label>
              <Select
                value={catchAllFilter}
                onValueChange={setCatchAllFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="only">Catch-All Only</SelectItem>
                  <SelectItem value="exclude">Exclude Catch-All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Last Outreach */}
            <div className="space-y-2">
              <Label>Last Outreach</Label>
              <Select
                value={outreachTimeRange}
                onValueChange={setOutreachTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="7d">Within 7 Days</SelectItem>
                  <SelectItem value="30d">Within 30 Days</SelectItem>
                  <SelectItem value="90d">Within 90 Days</SelectItem>
                  <SelectItem value="90d_plus">90+ Days Ago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seniority */}
            <div className="space-y-2">
              <Label>Seniority</Label>
              <Select
                value={seniorityFilter}
                onValueChange={setSeniorityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="c_level">C-Level</SelectItem>
                  <SelectItem value="executive">Executive / VP</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title contains */}
            <div className="space-y-2">
              <Label>Title Contains</Label>
              <Input
                placeholder='e.g. "CEO", "Marketing"'
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              />
            </div>

            {/* Event */}
            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {contacts.length} contacts
          {availableCount !== contacts.length && (
            <span> ({availableCount} available to add)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button onClick={handleAddSelected} disabled={adding}>
              <UserPlus className="mr-2 h-4 w-4" />
              {adding
                ? "Adding..."
                : `Add Selected (${selectedIds.size})`}
            </Button>
          )}
          {availableCount > 0 && (
            <Button
              variant="outline"
              onClick={handleAddAllMatching}
              disabled={adding}
            >
              <Users className="mr-2 h-4 w-4" />
              {adding
                ? "Adding..."
                : `Add All Matching (${availableCount})`}
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No contacts match your filters.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      availableCount > 0 &&
                      selectedIds.size === availableCount
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Seniority</TableHead>
                <TableHead>Outreach</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
                const isExisting = existingRecipientIds.has(contact.id)
                const noEmail = !contact.email
                const disabled = isExisting || noEmail
                const warning = cooldownMap.get(contact.id)

                return (
                  <TableRow
                    key={contact.id}
                    className={disabled ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleSelect(contact.id)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {contact.title || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contact.email || (
                        <span className="text-destructive">No email</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contact.company?.name || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contact.seniority || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contact.outreach_status === "responded"
                            ? "success"
                            : contact.outreach_status === "contacted"
                              ? "info"
                              : "secondary"
                        }
                      >
                        {contact.outreach_status || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isExisting && (
                        <Badge variant="outline" className="text-xs">
                          Added
                        </Badge>
                      )}
                      {warning && (
                        <span
                          title={`${warning.contact_name} was emailed ${warning.days_ago} days ago in "${warning.campaign_name}"`}
                          className="text-orange-500"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

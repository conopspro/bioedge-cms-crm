"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  Loader2,
} from "lucide-react"
import { FeaturedToggle } from "@/components/ui/featured-toggle"
import type { Company } from "@/types/database"
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
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Status badge color mapping — pipeline/article status
 */
const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  researching: "secondary",
  article_draft: "warning",
  published: "info",
  outreach: "default",
  engaged: "success",
}

/**
 * Status display labels
 */
const statusLabels: Record<string, string> = {
  researching: "Researching",
  article_draft: "Article Draft",
  published: "Published",
  outreach: "Outreach",
  engaged: "Engaged",
}

interface CompaniesTableProps {
  companies: Company[]
}

/**
 * Companies Table Component
 *
 * Displays companies in a sortable, filterable table with:
 * - Multi-select checkboxes for bulk publish/draft
 * - Separate Visibility column (Published/Draft based on is_draft)
 * - Status column (pipeline status derived from articles)
 * - Actions for view, edit, and delete
 */
export function CompaniesTable({ companies }: CompaniesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [draftFilter, setDraftFilter] = useState<string>("all")
  const [edgeFilter, setEdgeFilter] = useState<string>("all")
  const [accessFilter, setAccessFilter] = useState<string>("all")
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all")

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  // Filter companies based on search, status, draft mode, and EDGE classifications
  // Use derivedStatus if available (computed from articles), otherwise fall back to status
  const filteredCompanies = companies.filter((company) => {
    const effectiveStatus = (company as any).derivedStatus || company.status
    const matchesSearch = company.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || effectiveStatus === statusFilter
    const matchesDraft =
      draftFilter === "all" ||
      (draftFilter === "draft" && company.is_draft !== false) ||
      (draftFilter === "published" && company.is_draft === false)
    const matchesEdge =
      edgeFilter === "all" || (company.edge_categories || []).includes(edgeFilter as any)
    const matchesAccess =
      accessFilter === "all" || (company.access_levels || []).includes(accessFilter as any)
    const matchesAffiliate =
      affiliateFilter === "all" ||
      (affiliateFilter === "yes" && company.has_affiliate === true) ||
      (affiliateFilter === "no" && !company.has_affiliate)
    return matchesSearch && matchesStatus && matchesDraft && matchesEdge && matchesAccess && matchesAffiliate
  })

  // Selection helpers
  const allFilteredSelected =
    filteredCompanies.length > 0 &&
    filteredCompanies.every((c) => selectedIds.has(c.id))
  const someFilteredSelected =
    filteredCompanies.some((c) => selectedIds.has(c.id)) && !allFilteredSelected

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all filtered
      const next = new Set(selectedIds)
      filteredCompanies.forEach((c) => next.delete(c.id))
      setSelectedIds(next)
    } else {
      // Select all filtered
      const next = new Set(selectedIds)
      filteredCompanies.forEach((c) => next.add(c.id))
      setSelectedIds(next)
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const clearSelection = () => setSelectedIds(new Set())

  // Bulk update handler
  const handleBulkUpdate = async (isDraft: boolean) => {
    if (selectedIds.size === 0) return
    setIsBulkUpdating(true)
    try {
      const response = await fetch("/api/companies/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          updates: { is_draft: isDraft },
        }),
      })

      if (response.ok) {
        clearSelection()
        router.refresh()
      } else {
        const data = await response.json()
        alert(`Failed to update: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Bulk update failed:", error)
      alert("Failed to update companies")
    }
    setIsBulkUpdating(false)
  }

  // Handle delete with confirmation
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all related contacts, articles, and leaders.`)) {
      return
    }

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete company")
      }
    } catch (error) {
      console.error("Error deleting company:", error)
      alert("Failed to delete company")
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search companies..."
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
          <option value="researching">Researching</option>
          <option value="article_draft">Article Draft</option>
          <option value="published">Published</option>
          <option value="outreach">Outreach</option>
          <option value="engaged">Engaged</option>
        </select>
        <select
          value={draftFilter}
          onChange={(e) => setDraftFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Visibility</option>
          <option value="draft">Draft Only</option>
          <option value="published">Published Only</option>
        </select>
        <select
          value={edgeFilter}
          onChange={(e) => setEdgeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All EDGE</option>
          <option value="eliminate">Eliminate</option>
          <option value="decode">Decode</option>
          <option value="gain">Gain</option>
          <option value="execute">Execute</option>
        </select>
        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Access</option>
          <option value="consumer">Consumer</option>
          <option value="practitioner_facilitated">Practitioner-Facilitated</option>
          <option value="practitioner_only">Practitioner Only</option>
        </select>
        <select
          value={affiliateFilter}
          onChange={(e) => setAffiliateFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Affiliate</option>
          <option value="yes">Has Affiliate</option>
          <option value="no">No Affiliate</option>
        </select>
      </div>

      {/* Results count + bulk action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies.length} companies
        </p>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={() => handleBulkUpdate(false)}
              disabled={isBulkUpdating}
            >
              {isBulkUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={() => handleBulkUpdate(true)}
              disabled={isBulkUpdating}
            >
              {isBulkUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              Draft
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={allFilteredSelected}
                  ref={(el) => {
                    if (el) {
                      // Set indeterminate state for partial selection
                      ;(el as unknown as HTMLButtonElement).dataset.state =
                        someFilteredSelected
                          ? "indeterminate"
                          : allFilteredSelected
                            ? "checked"
                            : "unchecked"
                    }
                  }}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[40px]">
                <Star className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-[280px]">Company</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {companies.length === 0 ? (
                    <div className="text-muted-foreground">
                      No companies yet.{" "}
                      <Link
                        href="/dashboard/companies/new/edit"
                        className="text-primary underline"
                      >
                        Add your first company
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No companies match your filters.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => {
                const isSelected = selectedIds.has(company.id)
                const isPublished = company.is_draft === false
                const effectiveStatus = (company as any).derivedStatus || company.status

                return (
                  <TableRow
                    key={company.id}
                    className={isSelected ? "bg-muted/50" : undefined}
                  >
                    {/* Checkbox */}
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(company.id)}
                        aria-label={`Select ${company.name}`}
                      />
                    </TableCell>

                    {/* Featured star */}
                    <TableCell>
                      <FeaturedToggle
                        entityType="companies"
                        entityId={company.id}
                        isFeatured={company.is_featured || false}
                      />
                    </TableCell>

                    {/* Company name */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/companies/${company.id}`}
                          className="font-medium hover:underline"
                        >
                          {company.name}
                        </Link>
                      </div>
                      {company.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {company.description}
                        </p>
                      )}
                    </TableCell>

                    {/* Visibility (Published / Draft) */}
                    <TableCell>
                      {isPublished ? (
                        <Badge
                          variant="success"
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 text-muted-foreground"
                        >
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    {/* Pipeline/Article Status */}
                    <TableCell>
                      <Badge variant={statusColors[effectiveStatus] || "default"}>
                        {statusLabels[effectiveStatus] || effectiveStatus}
                      </Badge>
                    </TableCell>

                    {/* Website */}
                    <TableCell>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View"
                        >
                          <Link href={`/dashboard/companies/${company.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit"
                        >
                          <Link href={`/dashboard/companies/${company.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => handleDelete(company.id, company.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

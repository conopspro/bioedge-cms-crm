"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, ExternalLink, Star, FileEdit } from "lucide-react"
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

/**
 * Status badge color mapping
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
 * Displays companies in a sortable, filterable table.
 * Includes actions for view, edit, and delete.
 */
export function CompaniesTable({ companies }: CompaniesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [draftFilter, setDraftFilter] = useState<string>("all")

  // Filter companies based on search, status, and draft mode
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter
    const matchesDraft =
      draftFilter === "all" ||
      (draftFilter === "draft" && company.is_draft !== false) ||
      (draftFilter === "published" && company.is_draft === false)
    return matchesSearch && matchesStatus && matchesDraft
  })

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
      <div className="flex items-center gap-4">
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
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCompanies.length} of {companies.length} companies
      </p>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Star className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-[300px]">Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <FeaturedToggle
                      entityType="companies"
                      entityId={company.id}
                      isFeatured={company.is_featured || false}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        className="font-medium hover:underline"
                      >
                        {company.name}
                      </Link>
                      {company.is_draft !== false && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <FileEdit className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </div>
                    {company.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {company.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[company.status] || "default"}>
                      {statusLabels[company.status] || company.status}
                    </Badge>
                  </TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

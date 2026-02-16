"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MapPin,
  Star,
  RefreshCw,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Upload,
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
import { ClinicCsvUploader } from "@/components/clinics/clinic-csv-uploader"

interface ClinicListItem {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
  tags: string[]
  google_rating: number | null
  reviews_count: number
  is_active: boolean
  is_featured: boolean
  is_draft: boolean
  created_at: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function ClinicsPage() {
  const router = useRouter()
  const [clinics, setClinics] = useState<ClinicListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")
  const [showUploader, setShowUploader] = useState(false)

  const fetchClinics = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("limit", "50")
        params.set("sort", "name")
        params.set("order", "asc")

        if (searchQuery) params.set("search", searchQuery)
        if (stateFilter && stateFilter !== "all") params.set("state", stateFilter)
        if (activeFilter === "active") params.set("active", "true")
        if (activeFilter === "inactive") params.set("active", "false")

        const res = await fetch(`/api/clinics?${params.toString()}`)
        if (res.ok) {
          const result = await res.json()
          setClinics(result.data)
          setPagination(result.pagination)
        }
      } catch (error) {
        console.error("Failed to fetch clinics:", error)
      } finally {
        setLoading(false)
      }
    },
    [searchQuery, stateFilter, activeFilter]
  )

  useEffect(() => {
    fetchClinics()
  }, [fetchClinics])

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This will also delete all clinic contacts.`
      )
    ) {
      return
    }
    try {
      const res = await fetch(`/api/clinics/${id}`, { method: "DELETE" })
      if (res.ok) {
        setClinics((prev) => prev.filter((c) => c.id !== id))
      } else {
        alert("Failed to delete clinic")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete clinic")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchClinics(1)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinics</h1>
          <p className="text-muted-foreground">
            Manage longevity clinic directory ({pagination.total.toLocaleString()} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button asChild>
            <Link href="/dashboard/clinics/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Clinic
            </Link>
          </Button>
        </div>
      </div>

      {/* CSV Uploader */}
      {showUploader && (
        <ClinicCsvUploader
          onImportComplete={() => {
            fetchClinics(1)
          }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border bg-background pl-10 pr-4 py-2 text-sm w-[250px]"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>

        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => fetchClinics(pagination.page)}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : clinics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No clinics found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || stateFilter !== "all"
              ? "Try adjusting your filters."
              : "Import clinics from CSV or add them manually."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) => {
                  const location = [clinic.city, clinic.state]
                    .filter(Boolean)
                    .join(", ")

                  return (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/clinics/${clinic.id}`}
                          className="font-medium hover:underline"
                        >
                          {clinic.name}
                        </Link>
                        {clinic.email && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {clinic.email}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {location || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {clinic.google_rating ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{clinic.google_rating}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {clinic.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {clinic.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{clinic.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            clinic.is_active ? "success" : "secondary"
                          }
                        >
                          {clinic.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View Public Page"
                            asChild
                          >
                            <Link
                              href={`/clinics/${clinic.slug}`}
                              target="_blank"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Delete"
                            onClick={() =>
                              handleDelete(clinic.id, clinic.name)
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
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
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchClinics(pagination.page - 1)}
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
                  onClick={() => fetchClinics(pagination.page + 1)}
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

"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Loader2, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClinicRow {
  id: string
  name: string
  city: string | null
  state: string | null
  email: string | null
  phone: string | null
  google_rating: number | null
  reviews_count: number | null
  tags: string[] | null
  is_featured: boolean
  is_active: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClinicExporterPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())

  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [allCitiesSelected, setAllCitiesSelected] = useState(true)

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const [hasEmailOnly, setHasEmailOnly] = useState(false)
  const [minRating, setMinRating] = useState<string>("")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [nameSearch, setNameSearch] = useState("")

  const [matchingClinics, setMatchingClinics] = useState<ClinicRow[]>([])
  const [previewSearch, setPreviewSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [downloading, setDownloading] = useState(false)

  // ── Load states on mount ───────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/clinics?distinct=states")
      .then(r => r.ok ? r.json() : [])
      .then((data: string[]) => setAvailableStates((data || []).filter(Boolean).sort()))
      .catch(() => {})
  }, [])

  // ── Load cities when states change ────────────────────────────────────────
  useEffect(() => {
    if (selectedStates.size === 0) {
      setAvailableCities([])
      setSelectedCities(new Set())
      setAllCitiesSelected(true)
      return
    }
    const stateParams = Array.from(selectedStates).map(s => `state=${encodeURIComponent(s)}`).join("&")
    fetch(`/api/clinics?distinct=cities&${stateParams}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: string[]) => setAvailableCities((data || []).filter(Boolean).sort()))
      .catch(() => {})
  }, [selectedStates])

  // ── Build query params from current filters ───────────────────────────────
  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    if (nameSearch.trim()) params.set("search", nameSearch.trim())
    if (selectedStates.size > 0) params.set("states", Array.from(selectedStates).join(","))
    if (!allCitiesSelected && selectedCities.size > 0) params.set("cities", Array.from(selectedCities).join(","))
    if (selectedTags.size > 0) params.set("tags", Array.from(selectedTags).join(","))
    if (hasEmailOnly) params.set("has_email", "true")
    if (minRating) params.set("min_rating", minRating)
    if (featuredOnly) params.set("featured", "true")
    return params
  }, [nameSearch, selectedStates, selectedCities, allCitiesSelected, selectedTags, hasEmailOnly, minRating, featuredOnly])

  // ── Preview matching clinics ───────────────────────────────────────────────
  const handlePreview = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const params = buildParams()
      params.set("limit", "5000")
      const res = await fetch(`/api/clinics?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setMatchingClinics(data.clinics || data || [])
      }
    } catch (err) {
      console.error("Preview failed:", err)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  // ── Download CSV ───────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      const params = buildParams()
      const res = await fetch(`/api/clinics/export?${params.toString()}`)
      if (!res.ok) {
        alert("Export failed. Please try again.")
        return
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      const disposition = res.headers.get("Content-Disposition") || ""
      const match = disposition.match(/filename="([^"]+)"/)
      a.download = match?.[1] || `clinics-export-${new Date().toISOString().split("T")[0]}.csv`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
      alert("Download failed. Please try again.")
    } finally {
      setDownloading(false)
    }
  }, [buildParams])

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleState = (s: string) => {
    setSelectedStates(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
    setHasSearched(false)
  }

  const toggleCity = (c: string) => {
    setSelectedCities(prev => {
      const next = new Set(prev)
      next.has(c) ? next.delete(c) : next.add(c)
      return next
    })
    setAllCitiesSelected(false)
    setHasSearched(false)
  }

  const toggleTag = (t: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
    setHasSearched(false)
  }

  // ── Filtered preview table ────────────────────────────────────────────────
  const previewFiltered = previewSearch.trim()
    ? matchingClinics.filter(c =>
        c.name.toLowerCase().includes(previewSearch.toLowerCase()) ||
        c.city?.toLowerCase().includes(previewSearch.toLowerCase()) ||
        c.state?.toLowerCase().includes(previewSearch.toLowerCase())
      )
    : matchingClinics

  const hasFilters =
    selectedStates.size > 0 ||
    selectedTags.size > 0 ||
    hasEmailOnly ||
    !!minRating ||
    featuredOnly ||
    !!nameSearch.trim()

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clinic-emails">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Clinic Exporter</h1>
          <p className="text-sm text-muted-foreground">Filter clinics and download as CSV</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Filters ──────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Name search */}
          <div className="rounded-lg border p-4 space-y-3">
            <h2 className="font-semibold text-sm">Search by Name</h2>
            <Input
              placeholder="e.g. Longevity…"
              value={nameSearch}
              onChange={e => { setNameSearch(e.target.value); setHasSearched(false) }}
            />
          </div>

          {/* States */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">States</h2>
              {selectedStates.size > 0 && (
                <button
                  onClick={() => { setSelectedStates(new Set()); setHasSearched(false) }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
            {availableStates.length === 0 ? (
              <p className="text-xs text-muted-foreground">Loading states…</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {availableStates.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleState(s)}
                    className={`rounded px-2 py-0.5 text-xs font-medium border transition-colors ${
                      selectedStates.has(s)
                        ? "bg-navy text-white border-navy"
                        : "border-muted-foreground/30 hover:border-navy/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cities (only when states selected) */}
          {availableCities.length > 0 && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">Cities</h2>
                <button
                  onClick={() => { setAllCitiesSelected(true); setSelectedCities(new Set()); setHasSearched(false) }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {allCitiesSelected ? "All selected" : "Reset to all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {availableCities.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleCity(c)}
                    className={`rounded px-2 py-0.5 text-xs font-medium border transition-colors ${
                      allCitiesSelected || selectedCities.has(c)
                        ? "bg-navy text-white border-navy"
                        : "border-muted-foreground/30 hover:border-navy/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Specialty Tags</h2>
              <button
                onClick={() => {
                  setSelectedTags(
                    selectedTags.size === TAG_PRESETS.length ? new Set() : new Set(TAG_PRESETS)
                  )
                  setHasSearched(false)
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {selectedTags.size === TAG_PRESETS.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAG_PRESETS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded px-2 py-0.5 text-xs font-medium border transition-colors ${
                    selectedTags.has(tag)
                      ? "bg-navy text-white border-navy"
                      : "border-muted-foreground/30 hover:border-navy/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Other filters */}
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="font-semibold text-sm">Other Filters</h2>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasEmailOnly}
                onChange={e => { setHasEmailOnly(e.target.checked); setHasSearched(false) }}
                className="rounded"
              />
              <span className="text-sm">Has email only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={e => { setFeaturedOnly(e.target.checked); setHasSearched(false) }}
                className="rounded"
              />
              <span className="text-sm">Featured clinics only</span>
            </label>

            <div className="space-y-1">
              <label className="text-sm font-medium">Min. Google Rating</label>
              <div className="flex gap-1.5">
                {["", "3.0", "3.5", "4.0", "4.5"].map(r => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setHasSearched(false) }}
                    className={`rounded px-2 py-0.5 text-xs font-medium border transition-colors ${
                      minRating === r
                        ? "bg-navy text-white border-navy"
                        : "border-muted-foreground/30 hover:border-navy/50"
                    }`}
                  >
                    {r === "" ? "Any" : `${r}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button onClick={handlePreview} disabled={loading || !hasFilters} className="w-full">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Searching…</>
                : "Preview Matching Clinics"
              }
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading || !hasFilters}
              className="w-full gap-2"
            >
              {downloading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Downloading…</>
                : <><Download className="h-4 w-4" />Download CSV</>
              }
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              CSV includes all matching clinics (no preview required)
            </p>
          </div>
        </div>

        {/* ── Right: Preview results ─────────────────────────────────────── */}
        <div className="lg:col-span-2">
          {!hasSearched && (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              <p className="text-sm">Set your filters and click <strong>Preview Matching Clinics</strong> to see results here, or click <strong>Download CSV</strong> to export directly.</p>
            </div>
          )}

          {hasSearched && (
            <div className="rounded-lg border space-y-0 overflow-hidden">
              {/* Preview header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {loading ? "Searching…" : `${matchingClinics.length.toLocaleString()} clinic${matchingClinics.length !== 1 ? "s" : ""} matched`}
                  </span>
                  {matchingClinics.length > 0 && (
                    <Badge variant="secondary">
                      {matchingClinics.filter(c => c.email).length} with email
                    </Badge>
                  )}
                </div>
                {matchingClinics.length > 0 && (
                  <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading} className="gap-1.5">
                    {downloading
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Download className="h-3 w-3" />
                    }
                    Export {matchingClinics.length.toLocaleString()} Clinics
                  </Button>
                )}
              </div>

              {/* Search within results */}
              {matchingClinics.length > 0 && (
                <div className="px-4 py-2 border-b">
                  <div className="relative">
                    <Input
                      placeholder="Search within results…"
                      value={previewSearch}
                      onChange={e => setPreviewSearch(e.target.value)}
                      className="h-8 text-sm pr-8"
                    />
                    {previewSearch && (
                      <button
                        onClick={() => setPreviewSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Table */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : matchingClinics.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No clinics matched your filters.
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Tags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewFiltered.slice(0, 500).map(clinic => (
                        <TableRow key={clinic.id}>
                          <TableCell className="font-medium text-sm">
                            {clinic.name}
                            {clinic.is_featured && (
                              <Star className="inline-block h-3 w-3 ml-1 text-amber-400 fill-amber-400" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {[clinic.city, clinic.state].filter(Boolean).join(", ")}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {clinic.email || <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {clinic.google_rating
                              ? <span className="text-amber-600">★ {clinic.google_rating}</span>
                              : <span className="text-muted-foreground/50">—</span>
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(clinic.tags || []).slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {(clinic.tags || []).length > 3 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  +{(clinic.tags || []).length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {previewFiltered.length > 500 && (
                    <p className="text-xs text-center text-muted-foreground py-2 border-t">
                      Showing first 500 of {previewFiltered.length.toLocaleString()} — full set included in CSV export
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

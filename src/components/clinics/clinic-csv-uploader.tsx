"use client"

import { useState, useCallback } from "react"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  MapPin,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Papa from "papaparse"

interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  contactsImported: number
  errors: string[]
}

interface ParsedClinic {
  name: string
  external_id: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string
  phone: string | null
  phone_formatted: string | null
  email: string | null
  website: string | null
  google_maps_url: string | null
  description: string | null
  tags: string[]
  google_place_id: string | null
  google_rating: number | null
  reviews_count: number
  is_featured: boolean
  is_active: boolean
  metro_area: string | null
  search_term: string | null
  latitude: number | null
  longitude: number | null
  photos: string[]
  videos: string[]
  custom_urls: { title: string; url: string }[]
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  youtube: string | null
  twitter: string | null
  tiktok: string | null
  threads: string | null
  contacts: { name: string | null; email: string | null; phone: string | null }[]
}

// Map CSV column headers to our field structure
function mapCsvRow(row: Record<string, string>): ParsedClinic | null {
  const name = (row["Company Name"] || row["Name"] || row["name"] || "").trim()
  if (!name) return null

  const website = (row["Website"] || row["website"] || "").trim() || null

  // Tags: comma-separated
  const tagsStr = row["Tags"] || row["tags"] || ""
  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  // Photos
  const photos = [row["Photo 1"], row["Photo 2"], row["Photo 3"], row["Photo 4"]]
    .map((p) => (p || "").trim())
    .filter(Boolean)

  // Videos
  const videos = [
    row["Video Embed 1"],
    row["Video Embed 2"],
    row["Video Embed 3"],
    row["Video Embed 4"],
  ]
    .map((v) => (v || "").trim())
    .filter(Boolean)

  // Custom URLs
  const customUrls: { title: string; url: string }[] = []
  for (let i = 1; i <= 4; i++) {
    const title = (row[`URL Title ${i}`] || "").trim()
    const url = (row[`URL ${i}`] || "").trim()
    if (url) customUrls.push({ title: title || `Link ${i}`, url })
  }

  // Hunter contacts
  const contacts: { name: string | null; email: string | null; phone: string | null }[] = []
  for (let i = 1; i <= 5; i++) {
    const cName = (row[`Hunter Contact Name ${i}`] || "").trim() || null
    const cEmail = (row[`Hunter Email ${i}`] || "").trim() || null
    const cPhone = (row[`Hunter Phone ${i}`] || "").trim() || null
    if (cName || cEmail || cPhone) {
      contacts.push({ name: cName, email: cEmail, phone: cPhone })
    }
  }

  const state = (row["State"] || row["state"] || "").trim() || null
  // Heuristic: European entries often have state > 2 chars
  let country = "US"
  if (state && state.length > 2) {
    country = state
  }

  const ratingStr = row["Google Rating"] || row["rating"] || ""
  const reviewsStr = row["Reviews Count"] || row["reviews_count"] || ""

  return {
    name,
    external_id: (row["ID"] || row["id"] || "").trim() || null,
    address: (row["Address"] || row["address"] || "").trim() || null,
    city: (row["City"] || row["city"] || "").trim() || null,
    state,
    zip_code: (row["Zip Code"] || row["zip_code"] || "").trim() || null,
    country,
    phone: (row["Phone"] || row["phone"] || "").trim() || null,
    phone_formatted: (row["Phone Formatted"] || "").trim() || null,
    email: (row["Email"] || row["email"] || "").trim() || null,
    website,
    google_maps_url: (row["Google Maps URL"] || "").trim() || null,
    description: (row["About"] || row["Description"] || row["description"] || "").trim() || null,
    tags,
    google_place_id: (row["Google Place ID"] || "").trim() || null,
    google_rating: ratingStr ? parseFloat(ratingStr) : null,
    reviews_count: reviewsStr ? parseInt(reviewsStr, 10) || 0 : 0,
    is_featured: (row["Featured"] || "").toUpperCase() === "TRUE",
    is_active: (row["Active"] || "TRUE").toUpperCase() !== "FALSE",
    metro_area: (row["Metro Area"] || "").trim() || null,
    search_term: (row["Search Term"] || "").trim() || null,
    latitude: row["Latitude"] ? parseFloat(row["Latitude"]) : null,
    longitude: row["Longitude"] ? parseFloat(row["Longitude"]) : null,
    photos,
    videos,
    custom_urls: customUrls,
    facebook: (row["Facebook"] || "").trim() || null,
    instagram: (row["Instagram"] || "").trim() || null,
    linkedin: (row["LinkedIn"] || "").trim() || null,
    youtube: (row["YouTube"] || "").trim() || null,
    twitter: (row["Twitter/X"] || row["Twitter"] || "").trim() || null,
    tiktok: (row["TikTok"] || "").trim() || null,
    threads: (row["Threads"] || "").trim() || null,
    contacts,
  }
}

interface ClinicCsvUploaderProps {
  onImportComplete: () => void
}

export function ClinicCsvUploader({ onImportComplete }: ClinicCsvUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedClinics, setParsedClinics] = useState<ParsedClinic[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)
    setError(null)
    setProgress(null)

    // Parse with papaparse
    Papa.parse<Record<string, string>>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`CSV parse warnings: ${results.errors.length}`)
        }

        const mapped = results.data
          .map((row) => mapCsvRow(row))
          .filter(Boolean) as ParsedClinic[]

        setParsedClinics(mapped)

        if (mapped.length === 0) {
          setError("No valid clinic rows found in the CSV. Make sure it has a 'Company Name' column.")
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`)
      },
    })
  }, [])

  const handleImport = useCallback(async () => {
    if (parsedClinics.length === 0) return

    setIsImporting(true)
    setError(null)
    setResult(null)

    // Send in chunks to avoid request size limits
    const CHUNK_SIZE = 500
    let totalImported = 0
    let totalSkipped = 0
    let totalContacts = 0
    const allErrors: string[] = []

    try {
      for (let i = 0; i < parsedClinics.length; i += CHUNK_SIZE) {
        const chunk = parsedClinics.slice(i, i + CHUNK_SIZE)
        setProgress({ current: i, total: parsedClinics.length })

        const res = await fetch("/api/import/clinics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clinics: chunk }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Request failed" }))
          allErrors.push(errData.error || `Chunk ${Math.floor(i / CHUNK_SIZE) + 1} failed`)
          continue
        }

        const data = await res.json()
        totalImported += data.imported || 0
        totalSkipped += data.skipped || 0
        totalContacts += data.contactsImported || 0
        if (data.errors?.length) allErrors.push(...data.errors)
      }

      setResult({
        success: allErrors.length === 0,
        total: parsedClinics.length,
        imported: totalImported,
        skipped: totalSkipped,
        contactsImported: totalContacts,
        errors: allErrors,
      })

      if (totalImported > 0) {
        onImportComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
    } finally {
      setIsImporting(false)
      setProgress(null)
    }
  }, [parsedClinics, onImportComplete])

  const handleClear = useCallback(() => {
    setFile(null)
    setParsedClinics([])
    setResult(null)
    setError(null)
    setProgress(null)
  }, [])

  // Stats for preview
  const withContacts = parsedClinics.filter((c) => c.contacts.length > 0).length
  const withRating = parsedClinics.filter((c) => c.google_rating !== null).length
  const totalContacts = parsedClinics.reduce((sum, c) => sum + c.contacts.length, 0)
  const uniqueStates = new Set(parsedClinics.map((c) => c.state).filter(Boolean))

  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Import Clinics from CSV</h3>
        </div>
        {file && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* File input */}
      {!file && !result && (
        <div>
          <label
            htmlFor="clinic-csv"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 cursor-pointer hover:border-primary/50 transition"
          >
            <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">Choose a CSV file</p>
            <p className="text-xs text-muted-foreground mt-1">
              Expected columns: Company Name, Address, City, State, Phone, Email, Tags, etc.
            </p>
          </label>
          <input
            id="clinic-csv"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {file && parsedClinics.length > 0 && !result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{file.name}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{parsedClinics.length.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Clinics</p>
            </div>
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{totalContacts.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Contacts</p>
            </div>
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{uniqueStates.size}</p>
              <p className="text-xs text-muted-foreground">States</p>
            </div>
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{withRating.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">With Ratings</p>
            </div>
          </div>

          {/* Preview table */}
          <div className="rounded-md border overflow-hidden">
            <p className="px-3 py-2 bg-muted text-xs font-medium text-muted-foreground">
              Preview (first 10 rows)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">City</th>
                    <th className="px-3 py-2 text-left font-medium">State</th>
                    <th className="px-3 py-2 text-center font-medium">Rating</th>
                    <th className="px-3 py-2 text-left font-medium">Tags</th>
                    <th className="px-3 py-2 text-center font-medium">Contacts</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedClinics.slice(0, 10).map((clinic, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2 max-w-[200px] truncate">{clinic.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{clinic.city || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{clinic.state || "—"}</td>
                      <td className="px-3 py-2 text-center">
                        {clinic.google_rating ?? "—"}
                      </td>
                      <td className="px-3 py-2 max-w-[150px] truncate text-muted-foreground">
                        {clinic.tags.join(", ") || "—"}
                      </td>
                      <td className="px-3 py-2 text-center">{clinic.contacts.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Import button */}
          <div className="flex items-center gap-3">
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {progress
                    ? `Importing ${progress.current.toLocaleString()} / ${progress.total.toLocaleString()}...`
                    : "Importing..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import {parsedClinics.length.toLocaleString()} Clinics
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isImporting}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div
            className={`flex items-start gap-2 rounded-md p-4 text-sm ${
              result.success
                ? "bg-green-50 text-green-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {result.success ? (
              <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-medium">
                Import {result.success ? "complete" : "completed with errors"}
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <strong>{result.imported.toLocaleString()}</strong> clinics imported
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  <strong>{result.contactsImported.toLocaleString()}</strong> contacts imported
                </p>
                {result.skipped > 0 && (
                  <p className="text-muted-foreground">
                    {result.skipped.toLocaleString()} skipped (already exist)
                  </p>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-destructive">Errors:</p>
                  {result.errors.slice(0, 5).map((err, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Import Another File
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ParsedContact {
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  title?: string
  linkedin_url?: string
  company_name?: string
  website?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  notes?: string
}

interface ImportResult {
  success: boolean
  total: number
  contactsImported: number
  contactsSkipped: number
  contactsDuplicate: number
  companiesCreated: number
  companiesMatched: number
  errors: string[]
  newCompanies: Array<{ id: string; name: string }>
}

/**
 * Parse CSV text into array of objects with flexible column mapping
 */
function parseCSV(text: string): ParsedContact[] {
  const lines = text.trim().split("\n")
  if (lines.length < 2) return []

  // Parse header - handle quoted values with commas inside
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ""))
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ""))
    return result
  }

  const header = parseCSVLine(lines[0])

  // Map common header variations to our field names
  const headerMap: Record<number, string> = {}
  header.forEach((h, i) => {
    const lower = h.toLowerCase().trim()

    // Name fields
    if (lower.includes("first") && lower.includes("name") || lower === "first" || lower === "firstname") {
      headerMap[i] = "first_name"
    } else if (lower.includes("last") && lower.includes("name") || lower === "last" || lower === "lastname") {
      headerMap[i] = "last_name"
    }
    // Contact info
    else if (lower === "email" || lower.includes("email") || lower === "e-mail") {
      headerMap[i] = "email"
    } else if (lower === "phone" || lower.includes("phone") || lower === "telephone" || lower === "mobile") {
      headerMap[i] = "phone"
    } else if (lower === "title" || lower === "position" || lower.includes("job") && lower.includes("title")) {
      headerMap[i] = "title"
    } else if (lower.includes("linkedin")) {
      headerMap[i] = "linkedin_url"
    }
    // Company info
    else if (lower === "company" || lower.includes("company") && lower.includes("name") || lower === "organization") {
      headerMap[i] = "company_name"
    } else if (lower === "website" || lower.includes("website") || lower === "url" || lower.includes("company") && lower.includes("url")) {
      headerMap[i] = "website"
    }
    // Address fields
    else if (lower === "address" || lower === "address1" || lower === "street") {
      headerMap[i] = "address1"
    } else if (lower === "address2" || lower === "apt" || lower === "suite") {
      headerMap[i] = "address2"
    } else if (lower === "city") {
      headerMap[i] = "city"
    } else if (lower === "state" || lower === "province" || lower === "region") {
      headerMap[i] = "state"
    } else if (lower === "zip" || lower === "zipcode" || lower.includes("postal")) {
      headerMap[i] = "zip"
    } else if (lower === "country") {
      headerMap[i] = "country"
    }
    // Notes
    else if (lower === "notes" || lower === "comments") {
      headerMap[i] = "notes"
    }
  })

  // Parse rows
  const contacts: ParsedContact[] = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue // Skip empty lines

    const values = parseCSVLine(lines[i])
    const contact: Record<string, string | undefined> = {}

    values.forEach((v, j) => {
      if (headerMap[j] && v) {
        contact[headerMap[j]] = v
      }
    })

    // Only add if we have email
    if (contact.email) {
      contacts.push({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        title: contact.title,
        linkedin_url: contact.linkedin_url,
        company_name: contact.company_name,
        website: contact.website,
        address1: contact.address1,
        address2: contact.address2,
        city: contact.city,
        state: contact.state,
        zip: contact.zip,
        country: contact.country,
        notes: contact.notes,
      })
    }
  }

  return contacts
}

/**
 * Import Contacts Component
 *
 * Smart contact import with automatic company creation.
 * - Creates companies on-the-fly if they don't exist
 * - Matches existing companies by name or domain
 * - Skips duplicate contacts (by email)
 */
export function ImportContacts() {
  const router = useRouter()
  const [source, setSource] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)
    setError(null)

    try {
      const text = await selectedFile.text()
      const contacts = parseCSV(text)
      setParsedContacts(contacts)

      if (contacts.length === 0) {
        setError("No valid contacts found in the CSV file")
      }
    } catch (err) {
      setError("Failed to parse CSV file")
      setParsedContacts([])
    }
  }, [])

  // Handle import
  const handleImport = async () => {
    if (parsedContacts.length === 0) {
      setError("No contacts to import")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/import/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: parsedContacts,
          source: source || "CSV Import",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to import contacts")
      }

      setResult(data)

      // Clear file after successful import
      if (data.contactsImported > 0) {
        setFile(null)
        setParsedContacts([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Count unique companies in parsed contacts
  const uniqueCompanies = new Set(
    parsedContacts
      .map((c) => c.company_name?.toLowerCase())
      .filter(Boolean)
  ).size

  return (
    <div className="space-y-6">
      {/* Event/Source */}
      <Card>
        <CardHeader>
          <CardTitle>Import Source</CardTitle>
          <CardDescription>
            Optionally specify where these contacts came from (e.g., conference name, lead source).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="source">Event / Source</Label>
            <Input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Biohacking Conference 2024, Hunter.io, LinkedIn"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
          <CardDescription>
            Upload a CSV with contact and company information. Supported columns: First Name, Last Name, Email, Title, LinkedIn URL, Company Name, Website, Address, City, State, Zip, Country, Phone, Notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label
              htmlFor="csv-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {parsedContacts.length} contacts found
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV files only</p>
                  </>
                )}
              </div>
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {parsedContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {parsedContacts.length} contacts
                </span>
                {uniqueCompanies > 0 && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {uniqueCompanies} companies
                  </span>
                )}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">First Name</TableHead>
                    <TableHead className="whitespace-nowrap">Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Zip</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedContacts.slice(0, 10).map((contact, i) => (
                    <TableRow key={i}>
                      <TableCell className="whitespace-nowrap">{contact.first_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.last_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.phone}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.title}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.company_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.website}</TableCell>
                      <TableCell className="whitespace-nowrap max-w-[150px] truncate">{contact.linkedin_url}</TableCell>
                      <TableCell className="whitespace-nowrap">{[contact.address1, contact.address2].filter(Boolean).join(", ")}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.city}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.state}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.zip}</TableCell>
                      <TableCell className="whitespace-nowrap">{contact.country}</TableCell>
                      <TableCell className="whitespace-nowrap max-w-[200px] truncate">{contact.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedContacts.length > 10 && (
              <p className="mt-2 text-sm text-muted-foreground">
                And {parsedContacts.length - 10} more contacts...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Import Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <div className="text-2xl font-bold text-green-600">{result.contactsImported}</div>
                <div className="text-sm text-muted-foreground">Contacts imported</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <div className="text-2xl font-bold text-blue-600">{result.companiesCreated}</div>
                <div className="text-sm text-muted-foreground">Companies created</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <div className="text-2xl font-bold text-purple-600">{result.companiesMatched}</div>
                <div className="text-sm text-muted-foreground">Companies matched</div>
              </div>
              {result.contactsDuplicate > 0 && (
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <div className="text-2xl font-bold text-yellow-600">{result.contactsDuplicate}</div>
                  <div className="text-sm text-muted-foreground">Duplicates skipped</div>
                </div>
              )}
            </div>

            {result.newCompanies.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">New Companies Created:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.newCompanies.map((company) => (
                    <a
                      key={company.id}
                      href={`/dashboard/companies/${company.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-sm"
                    >
                      <Building2 className="h-3 w-3" />
                      {company.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10">
                <h4 className="font-medium text-destructive mb-2">Warnings:</h4>
                <ul className="text-sm space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null)
                  setSource("")
                }}
              >
                Import More
              </Button>
              <Button
                onClick={() => router.push("/dashboard/contacts")}
              >
                View Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!result && (
        <div className="flex items-center gap-4">
          <Button
            onClick={handleImport}
            disabled={isLoading || parsedContacts.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import {parsedContacts.length} Contacts
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { parseEdgeGuide, mergeEntries, type MergedEdgeCompany } from "@/lib/import/parse-edge-guide"

const EDGE_COLORS: Record<string, string> = {
  eliminate: "bg-red-100 text-red-800",
  decode: "bg-blue-100 text-blue-800",
  gain: "bg-green-100 text-green-800",
  execute: "bg-amber-100 text-amber-800",
}

const ACCESS_EMOJI: Record<string, string> = {
  consumer: "🟢",
  practitioner_facilitated: "🟡",
  practitioner_only: "🔴",
}

type ImportStep = "upload" | "preview" | "importing" | "done"

interface ImportResult {
  success: boolean
  total: number
  created: number
  updated: number
  skipped: number
  errors: string[]
}

export function EdgeResourceImport() {
  const [step, setStep] = useState<ImportStep>("upload")
  const [markdownContent, setMarkdownContent] = useState("")
  const [parsedCompanies, setParsedCompanies] = useState<MergedEdgeCompany[]>([])
  const [rawEntryCount, setRawEntryCount] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setMarkdownContent(content)
    }
    reader.readAsText(file)
  }

  const handleParse = () => {
    setError(null)
    try {
      const entries = parseEdgeGuide(markdownContent)
      setRawEntryCount(entries.length)
      const merged = mergeEntries(entries)
      // Only keep companies that have a domain — entries without domains
      // are typically generic activities/protocols, not real companies
      const withDomain = merged.filter(c => c.domain)
      setParsedCompanies(withDomain)
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse markdown")
    }
  }

  const handleImport = async () => {
    setStep("importing")
    setError(null)

    try {
      // Import in batches of 50 to avoid request size / timeout issues
      const BATCH_SIZE = 50
      let totalCreated = 0
      let totalUpdated = 0
      let totalSkipped = 0
      const allErrors: string[] = []

      for (let i = 0; i < parsedCompanies.length; i += BATCH_SIZE) {
        const batch = parsedCompanies.slice(i, i + BATCH_SIZE)

        const response = await fetch("/api/import/edge-resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companies: batch }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || `Import failed on batch ${Math.floor(i / BATCH_SIZE) + 1}`)
        }

        totalCreated += result.created || 0
        totalUpdated += result.updated || 0
        totalSkipped += result.skipped || 0
        if (result.errors?.length) allErrors.push(...result.errors)
      }

      setImportResult({
        success: true,
        total: parsedCompanies.length,
        created: totalCreated,
        updated: totalUpdated,
        skipped: totalSkipped,
        errors: allErrors.slice(0, 50),
      })
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
      setStep("preview")
    }
  }

  if (step === "upload") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Resource Guide
          </CardTitle>
          <CardDescription>
            Upload the bioEDGE Coach Resource Guide markdown (.md) file, or paste its contents below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept=".md,.txt,.markdown"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                cursor-pointer"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste content</span>
            </div>
          </div>

          <Textarea
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            placeholder="Paste the resource guide markdown content here..."
            rows={10}
            className="font-mono text-xs"
          />

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleParse}
            disabled={!markdownContent.trim()}
          >
            Parse & Preview
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "preview") {
    // Stats
    const withDomain = parsedCompanies.filter(c => c.domain).length
    const edgeCounts = {
      eliminate: parsedCompanies.filter(c => c.edgeCategories.includes("eliminate")).length,
      decode: parsedCompanies.filter(c => c.edgeCategories.includes("decode")).length,
      gain: parsedCompanies.filter(c => c.edgeCategories.includes("gain")).length,
      execute: parsedCompanies.filter(c => c.edgeCategories.includes("execute")).length,
    }

    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Parse Results</CardTitle>
            <CardDescription>
              Found {rawEntryCount} raw entries, merged into {parsedCompanies.length} unique companies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-md bg-muted">
                <div className="text-2xl font-bold">{parsedCompanies.length}</div>
                <div className="text-xs text-muted-foreground">Companies</div>
              </div>
              <div className="text-center p-3 rounded-md bg-muted">
                <div className="text-2xl font-bold">{withDomain}</div>
                <div className="text-xs text-muted-foreground">With Domain</div>
              </div>
              <div className="text-center p-3 rounded-md bg-muted">
                <div className="text-2xl font-bold">{parsedCompanies.filter(c => c.hasAffiliate).length}</div>
                <div className="text-xs text-muted-foreground">With Affiliate</div>
              </div>
              <div className="text-center p-3 rounded-md bg-muted">
                <div className="text-2xl font-bold">{parsedCompanies.filter(c => c.systems.length > 0).length}</div>
                <div className="text-xs text-muted-foreground">System-Linked</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {Object.entries(edgeCounts).map(([key, count]) => (
                <Badge key={key} className={EDGE_COLORS[key]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview Table */}
        <Card>
          <CardHeader>
            <CardTitle>Companies Preview</CardTitle>
            <CardDescription>
              Review the parsed data before importing. Existing companies will be matched by domain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr>
                    <th className="text-left p-2 font-medium">Company</th>
                    <th className="text-left p-2 font-medium">Domain</th>
                    <th className="text-left p-2 font-medium">EDGE</th>
                    <th className="text-left p-2 font-medium">Systems</th>
                    <th className="text-left p-2 font-medium">Access</th>
                    <th className="text-left p-2 font-medium">💰</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedCompanies.map((company, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{company.name}</td>
                      <td className="p-2 text-muted-foreground text-xs">{company.domain || "—"}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {company.edgeCategories.map(cat => (
                            <span key={cat} className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${EDGE_COLORS[cat]}`}>
                              {cat.charAt(0).toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {company.systems.length > 0
                          ? company.systems.length > 2
                            ? `${company.systems.slice(0, 2).join(", ")} +${company.systems.length - 2}`
                            : company.systems.join(", ")
                          : "Cross-System"
                        }
                      </td>
                      <td className="p-2">
                        {company.accessLevels.map(l => ACCESS_EMOJI[l] || "").join("")}
                      </td>
                      <td className="p-2">{company.hasAffiliate ? "💰" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleImport}>
            Import {parsedCompanies.length} Companies
          </Button>
          <Button variant="outline" onClick={() => setStep("upload")}>
            Back to Upload
          </Button>
        </div>
      </div>
    )
  }

  if (step === "importing") {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-lg font-medium">Importing companies...</div>
            <p className="text-sm text-muted-foreground">
              Processing {parsedCompanies.length} companies. This may take a moment.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // step === "done"
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {importResult?.errors.length === 0 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          Import Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {importResult && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-md bg-muted">
                <div className="text-2xl font-bold">{importResult.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 rounded-md bg-green-50">
                <div className="text-2xl font-bold text-green-700">{importResult.created}</div>
                <div className="text-xs text-muted-foreground">Created</div>
              </div>
              <div className="text-center p-3 rounded-md bg-blue-50">
                <div className="text-2xl font-bold text-blue-700">{importResult.updated}</div>
                <div className="text-xs text-muted-foreground">Updated</div>
              </div>
              <div className="text-center p-3 rounded-md bg-amber-50">
                <div className="text-2xl font-bold text-amber-700">{importResult.skipped}</div>
                <div className="text-xs text-muted-foreground">Skipped</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3">
                <div className="text-sm font-medium text-destructive mb-2">
                  {importResult.errors.length} error(s):
                </div>
                <ul className="text-xs text-destructive space-y-1">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            setStep("upload")
            setMarkdownContent("")
            setParsedCompanies([])
            setImportResult(null)
          }}>
            Import Another
          </Button>
          <Button asChild>
            <a href="/dashboard/companies">View Companies</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

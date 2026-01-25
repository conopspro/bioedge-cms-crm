"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ImportResult {
  success: boolean
  title: string
  slug: string
  error?: string
  companyCreated?: string
  companyMatched?: string
  contactCreated?: string
}

/**
 * Article Import Form Component
 *
 * Allows users to upload .md files and import them as articles.
 * Supports drag and drop and multiple file selection.
 */
export function ArticleImportForm() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [results, setResults] = useState<ImportResult[] | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.name.endsWith(".md"))
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith(".md"))
      setFiles(prev => [...prev, ...newFiles])
    }
  }, [])

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Upload and import files
  const handleImport = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setResults(null)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append("files", file))

      const response = await fetch("/api/import/articles", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Import failed")
      }

      setResults(data.results)

      // Clear files after successful import
      if (data.results.some((r: ImportResult) => r.success)) {
        setFiles([])
      }
    } catch (error) {
      console.error("Import error:", error)
      setResults([{
        success: false,
        title: "Import Error",
        slug: "",
        error: error instanceof Error ? error.message : "Unknown error"
      }])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Import Markdown Articles</CardTitle>
          <CardDescription>
            Upload .md files to import as articles. Use frontmatter to set metadata.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
              ${dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }
            `}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop .md files here, or click to browse
            </p>
            <input
              type="file"
              accept=".md"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Files ({files.length})</p>
              <div className="max-h-48 overflow-y-auto rounded-lg border">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? "Importing..." : `Import ${files.length} Article(s)`}
            </Button>
            {files.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Formats</CardTitle>
          <CardDescription>
            Import bioEDGE research packages or standard markdown articles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* bioEDGE Package Format */}
          <div>
            <h4 className="font-semibold mb-2">bioEDGE Marketing Package (Recommended)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Full research packages with company, contact, and article data
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`# Company Name - bioEDGE Marketing Package

## Warm Pitch

**To:** Contact Name, Title (optional)
**Email:** contact@company.com
**Subject:** Subject Line

Email body here...

## Company Overview

**Company:** Company Name
**Category:** Lab Testing / Device / Supplement / etc.
**What they offer:** Description...
**System(s) supported:** Hormones, Energy Production, Circulation
**Key differentiators:** ...
**Evidence/credibility:** ...
**bioEDGE fit:** ...

## Native Article

**Article Title Here**

Article content paragraphs...

**Company Name** | website.com | Brief description.`}
            </pre>
            <p className="mt-2 text-sm text-green-600">
              This format creates: Company + Contact + Article (all linked)
            </p>
          </div>

          {/* Standard Format */}
          <div>
            <h4 className="font-semibold mb-2">Standard Frontmatter (Simple)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Basic articles with optional company linking
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`---
title: "Your Article Title"
company: "Company Name"
status: draft
---

Article content in markdown...`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    result.success
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{result.title}</p>
                    {result.success ? (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {result.slug && <p>Article: /articles/{result.slug}</p>}
                        {result.companyCreated && (
                          <p className="text-green-600">
                            + Created company: {result.companyCreated}
                          </p>
                        )}
                        {result.companyMatched && (
                          <p className="text-blue-600">
                            Linked to existing company: {result.companyMatched}
                          </p>
                        )}
                        {result.contactCreated && (
                          <p className="text-green-600">
                            + Created contact: {result.contactCreated}
                          </p>
                        )}
                        {result.error && (
                          <p className="text-yellow-600">{result.error}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">{result.error}</p>
                    )}
                  </div>
                  {result.success && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/articles`)}
                    >
                      View Articles
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  FileText,
  Mail,
  Copy,
  Check,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CompanyResearchInput, CompanyResearchOutput, BiologicalSystem } from "@/types/database"

interface CompanyCategory {
  id: string
  slug: string
  name: string
  description: string | null
  display_order: number
}

const ALL_SYSTEMS: BiologicalSystem[] = [
  "Breath", "Circulation", "Consciousness", "Defense",
  "Detoxification", "Digestive", "Emotional", "Energy Production",
  "Hormonal", "Hydration", "Nervous System", "Regeneration",
  "Stress Response", "Structure & Movement", "Temperature"
]

interface ResearchResult {
  success: boolean
  data: CompanyResearchOutput
  input: CompanyResearchInput & { existing_company_id?: string }
}

/**
 * Research Review Page
 *
 * Displays AI-generated research results for editing and saving.
 */
export default function ResearchReviewPage() {
  const router = useRouter()
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [research, setResearch] = useState<CompanyResearchOutput | null>(null)
  const [input, setInput] = useState<(CompanyResearchInput & { existing_company_id?: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [categories, setCategories] = useState<CompanyCategory[]>([])

  // Options for what to create
  const [createArticle, setCreateArticle] = useState(true)

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/company-categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (err) {
        console.log("Could not fetch categories")
      }
    }
    fetchCategories()

    // Load results from sessionStorage
    const stored = sessionStorage.getItem("researchResults")
    if (stored) {
      try {
        const parsed: ResearchResult = JSON.parse(stored)
        setResult(parsed)
        setResearch(parsed.data)
        setInput(parsed.input)
      } catch (e) {
        setError("Failed to load research results")
      }
    } else {
      setError("No research results found. Please start a new research.")
    }
    setIsLoading(false)
  }, [])

  const handleResearchChange = (
    field: keyof CompanyResearchOutput,
    value: string | string[]
  ) => {
    if (!research) return
    setResearch((prev) => prev ? { ...prev, [field]: value } : null)
  }

  const toggleSystem = (system: BiologicalSystem) => {
    if (!research) return
    const current = research.systems_supported || []
    const updated = current.includes(system)
      ? current.filter((s) => s !== system)
      : [...current, system]
    handleResearchChange("systems_supported", updated)
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSave = async () => {
    if (!research || !input) return
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/research/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          research,
          createArticle,
          createContact: false, // Never create contacts from research
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Save failed")
      }

      // Clear sessionStorage
      sessionStorage.removeItem("researchResults")

      // Build feedback message for any errors
      const errors: string[] = []
      if (createArticle && result.article_error) {
        errors.push(`Article: ${result.article_error}`)
      }

      if (errors.length > 0) {
        alert(`Company saved but some items failed:\n\n${errors.join('\n')}`)
      }

      // Navigate to the company
      router.push(`/dashboard/companies/${result.company_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !research) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
        <Button asChild>
          <Link href="/dashboard/research">Start New Research</Link>
        </Button>
      </div>
    )
  }

  if (!research || !input) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/research"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Research
          </Link>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            {research.company_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and edit the AI-generated content before saving
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Company Brief */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Brief */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={research.company_name}
                    onChange={(e) => handleResearchChange("company_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={research.category}
                    onChange={(e) => handleResearchChange("category", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))
                    ) : (
                      // Fallback to basic option if categories not loaded
                      <option value={research.category}>{research.category}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={research.description}
                  onChange={(e) => handleResearchChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Systems Supported</Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SYSTEMS.map((system) => (
                    <Badge
                      key={system}
                      variant={research.systems_supported?.includes(system) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSystem(system)}
                    >
                      {system}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Differentiators</Label>
                <Textarea
                  value={research.differentiators}
                  onChange={(e) => handleResearchChange("differentiators", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Evidence / Credibility</Label>
                <Textarea
                  value={research.evidence}
                  onChange={(e) => handleResearchChange("evidence", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>bioEDGE Fit</Label>
                <Textarea
                  value={research.bioedge_fit}
                  onChange={(e) => handleResearchChange("bioedge_fit", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Native Article */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Native Article
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(
                    `# ${research.article_title}\n\n${research.article_content}`,
                    "article"
                  )}
                >
                  {copiedField === "article" ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
              <CardDescription>500-600 word article following bioEDGE voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Article Title</Label>
                <Input
                  value={research.article_title}
                  onChange={(e) => handleResearchChange("article_title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={research.article_excerpt}
                  onChange={(e) => handleResearchChange("article_excerpt", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Article Content</Label>
                <Textarea
                  value={research.article_content}
                  onChange={(e) => handleResearchChange("article_content", e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {research.article_content.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warm Pitch */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Warm Pitch Email
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(research.warm_pitch, "pitch")}
                >
                  {copiedField === "pitch" ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={research.warm_pitch}
                onChange={(e) => handleResearchChange("warm_pitch", e.target.value)}
                rows={8}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-6">
          {/* Save Options */}
          <Card>
            <CardHeader>
              <CardTitle>Save Options</CardTitle>
              <CardDescription>Choose what to create</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {input?.existing_company_id ? "Update Company" : "Create Company"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {input?.existing_company_id ? "Update existing company with new research" : "Always created"}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createArticle}
                    onChange={(e) => setCreateArticle(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium text-sm">Create Article Draft</p>
                    <p className="text-xs text-muted-foreground">Save the native article</p>
                  </div>
                </label>
              </div>

              <Separator />

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Database
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Input Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Research Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Website</p>
                <a
                  href={input.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {input.website}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground">Event</p>
                <p className="font-medium">{input.event}</p>
              </div>
            </CardContent>
          </Card>

          {/* Research Notes */}
          {research.research_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Research Notes</CardTitle>
                <CardDescription>Raw findings for reference</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {research.research_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

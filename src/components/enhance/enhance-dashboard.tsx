"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  Zap,
  Globe,
  Youtube,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface SearchResult {
  id: string
  name: string
  subtitle: string
  enhanced: boolean
  enhancedAt?: string | null
}

interface EnhanceStats {
  companies: { total: number; needsEnhancement: number }
  contacts: { total: number; needsEnhancement: number }
  articles: { total: number; needsEnhancement: number }
}

interface EnhanceStatus {
  services: {
    hunter: {
      configured: boolean
      account: {
        planName: string
        callsUsed: number
        callsAvailable: number
        searchesUsed: number
        searchesAvailable: number
        verificationsUsed: number
        verificationsAvailable: number
        resetDate: string
      } | null
    }
    anthropic: {
      configured: boolean
    }
    perplexity: {
      configured: boolean
    }
    youtube: {
      configured: boolean
    }
  }
  stats: EnhanceStats
}

interface EnhanceDashboardProps {
  stats: EnhanceStats
  preselectedArticle: string | null
  preselectedCompany: string | null
  preselectedContact: string | null
}

export function EnhanceDashboard({
  stats: initialStats,
  preselectedArticle,
  preselectedCompany,
  preselectedContact,
}: EnhanceDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("companies")
  const [status, setStatus] = useState<EnhanceStatus | null>(null)
  const [stats, setStats] = useState<EnhanceStats>(initialStats)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhanceResults, setEnhanceResults] = useState<{
    success: boolean
    message: string
    results: Array<{ id: string; success: boolean; error?: string; fieldsUpdated?: string[] }>
  } | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Batch enhancement state
  const [isBatchEnhancing, setIsBatchEnhancing] = useState(false)
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null)

  // Load enhancement status
  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch("/api/enhance")
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
          if (data.stats) {
            setStats(data.stats)
          }
        }
      } catch (e) {
        console.error("Failed to load enhancement status:", e)
      } finally {
        setIsLoadingStatus(false)
      }
    }
    loadStatus()
  }, [])

  // Handle preselected entities
  useEffect(() => {
    if (preselectedCompany) {
      setActiveTab("companies")
      handleSearch("companies", preselectedCompany)
    } else if (preselectedContact) {
      setActiveTab("contacts")
      handleSearch("contacts", preselectedContact)
    } else if (preselectedArticle) {
      setActiveTab("articles")
      handleSearch("articles", preselectedArticle)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedCompany, preselectedContact, preselectedArticle])

  // Search function
  const handleSearch = useCallback(async (entityType: string, query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/enhance/search?type=${entityType}&q=${encodeURIComponent(query)}&limit=50`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      }
    } catch (e) {
      console.error("Search failed:", e)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(activeTab, searchQuery)
      } else {
        setSearchResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, handleSearch])

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery("")
    setSearchResults([])
    setHasSearched(false)
    setSelectedIds(new Set())
  }, [activeTab])

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  // Select all search results
  const selectAll = () => {
    if (selectedIds.size === searchResults.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(searchResults.map(r => r.id)))
    }
  }

  // Enhance selected entities
  const handleEnhanceSelected = async () => {
    if (selectedIds.size === 0) return

    setIsEnhancing(true)
    setEnhanceResults(null)

    try {
      const entityType = activeTab === "companies" ? "company" :
                         activeTab === "contacts" ? "contact" : "article"

      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityIds: Array.from(selectedIds),
          enhancementType: entityType === "contact" ? "profile" : undefined,
        }),
      })

      const result = await response.json()

      setEnhanceResults({
        success: result.success,
        message: result.message,
        results: result.results || [],
      })

      // Refresh search results and stats
      if (searchQuery) {
        handleSearch(activeTab, searchQuery)
      }

      // Reload status to get updated stats
      const statusResponse = await fetch("/api/enhance")
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        if (statusData.stats) {
          setStats(statusData.stats)
        }
      }

      setSelectedIds(new Set())
    } catch (error) {
      console.error("Enhancement error:", error)
      setEnhanceResults({
        success: false,
        message: "Enhancement failed",
        results: [],
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  // Batch enhance all that need it
  const handleBatchEnhance = async (entityType: "companies" | "contacts" | "articles", batchSize: number = 10) => {
    setIsBatchEnhancing(true)
    setBatchProgress({ current: 0, total: 0 })
    setEnhanceResults(null)

    try {
      const type = entityType === "companies" ? "company" :
                   entityType === "contacts" ? "contact" : "article"

      // Get IDs that need enhancement
      const idsResponse = await fetch(`/api/enhance/batch?type=${type}&limit=100`)
      if (!idsResponse.ok) throw new Error("Failed to get batch IDs")

      const { ids, total } = await idsResponse.json()

      if (ids.length === 0) {
        setEnhanceResults({
          success: true,
          message: `All ${entityType} are already enhanced!`,
          results: [],
        })
        return
      }

      setBatchProgress({ current: 0, total: Math.min(ids.length, 100) })

      const allResults: Array<{ id: string; success: boolean; error?: string; fieldsUpdated?: string[] }> = []

      // Process in batches
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)

        const response = await fetch("/api/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entityType: type,
            entityIds: batch,
            enhancementType: type === "contact" ? "profile" : undefined,
          }),
        })

        const result = await response.json()
        allResults.push(...(result.results || []))

        setBatchProgress({ current: Math.min(i + batchSize, ids.length), total: ids.length })

        // Small delay between batches to avoid rate limits
        if (i + batchSize < ids.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      const successCount = allResults.filter(r => r.success).length

      setEnhanceResults({
        success: successCount === allResults.length,
        message: `Enhanced ${successCount} of ${allResults.length} ${entityType}${total > 100 ? ` (${total - 100} more remaining)` : ""}`,
        results: allResults,
      })

      // Reload stats
      const statusResponse = await fetch("/api/enhance")
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        if (statusData.stats) {
          setStats(statusData.stats)
        }
      }

    } catch (error) {
      console.error("Batch enhancement error:", error)
      setEnhanceResults({
        success: false,
        message: "Batch enhancement failed",
        results: [],
      })
    } finally {
      setIsBatchEnhancing(false)
      setBatchProgress(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hunter.io Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" />
              Hunter.io
            </CardTitle>
            <CardDescription>
              Company & contact enrichment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status?.services.hunter.configured ? (
              <div className="space-y-2">
                <Badge variant="success">Connected</Badge>
                {status.services.hunter.account && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Plan: {status.services.hunter.account.planName}</p>
                    <p>
                      Searches: {status.services.hunter.account.searchesUsed} / {status.services.hunter.account.searchesAvailable}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="secondary">Not Configured</Badge>
                <p className="text-sm text-muted-foreground">
                  Add HUNTER_API_KEY
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* YouTube Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube API
            </CardTitle>
            <CardDescription>
              Video search & metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status?.services.youtube?.configured ? (
              <div className="space-y-2">
                <Badge variant="success">Connected</Badge>
                <p className="text-sm text-muted-foreground">
                  Rich video metadata enabled
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="secondary">Not Configured</Badge>
                <p className="text-sm text-muted-foreground">
                  Add YOUTUBE_API_KEY
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Perplexity Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              Perplexity AI
            </CardTitle>
            <CardDescription>
              Scholar & book search
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status?.services.perplexity?.configured ? (
              <div className="space-y-2">
                <Badge variant="success">Connected</Badge>
                <p className="text-sm text-muted-foreground">
                  Academic papers & Amazon books
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="secondary">Not Configured</Badge>
                <p className="text-sm text-muted-foreground">
                  Add PERPLEXITY_API_KEY
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Anthropic AI
            </CardTitle>
            <CardDescription>
              Excerpts & smart selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status?.services.anthropic.configured ? (
              <div className="space-y-2">
                <Badge variant="success">Connected</Badge>
                <p className="text-sm text-muted-foreground">
                  AI enhancement ready
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="secondary">Not Configured</Badge>
                <p className="text-sm text-muted-foreground">
                  Add ANTHROPIC_API_KEY
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats & Batch Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Companies
              </span>
              <span className="text-2xl font-bold">{stats.companies.total.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {stats.companies.needsEnhancement > 0 ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    {stats.companies.needsEnhancement.toLocaleString()} need enhancement
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    All enhanced
                  </span>
                )}
              </div>
              {stats.companies.needsEnhancement > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchEnhance("companies")}
                  disabled={isBatchEnhancing}
                >
                  {isBatchEnhancing && activeTab === "companies" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Zap className="h-3 w-3 mr-1" />
                  )}
                  Enhance All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </span>
              <span className="text-2xl font-bold">{stats.contacts.total.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {stats.contacts.needsEnhancement > 0 ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    {stats.contacts.needsEnhancement.toLocaleString()} need enhancement
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    All enhanced
                  </span>
                )}
              </div>
              {stats.contacts.needsEnhancement > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchEnhance("contacts")}
                  disabled={isBatchEnhancing}
                >
                  {isBatchEnhancing && activeTab === "contacts" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Zap className="h-3 w-3 mr-1" />
                  )}
                  Enhance All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Articles
              </span>
              <span className="text-2xl font-bold">{stats.articles.total.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {stats.articles.needsEnhancement > 0 ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    {stats.articles.needsEnhancement.toLocaleString()} need enhancement
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    All enhanced
                  </span>
                )}
              </div>
              {stats.articles.needsEnhancement > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchEnhance("articles")}
                  disabled={isBatchEnhancing}
                >
                  {isBatchEnhancing && activeTab === "articles" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Zap className="h-3 w-3 mr-1" />
                  )}
                  Enhance All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Progress */}
      {batchProgress && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Batch Enhancement in Progress</AlertTitle>
          <AlertDescription>
            Processing {batchProgress.current} of {batchProgress.total} items...
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
              />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhancement Results */}
      {enhanceResults && (
        <Alert variant={enhanceResults.success ? "default" : "destructive"}>
          {enhanceResults.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>{enhanceResults.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            <p>{enhanceResults.message}</p>

            {/* Show successful updates */}
            {enhanceResults.results.some(r => r.success && r.fieldsUpdated && r.fieldsUpdated.length > 0) && (
              <div className="mt-3 max-h-40 overflow-y-auto">
                <p className="font-medium text-sm mb-1">Updates made:</p>
                <ul className="text-sm space-y-1">
                  {enhanceResults.results
                    .filter(r => r.success && r.fieldsUpdated && r.fieldsUpdated.length > 0)
                    .slice(0, 10)
                    .map(r => (
                      <li key={r.id} className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        {r.fieldsUpdated?.join(", ")}
                      </li>
                    ))}
                  {enhanceResults.results.filter(r => r.success && r.fieldsUpdated && r.fieldsUpdated.length > 0).length > 10 && (
                    <li className="text-muted-foreground">
                      ...and {enhanceResults.results.filter(r => r.success).length - 10} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Show errors */}
            {enhanceResults.results.some(r => !r.success && r.error) && (
              <div className="mt-3 max-h-40 overflow-y-auto">
                <p className="font-medium text-sm mb-1 text-destructive">Errors:</p>
                <ul className="text-sm space-y-1">
                  {enhanceResults.results
                    .filter(r => !r.success && r.error)
                    .slice(0, 5)
                    .map(r => (
                      <li key={r.id} className="flex items-start gap-1 text-destructive">
                        <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {r.error}
                      </li>
                    ))}
                  {enhanceResults.results.filter(r => !r.success).length > 5 && (
                    <li className="text-muted-foreground">
                      ...and {enhanceResults.results.filter(r => !r.success).length - 5} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Search & Select */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search & Enhance</CardTitle>
              <CardDescription>
                Search for specific entities to enhance individually
              </CardDescription>
            </div>
            <Button
              onClick={handleEnhanceSelected}
              disabled={selectedIds.size === 0 || isEnhancing}
              className="gap-2"
            >
              {isEnhancing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Enhance {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="companies" className="gap-2">
                <Building2 className="h-4 w-4" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="h-4 w-4" />
                Articles
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              {/* Search Input */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {searchResults.length > 0 && (
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedIds.size === searchResults.length ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>

              {/* Results */}
              <div className="border rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !hasSearched ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>Search for {activeTab} to enhance</p>
                    <p className="text-sm">Or use &quot;Enhance All&quot; above for batch processing</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <Info className="h-8 w-8 mb-2 opacity-50" />
                    <p>No {activeTab} found matching &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleSelection(result.id)}
                      >
                        <Checkbox
                          checked={selectedIds.has(result.id)}
                          onCheckedChange={() => toggleSelection(result.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        {result.enhanced ? (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Sparkles className="h-3 w-3" />
                            Enhanced
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Needs Enhancement
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhancement Options Info */}
      <Card>
        <CardHeader>
          <CardTitle>Enhancement Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Companies
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI-powered company research</li>
                <li>• Generate detailed description</li>
                <li>• Identify key differentiators</li>
                <li>• Evidence & credibility markers</li>
                <li>• Biological systems supported</li>
                <li>• Discover leadership team</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contacts
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI profile research</li>
                <li>• Generate professional bio</li>
                <li>• Extract career highlights</li>
                <li>• Identify areas of expertise</li>
                <li>• Find YouTube appearances</li>
                <li>• Discover books & papers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Articles
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generate excerpts</li>
                <li>• Find YouTube videos</li>
                <li>• Scholar references</li>
                <li>• Related books</li>
                <li>• SEO optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { Plus, Loader2, Play, BookOpen, Book, Link as LinkIcon, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AddEnhancementFormProps {
  articleId: string
  onAdded?: () => void
}

type EnhancementType = "youtube" | "scholar" | "book" | "link"

const typeConfig = {
  youtube: {
    label: "YouTube Video",
    icon: Play,
    urlPlaceholder: "https://youtube.com/watch?v=...",
    urlLabel: "YouTube URL",
  },
  scholar: {
    label: "Research Paper",
    icon: BookOpen,
    urlPlaceholder: "https://scholar.google.com/...",
    urlLabel: "Paper URL",
  },
  book: {
    label: "Book",
    icon: Book,
    urlPlaceholder: "https://amazon.com/... or https://books.google.com/...",
    urlLabel: "Book URL",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    urlPlaceholder: "https://...",
    urlLabel: "URL",
  },
}

interface SearchResult {
  title: string
  url: string
  author?: string
  channel?: string
  publication?: string
  year?: string | number | null
  thumbnail?: string
  snippet?: string
  duration?: string
  citedBy?: number | null
}

/**
 * Form dialog for manually adding enhancements with built-in search
 */
export function AddEnhancementForm({ articleId, onAdded }: AddEnhancementFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingTitle, setIsFetchingTitle] = useState(false)
  const [type, setType] = useState<EnhancementType>("youtube")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [publication, setPublication] = useState("")
  const [mode, setMode] = useState<"manual" | "search">("search")

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  const router = useRouter()

  const config = typeConfig[type]

  // Extract YouTube video ID from various URL formats
  const extractYouTubeId = (youtubeUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ]
    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Fetch YouTube video title using oEmbed API
  const fetchYouTubeTitle = useCallback(async (youtubeUrl: string) => {
    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) return

    setIsFetchingTitle(true)
    try {
      // Use YouTube oEmbed API (no API key required)
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      const response = await fetch(oEmbedUrl)
      if (response.ok) {
        const data = await response.json()
        if (data.title && !title) {
          setTitle(data.title)
        }
      }
    } catch (error) {
      console.error("Failed to fetch YouTube title:", error)
    } finally {
      setIsFetchingTitle(false)
    }
  }, [title])

  // Check if URL is an Amazon link (including short URLs)
  const isAmazonUrl = (url: string): boolean => {
    return url.includes("amazon") || url.includes("a.co") || url.includes("amzn")
  }

  // Fetch book metadata from Amazon URL using Perplexity
  const fetchBookMetadata = useCallback(async (bookUrl: string) => {
    if (!isAmazonUrl(bookUrl)) return

    setIsFetchingTitle(true)
    try {
      const response = await fetch("/api/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: bookUrl, type: "book" }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.title && !title) {
          setTitle(data.title)
        }
        if (data.author && !author) {
          setAuthor(data.author)
        }
      }
    } catch (error) {
      console.error("Failed to fetch book metadata:", error)
    } finally {
      setIsFetchingTitle(false)
    }
  }, [title, author])

  // Fetch research paper metadata using Perplexity
  const fetchScholarMetadata = useCallback(async (paperUrl: string) => {
    setIsFetchingTitle(true)
    try {
      const response = await fetch("/api/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: paperUrl, type: "scholar" }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.title && !title) {
          setTitle(data.title)
        }
        if (data.publication && !publication) {
          setPublication(data.publication)
        }
      }
    } catch (error) {
      console.error("Failed to fetch paper metadata:", error)
    } finally {
      setIsFetchingTitle(false)
    }
  }, [title, publication])

  // Handle URL change - auto-fetch title for YouTube, books, and research papers
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    if (type === "youtube" && newUrl && !title) {
      fetchYouTubeTitle(newUrl)
    } else if (type === "book" && newUrl && !title) {
      fetchBookMetadata(newUrl)
    } else if (type === "scholar" && newUrl && !title) {
      fetchScholarMetadata(newUrl)
    }
  }

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSearchResults([])

    try {
      let endpoint = ""
      if (type === "youtube") {
        endpoint = `/api/youtube-search?q=${encodeURIComponent(searchQuery)}&maxResults=5`
      } else if (type === "book") {
        endpoint = `/api/search-books?q=${encodeURIComponent(searchQuery)}&limit=5`
      } else if (type === "scholar") {
        endpoint = `/api/search-papers?q=${encodeURIComponent(searchQuery)}&limit=5`
      }

      if (!endpoint) {
        setSearchError("Search not available for this type")
        return
      }

      const response = await fetch(endpoint)
      const data = await response.json()

      if (!response.ok) {
        setSearchError(data.error || "Search failed")
        return
      }

      // Normalize results based on type
      if (type === "youtube" && data.results) {
        setSearchResults(data.results.map((r: { metadata: { title: string; videoId: string }; video?: { channelTitle?: string; duration?: string } }) => ({
          title: r.metadata.title,
          url: `https://www.youtube.com/watch?v=${r.metadata.videoId}`,
          channel: r.video?.channelTitle,
          duration: r.video?.duration,
          thumbnail: `https://img.youtube.com/vi/${r.metadata.videoId}/mqdefault.jpg`,
        })))
      } else if (type === "book" && data.results) {
        setSearchResults(data.results.map((r: { title: string; url: string; author: string; year: string | number | null; thumbnail: string }) => ({
          title: r.title,
          url: r.url,
          author: r.author,
          year: r.year,
          thumbnail: r.thumbnail,
        })))
      } else if (type === "scholar" && data.results) {
        setSearchResults(data.results.map((r: { title: string; url: string; publication: string; year: string | null; citedBy: number | null; snippet: string }) => ({
          title: r.title,
          url: r.url,
          publication: r.publication,
          year: r.year,
          citedBy: r.citedBy,
          snippet: r.snippet,
        })))
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("Failed to search. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Select a search result
  const selectResult = (result: SearchResult) => {
    setTitle(result.title)
    setUrl(result.url)
    if (type === "book" && result.author) {
      setAuthor(result.author)
    }
    if (type === "scholar" && result.publication) {
      setPublication(result.publication)
    }
    setMode("manual") // Switch to manual mode to show the form
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Build metadata based on type
      const metadata: Record<string, unknown> = {}

      if (type === "book" && author) {
        metadata.author = author
      }
      if (type === "scholar" && publication) {
        metadata.publication = publication
      }

      const response = await fetch("/api/enhancements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId,
          type,
          title: title || null,
          url: url || null,
          metadata: Object.keys(metadata).length > 0 ? metadata : null,
        }),
      })

      if (response.ok) {
        setOpen(false)
        resetForm()
        if (onAdded) {
          onAdded()
        } else {
          router.refresh()
        }
      } else {
        const data = await response.json()
        console.error("Failed to add enhancement:", data.error)
      }
    } catch (error) {
      console.error("Error adding enhancement:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setType("youtube")
    setTitle("")
    setUrl("")
    setAuthor("")
    setPublication("")
    setMode("search")
    setSearchQuery("")
    setSearchResults([])
    setSearchError(null)
  }

  const handleTypeChange = (newType: EnhancementType) => {
    setType(newType)
    // Reset search when changing type
    setSearchQuery("")
    setSearchResults([])
    setSearchError(null)
    // Switch back to search mode when changing type
    if (newType !== "link") {
      setMode("search")
    } else {
      setMode("manual")
    }
  }

  const canSearch = type === "youtube" || type === "book" || type === "scholar"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Enhancement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Enhancement</DialogTitle>
            <DialogDescription>
              Search for or manually add a video, paper, book, or link.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => handleTypeChange(v as EnhancementType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <cfg.icon className="h-4 w-4" />
                        {cfg.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mode Tabs for searchable types */}
            {canSearch ? (
              <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "search")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Enter URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="mt-4 space-y-4">
                  {/* Search Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Search for ${type === "youtube" ? "videos" : type === "book" ? "books" : "papers"}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSearch()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Search Results */}
                  {searchError && (
                    <p className="text-sm text-destructive">{searchError}</p>
                  )}

                  {searchResults.length > 0 && (
                    <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectResult(result)}
                          className={cn(
                            "w-full text-left p-2 rounded-md hover:bg-muted transition-colors",
                            "flex gap-3 items-start"
                          )}
                        >
                          {result.thumbnail && (
                            <img
                              src={result.thumbnail}
                              alt=""
                              className="w-16 h-12 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{result.title}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                              {result.author && <span>{result.author}</span>}
                              {result.channel && <span>{result.channel}</span>}
                              {result.publication && <span className="truncate max-w-[200px]">{result.publication}</span>}
                              {result.year && <span>{result.year}</span>}
                              {result.duration && <span>{result.duration}</span>}
                              {result.citedBy !== null && result.citedBy !== undefined && (
                                <span>Cited by {result.citedBy}</span>
                              )}
                            </div>
                            {result.snippet && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {!isSearching && searchResults.length === 0 && searchQuery && !searchError && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Press Enter or click Search to find results
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="mt-4 space-y-4">
                  {/* URL - moved before Title so auto-fetch works naturally */}
                  <div className="grid gap-2">
                    <Label htmlFor="url">{config.urlLabel}</Label>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder={config.urlPlaceholder}
                      required
                    />
                    {type === "youtube" && (
                      <p className="text-xs text-muted-foreground">
                        Paste a YouTube URL and the title will be fetched automatically
                      </p>
                    )}
                    {type === "book" && (
                      <p className="text-xs text-muted-foreground">
                        Paste an Amazon URL and the title/author will be fetched automatically
                      </p>
                    )}
                    {type === "scholar" && (
                      <p className="text-xs text-muted-foreground">
                        Paste a research paper URL and the title/publication will be fetched automatically
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      Title
                      {isFetchingTitle && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Fetching...
                        </span>
                      )}
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={isFetchingTitle ? "Fetching title..." : "Enter title..."}
                      required
                      disabled={isFetchingTitle}
                    />
                  </div>

                  {/* Author (for books) */}
                  {type === "book" && (
                    <div className="grid gap-2">
                      <Label htmlFor="author" className="flex items-center gap-2">
                        Author (optional)
                        {isFetchingTitle && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Fetching...
                          </span>
                        )}
                      </Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder={isFetchingTitle ? "Fetching author..." : "Author name..."}
                        disabled={isFetchingTitle}
                      />
                    </div>
                  )}

                  {/* Publication (for scholar) */}
                  {type === "scholar" && (
                    <div className="grid gap-2">
                      <Label htmlFor="publication" className="flex items-center gap-2">
                        Publication (optional)
                        {isFetchingTitle && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Fetching...
                          </span>
                        )}
                      </Label>
                      <Input
                        id="publication"
                        value={publication}
                        onChange={(e) => setPublication(e.target.value)}
                        placeholder={isFetchingTitle ? "Fetching publication..." : "Journal or conference name..."}
                        disabled={isFetchingTitle}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              /* Manual-only mode for links */
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">{config.urlLabel}</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={config.urlPlaceholder}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title..."
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !url}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

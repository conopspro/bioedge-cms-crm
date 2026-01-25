"use client"

import { useState, useCallback } from "react"
import { Plus, Loader2, Play, BookOpen, Book, Link as LinkIcon } from "lucide-react"
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
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AddContactEnhancementFormProps {
  contactId: string
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
    urlPlaceholder: "https://amazon.com/...",
    urlLabel: "Book URL",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    urlPlaceholder: "https://...",
    urlLabel: "URL",
  },
}

/**
 * Form dialog for manually adding enhancements to a contact/leader
 */
export function AddContactEnhancementForm({ contactId, onAdded }: AddContactEnhancementFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingTitle, setIsFetchingTitle] = useState(false)
  const [type, setType] = useState<EnhancementType>("youtube")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [publication, setPublication] = useState("")
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

  // Check if URL is an Amazon link
  const isAmazonUrl = (url: string): boolean => {
    return url.includes("amazon") || url.includes("a.co") || url.includes("amzn")
  }

  // Fetch book metadata from Amazon URL
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

  // Fetch research paper metadata
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

  // Handle URL change - auto-fetch title
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Build metadata based on type
      const metadata: Record<string, unknown> = {}

      if (type === "youtube") {
        const videoId = extractYouTubeId(url)
        if (videoId) {
          metadata.videoId = videoId
          metadata.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        }
      }
      if (type === "book" && author) {
        metadata.authors = [author]
      }
      if (type === "scholar" && publication) {
        metadata.journal = publication
      }

      // Get current max position
      const { data: existingEnhancements } = await supabase
        .from("contact_enhancements")
        .select("position")
        .eq("contact_id", contactId)
        .order("position", { ascending: false })
        .limit(1)

      const nextPosition = existingEnhancements?.[0]?.position ?? -1
      const newPosition = nextPosition + 1

      const { error } = await supabase.from("contact_enhancements").insert({
        contact_id: contactId,
        type,
        title: title || null,
        url: url || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
        position: newPosition,
      })

      if (!error) {
        setOpen(false)
        resetForm()
        if (onAdded) {
          onAdded()
        } else {
          router.refresh()
        }
      } else {
        console.error("Failed to add enhancement:", error)
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Enhancement</DialogTitle>
            <DialogDescription>
              Manually add a video, paper, book, or link for this leader.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as EnhancementType)}>
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

            {/* URL */}
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
                <Label htmlFor="author">Author (optional)</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name..."
                  disabled={isFetchingTitle}
                />
              </div>
            )}

            {/* Publication (for scholar) */}
            {type === "scholar" && (
              <div className="grid gap-2">
                <Label htmlFor="publication">Publication (optional)</Label>
                <Input
                  id="publication"
                  value={publication}
                  onChange={(e) => setPublication(e.target.value)}
                  placeholder="Journal or conference name..."
                  disabled={isFetchingTitle}
                />
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
            <Button type="submit" disabled={isSubmitting}>
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

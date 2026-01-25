"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Youtube, BookOpen, Book, Link as LinkIcon, Trash2, ExternalLink, CheckSquare, Square, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddContactEnhancementForm } from "./add-contact-enhancement-form"
import { createClient } from "@/lib/supabase/client"

interface EnhancementMetadata {
  thumbnail?: string
  channel?: string
  duration?: string
  authors?: string[]
  journal?: string
  year?: string
  citedBy?: number
  videoId?: string
  rating?: number
}

interface ContactEnhancement {
  id: string
  contact_id: string
  type: "youtube" | "scholar" | "book" | "link" | "image"
  title: string | null
  url: string | null
  embed_code: string | null
  metadata: EnhancementMetadata | null
  position: number
  created_at: string
}

interface ContactEnhancementsEditorProps {
  contactId: string
  enhancements: ContactEnhancement[]
}

const typeConfig = {
  youtube: {
    label: "Videos",
    icon: Youtube,
    color: "text-red-500",
  },
  scholar: {
    label: "Research Papers",
    icon: BookOpen,
    color: "text-blue-500",
  },
  book: {
    label: "Books",
    icon: Book,
    color: "text-amber-600",
  },
  link: {
    label: "Links",
    icon: LinkIcon,
    color: "text-gray-500",
  },
  image: {
    label: "Images",
    icon: LinkIcon,
    color: "text-gray-500",
  },
}

/**
 * Client-side wrapper for contact enhancements with CRUD controls
 * Used in the dashboard for editing leader enhancements
 */
export function ContactEnhancementsEditor({
  contactId,
  enhancements,
}: ContactEnhancementsEditorProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  const isSelectMode = selectedIds.size > 0

  const handleChange = () => {
    router.refresh()
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAllInGroup = (items: ContactEnhancement[]) => {
    const newSelected = new Set(selectedIds)
    items.forEach(item => newSelected.add(item.id))
    setSelectedIds(newSelected)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleDelete = async (enhancementId: string) => {
    if (!confirm("Delete this enhancement?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from("contact_enhancements")
      .delete()
      .eq("id", enhancementId)

    if (!error) {
      router.refresh()
    } else {
      console.error("Failed to delete enhancement:", error)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} selected item(s)?`)) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("contact_enhancements")
      .delete()
      .in("id", Array.from(selectedIds))

    if (!error) {
      setSelectedIds(new Set())
      router.refresh()
    } else {
      console.error("Failed to delete enhancements:", error)
    }
    setIsDeleting(false)
  }

  // Group enhancements by type
  const youtubeVideos = enhancements.filter(e => e.type === "youtube")
  const papers = enhancements.filter(e => e.type === "scholar")
  const books = enhancements.filter(e => e.type === "book")
  const links = enhancements.filter(e => e.type === "link")

  const renderEnhancementGroup = (
    items: ContactEnhancement[],
    type: keyof typeof typeConfig
  ) => {
    if (items.length === 0) return null
    const config = typeConfig[type]
    const Icon = config.icon
    const allSelected = items.every(item => selectedIds.has(item.id))

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon className={`h-4 w-4 ${config.color}`} />
            {config.label} ({items.length})
          </h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => allSelected ? items.forEach(i => toggleSelect(i.id)) : selectAllInGroup(items)}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((enhancement) => {
            const isSelected = selectedIds.has(enhancement.id)
            return (
              <div
                key={enhancement.id}
                className={`flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer ${
                  isSelected ? "ring-2 ring-primary border-primary" : ""
                }`}
                onClick={() => toggleSelect(enhancement.id)}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {/* Thumbnail for YouTube */}
                {type === "youtube" && enhancement.metadata?.thumbnail && (
                  <img
                    src={enhancement.metadata.thumbnail}
                    alt=""
                    className="w-20 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                {/* Thumbnail for Books */}
                {type === "book" && enhancement.metadata?.thumbnail && (
                  <img
                    src={enhancement.metadata.thumbnail}
                    alt=""
                    className="w-10 h-14 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {enhancement.title || "Untitled"}
                  </p>
                  {enhancement.metadata?.channel && (
                    <p className="text-xs text-muted-foreground truncate">
                      {enhancement.metadata.channel}
                    </p>
                  )}
                  {enhancement.metadata?.authors && enhancement.metadata.authors.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {enhancement.metadata.authors.join(", ")}
                    </p>
                  )}
                  {enhancement.metadata?.journal && (
                    <p className="text-xs text-muted-foreground truncate">
                      {enhancement.metadata.journal}
                    </p>
                  )}
                  {enhancement.metadata?.duration && (
                    <p className="text-xs text-muted-foreground">
                      {enhancement.metadata.duration}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {enhancement.url && (
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <a href={enhancement.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(enhancement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        {isSelectMode ? (
          <div className="flex items-center justify-between bg-primary/10 -m-6 p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
              <span className="font-medium">{selectedIds.size} selected</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : `Delete ${selectedIds.size}`}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Leader Media
              </CardTitle>
              <CardDescription>
                {enhancements.length} item(s) - videos, papers, and books
              </CardDescription>
            </div>
            <AddContactEnhancementForm contactId={contactId} onAdded={handleChange} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {enhancements.length > 0 ? (
          <div className="space-y-6">
            {renderEnhancementGroup(youtubeVideos, "youtube")}
            {renderEnhancementGroup(papers, "scholar")}
            {renderEnhancementGroup(books, "book")}
            {renderEnhancementGroup(links, "link")}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No media yet. Use the &quot;Enhance with AI&quot; button or add items manually.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Check,
  Copy,
  Image as ImageIcon,
  Folder,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  filename: string
  original_filename: string
  file_path: string
  file_url: string
  thumbnail_url: string | null
  file_size: number | null
  mime_type: string | null
  width: number | null
  height: number | null
  folder: string
  alt_text: string | null
  caption: string | null
  tags: string[] | null
  created_at: string
}

interface MediaLibraryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect?: (media: MediaItem) => void
  selectionMode?: "single" | "multiple" | "none"
  folder?: string
  title?: string
}

const FOLDERS = [
  { value: "all", label: "All Files" },
  { value: "general", label: "General" },
  { value: "events", label: "Events" },
  { value: "sliders", label: "Sliders" },
  { value: "companies", label: "Companies" },
  { value: "contacts", label: "Contacts" },
  { value: "articles", label: "Articles" },
]

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Shared media library content - used by both dialog and inline versions
 */
interface MediaLibraryContentProps {
  onSelect?: (media: MediaItem) => void
  selectionMode?: "single" | "multiple" | "none"
  folder?: string
  onClose?: () => void
}

function MediaLibraryContent({
  onSelect,
  selectionMode = "single",
  folder: initialFolder,
  onClose,
}: MediaLibraryContentProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(initialFolder || "all")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch media items
  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedFolder !== "all") params.set("folder", selectedFolder)
      if (searchQuery) params.set("search", searchQuery)

      console.log("Fetching media with params:", params.toString(), "selectedFolder:", selectedFolder)
      const response = await fetch(`/api/media?${params}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Media fetch result:", data.items?.length, "items")
        setMedia(data.items || [])
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedFolder, searchQuery])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Handle file upload - uploads sequentially to avoid rate limiting
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const fileArray = Array.from(files)
    const newMedia: MediaItem[] = []

    // Upload files sequentially to avoid Supabase rate limiting
    for (const file of fileArray) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", selectedFolder === "all" ? "general" : selectedFolder)

      try {
        const response = await fetch("/api/media", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const uploaded = await response.json()
          newMedia.push(uploaded)
          // Update UI immediately after each upload
          setMedia((prev) => [uploaded, ...prev])
        } else {
          const error = await response.json()
          console.error("Error uploading file:", file.name, error)
        }
      } catch (error) {
        console.error("Error uploading file:", file.name, error)
      }
    }

    setUploading(false)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/media/${id}`, { method: "DELETE" })
      if (response.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id))
        setSelectedItems((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    } catch (error) {
      console.error("Error deleting media:", error)
    }
  }

  // Handle selection
  const handleSelect = (item: MediaItem) => {
    if (selectionMode === "none") return

    if (selectionMode === "single") {
      onSelect?.(item)
      onClose?.()
    } else {
      setSelectedItems((prev) => {
        const next = new Set(prev)
        if (next.has(item.id)) {
          next.delete(item.id)
        } else {
          next.add(item.id)
        }
        return next
      })
    }
  }

  // Copy URL to clipboard
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error("Error copying URL:", error)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload
            </Button>

            {/* Folder filter */}
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-40">
                <Folder className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOLDERS.map((folder) => (
                  <SelectItem key={folder.value} value={folder.value}>
                    {folder.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="pl-9"
              />
            </div>

            {/* View toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Drop zone / Content area */}
          <div
            className="flex-1 overflow-y-auto border rounded-lg"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
                <p className="font-medium">No images yet</p>
                <p className="text-sm">Drag and drop images here or click Upload</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 p-2">
                {media.map((item) => {
                  const isSelected = selectedItems.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() => handleSelect(item)}
                    >
                      <img
                        src={item.thumbnail_url || item.file_url}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-1 left-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}

                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(item.file_url)
                          }}
                        >
                          {copiedUrl === item.file_url ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="divide-y">
                {media.map((item) => {
                  const isSelected = selectedItems.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                      )}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail_url || item.file_url}
                          alt={item.alt_text || item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.original_filename}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(item.file_size)}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.folder}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(item.file_url)
                          }}
                        >
                          {copiedUrl === item.file_url ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer with selection info */}
      {selectionMode === "multiple" && selectedItems.size > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedItems.size} item{selectedItems.size !== 1 && "s"} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedItems(new Set())}>
              Clear Selection
            </Button>
            <Button
              onClick={() => {
                const selectedMedia = media.filter((m) => selectedItems.has(m.id))
                selectedMedia.forEach((m) => onSelect?.(m))
                onClose?.()
              }}
            >
              Add Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Inline Media Library - renders directly without a dialog wrapper
 */
interface MediaLibraryInlineProps {
  onSelect?: (media: MediaItem) => void
  selectionMode?: "single" | "multiple" | "none"
  folder?: string
  className?: string
}

export function MediaLibraryInline({
  onSelect,
  selectionMode = "none",
  folder,
  className,
}: MediaLibraryInlineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <MediaLibraryContent
        onSelect={onSelect}
        selectionMode={selectionMode}
        folder={folder}
      />
    </div>
  )
}

/**
 * Media Library Dialog - wraps content in a dialog
 */
export function MediaLibrary({
  open,
  onOpenChange,
  onSelect,
  selectionMode = "single",
  folder: initialFolder,
  title = "Media Library",
}: MediaLibraryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload and manage images. {selectionMode !== "none" && "Click an image to select it."}
          </DialogDescription>
        </DialogHeader>
        <MediaLibraryContent
          onSelect={onSelect}
          selectionMode={selectionMode}
          folder={initialFolder}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/**
 * Simpler image picker for inline use
 */
interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  placeholder?: string
  className?: string
}

export function ImagePicker({
  value,
  onChange,
  folder = "general",
  placeholder = "Select or upload image",
  className,
}: ImagePickerProps) {
  const [showLibrary, setShowLibrary] = useState(false)

  return (
    <>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
          className
        )}
        onClick={() => setShowLibrary(true)}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Selected"
              className="w-full h-32 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">{placeholder}</p>
          </div>
        )}
      </div>

      <MediaLibrary
        open={showLibrary}
        onOpenChange={setShowLibrary}
        onSelect={(media) => onChange(media.file_url)}
        selectionMode="single"
        folder={folder}
        title="Select Image"
      />
    </>
  )
}

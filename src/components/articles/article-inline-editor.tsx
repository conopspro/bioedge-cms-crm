"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Check, X, Image as ImageIcon, Building2, Youtube } from "lucide-react"
import type { Article } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { cn } from "@/lib/utils"
import { getYouTubeThumbnailUrl, isYouTubeUrl } from "@/lib/youtube"

interface ArticleInlineEditorProps {
  article: Article & { company?: { id: string; name: string } | null }
  companies: { id: string; name: string }[]
}

/**
 * Article Inline Editor Component
 *
 * Provides inline editing for article title, excerpt, content, company, and featured image.
 * Click on any field to edit it in place.
 */
export function ArticleInlineEditor({ article, companies }: ArticleInlineEditorProps) {
  const router = useRouter()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form values for each field
  const [title, setTitle] = useState(article.title)
  const [excerpt, setExcerpt] = useState(article.excerpt || "")
  const [content, setContent] = useState(article.content || "")
  const [companyId, setCompanyId] = useState(article.company_id || "")
  const [slug, setSlug] = useState(article.slug)
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article.featured_image_url || "")
  const [featuredImageAlt, setFeaturedImageAlt] = useState(article.featured_image_alt || "")
  const [youtubeUrl, setYoutubeUrl] = useState(article.youtube_url || "")

  const saveField = async (field: string, value: any) => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save")
      }

      setEditingField(null)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (field: string) => {
    // Reset to original values
    switch (field) {
      case "title":
        setTitle(article.title)
        break
      case "excerpt":
        setExcerpt(article.excerpt || "")
        break
      case "content":
        setContent(article.content || "")
        break
      case "company_id":
        setCompanyId(article.company_id || "")
        break
      case "slug":
        setSlug(article.slug)
        break
    }
    setEditingField(null)
    setError(null)
  }

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setSlug(newSlug)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Title</CardTitle>
        </CardHeader>
        <CardContent>
          {editingField === "title" ? (
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold h-auto py-2"
                autoFocus
                disabled={isSaving}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveField("title", title)}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCancel("title")}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingField("title")}
              className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excerpt & Slug Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Excerpt */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Excerpt</CardTitle>
          </CardHeader>
          <CardContent>
            {editingField === "excerpt" ? (
              <div className="space-y-2">
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  autoFocus
                  disabled={isSaving}
                  placeholder="Brief summary of the article..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveField("excerpt", excerpt || null)}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancel("excerpt")}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingField("excerpt")}
                className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm", !excerpt && "text-muted-foreground italic")}>
                    {excerpt || "No excerpt. Click to add..."}
                  </p>
                  <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slug */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">URL Slug</CardTitle>
          </CardHeader>
          <CardContent>
            {editingField === "slug" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="font-mono text-sm"
                    autoFocus
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlug}
                    disabled={isSaving}
                  >
                    Generate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveField("slug", slug)}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancel("slug")}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingField("slug")}
                className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-sm">{slug}</p>
                  <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingField === "company_id" ? (
            <div className="space-y-2">
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                autoFocus
                disabled={isSaving}
              >
                <option value="">No company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveField("company_id", companyId || null)}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCancel("company_id")}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingField("company_id")}
              className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn("text-sm", !article.company && "text-muted-foreground italic")}>
                  {article.company?.name || "No company linked. Click to select..."}
                </p>
                <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* YouTube Video & Featured Image Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* YouTube Video */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-600" />
              YouTube Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingField === "youtube_url" ? (
              <div className="space-y-3">
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoFocus
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">
                  The thumbnail will be used as the article card image if no featured image is set.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveField("youtube_url", youtubeUrl || null)}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setYoutubeUrl(article.youtube_url || "")
                      setEditingField(null)
                    }}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingField("youtube_url")}
                className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
              >
                {youtubeUrl && isYouTubeUrl(youtubeUrl) ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={getYouTubeThumbnailUrl(youtubeUrl) || ""}
                        alt="YouTube thumbnail"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src.includes("maxresdefault")) {
                            target.src = getYouTubeThumbnailUrl(youtubeUrl, "hqdefault") || ""
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-red-600 p-3">
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <Pencil className="absolute top-2 right-2 h-4 w-4 text-white bg-black/50 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {!featuredImageUrl && (
                      <p className="text-xs text-muted-foreground">
                        Using this thumbnail for article cards.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground italic">
                      No YouTube video. Click to add...
                    </p>
                    <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Featured Image
              {youtubeUrl && !featuredImageUrl && (
                <span className="text-xs font-normal">(overrides YouTube thumbnail)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ImageUpload
                imageType="article"
                value={featuredImageUrl || null}
                entityType="article"
                entityId={article.id}
                onUpload={async (url, storagePath) => {
                  setFeaturedImageUrl(url)
                  await saveField("featured_image_url", url)
                }}
                onRemove={async () => {
                  setFeaturedImageUrl("")
                  await saveField("featured_image_url", null)
                }}
              />
              {featuredImageUrl && (
                <div className="space-y-2">
                  <Label htmlFor="alt-text" className="text-sm">Alt Text</Label>
                  <div className="flex gap-2">
                    <Input
                      id="alt-text"
                      value={featuredImageAlt}
                      onChange={(e) => setFeaturedImageAlt(e.target.value)}
                      placeholder="Describe the image..."
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveField("featured_image_alt", featuredImageAlt || null)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Content (Markdown)</CardTitle>
        </CardHeader>
        <CardContent>
          {editingField === "content" ? (
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                autoFocus
                disabled={isSaving}
                placeholder="Write your article content in Markdown..."
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveField("content", content || null)}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCancel("content")}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingField("content")}
              className="group cursor-pointer rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                {content ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap line-clamp-[20]">
                    {content}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No content yet. Click to add...
                  </p>
                )}
                <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

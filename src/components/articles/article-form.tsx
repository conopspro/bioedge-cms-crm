"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Article, ArticleInsert } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { getYouTubeThumbnailUrl, isYouTubeUrl } from "@/lib/youtube"
import { Youtube } from "lucide-react"

interface ArticleFormProps {
  article?: Article
  companies: { id: string; name: string }[]
  mode: "create" | "edit"
}

/**
 * Article Form Component
 *
 * Form for creating and editing articles with markdown content.
 */
export function ArticleForm({ article, companies, mode }: ArticleFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get company ID from URL if provided
  const companyIdFromUrl = searchParams.get("company")

  // Form state
  const [formData, setFormData] = useState<ArticleInsert>({
    company_id: article?.company_id || companyIdFromUrl || "",
    title: article?.title || "",
    slug: article?.slug || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    status: article?.status || "draft",
    ai_enhanced: article?.ai_enhanced || false,
    published_at: article?.published_at || null,
    key_people: article?.key_people || [],
    key_people_contact_ids: article?.key_people_contact_ids || [],
    featured_image_url: article?.featured_image_url || null,
    featured_image_alt: article?.featured_image_alt || null,
    youtube_url: article?.youtube_url || null,
  })

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }))
  }

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData((prev) => ({ ...prev, slug }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = mode === "create"
        ? "/api/articles"
        : `/api/articles/${article?.id}`

      const method = mode === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save article")
      }

      const savedArticle = await response.json()

      // Redirect to article detail or company page
      if (companyIdFromUrl && mode === "create") {
        router.push(`/dashboard/companies/${companyIdFromUrl}`)
      } else {
        router.push(`/dashboard/articles/${savedArticle.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Company Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>
            Select the company this article is about.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="company_id">Company *</Label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a company...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Article Details */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Basic information about the article.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => {
                if (!formData.slug) generateSlug()
              }}
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="article-url-slug"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateSlug}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be used in the article URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleChange}
              placeholder="Brief summary of the article (1-2 sentences)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Video
          </CardTitle>
          <CardDescription>
            Add a YouTube video. The thumbnail will be used as the article image if no featured image is set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube URL</Label>
            <Input
              id="youtube_url"
              name="youtube_url"
              value={formData.youtube_url || ""}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Paste any YouTube URL (watch, youtu.be, or embed format)
            </p>
          </div>

          {/* Show thumbnail preview if valid YouTube URL */}
          {formData.youtube_url && isYouTubeUrl(formData.youtube_url) && (
            <div className="space-y-2">
              <Label>Thumbnail Preview</Label>
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                <img
                  src={getYouTubeThumbnailUrl(formData.youtube_url) || ""}
                  alt="YouTube thumbnail"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to lower quality if maxresdefault doesn't exist
                    const target = e.target as HTMLImageElement
                    if (target.src.includes("maxresdefault")) {
                      target.src = getYouTubeThumbnailUrl(formData.youtube_url, "hqdefault") || ""
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
              </div>
              {!formData.featured_image_url && (
                <p className="text-xs text-muted-foreground">
                  This thumbnail will be used as the article card image.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Image */}
      {mode === "edit" && article?.id && (
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>
              Upload a featured image for social sharing (1200x630px recommended).
              {formData.youtube_url && !formData.featured_image_url && (
                <span className="block mt-1 text-xs">
                  Currently using YouTube thumbnail. Upload an image to override.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              imageType="article"
              value={formData.featured_image_url}
              entityType="article"
              entityId={article.id}
              onUpload={(url) => {
                setFormData((prev) => ({ ...prev, featured_image_url: url }))
              }}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, featured_image_url: null }))
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="featured_image_alt">Image Alt Text</Label>
              <Input
                id="featured_image_alt"
                name="featured_image_alt"
                value={formData.featured_image_alt || ""}
                onChange={handleChange}
                placeholder="Describe the image for accessibility"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Write your article content in Markdown format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              placeholder="# Article Title

Write your article content here using Markdown...

## Introduction

Your introduction paragraph...

## Main Section

More content..."
              rows={20}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : mode === "create"
            ? "Create Article"
            : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

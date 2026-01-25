"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MediaLibrary } from "@/components/media/media-library"

interface HomepageSettings {
  id: string
  page_title: string | null
  meta_description: string | null
  og_image_url: string | null
  hero_label: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_description: string | null
  hero_video_url: string | null
  hero_image_url: string | null
  hero_cta_text: string | null
  hero_cta_url: string | null
  hero_secondary_cta_text: string | null
  hero_secondary_cta_url: string | null
  is_published: boolean
}

interface HomepageDetailsFormProps {
  initialSettings: HomepageSettings | null
}

export function HomepageDetailsForm({ initialSettings }: HomepageDetailsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<"og" | "hero">("og")

  // Form state
  const [pageTitle, setPageTitle] = useState(initialSettings?.page_title || "bioEDGE Longevity Summit | National Tour 2026")
  const [metaDescription, setMetaDescription] = useState(initialSettings?.meta_description || "")
  const [ogImageUrl, setOgImageUrl] = useState(initialSettings?.og_image_url || "")
  const [heroLabel, setHeroLabel] = useState(initialSettings?.hero_label || "NATIONAL TOUR 2026")
  const [heroTitle, setHeroTitle] = useState(initialSettings?.hero_title || "bioEDGE Longevity Summit")
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings?.hero_subtitle || "Where Biohacking Starts with NO")
  const [heroDescription, setHeroDescription] = useState(initialSettings?.hero_description || "")
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialSettings?.hero_video_url || "")
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings?.hero_image_url || "")
  const [heroCtaText, setHeroCtaText] = useState(initialSettings?.hero_cta_text || "Get Notified")
  const [heroCtaUrl, setHeroCtaUrl] = useState(initialSettings?.hero_cta_url || "")
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(initialSettings?.hero_secondary_cta_text || "Get the Book")
  const [heroSecondaryCtaUrl, setHeroSecondaryCtaUrl] = useState(initialSettings?.hero_secondary_cta_url || "")
  const [isPublished, setIsPublished] = useState(initialSettings?.is_published || false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_title: pageTitle,
          meta_description: metaDescription,
          og_image_url: ogImageUrl || null,
          hero_label: heroLabel,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_description: heroDescription || null,
          hero_video_url: heroVideoUrl || null,
          hero_image_url: heroImageUrl || null,
          hero_cta_text: heroCtaText,
          hero_cta_url: heroCtaUrl || null,
          hero_secondary_cta_text: heroSecondaryCtaText,
          hero_secondary_cta_url: heroSecondaryCtaUrl || null,
          is_published: isPublished,
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to save")
      }
    } catch (error) {
      console.error("Error saving homepage settings:", error)
      alert("Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  const openMediaLibrary = (target: "og" | "hero") => {
    setMediaTarget(target)
    setShowMediaLibrary(true)
  }

  return (
    <div className="space-y-6">
      {/* Meta Information */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Information</CardTitle>
          <CardDescription>
            SEO settings and social sharing preview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="bioEDGE Longevity Summit | National Tour 2026"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="A transformational live experience bringing the EDGE Framework to cities across America."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Social Share Image (OG Image)</Label>
            <div className="flex gap-2">
              <Input
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <Button variant="outline" onClick={() => openMediaLibrary("og")}>
                Browse
              </Button>
            </div>
            {ogImageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border max-w-xs">
                <img src={ogImageUrl} alt="OG Preview" className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            The main banner at the top of the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroLabel">Label (Badge Text)</Label>
              <Input
                id="heroLabel"
                value={heroLabel}
                onChange={(e) => setHeroLabel(e.target.value)}
                placeholder="NATIONAL TOUR 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="bioEDGE Longevity Summit"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Where Biohacking Starts with NO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDescription">Description</Label>
            <Textarea
              id="heroDescription"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="A transformational live experience..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroVideoUrl">Video URL (YouTube/Vimeo Embed)</Label>
            <Input
              id="heroVideoUrl"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div className="space-y-2">
            <Label>Hero Background Image (if no video)</Label>
            <div className="flex gap-2">
              <Input
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <Button variant="outline" onClick={() => openMediaLibrary("hero")}>
                Browse
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroCtaText">Primary CTA Text</Label>
              <Input
                id="heroCtaText"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                placeholder="Get Notified"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCtaUrl">Primary CTA URL</Label>
              <Input
                id="heroCtaUrl"
                value={heroCtaUrl}
                onChange={(e) => setHeroCtaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroSecondaryCtaText">Secondary CTA Text</Label>
              <Input
                id="heroSecondaryCtaText"
                value={heroSecondaryCtaText}
                onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                placeholder="Get the Book"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSecondaryCtaUrl">Secondary CTA URL</Label>
              <Input
                id="heroSecondaryCtaUrl"
                value={heroSecondaryCtaUrl}
                onChange={(e) => setHeroSecondaryCtaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
          <CardDescription>
            Control the homepage publish status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="isPublished">
              {isPublished ? "Homepage is published" : "Homepage is in draft mode"}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Media Library */}
      <MediaLibrary
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelect={(media) => {
          if (mediaTarget === "og") {
            setOgImageUrl(media.file_url)
          } else {
            setHeroImageUrl(media.file_url)
          }
          setShowMediaLibrary(false)
        }}
        selectionMode="single"
        folder="general"
        title="Select Image"
      />
    </div>
  )
}

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaLibraryInline } from "@/components/media/media-library"
import { SharedSlidersManager } from "@/components/media/shared-sliders-manager"

interface SliderImage {
  id: string
  slider_id: string
  image_url: string
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  link_url: string | null
  display_order: number
  is_visible: boolean
}

interface SharedSlider {
  id: string
  name: string
  slug: string
  description: string | null
  section_title: string | null
  section_subtitle: string | null
  section_background: string
  auto_play: boolean
  auto_play_interval: number
  show_navigation: boolean
  show_dots: boolean
  show_captions: boolean
  is_active: boolean
  images: SliderImage[]
}

interface MediaPageTabsProps {
  initialSliders: SharedSlider[]
}

/**
 * Media Page Tabs
 *
 * Provides tabbed navigation between Media Library and Photo Sliders.
 */
export function MediaPageTabs({ initialSliders }: MediaPageTabsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media</h1>
        <p className="text-muted-foreground">
          Upload images and manage photo sliders for your site.
        </p>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="sliders">Photo Sliders</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <MediaLibraryInline className="min-h-[600px]" />
        </TabsContent>

        <TabsContent value="sliders">
          <SharedSlidersManager initialSliders={initialSliders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

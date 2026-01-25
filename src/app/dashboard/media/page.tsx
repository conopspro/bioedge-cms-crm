import { createClient } from "@/lib/supabase/server"
import { MediaPageTabs } from "@/components/media/media-page-tabs"

/**
 * Media Management Page
 *
 * Central place to manage media assets:
 * - Media Library: Upload and manage images
 * - Photo Sliders: Create reusable sliders for homepage and other pages
 */
export default async function MediaPage() {
  const supabase = await createClient()

  // Fetch all shared sliders with their images
  const { data: sliders, error } = await supabase
    .from("shared_photo_sliders")
    .select(`
      *,
      images:shared_slider_images(*)
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching shared sliders:", error)
  }

  // Sort images by display_order
  const slidersWithSortedImages = (sliders || []).map((slider) => ({
    ...slider,
    images: (slider.images || []).sort(
      (a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order
    ),
  }))

  return <MediaPageTabs initialSliders={slidersWithSortedImages} />
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
  Link,
  BookOpen,
  Pencil,
  Palette,
} from "lucide-react"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { FaqManager } from "./faq-manager"
import { MediaLibrary } from "@/components/media/media-library"

interface SharedSlider {
  id: string
  name: string
  slug: string
  description: string | null
  images: SliderImage[]
}

interface SectionSettings {
  visible: boolean
  title: string
  subtitle: string
  order?: number // For drag-and-drop ordering
}

interface HeroSectionSettings extends SectionSettings {
  layout?: 'full_background' | 'split_image' // Hero layout type
  split_image_url?: string | null // Image URL for split layout
  split_image_position?: 'left' | 'right' // Which side the image appears on
  // Content overrides (if not set, uses event fields)
  logo_url?: string | null
  tagline?: string | null
  description?: string | null
  // CTA customization
  cta_text?: string | null // Default: "Register Now"
  cta_url?: string | null // Default: event.registration_url
  secondary_cta_text?: string | null
  secondary_cta_url?: string | null
  // Display options
  show_countdown?: boolean
  show_early_bird?: boolean
  early_bird_text?: string | null
  // Media
  background_image_url?: string | null
  video_url?: string | null
  overlay_opacity?: number // 0-100
}

interface SliderSectionSettings extends SectionSettings {
  slider_id?: string | null // Reference to event_photo_sliders
  background?: string
}

interface VideoPlaylistSettings extends SectionSettings {
  videos?: { url: string; title?: string; thumbnail?: string }[]
  background?: string
}

interface CustomHtmlSettings extends SectionSettings {
  html_content?: string
  background?: string
}

interface FinalCtaSettings extends SectionSettings {
  description?: string  // Subtitle/description text below the title
  button_text?: string  // Custom button text (default: "Get Your Tickets Now")
}

// Value Prop item for the Value Propositions section
interface ValuePropItem {
  id: string
  text: string
  icon?: string | null
  highlight?: boolean
}

interface ValuePropsSectionSettings extends SectionSettings {
  // Description text shown below the header
  description?: string | null
  // Layout options
  layout?: 'grid' | 'list' | 'cards'
  columns?: 2 | 3 | 4
  // Custom value props (overrides event.value_props if present)
  custom_value_props?: ValuePropItem[] | null
  use_custom_props?: boolean
  // Fallback description (when no value props exist)
  fallback_description?: string | null
  // Style options
  show_icons?: boolean
  icon_style?: 'check' | 'bullet' | 'number' | 'custom'
}

interface TestimonialsSectionSettings extends SectionSettings {
  // Description text shown below the header
  description?: string | null
  // Layout options
  layout?: 'grid' | 'carousel' | 'featured'
  columns?: 2 | 3
  // Display options
  max_testimonials?: number // Limit how many to show (default: 6)
  show_photos?: boolean
  show_company?: boolean
  show_title?: boolean
  show_video_link?: boolean
  show_quote_icon?: boolean
  // Card style
  card_style?: 'default' | 'minimal' | 'bordered'
}

interface FaqSectionSettings extends SectionSettings {
  // Description text shown below the header
  description?: string | null
  // Contact section
  show_contact_section?: boolean
  contact_text?: string | null
  contact_email?: string | null
  contact_button_text?: string | null
  // Layout
  layout?: 'accordion' | 'two_column'
  // Display options
  show_categories?: boolean
  expand_first?: boolean
}

interface LandingPageSettings {
  hero: HeroSectionSettings
  value_props: ValuePropsSectionSettings
  testimonials: TestimonialsSectionSettings
  leaders: SectionSettings
  tickets: SectionSettings
  venue: SectionSettings
  companies: SectionSettings
  faq: FaqSectionSettings
  final_cta: FinalCtaSettings
  photo_slider_1: SliderSectionSettings
  photo_slider_2: SliderSectionSettings
  video_playlist: VideoPlaylistSettings
  custom_html: CustomHtmlSettings
  section_order?: string[] // Array of section keys in display order
}

interface PhotoSlider {
  id: string
  name: string
  slug: string
  position: string
  display_order: number
  auto_play: boolean
  auto_play_interval: number
  show_navigation: boolean
  show_dots: boolean
  show_captions: boolean
  is_visible: boolean
  section_title: string | null
  section_subtitle: string | null
  section_background: string
  images: SliderImage[]
  shared_slider_id?: string | null
  is_from_shared?: boolean
}

interface SliderImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  link_url: string | null
  display_order: number
  is_visible: boolean
}

interface SectionPhoto {
  id: string
  section: string
  image_url: string
  alt_text: string | null
  caption: string | null
  focal_point_x: number
  focal_point_y: number
  overlay_opacity: number
  display_order: number
  is_primary: boolean
  is_visible: boolean
}

interface SectionColors {
  background: string | null
  title: string
  subtitle: string
  text: string
  accent?: string        // Icons, links, highlights
  button_bg?: string     // Primary button background
  button_text?: string   // Primary button text
  card_bg?: string       // Card backgrounds within section
  card_title?: string    // Title text inside cards (for sections with different bg)
  card_text?: string     // Body text inside cards
}

interface SectionColorsSettings {
  hero: SectionColors
  value_props: SectionColors
  testimonials: SectionColors
  leaders: SectionColors
  tickets: SectionColors
  venue: SectionColors
  companies: SectionColors
  faq: SectionColors
  cta: SectionColors
}

interface LandingPageEditorProps {
  eventId: string
  initialSettings: Partial<LandingPageSettings> | null
  initialSectionColors?: Partial<SectionColorsSettings> | null
  sliders: PhotoSlider[]
  sectionPhotos: SectionPhoto[]
}

const defaultSettings: LandingPageSettings = {
  hero: {
    visible: true,
    title: "",
    subtitle: "",
    order: 0,
    layout: 'full_background',
    split_image_url: null,
    split_image_position: 'right',
    cta_text: "Register Now",
    show_countdown: true,
    show_early_bird: true,
    overlay_opacity: 70,
  },
  value_props: {
    visible: true,
    title: "What You'll Get",
    subtitle: "Why Attend",
    order: 1,
    layout: 'grid',
    columns: 3,
    show_icons: true,
    icon_style: 'check',
    use_custom_props: false,
    custom_value_props: null,
  },
  testimonials: {
    visible: true,
    title: "Don't Take Our Word For It",
    subtitle: "What Attendees Say",
    order: 2,
    layout: 'grid',
    columns: 3,
    max_testimonials: 6,
    show_photos: true,
    show_company: true,
    show_title: true,
    show_video_link: true,
    show_quote_icon: true,
    card_style: 'default',
  },
  leaders: { visible: true, title: "Featured Leaders", subtitle: "Who You'll Learn From", order: 3 },
  photo_slider_1: { visible: false, title: "Photo Gallery", subtitle: "Event Highlights", order: 4, slider_id: null, background: "#ffffff" },
  tickets: { visible: true, title: "Choose Your Experience", subtitle: "Reserve Your Spot", order: 5 },
  venue: { visible: true, title: "", subtitle: "The Venue", order: 6 },
  companies: { visible: true, title: "Companies & Sponsors", subtitle: "Our Partners", order: 7 },
  video_playlist: { visible: false, title: "Videos", subtitle: "Watch & Learn", order: 8, videos: [], background: "#f8f9fa" },
  photo_slider_2: { visible: false, title: "More Photos", subtitle: "Gallery", order: 9, slider_id: null, background: "#ffffff" },
  faq: {
    visible: true,
    title: "Frequently Asked Questions",
    subtitle: "Questions?",
    order: 10,
    layout: 'accordion',
    show_contact_section: true,
    contact_text: "Still have questions?",
    contact_email: null,
    contact_button_text: "Contact Us",
    show_categories: false,
    expand_first: false,
  },
  custom_html: { visible: false, title: "Custom Section", subtitle: "", order: 11, html_content: "", background: "#ffffff" },
  final_cta: { visible: true, title: "Ready to Join Us?", subtitle: "", description: "", button_text: "Get Your Tickets Now", order: 12 },
  section_order: ["hero", "value_props", "testimonials", "leaders", "photo_slider_1", "tickets", "venue", "companies", "video_playlist", "photo_slider_2", "faq", "custom_html", "final_cta"],
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Section",
  value_props: "Value Propositions",
  testimonials: "Testimonials",
  leaders: "Featured Leaders",
  photo_slider_1: "Photo Slider 1",
  tickets: "Ticket Tiers",
  venue: "Venue Information",
  companies: "Companies & Sponsors",
  video_playlist: "Video Playlist",
  photo_slider_2: "Photo Slider 2",
  faq: "FAQ Section",
  custom_html: "Custom HTML Section",
  final_cta: "Final Call-to-Action",
}

const sectionDescriptions: Record<string, string> = {
  hero: "The main banner with event name, date, location, and countdown",
  value_props: "Key benefits and reasons to attend",
  testimonials: "Quotes from past attendees",
  leaders: "Featured speakers and panelists",
  photo_slider_1: "Image carousel from your photo sliders",
  tickets: "Ticket tiers and pricing",
  venue: "Location details and accommodation info",
  companies: "Sponsors and exhibitors",
  video_playlist: "YouTube or Vimeo video playlist",
  photo_slider_2: "Second image carousel for more photos",
  faq: "Frequently asked questions",
  custom_html: "Add your own HTML content",
  final_cta: "Bottom registration call-to-action",
}

const defaultSectionColors: SectionColorsSettings = {
  hero: {
    background: null, // Uses gradient by default
    title: "#ffffff",
    subtitle: "#cccccc",
    text: "#cccccc",
    accent: "#c9a227",      // Gold for icons
    button_bg: "#c9a227",   // Gold button
    button_text: "#ffffff",
    card_bg: "rgba(255,255,255,0.1)", // Countdown boxes
  },
  value_props: {
    background: "#ffffff",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
    card_bg: "#f3f4f6",
  },
  testimonials: {
    background: "#f8f9fa",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
    card_bg: "#ffffff",
  },
  leaders: {
    background: "#ffffff",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
    card_bg: "#ffffff",
  },
  tickets: {
    background: "#0a2540",
    title: "#ffffff",
    subtitle: "#c9a227",
    text: "#cccccc",
    accent: "#c9a227",
    button_bg: "#c9a227",
    button_text: "#ffffff",
    card_bg: "#ffffff",
    card_title: "#0a2540",  // Dark title on white card
    card_text: "#374151",   // Dark text on white card
  },
  venue: {
    background: "#ffffff",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
  },
  companies: {
    background: "#f8f9fa",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
    card_bg: "#ffffff",
  },
  faq: {
    background: "#ffffff",
    title: "#0a2540",
    subtitle: "#c9a227",
    text: "#374151",
    accent: "#c9a227",
  },
  cta: {
    background: null, // Uses gradient by default
    title: "#ffffff",
    subtitle: "#cccccc",
    text: "#cccccc",
    accent: "#c9a227",
    button_bg: "#c9a227",
    button_text: "#ffffff",
  },
}

// Color section keys (slightly different from settings - uses "cta" instead of "final_cta")
const colorSectionKeys: (keyof SectionColorsSettings)[] = [
  "hero",
  "value_props",
  "testimonials",
  "leaders",
  "tickets",
  "venue",
  "companies",
  "faq",
  "cta",
]

const colorSectionLabels: Record<string, string> = {
  hero: "Hero Section",
  value_props: "Value Propositions",
  testimonials: "Testimonials",
  leaders: "Featured Leaders",
  tickets: "Ticket Tiers",
  venue: "Venue Information",
  companies: "Companies & Sponsors",
  faq: "FAQ Section",
  cta: "Final Call-to-Action",
}

function mergeSectionColorsWithDefaults(initial: Partial<SectionColorsSettings> | null | undefined): SectionColorsSettings {
  if (!initial) return defaultSectionColors

  const merged = { ...defaultSectionColors }
  for (const key of colorSectionKeys) {
    if (initial[key]) {
      merged[key] = { ...defaultSectionColors[key], ...initial[key] }
    }
  }
  return merged
}

// Merge initial settings with defaults to ensure all sections exist
function mergeWithDefaults(initial: Partial<LandingPageSettings> | null): LandingPageSettings {
  if (!initial) return defaultSettings

  const merged = { ...defaultSettings }
  for (const key of Object.keys(defaultSettings) as (keyof LandingPageSettings)[]) {
    if (key === 'section_order') {
      // Use initial section_order if provided, otherwise use default
      merged.section_order = initial.section_order || defaultSettings.section_order
    } else if (initial[key]) {
      merged[key] = { ...defaultSettings[key], ...initial[key] } as any
    }
  }
  return merged
}

export function LandingPageEditor({
  eventId,
  initialSettings,
  initialSectionColors,
  sliders: initialSliders,
  sectionPhotos: initialPhotos,
}: LandingPageEditorProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<LandingPageSettings>(
    mergeWithDefaults(initialSettings)
  )
  const [sectionColors, setSectionColors] = useState<SectionColorsSettings>(
    mergeSectionColorsWithDefaults(initialSectionColors)
  )
  const [sliders, setSliders] = useState<PhotoSlider[]>(initialSliders)
  const [sectionPhotos, setSectionPhotos] = useState<SectionPhoto[]>(initialPhotos)
  const [saving, setSaving] = useState(false)
  const [savingColors, setSavingColors] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [expandedColorSections, setExpandedColorSections] = useState<Set<string>>(new Set())
  const [showSliderDialog, setShowSliderDialog] = useState(false)
  const [showLinkSliderDialog, setShowLinkSliderDialog] = useState(false)
  const [showSliderLibraryDialog, setShowSliderLibraryDialog] = useState(false)
  const [showImageManagerDialog, setShowImageManagerDialog] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [showSectionPhotoLibrary, setShowSectionPhotoLibrary] = useState(false)
  const [addingPhotoToSection, setAddingPhotoToSection] = useState<string | null>(null)
  const [managingSlider, setManagingSlider] = useState<PhotoSlider | null>(null)
  const [sharedSliders, setSharedSliders] = useState<SharedSlider[]>([])
  const [newSliderName, setNewSliderName] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageCaption, setNewImageCaption] = useState("")

  // New shared slider form
  const [newSharedSlider, setNewSharedSlider] = useState({
    name: "",
    description: "",
  })

  // Fetch shared sliders
  useEffect(() => {
    fetchSharedSliders()
  }, [])

  const fetchSharedSliders = async () => {
    try {
      const response = await fetch("/api/shared-sliders")
      if (response.ok) {
        const data = await response.json()
        setSharedSliders(data)
      }
    } catch (error) {
      console.error("Error fetching shared sliders:", error)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const toggleColorSection = (section: string) => {
    setExpandedColorSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const updateSectionColor = (
    section: keyof SectionColorsSettings,
    colorType: keyof SectionColors,
    value: string
  ) => {
    setSectionColors((prev) => ({
      ...prev,
      [section]: { ...prev[section], [colorType]: value || null },
    }))
  }

  const saveSectionColors = async () => {
    setSavingColors(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_colors: sectionColors }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Save colors error response:", errorData)
        throw new Error(errorData.error || "Failed to save colors")
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving colors:", error)
    } finally {
      setSavingColors(false)
    }
  }

  const addSectionPhoto = async (section: string, imageUrl: string) => {
    console.log("Adding section photo:", { section, imageUrl, eventId })
    try {
      const response = await fetch(`/api/events/${eventId}/section-photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          image_url: imageUrl,
          display_order: sectionPhotos.filter(p => p.section === section).length,
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to add section photo")
      }

      const newPhoto = await response.json()
      console.log("New photo added:", newPhoto)
      setSectionPhotos(prev => [...prev, newPhoto])
      router.refresh()
    } catch (error) {
      console.error("Error adding section photo:", error)
    }
  }

  const deleteSectionPhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/section-photos/${photoId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete section photo")
      }

      setSectionPhotos(prev => prev.filter(p => p.id !== photoId))
      router.refresh()
    } catch (error) {
      console.error("Error deleting section photo:", error)
    }
  }

  const updateSectionVisibility = (section: keyof LandingPageSettings, visible: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], visible },
    }))
  }

  const updateSectionTitle = (section: keyof LandingPageSettings, title: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], title },
    }))
  }

  const updateSectionSubtitle = (section: keyof LandingPageSettings, subtitle: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], subtitle },
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landing_page_settings: settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const createSlider = async () => {
    if (!newSliderName.trim()) return

    try {
      const response = await fetch(`/api/events/${eventId}/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSliderName,
          slug: newSliderName.toLowerCase().replace(/\s+/g, "-"),
          position: "custom",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create slider")
      }

      const newSlider = await response.json()
      setSliders((prev) => [...prev, { ...newSlider, images: [] }])
      setNewSliderName("")
      setShowSliderDialog(false)
    } catch (error) {
      console.error("Error creating slider:", error)
    }
  }

  const deleteSlider = async (sliderId: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/sliders/${sliderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete slider")
      }

      setSliders((prev) => prev.filter((s) => s.id !== sliderId))
    } catch (error) {
      console.error("Error deleting slider:", error)
    }
  }

  // Slider position options - where sliders can be placed between sections
  const sliderPositionOptions = [
    { value: "after_hero", label: "After Hero" },
    { value: "after_value_props", label: "After Value Propositions" },
    { value: "after_testimonials", label: "After Testimonials" },
    { value: "after_leaders", label: "After Featured Leaders" },
    { value: "after_tickets", label: "After Ticket Tiers" },
    { value: "after_venue", label: "After Venue" },
    { value: "after_companies", label: "After Companies" },
    { value: "after_faq", label: "After FAQ" },
    { value: "custom", label: "Custom Position" },
  ]

  const updateSliderPosition = async (sliderId: string, position: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sliders/${sliderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position }),
      })

      if (response.ok) {
        setSliders((prev) =>
          prev.map((s) => (s.id === sliderId ? { ...s, position } : s))
        )
      }
    } catch (error) {
      console.error("Error updating slider position:", error)
    }
  }

  const updateSliderVisibility = async (sliderId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sliders/${sliderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: isVisible }),
      })

      if (response.ok) {
        setSliders((prev) =>
          prev.map((s) => (s.id === sliderId ? { ...s, is_visible: isVisible } : s))
        )
      }
    } catch (error) {
      console.error("Error updating slider visibility:", error)
    }
  }

  // Link a shared slider to this event
  const linkSharedSlider = async (sharedSliderId: string) => {
    const sharedSlider = sharedSliders.find((s) => s.id === sharedSliderId)
    if (!sharedSlider) return

    try {
      const response = await fetch(`/api/events/${eventId}/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sharedSlider.name,
          slug: sharedSlider.slug,
          position: "custom",
          shared_slider_id: sharedSliderId,
          is_from_shared: true,
        }),
      })

      if (response.ok) {
        const newSlider = await response.json()
        setSliders((prev) => [...prev, { ...newSlider, images: sharedSlider.images }])
        setShowLinkSliderDialog(false)
      }
    } catch (error) {
      console.error("Error linking shared slider:", error)
    }
  }

  // Create a new shared slider
  const createSharedSlider = async () => {
    if (!newSharedSlider.name.trim()) return

    try {
      const response = await fetch("/api/shared-sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSharedSlider.name,
          description: newSharedSlider.description || null,
        }),
      })

      if (response.ok) {
        const created = await response.json()
        setSharedSliders((prev) => [...prev, created])
        setNewSharedSlider({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error creating shared slider:", error)
    }
  }

  // Delete a shared slider
  const deleteSharedSlider = async (sliderId: string) => {
    if (!confirm("Are you sure you want to delete this slider? It will be removed from all events.")) return

    try {
      const response = await fetch(`/api/shared-sliders/${sliderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSharedSliders((prev) => prev.filter((s) => s.id !== sliderId))
      }
    } catch (error) {
      console.error("Error deleting shared slider:", error)
    }
  }

  // Open image manager for a slider
  const openImageManager = (slider: PhotoSlider) => {
    setManagingSlider(slider)
    setShowImageManagerDialog(true)
  }

  // Add image to slider
  const addImageToSlider = async () => {
    if (!managingSlider || !newImageUrl.trim()) return

    const apiBase = managingSlider.is_from_shared && managingSlider.shared_slider_id
      ? `/api/shared-sliders/${managingSlider.shared_slider_id}/images`
      : `/api/events/${eventId}/sliders/${managingSlider.id}/images`

    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: newImageUrl,
          caption: newImageCaption || null,
        }),
      })

      if (response.ok) {
        const newImage = await response.json()

        // Update local state
        setSliders((prev) =>
          prev.map((s) =>
            s.id === managingSlider.id
              ? { ...s, images: [...s.images, newImage] }
              : s
          )
        )

        // Also update managing slider
        setManagingSlider((prev) =>
          prev ? { ...prev, images: [...prev.images, newImage] } : null
        )

        // If it's a shared slider, also update shared sliders state
        if (managingSlider.is_from_shared && managingSlider.shared_slider_id) {
          setSharedSliders((prev) =>
            prev.map((s) =>
              s.id === managingSlider.shared_slider_id
                ? { ...s, images: [...s.images, newImage] }
                : s
            )
          )
        }

        setNewImageUrl("")
        setNewImageCaption("")
      }
    } catch (error) {
      console.error("Error adding image:", error)
    }
  }

  // Delete image from slider
  const deleteImageFromSlider = async (imageId: string) => {
    if (!managingSlider) return

    const apiBase = managingSlider.is_from_shared && managingSlider.shared_slider_id
      ? `/api/shared-sliders/${managingSlider.shared_slider_id}/images/${imageId}`
      : `/api/events/${eventId}/sliders/${managingSlider.id}/images/${imageId}`

    try {
      const response = await fetch(apiBase, { method: "DELETE" })

      if (response.ok) {
        // Update local state
        setSliders((prev) =>
          prev.map((s) =>
            s.id === managingSlider.id
              ? { ...s, images: s.images.filter((img) => img.id !== imageId) }
              : s
          )
        )

        // Also update managing slider
        setManagingSlider((prev) =>
          prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : null
        )

        // If it's a shared slider, also update shared sliders state
        if (managingSlider.is_from_shared && managingSlider.shared_slider_id) {
          setSharedSliders((prev) =>
            prev.map((s) =>
              s.id === managingSlider.shared_slider_id
                ? { ...s, images: s.images.filter((img) => img.id !== imageId) }
                : s
            )
          )
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  // Use section_order for display, filter out the section_order key itself
  const sectionKeys = (settings.section_order || defaultSettings.section_order || []).filter(
    (key): key is keyof Omit<LandingPageSettings, 'section_order'> => key !== 'section_order' && key in settings
  )

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sectionKeys)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSettings((prev) => ({
      ...prev,
      section_order: items,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Section Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Landing Page Sections</CardTitle>
              <CardDescription>
                Toggle visibility and customize titles for each section. Drag to reorder.
              </CardDescription>
            </div>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {sectionKeys.map((section, index) => {
            const sectionSettings = settings[section]
            const isExpanded = expandedSections.has(section)

            return (
              <Collapsible key={section} open={isExpanded} onOpenChange={() => toggleSection(section)}>
                <div
                  className={cn(
                    "border rounded-lg transition-colors",
                    sectionSettings.visible ? "bg-white" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 p-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                    <Switch
                      checked={sectionSettings.visible}
                      onCheckedChange={(checked) => updateSectionVisibility(section, checked)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sectionLabels[section]}</span>
                        {!sectionSettings.visible && (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {sectionDescriptions[section]}
                      </p>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="px-3 pb-3 pt-0 border-t space-y-3">
                      {section !== "hero" && (
                        <>
                          <div className="grid gap-3 sm:grid-cols-2 pt-3">
                            <div>
                              <Label htmlFor={`${section}-subtitle`}>Section Label</Label>
                              <Input
                                id={`${section}-subtitle`}
                                value={sectionSettings.subtitle}
                                onChange={(e) => updateSectionSubtitle(section, e.target.value)}
                                placeholder="e.g., Why Attend"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${section}-title`}>Section Title</Label>
                              <Input
                                id={`${section}-title`}
                                value={sectionSettings.title}
                                onChange={(e) => updateSectionTitle(section, e.target.value)}
                                placeholder="e.g., What You'll Get"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Final CTA specific fields */}
                      {section === "final_cta" && (
                        <div className="pt-3 border-t mt-3 space-y-3">
                          <div>
                            <Label htmlFor="final_cta-description">Description</Label>
                            <Input
                              id="final_cta-description"
                              value={(settings.final_cta as FinalCtaSettings).description || ""}
                              onChange={(e) => {
                                setSettings((prev) => ({
                                  ...prev,
                                  final_cta: { ...prev.final_cta, description: e.target.value },
                                }))
                              }}
                              placeholder="e.g., Decode Your Longevity Potential. Optimize Your Biological EDGE."
                              className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Short description shown below the title
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="final_cta-button_text">Button Text</Label>
                            <Input
                              id="final_cta-button_text"
                              value={(settings.final_cta as FinalCtaSettings).button_text || "Get Your Tickets Now"}
                              onChange={(e) => {
                                setSettings((prev) => ({
                                  ...prev,
                                  final_cta: { ...prev.final_cta, button_text: e.target.value },
                                }))
                              }}
                              placeholder="Get Your Tickets Now"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Hero Section Full Customization */}
                      {section === "hero" && (
                        <div className="pt-3 space-y-4">
                          {/* Content Overrides */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Content Overrides</h4>
                            <p className="text-xs text-muted-foreground">
                              Leave blank to use event defaults. Fill in to override.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="hero-tagline">Tagline Override</Label>
                                <Input
                                  id="hero-tagline"
                                  value={(settings.hero as HeroSectionSettings).tagline || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, tagline: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="Uses event tagline if blank"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="hero-description">Description Override</Label>
                                <Input
                                  id="hero-description"
                                  value={(settings.hero as HeroSectionSettings).description || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, description: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="Uses event description if blank"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="hero-logo">Logo URL Override</Label>
                              <Input
                                id="hero-logo"
                                value={(settings.hero as HeroSectionSettings).logo_url || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, logo_url: e.target.value || null },
                                  }))
                                }}
                                placeholder="Uses event logo if blank"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Call to Action</h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="hero-cta-text">Primary Button Text</Label>
                                <Input
                                  id="hero-cta-text"
                                  value={(settings.hero as HeroSectionSettings).cta_text || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, cta_text: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="Register Now"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="hero-cta-url">Primary Button URL</Label>
                                <Input
                                  id="hero-cta-url"
                                  value={(settings.hero as HeroSectionSettings).cta_url || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, cta_url: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="Uses registration URL if blank"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="hero-secondary-cta-text">Secondary Button Text</Label>
                                <Input
                                  id="hero-secondary-cta-text"
                                  value={(settings.hero as HeroSectionSettings).secondary_cta_text || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, secondary_cta_text: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="Leave blank to hide"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="hero-secondary-cta-url">Secondary Button URL</Label>
                                <Input
                                  id="hero-secondary-cta-url"
                                  value={(settings.hero as HeroSectionSettings).secondary_cta_url || ""}
                                  onChange={(e) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, secondary_cta_url: e.target.value || null },
                                    }))
                                  }}
                                  placeholder="https://..."
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Display Options */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Display Options</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Countdown Timer</Label>
                                  <p className="text-xs text-muted-foreground">Display countdown to event start</p>
                                </div>
                                <Switch
                                  checked={(settings.hero as HeroSectionSettings).show_countdown !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, show_countdown: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Early Bird Notice</Label>
                                  <p className="text-xs text-muted-foreground">Display early bird pricing text</p>
                                </div>
                                <Switch
                                  checked={(settings.hero as HeroSectionSettings).show_early_bird !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, show_early_bird: checked },
                                    }))
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="hero-early-bird">Early Bird Text Override</Label>
                              <Input
                                id="hero-early-bird"
                                value={(settings.hero as HeroSectionSettings).early_bird_text || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, early_bird_text: e.target.value || null },
                                  }))
                                }}
                                placeholder="e.g., Early Bird ends March 15!"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {/* Layout */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Layout</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, layout: 'full_background' },
                                  }))
                                }}
                                className={cn(
                                  "p-3 border rounded-lg text-left transition-colors",
                                  (settings.hero as HeroSectionSettings).layout !== 'split_image'
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted/50"
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-6 rounded bg-gradient-to-r from-navy to-blue-600" />
                                  <span className="font-medium text-sm">Full Background</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Image covers entire hero with overlay
                                </p>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, layout: 'split_image' },
                                  }))
                                }}
                                className={cn(
                                  "p-3 border rounded-lg text-left transition-colors",
                                  (settings.hero as HeroSectionSettings).layout === 'split_image'
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted/50"
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex w-8 h-6 rounded overflow-hidden">
                                    <div className="w-1/2 bg-navy" />
                                    <div className="w-1/2 bg-gray-300" />
                                  </div>
                                  <span className="font-medium text-sm">Split Image</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Text on one side, image on the other
                                </p>
                              </button>
                            </div>

                            {/* Full Background Options */}
                            {(settings.hero as HeroSectionSettings).layout !== 'split_image' && (
                              <div className="pt-3 space-y-3">
                                <div>
                                  <Label htmlFor="hero-overlay">Background Overlay Opacity</Label>
                                  <div className="flex items-center gap-3 mt-1">
                                    <input
                                      type="range"
                                      id="hero-overlay"
                                      min="0"
                                      max="100"
                                      value={(settings.hero as HeroSectionSettings).overlay_opacity ?? 70}
                                      onChange={(e) => {
                                        setSettings((prev) => ({
                                          ...prev,
                                          hero: { ...prev.hero, overlay_opacity: parseInt(e.target.value) },
                                        }))
                                      }}
                                      className="flex-1"
                                    />
                                    <span className="text-sm w-12 text-right">
                                      {(settings.hero as HeroSectionSettings).overlay_opacity ?? 70}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Controls how much the background color covers the image
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Split Image Options */}
                            {(settings.hero as HeroSectionSettings).layout === 'split_image' && (
                              <div className="pt-3 space-y-3">
                                <div>
                                  <Label>Image Position</Label>
                                  <Select
                                    value={(settings.hero as HeroSectionSettings).split_image_position || 'right'}
                                    onValueChange={(value: 'left' | 'right') => {
                                      setSettings((prev) => ({
                                        ...prev,
                                        hero: { ...prev.hero, split_image_position: value },
                                      }))
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="right">Image on Right</SelectItem>
                                      <SelectItem value="left">Image on Left</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Split Image</Label>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    This image will take up 50% of the hero section
                                  </p>
                                  {(settings.hero as HeroSectionSettings).split_image_url ? (
                                    <div className="relative">
                                      <div className="aspect-video rounded-lg overflow-hidden border max-w-xs">
                                        <img
                                          src={(settings.hero as HeroSectionSettings).split_image_url!}
                                          alt="Hero split image"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setAddingPhotoToSection('hero_split')
                                            setShowSectionPhotoLibrary(true)
                                          }}
                                        >
                                          <Pencil className="h-3 w-3 mr-1" />
                                          Change
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSettings((prev) => ({
                                              ...prev,
                                              hero: { ...prev.hero, split_image_url: null },
                                            }))
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAddingPhotoToSection('hero_split')
                                        setShowSectionPhotoLibrary(true)
                                      }}
                                      className="w-full max-w-xs aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                    >
                                      <Upload className="h-6 w-6" />
                                      <span className="text-sm">Add Split Image</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Value Props Section Full Customization */}
                      {section === "value_props" && (
                        <div className="pt-3 space-y-4">
                          {/* Description */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Section Content</h4>
                            <div>
                              <Label htmlFor="value_props-description">Section Description</Label>
                              <Textarea
                                id="value_props-description"
                                value={(settings.value_props as ValuePropsSectionSettings).description || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    value_props: { ...prev.value_props, description: e.target.value || null },
                                  }))
                                }}
                                placeholder="Optional description shown below the title"
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="value_props-fallback">Fallback Description</Label>
                              <Textarea
                                id="value_props-fallback"
                                value={(settings.value_props as ValuePropsSectionSettings).fallback_description || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    value_props: { ...prev.value_props, fallback_description: e.target.value || null },
                                  }))
                                }}
                                placeholder="Shown if no value props exist (uses event description as default)"
                                className="mt-1"
                                rows={2}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Displayed when there are no value propositions defined
                              </p>
                            </div>
                          </div>

                          {/* Layout Options */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Layout</h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label>Display Style</Label>
                                <Select
                                  value={(settings.value_props as ValuePropsSectionSettings).layout || 'grid'}
                                  onValueChange={(value: 'grid' | 'list' | 'cards') => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, layout: value },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="grid">Grid Layout</SelectItem>
                                    <SelectItem value="list">Single Column List</SelectItem>
                                    <SelectItem value="cards">Cards with Borders</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Grid Columns</Label>
                                <Select
                                  value={String((settings.value_props as ValuePropsSectionSettings).columns || 3)}
                                  onValueChange={(value) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, columns: parseInt(value) as 2 | 3 | 4 },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2">2 Columns</SelectItem>
                                    <SelectItem value="3">3 Columns</SelectItem>
                                    <SelectItem value="4">4 Columns</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Only applies to grid and cards layouts
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Icon Style */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Icons & Style</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Icons</Label>
                                  <p className="text-xs text-muted-foreground">Display icons next to each item</p>
                                </div>
                                <Switch
                                  checked={(settings.value_props as ValuePropsSectionSettings).show_icons !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, show_icons: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Icon Style</Label>
                                <Select
                                  value={(settings.value_props as ValuePropsSectionSettings).icon_style || 'check'}
                                  onValueChange={(value: 'check' | 'bullet' | 'number' | 'custom') => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, icon_style: value },
                                    }))
                                  }}
                                  disabled={!(settings.value_props as ValuePropsSectionSettings).show_icons}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="check">Checkmark ✓</SelectItem>
                                    <SelectItem value="bullet">Bullet Point •</SelectItem>
                                    <SelectItem value="number">Numbered 1, 2, 3</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Custom Value Props */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between border-b pb-2">
                              <h4 className="text-sm font-medium">Custom Value Propositions</h4>
                              <div className="flex items-center gap-2">
                                <Label htmlFor="use-custom-props" className="text-xs text-muted-foreground">
                                  Use custom props
                                </Label>
                                <Switch
                                  id="use-custom-props"
                                  checked={(settings.value_props as ValuePropsSectionSettings).use_custom_props === true}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, use_custom_props: checked },
                                    }))
                                  }}
                                />
                              </div>
                            </div>

                            {(settings.value_props as ValuePropsSectionSettings).use_custom_props ? (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  These will override the event's default value propositions.
                                </p>

                                {/* List of custom value props */}
                                {((settings.value_props as ValuePropsSectionSettings).custom_value_props || []).map((prop, index) => (
                                  <div key={prop.id} className="flex items-start gap-2 p-2 bg-background rounded border">
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        value={prop.text}
                                        onChange={(e) => {
                                          const newProps = [...((settings.value_props as ValuePropsSectionSettings).custom_value_props || [])]
                                          newProps[index] = { ...newProps[index], text: e.target.value }
                                          setSettings((prev) => ({
                                            ...prev,
                                            value_props: { ...prev.value_props, custom_value_props: newProps },
                                          }))
                                        }}
                                        placeholder="Value proposition text"
                                      />
                                      <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-xs">
                                          <input
                                            type="checkbox"
                                            checked={prop.highlight || false}
                                            onChange={(e) => {
                                              const newProps = [...((settings.value_props as ValuePropsSectionSettings).custom_value_props || [])]
                                              newProps[index] = { ...newProps[index], highlight: e.target.checked }
                                              setSettings((prev) => ({
                                                ...prev,
                                                value_props: { ...prev.value_props, custom_value_props: newProps },
                                              }))
                                            }}
                                            className="rounded border-gray-300"
                                          />
                                          Highlight this item
                                        </label>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      {index > 0 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => {
                                            const newProps = [...((settings.value_props as ValuePropsSectionSettings).custom_value_props || [])]
                                            const temp = newProps[index]
                                            newProps[index] = newProps[index - 1]
                                            newProps[index - 1] = temp
                                            setSettings((prev) => ({
                                              ...prev,
                                              value_props: { ...prev.value_props, custom_value_props: newProps },
                                            }))
                                          }}
                                        >
                                          <ChevronUp className="h-3 w-3" />
                                        </Button>
                                      )}
                                      {index < ((settings.value_props as ValuePropsSectionSettings).custom_value_props?.length || 0) - 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => {
                                            const newProps = [...((settings.value_props as ValuePropsSectionSettings).custom_value_props || [])]
                                            const temp = newProps[index]
                                            newProps[index] = newProps[index + 1]
                                            newProps[index + 1] = temp
                                            setSettings((prev) => ({
                                              ...prev,
                                              value_props: { ...prev.value_props, custom_value_props: newProps },
                                            }))
                                          }}
                                        >
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                      )}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                        onClick={() => {
                                          const newProps = ((settings.value_props as ValuePropsSectionSettings).custom_value_props || []).filter((_, i) => i !== index)
                                          setSettings((prev) => ({
                                            ...prev,
                                            value_props: { ...prev.value_props, custom_value_props: newProps },
                                          }))
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                                {/* Add new prop button */}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    const newProp: ValuePropItem = {
                                      id: crypto.randomUUID(),
                                      text: "",
                                      highlight: false,
                                    }
                                    const currentProps = (settings.value_props as ValuePropsSectionSettings).custom_value_props || []
                                    setSettings((prev) => ({
                                      ...prev,
                                      value_props: { ...prev.value_props, custom_value_props: [...currentProps, newProp] },
                                    }))
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Value Proposition
                                </Button>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                Currently using event's default value propositions. Enable custom props to override.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Testimonials Section Full Customization */}
                      {section === "testimonials" && (
                        <div className="pt-3 space-y-4">
                          {/* Description */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Section Content</h4>
                            <div>
                              <Label htmlFor="testimonials-description">Section Description</Label>
                              <Textarea
                                id="testimonials-description"
                                value={(settings.testimonials as TestimonialsSectionSettings).description || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    testimonials: { ...prev.testimonials, description: e.target.value || null },
                                  }))
                                }}
                                placeholder="Optional description shown below the title"
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </div>

                          {/* Layout Options */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Layout</h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label>Display Style</Label>
                                <Select
                                  value={(settings.testimonials as TestimonialsSectionSettings).layout || 'grid'}
                                  onValueChange={(value: 'grid' | 'carousel' | 'featured') => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, layout: value },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="grid">Grid Layout</SelectItem>
                                    <SelectItem value="carousel">Carousel</SelectItem>
                                    <SelectItem value="featured">Featured (Large First)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Grid Columns</Label>
                                <Select
                                  value={String((settings.testimonials as TestimonialsSectionSettings).columns || 3)}
                                  onValueChange={(value) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, columns: parseInt(value) as 2 | 3 },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2">2 Columns</SelectItem>
                                    <SelectItem value="3">3 Columns</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Only applies to grid layout
                                </p>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label>Maximum Testimonials</Label>
                                <Select
                                  value={String((settings.testimonials as TestimonialsSectionSettings).max_testimonials || 6)}
                                  onValueChange={(value) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, max_testimonials: parseInt(value) },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Limit how many testimonials to display
                                </p>
                              </div>
                              <div>
                                <Label>Card Style</Label>
                                <Select
                                  value={(settings.testimonials as TestimonialsSectionSettings).card_style || 'default'}
                                  onValueChange={(value: 'default' | 'minimal' | 'bordered') => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, card_style: value },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="default">Default (Shadow)</SelectItem>
                                    <SelectItem value="minimal">Minimal (No Border)</SelectItem>
                                    <SelectItem value="bordered">Bordered</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Display Options */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Display Options</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Photos</Label>
                                  <p className="text-xs text-muted-foreground">Display author photos</p>
                                </div>
                                <Switch
                                  checked={(settings.testimonials as TestimonialsSectionSettings).show_photos !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, show_photos: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Quote Icon</Label>
                                  <p className="text-xs text-muted-foreground">Display decorative quote mark</p>
                                </div>
                                <Switch
                                  checked={(settings.testimonials as TestimonialsSectionSettings).show_quote_icon !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, show_quote_icon: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Title</Label>
                                  <p className="text-xs text-muted-foreground">Display job title</p>
                                </div>
                                <Switch
                                  checked={(settings.testimonials as TestimonialsSectionSettings).show_title !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, show_title: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Company</Label>
                                  <p className="text-xs text-muted-foreground">Display company name</p>
                                </div>
                                <Switch
                                  checked={(settings.testimonials as TestimonialsSectionSettings).show_company !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, show_company: checked },
                                    }))
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Show Video Links</Label>
                                  <p className="text-xs text-muted-foreground">Display video testimonial links</p>
                                </div>
                                <Switch
                                  checked={(settings.testimonials as TestimonialsSectionSettings).show_video_link !== false}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, show_video_link: checked },
                                    }))
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FAQ Section Full Customization */}
                      {section === "faq" && (
                        <div className="pt-3 space-y-4">
                          {/* Description */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Section Content</h4>
                            <div>
                              <Label htmlFor="faq-description">Section Description</Label>
                              <Textarea
                                id="faq-description"
                                value={(settings.faq as FaqSectionSettings).description || ""}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    faq: { ...prev.faq, description: e.target.value || null },
                                  }))
                                }}
                                placeholder="Optional description shown below the title"
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </div>

                          {/* Layout Options */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium border-b pb-2">Layout</h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label>Display Style</Label>
                                <Select
                                  value={(settings.faq as FaqSectionSettings).layout || 'accordion'}
                                  onValueChange={(value: 'accordion' | 'two_column') => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      faq: { ...prev.faq, layout: value },
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="accordion">Accordion</SelectItem>
                                    <SelectItem value="two_column">Two Column Grid</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Expand First Item</Label>
                                  <p className="text-xs text-muted-foreground">Open first FAQ by default</p>
                                </div>
                                <Switch
                                  checked={(settings.faq as FaqSectionSettings).expand_first === true}
                                  onCheckedChange={(checked) => {
                                    setSettings((prev) => ({
                                      ...prev,
                                      faq: { ...prev.faq, expand_first: checked },
                                    }))
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Contact Section */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between border-b pb-2">
                              <h4 className="text-sm font-medium">Contact Section</h4>
                              <Switch
                                checked={(settings.faq as FaqSectionSettings).show_contact_section !== false}
                                onCheckedChange={(checked) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    faq: { ...prev.faq, show_contact_section: checked },
                                  }))
                                }}
                              />
                            </div>
                            {(settings.faq as FaqSectionSettings).show_contact_section !== false && (
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="faq-contact-text">Contact Text</Label>
                                  <Input
                                    id="faq-contact-text"
                                    value={(settings.faq as FaqSectionSettings).contact_text || ""}
                                    onChange={(e) => {
                                      setSettings((prev) => ({
                                        ...prev,
                                        faq: { ...prev.faq, contact_text: e.target.value || null },
                                      }))
                                    }}
                                    placeholder="Still have questions?"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <Label htmlFor="faq-contact-email">Contact Email</Label>
                                    <Input
                                      id="faq-contact-email"
                                      type="email"
                                      value={(settings.faq as FaqSectionSettings).contact_email || ""}
                                      onChange={(e) => {
                                        setSettings((prev) => ({
                                          ...prev,
                                          faq: { ...prev.faq, contact_email: e.target.value || null },
                                        }))
                                      }}
                                      placeholder="events@yourcompany.com"
                                      className="mt-1"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Leave blank to use event contact email
                                    </p>
                                  </div>
                                  <div>
                                    <Label htmlFor="faq-contact-button">Button Text</Label>
                                    <Input
                                      id="faq-contact-button"
                                      value={(settings.faq as FaqSectionSettings).contact_button_text || ""}
                                      onChange={(e) => {
                                        setSettings((prev) => ({
                                          ...prev,
                                          faq: { ...prev.faq, contact_button_text: e.target.value || null },
                                        }))
                                      }}
                                      placeholder="Contact Us"
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Section-specific photo uploads */}
                      {(section === "hero" || section === "venue") && (
                        <div className="pt-3 border-t mt-3">
                          <Label className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            {section === "hero" ? "Background Photo (for Full Background layout)" : "Section Photos"}
                          </Label>
                          <div className="mt-2 grid gap-2 grid-cols-2 sm:grid-cols-4">
                            {sectionPhotos
                              .filter((p) => p.section === section)
                              .map((photo) => (
                                <div
                                  key={photo.id}
                                  className="group relative aspect-video rounded-lg overflow-hidden border"
                                >
                                  <img
                                    src={photo.image_url}
                                    alt={photo.alt_text || ""}
                                    className="w-full h-full object-cover"
                                  />
                                  {photo.is_primary && (
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-gold text-white text-[10px] rounded">
                                      Primary
                                    </div>
                                  )}
                                  <button
                                    onClick={() => deleteSectionPhoto(photo.id)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            <button
                              onClick={() => {
                                setAddingPhotoToSection(section)
                                setShowSectionPhotoLibrary(true)
                              }}
                              className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                              <Upload className="h-5 w-5" />
                              <span className="text-xs">Add Photo</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Photo Slider sections - select which slider to use */}
                      {(section === "photo_slider_1" || section === "photo_slider_2") && (
                        <div className="pt-3 border-t mt-3">
                          <Label>Select Photo Slider</Label>
                          <Select
                            value={(sectionSettings as SliderSectionSettings).slider_id || "none"}
                            onValueChange={(value) => {
                              setSettings((prev) => ({
                                ...prev,
                                [section]: {
                                  ...prev[section],
                                  slider_id: value === "none" ? null : value,
                                },
                              }))
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose a slider..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No slider selected</SelectItem>
                              {sliders.map((slider) => (
                                <SelectItem key={slider.id} value={slider.id}>
                                  {slider.name} ({slider.images.length} images)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Create sliders in the Photo Sliders section below
                          </p>
                        </div>
                      )}

                      {/* Video Playlist section */}
                      {section === "video_playlist" && (
                        <div className="pt-3 border-t mt-3 space-y-3">
                          <div>
                            <Label>Videos (YouTube or Vimeo URLs)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              Add video URLs one per line
                            </p>
                            <textarea
                              className="w-full min-h-[100px] p-2 border rounded-md text-sm"
                              placeholder="https://www.youtube.com/watch?v=...&#10;https://vimeo.com/..."
                              value={((sectionSettings as VideoPlaylistSettings).videos || [])
                                .map((v) => v.url)
                                .join("\n")}
                              onChange={(e) => {
                                const urls = e.target.value.split("\n").filter((url) => url.trim())
                                setSettings((prev) => ({
                                  ...prev,
                                  video_playlist: {
                                    ...prev.video_playlist,
                                    videos: urls.map((url) => ({ url: url.trim() })),
                                  },
                                }))
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom HTML section */}
                      {section === "custom_html" && (
                        <div className="pt-3 border-t mt-3 space-y-3">
                          <div>
                            <Label>HTML Content</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              Add your custom HTML. Use Tailwind classes for styling.
                            </p>
                            <textarea
                              className="w-full min-h-[150px] p-2 border rounded-md text-sm font-mono"
                              placeholder='<div class="text-center">&#10;  <h3 class="text-xl font-bold">Your content here</h3>&#10;</div>'
                              value={(sectionSettings as CustomHtmlSettings).html_content || ""}
                              onChange={(e) => {
                                setSettings((prev) => ({
                                  ...prev,
                                  custom_html: {
                                    ...prev.custom_html,
                                    html_content: e.target.value,
                                  },
                                }))
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </CardContent>
      </Card>

      {/* Section Colors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Section Colors
              </CardTitle>
              <CardDescription>
                Customize background and text colors for each section
              </CardDescription>
            </div>
            <Button onClick={saveSectionColors} disabled={savingColors}>
              {savingColors ? "Saving..." : "Save Colors"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {colorSectionKeys.map((section) => {
            const colors = sectionColors[section]
            const isExpanded = expandedColorSections.has(section)

            return (
              <Collapsible key={section} open={isExpanded} onOpenChange={() => toggleColorSection(section)}>
                <div className="border rounded-lg">
                  <div className="flex items-center gap-3 p-3">
                    {/* Color preview dots */}
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: colors.background || '#0a2540' }}
                        title="Background"
                      />
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: colors.title }}
                        title="Title"
                      />
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: colors.subtitle }}
                        title="Subtitle"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{colorSectionLabels[section]}</span>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="px-3 pb-3 pt-0 border-t">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-3">
                        <div>
                          <Label htmlFor={`${section}-bg`} className="text-xs">Background</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`${section}-bg`}
                              type="color"
                              value={colors.background || '#ffffff'}
                              onChange={(e) => updateSectionColor(section, 'background', e.target.value)}
                              className="w-10 h-8 p-0.5 cursor-pointer"
                            />
                            <Input
                              value={colors.background || ''}
                              onChange={(e) => updateSectionColor(section, 'background', e.target.value)}
                              placeholder="Auto/Gradient"
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`${section}-title`} className="text-xs">Title</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`${section}-title`}
                              type="color"
                              value={colors.title}
                              onChange={(e) => updateSectionColor(section, 'title', e.target.value)}
                              className="w-10 h-8 p-0.5 cursor-pointer"
                            />
                            <Input
                              value={colors.title}
                              onChange={(e) => updateSectionColor(section, 'title', e.target.value)}
                              placeholder="#0a2540"
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`${section}-subtitle`} className="text-xs">Subtitle/Label</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`${section}-subtitle`}
                              type="color"
                              value={colors.subtitle}
                              onChange={(e) => updateSectionColor(section, 'subtitle', e.target.value)}
                              className="w-10 h-8 p-0.5 cursor-pointer"
                            />
                            <Input
                              value={colors.subtitle}
                              onChange={(e) => updateSectionColor(section, 'subtitle', e.target.value)}
                              placeholder="#c9a227"
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`${section}-text`} className="text-xs">Paragraph Text</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`${section}-text`}
                              type="color"
                              value={colors.text}
                              onChange={(e) => updateSectionColor(section, 'text', e.target.value)}
                              className="w-10 h-8 p-0.5 cursor-pointer"
                            />
                            <Input
                              value={colors.text}
                              onChange={(e) => updateSectionColor(section, 'text', e.target.value)}
                              placeholder="#374151"
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Second row - accent, buttons, cards */}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-3 border-t mt-3">
                        <div>
                          <Label htmlFor={`${section}-accent`} className="text-xs">Accent/Icons</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={`${section}-accent`}
                              type="color"
                              value={colors.accent || '#c9a227'}
                              onChange={(e) => updateSectionColor(section, 'accent', e.target.value)}
                              className="w-10 h-8 p-0.5 cursor-pointer"
                            />
                            <Input
                              value={colors.accent || ''}
                              onChange={(e) => updateSectionColor(section, 'accent', e.target.value)}
                              placeholder="#c9a227"
                              className="h-8 text-xs flex-1"
                            />
                          </div>
                        </div>
                        {(section === 'hero' || section === 'tickets' || section === 'cta') && (
                          <>
                            <div>
                              <Label htmlFor={`${section}-button-bg`} className="text-xs">Button Background</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id={`${section}-button-bg`}
                                  type="color"
                                  value={colors.button_bg || '#c9a227'}
                                  onChange={(e) => updateSectionColor(section, 'button_bg', e.target.value)}
                                  className="w-10 h-8 p-0.5 cursor-pointer"
                                />
                                <Input
                                  value={colors.button_bg || ''}
                                  onChange={(e) => updateSectionColor(section, 'button_bg', e.target.value)}
                                  placeholder="#c9a227"
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`${section}-button-text`} className="text-xs">Button Text</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id={`${section}-button-text`}
                                  type="color"
                                  value={colors.button_text || '#ffffff'}
                                  onChange={(e) => updateSectionColor(section, 'button_text', e.target.value)}
                                  className="w-10 h-8 p-0.5 cursor-pointer"
                                />
                                <Input
                                  value={colors.button_text || ''}
                                  onChange={(e) => updateSectionColor(section, 'button_text', e.target.value)}
                                  placeholder="#ffffff"
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {(section === 'hero' || section === 'value_props' || section === 'testimonials' || section === 'leaders' || section === 'tickets' || section === 'companies') && (
                          <div>
                            <Label htmlFor={`${section}-card-bg`} className="text-xs">Card Background</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                id={`${section}-card-bg`}
                                type="color"
                                value={(colors.card_bg || '#ffffff').replace('rgba(255,255,255,0.1)', '#ffffff')}
                                onChange={(e) => updateSectionColor(section, 'card_bg', e.target.value)}
                                className="w-10 h-8 p-0.5 cursor-pointer"
                              />
                              <Input
                                value={colors.card_bg || ''}
                                onChange={(e) => updateSectionColor(section, 'card_bg', e.target.value)}
                                placeholder="#ffffff or rgba()"
                                className="h-8 text-xs flex-1"
                              />
                            </div>
                          </div>
                        )}
                        {section === 'tickets' && (
                          <>
                            <div>
                              <Label htmlFor={`${section}-card-title`} className="text-xs">Card Title</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id={`${section}-card-title`}
                                  type="color"
                                  value={colors.card_title || '#0a2540'}
                                  onChange={(e) => updateSectionColor(section, 'card_title', e.target.value)}
                                  className="w-10 h-8 p-0.5 cursor-pointer"
                                />
                                <Input
                                  value={colors.card_title || ''}
                                  onChange={(e) => updateSectionColor(section, 'card_title', e.target.value)}
                                  placeholder="#0a2540"
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`${section}-card-text`} className="text-xs">Card Text</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id={`${section}-card-text`}
                                  type="color"
                                  value={colors.card_text || '#374151'}
                                  onChange={(e) => updateSectionColor(section, 'card_text', e.target.value)}
                                  className="w-10 h-8 p-0.5 cursor-pointer"
                                />
                                <Input
                                  value={colors.card_text || ''}
                                  onChange={(e) => updateSectionColor(section, 'card_text', e.target.value)}
                                  placeholder="#374151"
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {(section === 'hero' || section === 'cta') && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Leave background empty to use the default gradient, or enter a custom gradient:
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            Example: linear-gradient(to right, #0d598a, #1e3a5f)
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </CardContent>
      </Card>

      {/* Photo Sliders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Photo Sliders</CardTitle>
              <CardDescription>
                Add image carousels and galleries to your landing page
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Manage Slider Library */}
              <Dialog open={showSliderLibraryDialog} onOpenChange={setShowSliderLibraryDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Slider Library
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Slider Library</DialogTitle>
                    <DialogDescription>
                      Create reusable photo sliders that can be linked to any event
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    {/* Add new shared slider form */}
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium mb-3">Add New Slider</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="shared-slider-name">Name</Label>
                          <Input
                            id="shared-slider-name"
                            value={newSharedSlider.name}
                            onChange={(e) => setNewSharedSlider((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Conference Photos 2024"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shared-slider-desc">Description</Label>
                          <Input
                            id="shared-slider-desc"
                            value={newSharedSlider.description}
                            onChange={(e) => setNewSharedSlider((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Optional description"
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={createSharedSlider}
                          disabled={!newSharedSlider.name.trim()}
                        >
                          Add Slider
                        </Button>
                      </div>
                    </div>

                    {/* Existing shared sliders */}
                    <div className="space-y-2">
                      {sharedSliders.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No shared sliders yet. Create one above.
                        </p>
                      ) : (
                        sharedSliders.map((slider) => (
                          <div key={slider.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{slider.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {slider.images.length} images
                                {slider.description && ` • ${slider.description}`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSharedSlider(slider.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Link existing slider */}
              <Dialog open={showLinkSliderDialog} onOpenChange={setShowLinkSliderDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-1" />
                    Link Slider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Link Photo Slider</DialogTitle>
                    <DialogDescription>
                      Select a slider from the library to add to this event
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    {sharedSliders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No sliders in library</p>
                        <p className="text-sm">Create sliders in the "Slider Library" first</p>
                      </div>
                    ) : (
                      sharedSliders.map((slider) => {
                        const isLinked = sliders.some((s) => s.shared_slider_id === slider.id)
                        return (
                          <div
                            key={slider.id}
                            className={cn(
                              "flex items-start gap-3 p-3 border rounded-lg transition-colors",
                              isLinked ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50 cursor-pointer"
                            )}
                            onClick={() => !isLinked && linkSharedSlider(slider.id)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{slider.name}</p>
                                {isLinked && (
                                  <Badge variant="secondary" className="text-xs">Linked</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {slider.images.length} images
                              </p>
                            </div>
                            {/* Preview thumbnails */}
                            {slider.images.length > 0 && (
                              <div className="flex gap-1">
                                {slider.images.slice(0, 3).map((img) => (
                                  <div key={img.id} className="w-10 h-8 rounded overflow-hidden">
                                    <img
                                      src={img.thumbnail_url || img.image_url}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Create event-specific slider */}
              <Dialog open={showSliderDialog} onOpenChange={setShowSliderDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Slider
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Photo Slider</DialogTitle>
                    <DialogDescription>
                      Add a new image slider specific to this event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="slider-name">Slider Name</Label>
                      <Input
                        id="slider-name"
                        value={newSliderName}
                        onChange={(e) => setNewSliderName(e.target.value)}
                        placeholder="e.g., Event Highlights"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowSliderDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createSlider}>Create Slider</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sliders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No photo sliders yet</p>
              <p className="text-sm">Add a slider to showcase images on your landing page</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sliders.map((slider) => (
                <div key={slider.id} className={cn(
                  "border rounded-lg p-4",
                  !slider.is_visible && "bg-muted/50"
                )}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slider.is_visible}
                          onCheckedChange={(checked) => updateSliderVisibility(slider.id, checked)}
                        />
                        <h4 className="font-medium">{slider.name}</h4>
                        {slider.is_from_shared && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Library
                          </Badge>
                        )}
                        {!slider.is_visible && (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {slider.images.length} images
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-48">
                        <Label className="text-xs text-muted-foreground mb-1 block">Position</Label>
                        <Select
                          value={slider.position}
                          onValueChange={(value) => updateSliderPosition(slider.id, value)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {sliderPositionOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1 pt-5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openImageManager(slider)}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Images
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSlider(slider.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image preview */}
                  {slider.images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {slider.images.slice(0, 5).map((image) => (
                        <div
                          key={image.id}
                          className="flex-shrink-0 w-20 h-14 rounded overflow-hidden"
                        >
                          <img
                            src={image.thumbnail_url || image.image_url}
                            alt={image.alt_text || ""}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {slider.images.length > 5 && (
                        <div className="flex-shrink-0 w-20 h-14 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          +{slider.images.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Manager Dialog */}
      <Dialog open={showImageManagerDialog} onOpenChange={setShowImageManagerDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Images: {managingSlider?.name}
              {managingSlider?.is_from_shared && (
                <Badge variant="outline" className="ml-2 text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  From Library
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {managingSlider?.is_from_shared
                ? "Changes to images will apply to all events using this slider"
                : "Add, remove, or reorder images in this slider"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Add new image */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-3">Add Image</h4>
              <div className="space-y-3">
                {/* Option 1: Browse Media Library */}
                <div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowMediaLibrary(true)}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Browse Media Library
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload new images or select from existing ones
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-muted px-2 text-muted-foreground">Or paste URL</span>
                  </div>
                </div>

                {/* Option 2: Paste URL directly */}
                <div>
                  <Label htmlFor="new-image-url">Image URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="new-image-url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      onClick={addImageToSlider}
                      disabled={!newImageUrl.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current images */}
            <div>
              <h4 className="font-medium mb-3">Current Images ({managingSlider?.images.length || 0})</h4>
              {managingSlider?.images.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No images yet. Use the Media Library or paste a URL above.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {managingSlider?.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={image.thumbnail_url || image.image_url}
                          alt={image.alt_text || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {image.caption && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {image.caption}
                        </p>
                      )}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                        {index + 1}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteImageFromSlider(image.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageManagerDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Library */}
      <MediaLibrary
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelect={(media) => {
          // Add image to slider
          if (managingSlider) {
            const apiBase = managingSlider.is_from_shared && managingSlider.shared_slider_id
              ? `/api/shared-sliders/${managingSlider.shared_slider_id}/images`
              : `/api/events/${eventId}/sliders/${managingSlider.id}/images`

            fetch(apiBase, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image_url: media.file_url,
                thumbnail_url: media.thumbnail_url,
                alt_text: media.alt_text,
                caption: media.caption,
              }),
            })
              .then((res) => res.json())
              .then((newImage) => {
                setSliders((prev) =>
                  prev.map((s) =>
                    s.id === managingSlider.id
                      ? { ...s, images: [...s.images, newImage] }
                      : s
                  )
                )
                setManagingSlider((prev) =>
                  prev ? { ...prev, images: [...prev.images, newImage] } : null
                )
                if (managingSlider.is_from_shared && managingSlider.shared_slider_id) {
                  setSharedSliders((prev) =>
                    prev.map((s) =>
                      s.id === managingSlider.shared_slider_id
                        ? { ...s, images: [...s.images, newImage] }
                        : s
                    )
                  )
                }
              })
              .catch((err) => console.error("Error adding image:", err))
          }
        }}
        selectionMode="multiple"
        folder="sliders"
        title="Select Images for Slider"
      />

      {/* Media Library for Section Photos */}
      <MediaLibrary
        open={showSectionPhotoLibrary}
        onOpenChange={setShowSectionPhotoLibrary}
        onSelect={(media) => {
          console.log("Media selected:", media, "For section:", addingPhotoToSection)
          if (addingPhotoToSection === 'hero_split') {
            // Handle hero split image selection
            setSettings((prev) => ({
              ...prev,
              hero: { ...prev.hero, split_image_url: media.file_url },
            }))
          } else if (addingPhotoToSection) {
            addSectionPhoto(addingPhotoToSection, media.file_url)
          }
          setShowSectionPhotoLibrary(false)
          setAddingPhotoToSection(null)
        }}
        selectionMode="single"
        title={
          addingPhotoToSection === 'hero_split'
            ? 'Select Split Image for Hero'
            : `Select Photo for ${addingPhotoToSection === 'hero' ? 'Hero' : 'Venue'} Section`
        }
      />

      {/* FAQ Manager */}
      <FaqManager eventId={eventId} />
    </div>
  )
}

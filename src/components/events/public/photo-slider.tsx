"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SliderImage {
  id: string
  image_url: string
  thumbnail_url?: string | null
  alt_text?: string | null
  caption?: string | null
  link_url?: string | null
  display_order: number
}

interface PhotoSliderProps {
  images: SliderImage[]
  className?: string
  showCaption?: boolean
  cardWidth?: number
  cardHeight?: number
}

export function PhotoSlider({
  images,
  className,
  showCaption = true,
  cardWidth = 400,
  cardHeight = 300,
}: PhotoSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth + 24 // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (sortedImages.length === 0) {
    return null
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Navigation Buttons */}
      {sortedImages.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {sortedImages.map((image, index) => (
          <div
            key={image.id || index}
            className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
            style={{
              width: cardWidth,
              height: cardHeight,
              scrollSnapAlign: "start",
            }}
          >
            {image.link_url ? (
              <a
                href={image.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {showCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </a>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {showCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scroll hint caption */}
      {sortedImages.length > 2 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Scroll to see more images
        </p>
      )}
    </div>
  )
}

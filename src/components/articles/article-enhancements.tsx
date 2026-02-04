"use client"

// Icons removed for cleaner design
import type {
  ArticleEnhancement,
  YouTubeEnhancementMetadata,
  ScholarEnhancementMetadata,
  BookEnhancementMetadata
} from "@/types/database"
import { YouTubeVideoCard } from "./youtube-video-card"
import { ScholarPaperCard } from "./scholar-paper-card"
import { BookCard } from "./book-card"
import { LinkCard } from "./link-card"

interface ArticleEnhancementsProps {
  enhancements: ArticleEnhancement[]
  className?: string
  /** Whether to show section headers for each type */
  showHeaders?: boolean
  /** Optional title override */
  title?: string
  /** Whether to show edit/delete controls */
  editable?: boolean
  /** Callback when an enhancement is deleted */
  onEnhancementDeleted?: () => void
}

/**
 * Article Enhancements Container
 *
 * Groups and displays all article enhancements by type:
 * - YouTube videos with facade pattern for performance
 * - Google Scholar papers with citation info
 * - Books with author info
 * - Generic links
 */
export function ArticleEnhancements({
  enhancements,
  className = "",
  showHeaders = true,
  title = "Related Resources",
  editable = false,
  onEnhancementDeleted,
}: ArticleEnhancementsProps) {
  if (!enhancements || enhancements.length === 0) {
    return null
  }

  // Group enhancements by type
  const youtubeVideos = enhancements.filter(e => e.type === "youtube")
  const scholarPapers = enhancements.filter(e => e.type === "scholar")
  const books = enhancements.filter(e => e.type === "book")
  const links = enhancements.filter(e => e.type === "link")
  const images = enhancements.filter(e => e.type === "image")

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Section title - only show if title provided */}
      {title && (
        <h2 className="font-heading font-bold text-navy text-xl mb-4">
          {title}
        </h2>
      )}

      {/* YouTube Videos */}
      {youtubeVideos.length > 0 && (
        <section>
          {showHeaders && (
            <h2 className="font-heading font-bold text-navy text-xl mb-4">
              Videos
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {youtubeVideos.map((video) => (
              <YouTubeVideoCard
                key={video.id}
                title={video.title || "Video"}
                url={video.url || ""}
                metadata={video.metadata as YouTubeEnhancementMetadata | null}
                embedUrl={video.embed_code || undefined}
                enhancementId={video.id}
                editable={editable}
                onDeleted={onEnhancementDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Google Scholar Papers */}
      {scholarPapers.length > 0 && (
        <section>
          {showHeaders && (
            <h2 className="font-heading font-bold text-navy text-xl mb-4">
              Research Papers
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {scholarPapers.map((paper) => (
              <ScholarPaperCard
                key={paper.id}
                title={paper.title || "Research Paper"}
                url={paper.url || ""}
                metadata={paper.metadata as ScholarEnhancementMetadata | null}
                enhancementId={paper.id}
                editable={editable}
                onDeleted={onEnhancementDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Books */}
      {books.length > 0 && (
        <section>
          {showHeaders && (
            <h2 className="font-heading font-bold text-navy text-xl mb-4">
              Related Books
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {books.map((book) => (
              <BookCard
                key={book.id}
                title={book.title || "Book"}
                url={book.url || ""}
                metadata={book.metadata as BookEnhancementMetadata | null}
                enhancementId={book.id}
                editable={editable}
                onDeleted={onEnhancementDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {links.length > 0 && (
        <section>
          {showHeaders && (
            <h2 className="font-heading font-bold text-navy text-xl mb-4">
              Additional Resources
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                title={link.title || "Link"}
                url={link.url || ""}
                enhancementId={link.id}
                editable={editable}
                onDeleted={onEnhancementDeleted}
              />
            ))}
          </div>
        </section>
      )}

      {/* Images - Simple display for now */}
      {images.length > 0 && (
        <section>
          {showHeaders && (
            <h2 className="font-heading font-bold text-navy text-xl mb-4">Images</h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden border">
                {image.url && (
                  <img
                    src={image.url}
                    alt={image.title || "Image"}
                    className="w-full h-auto"
                  />
                )}
                {image.title && (
                  <p className="p-2 text-xs text-muted-foreground">{image.title}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

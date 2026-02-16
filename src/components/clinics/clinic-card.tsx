import Link from "next/link"
import { MapPin, Phone, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ClinicCardProps {
  clinic: {
    id: string
    name: string
    slug: string
    city: string | null
    state: string | null
    country: string | null
    phone: string | null
    website: string | null
    description: string | null
    tags: string[]
    photos: string[]
  }
  distance?: number
}

export function ClinicCard({ clinic, distance }: ClinicCardProps) {
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ")
  const truncatedDescription = clinic.description
    ? clinic.description.length > 150
      ? clinic.description.slice(0, 150) + "..."
      : clinic.description
    : null

  return (
    <Link
      href={`/clinics/${clinic.slug}`}
      className="group flex flex-col rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      {/* Header: Name */}
      <div className="mb-2">
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {clinic.name}
        </h3>
      </div>

      {/* Location */}
      {(location || distance != null) && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>
            {location}
            {distance != null && (
              <span className="text-primary font-medium">
                {location ? " · " : ""}{distance} mi
              </span>
            )}
          </span>
        </div>
      )}

      {/* Description */}
      {truncatedDescription && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {truncatedDescription}
        </p>
      )}

      {/* Tags */}
      {clinic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {clinic.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
          {clinic.tags.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{clinic.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer: Phone + Website indicators */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t">
        {clinic.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{clinic.phone}</span>
          </div>
        )}
        {clinic.website && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>Website</span>
          </div>
        )}
      </div>
    </Link>
  )
}

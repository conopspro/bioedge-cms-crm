import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DetailCardProps {
  title: string
  description?: string
  editHref?: string
  editLabel?: string
  children: React.ReactNode
  className?: string
}

/**
 * Premium Detail Card Component
 *
 * A card with a subtle edit button that appears on hover.
 * Used for displaying detail pages with inline editing.
 */
export function DetailCard({
  title,
  description,
  editHref,
  editLabel = "Edit",
  children,
  className,
}: DetailCardProps) {
  return (
    <Card className={cn("group relative transition-shadow hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {editHref && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2"
            >
              <Link href={editHref}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                {editLabel}
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface DetailItemProps {
  label: string
  value?: string | number | null
  href?: string
  badge?: React.ReactNode
  className?: string
}

/**
 * Detail Item Component
 *
 * Displays a label/value pair within a DetailCard.
 */
export function DetailItem({ label, value, href, badge, className }: DetailItemProps) {
  const displayValue = value || "—"

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        {href && value ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {displayValue}
          </a>
        ) : (
          <p className="text-sm font-medium">{displayValue}</p>
        )}
        {badge}
      </div>
    </div>
  )
}

interface DetailGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

/**
 * Detail Grid Component
 *
 * A responsive grid for displaying multiple DetailItems.
 */
export function DetailGrid({ children, columns = 2, className }: DetailGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4", colsClass[columns], className)}>
      {children}
    </div>
  )
}

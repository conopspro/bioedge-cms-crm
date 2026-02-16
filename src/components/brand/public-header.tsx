"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderEvent {
  name: string
  slug: string
  city: string | null
  start_date: string | null
  end_date: string | null
}

interface NavItem {
  id: string
  label: string
  href: string
  is_external: boolean
  display_order: number
}

interface PublicHeaderProps {
  className?: string
  events?: HeaderEvent[]
  navItems?: NavItem[]
}

/**
 * Format date range for display (e.g., "July 10-11" or "July 10 - Aug 2")
 */
function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) return ""

  const start = new Date(startDate + "T00:00:00")
  const startMonth = start.toLocaleDateString("en-US", { month: "long" })
  const startDay = start.getDate()

  if (!endDate || endDate === startDate) {
    return `${startMonth} ${startDay}`
  }

  const end = new Date(endDate + "T00:00:00")
  const endMonth = end.toLocaleDateString("en-US", { month: "long" })
  const endDay = end.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

/**
 * Public Header
 *
 * Header component for public-facing pages with BioEdge branding.
 * Uses solid Deep Blue (#0d598a) background.
 * Shows upcoming events with city and dates on the top line.
 * Navigation is database-driven when navItems are provided.
 */
export function PublicHeader({ className, events = [], navItems }: PublicHeaderProps) {
  return (
    <header className={cn("bg-[#0d598a]", className)}>
      <div className="be-container py-4">
        {/* Top row: Logo left, Events right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <div className="font-heading font-bold leading-tight tracking-wide">
              <span className="text-[16px] md:text-[18px] text-white">BIO</span>
              <span className="text-[24px] md:text-[28px] text-gold">EDGE</span>
              <span className="block -mt-1 text-[14px] md:text-[16px] text-white">
                LONGEVITY SUMMIT
              </span>
            </div>
          </Link>

          {/* Events - right justified on desktop, wraps on mobile */}
          {events.length > 0 && (
            <div className="flex flex-col sm:items-end gap-1">
              {events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/${event.slug}`}
                  className="font-heading font-semibold text-gold text-sm hover:text-white transition-colors"
                >
                  {event.city && <span>{event.city}</span>}
                  {event.city && event.start_date && <span> </span>}
                  {event.start_date && (
                    <span>{formatDateRange(event.start_date, event.end_date)}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation - centered under logo */}
        <nav className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 lg:gap-4">
          {navItems && navItems.length > 0 ? (
            // Database-driven navigation
            navItems.map((item) =>
              item.is_external ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              )
            )
          ) : (
            // Fallback hardcoded navigation
            <>
              <Link href="/articles" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Articles</Link>
              <Link href="/companies" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Companies</Link>
              <Link href="/leaders" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Leaders</Link>
              <Link href="/presentations" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Presentations</Link>
              <Link href="/clinics" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Clinics</Link>
              <a href="https://bioedge.circle.so/" target="_blank" rel="noopener noreferrer" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Coach</a>
              <a href="https://www.bioedgedecoder.com/" target="_blank" rel="noopener noreferrer" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Decoder</a>
              <Link href="/systems" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">Systems</Link>
              <a href="https://longevitynewswire.com/" target="_blank" rel="noopener noreferrer" className="font-heading text-xs font-bold tracking-wide text-white transition-colors hover:text-gold">News</a>
            </>
          )}
          <Link
            href="/search"
            className="flex items-center justify-center text-white transition-colors hover:text-gold"
            aria-label="Search"
          >
            <Search className="h-4 w-4 lg:h-5 lg:w-5" />
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default PublicHeader

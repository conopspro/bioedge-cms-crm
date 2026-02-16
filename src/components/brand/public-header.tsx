"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronDown, Menu, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

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
  parent_id: string | null
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

/** Group flat nav items into top-level items with children */
function groupNavItems(items: NavItem[]) {
  const topLevel = items
    .filter((item) => item.parent_id === null)
    .sort((a, b) => a.display_order - b.display_order)

  const childrenMap = new Map<string, NavItem[]>()
  for (const item of items) {
    if (item.parent_id) {
      const existing = childrenMap.get(item.parent_id) || []
      existing.push(item)
      childrenMap.set(item.parent_id, existing)
    }
  }

  // Sort children within each group
  for (const [key, children] of childrenMap) {
    childrenMap.set(
      key,
      children.sort((a, b) => a.display_order - b.display_order)
    )
  }

  return topLevel.map((parent) => ({
    ...parent,
    children: childrenMap.get(parent.id) || [],
  }))
}

const linkClass =
  "font-heading text-xs lg:text-sm font-bold tracking-wide text-white transition-colors hover:text-gold"

/**
 * Public Header
 *
 * Header component for public-facing pages with BioEdge branding.
 * Uses solid Deep Blue (#0d598a) background.
 * Shows upcoming events with city and dates on the top line.
 * Navigation is database-driven with dropdown menus for grouped items.
 */
export function PublicHeader({ className, events = [], navItems }: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const grouped = useMemo(
    () => (navItems && navItems.length > 0 ? groupNavItems(navItems) : null),
    [navItems]
  )

  return (
    <header className={cn("bg-[#0d598a]", className)}>
      <div className="be-container py-4">
        {/* Top row: Logo left, Events right */}
        <div className="flex items-center justify-between gap-4 mb-4">
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

          {/* Events - right justified on desktop */}
          {events.length > 0 && (
            <div className="hidden sm:flex flex-col items-end gap-1">
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

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex items-center justify-center text-white hover:text-gold transition-colors p-1"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0d598a] border-[#0a4a73] w-72">
              <SheetHeader>
                <SheetTitle className="text-white font-heading">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-4 overflow-y-auto">
                {grouped ? (
                  grouped.map((item) =>
                    item.children.length > 0 ? (
                      <div key={item.id} className="mb-2">
                        <span className="font-heading text-xs font-bold uppercase tracking-wider text-gold block py-2">
                          {item.label}
                        </span>
                        <div className="flex flex-col gap-0.5 pl-3 border-l border-white/20">
                          {item.children.map((child) => (
                            <SheetClose asChild key={child.id}>
                              {child.is_external ? (
                                <a
                                  href={child.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 py-1.5 text-sm text-white/90 hover:text-gold transition-colors"
                                >
                                  {child.label}
                                  <ExternalLink className="h-3 w-3 text-white/50" />
                                </a>
                              ) : (
                                <Link
                                  href={child.href}
                                  className="block py-1.5 text-sm text-white/90 hover:text-gold transition-colors"
                                >
                                  {child.label}
                                </Link>
                              )}
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    ) : item.href !== "#" ? (
                      <SheetClose asChild key={item.id}>
                        {item.is_external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 py-2 font-heading text-sm font-bold text-white hover:text-gold transition-colors"
                          >
                            {item.label}
                            <ExternalLink className="h-3 w-3 text-white/50" />
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="block py-2 font-heading text-sm font-bold text-white hover:text-gold transition-colors"
                          >
                            {item.label}
                          </Link>
                        )}
                      </SheetClose>
                    ) : null
                  )
                ) : (
                  /* Fallback mobile nav */
                  <>
                    <MobileGroup label="Longevity News" onClose={() => setMobileOpen(false)}>
                      <MobileLink href="/articles" label="Articles" onClose={() => setMobileOpen(false)} />
                      <MobileLink href="/presentations" label="Presentations" onClose={() => setMobileOpen(false)} />
                      <MobileLink href="/spotlight" label="Spotlight" onClose={() => setMobileOpen(false)} />
                      <MobileLink href="https://longevitynewswire.com/" label="News" external onClose={() => setMobileOpen(false)} />
                    </MobileGroup>
                    <MobileGroup label="Longevity Directories" onClose={() => setMobileOpen(false)}>
                      <MobileLink href="/companies" label="Companies" onClose={() => setMobileOpen(false)} />
                      <MobileLink href="/leaders" label="Leaders" onClose={() => setMobileOpen(false)} />
                      <MobileLink href="/clinics" label="Clinics" onClose={() => setMobileOpen(false)} />
                    </MobileGroup>
                    <MobileGroup label="Longevity Tools" onClose={() => setMobileOpen(false)}>
                      <MobileLink href="https://bioedge.circle.so/" label="Coach" external onClose={() => setMobileOpen(false)} />
                      <MobileLink href="https://www.bioedgedecoder.com/" label="Decoder" external onClose={() => setMobileOpen(false)} />
                    </MobileGroup>
                    <SheetClose asChild>
                      <Link href="/systems" className="block py-2 font-heading text-sm font-bold text-white hover:text-gold transition-colors">
                        Biological Systems
                      </Link>
                    </SheetClose>
                  </>
                )}
                {/* Search link */}
                <SheetClose asChild>
                  <Link
                    href="/search"
                    className="flex items-center gap-2 py-2 mt-2 border-t border-white/20 pt-4 text-sm text-white hover:text-gold transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation — hidden on mobile, shown on lg+ */}
        <nav className="hidden lg:flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
          {grouped ? (
            // Database-driven grouped navigation
            grouped.map((item) =>
              item.children.length > 0 ? (
                // Dropdown menu
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger
                    className={cn(
                      linkClass,
                      "inline-flex items-center gap-1 outline-none"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="bg-[#0d598a] border-[#0a4a73] min-w-[160px]"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.id} asChild className="focus:bg-[#0a4a73] focus:text-white">
                        {child.is_external ? (
                          <a
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 text-white hover:text-gold focus:text-gold cursor-pointer"
                          >
                            {child.label}
                            <ExternalLink className="h-3 w-3 text-white/50" />
                          </a>
                        ) : (
                          <Link
                            href={child.href}
                            className="text-white hover:text-gold focus:text-gold cursor-pointer"
                          >
                            {child.label}
                          </Link>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.href !== "#" ? (
                // Direct link (no children)
                item.is_external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.id} href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                )
              ) : null
            )
          ) : (
            // Fallback hardcoded navigation with dropdown menus
            <>
              <NavDropdown label="Longevity News">
                <NavDropdownLink href="/articles" label="Articles" />
                <NavDropdownLink href="/presentations" label="Presentations" />
                <NavDropdownLink href="/spotlight" label="Spotlight" />
                <NavDropdownLink href="https://longevitynewswire.com/" label="News" external />
              </NavDropdown>
              <NavDropdown label="Longevity Directories">
                <NavDropdownLink href="/companies" label="Companies" />
                <NavDropdownLink href="/leaders" label="Leaders" />
                <NavDropdownLink href="/clinics" label="Clinics" />
              </NavDropdown>
              <NavDropdown label="Longevity Tools">
                <NavDropdownLink href="https://bioedge.circle.so/" label="Coach" external />
                <NavDropdownLink href="https://www.bioedgedecoder.com/" label="Decoder" external />
              </NavDropdown>
              <Link href="/systems" className={linkClass}>
                Biological Systems
              </Link>
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

/** Reusable dropdown for fallback navigation */
function NavDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(linkClass, "inline-flex items-center gap-1 outline-none")}
      >
        {label}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        className="bg-[#0d598a] border-[#0a4a73] min-w-[160px]"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Reusable dropdown link item for fallback navigation */
function NavDropdownLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  return (
    <DropdownMenuItem asChild className="focus:bg-[#0a4a73] focus:text-white">
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 text-white hover:text-gold focus:text-gold cursor-pointer"
        >
          {label}
          <ExternalLink className="h-3 w-3 text-white/50" />
        </a>
      ) : (
        <Link
          href={href}
          className="text-white hover:text-gold focus:text-gold cursor-pointer"
        >
          {label}
        </Link>
      )}
    </DropdownMenuItem>
  )
}

/** Mobile nav group header + children */
function MobileGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="mb-2">
      <span className="font-heading text-xs font-bold uppercase tracking-wider text-gold block py-2">
        {label}
      </span>
      <div className="flex flex-col gap-0.5 pl-3 border-l border-white/20">
        {children}
      </div>
    </div>
  )
}

/** Mobile nav link */
function MobileLink({
  href,
  label,
  external,
  onClose,
}: {
  href: string
  label: string
  external?: boolean
  onClose: () => void
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-2 py-1.5 text-sm text-white/90 hover:text-gold transition-colors"
      >
        {label}
        <ExternalLink className="h-3 w-3 text-white/50" />
      </a>
    )
  }
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block py-1.5 text-sm text-white/90 hover:text-gold transition-colors"
    >
      {label}
    </Link>
  )
}

export default PublicHeader

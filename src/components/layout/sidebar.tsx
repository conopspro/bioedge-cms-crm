"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Users,
  LayoutDashboard,
  Settings,
  Upload,
  UserCheck,
  Search,
  FileUp,
  Calendar,
  FileText,
  Presentation,
  Image,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

/**
 * Navigation items for the sidebar
 * Each item has an icon, label, and href
 */
const mainNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Homepage",
    href: "/dashboard/homepage",
    icon: Home,
  },
  {
    label: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    label: "Presentations",
    href: "/dashboard/presentations",
    icon: Presentation,
  },
  {
    label: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    label: "Media",
    href: "/dashboard/media",
    icon: Image,
  },
]

const toolsNavItems = [
  {
    label: "Research Company",
    href: "/dashboard/research",
    icon: Search,
  },
  {
    label: "Import Contacts",
    href: "/dashboard/import",
    icon: Upload,
  },
  {
    label: "Import Articles",
    href: "/dashboard/import/articles",
    icon: FileUp,
  },
  {
    label: "Review Contacts",
    href: "/dashboard/contacts/review",
    icon: UserCheck,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

/**
 * Sidebar Navigation Component
 *
 * Displays the main navigation for the CMS.
 * Highlights the current active route.
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar-background">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="font-heading font-bold leading-tight tracking-wide">
            <span className="text-[14px] text-white">BIO</span>
            <span className="text-[20px] text-gold">EDGE</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Content
          </p>
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Tools Navigation */}
        <div className="space-y-1">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          {toolsNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          BioEdge CMS v0.1.0
        </p>
      </div>
    </div>
  )
}

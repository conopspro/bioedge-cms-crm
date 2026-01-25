import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

/**
 * Dashboard Layout
 *
 * Sidebar sticks to the left, content flows naturally.
 * Better for mobile and variable content heights.
 *
 * Structure:
 * ┌──────────────────────────────────────────┐
 * │ Sidebar │ Header                         │
 * │ (fixed) │────────────────────────────────│
 * │         │                                │
 * │         │ Main Content (natural height)  │
 * │         │                                │
 * └──────────────────────────────────────────┘
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar - fixed to left, full height */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area - offset by sidebar width on desktop */}
      <div className="flex-1 md:ml-64">
        {/* Header - sticky at top */}
        <div className="sticky top-0 z-40">
          <Header />
        </div>

        {/* Page content - natural flow */}
        <main className="bg-muted/30 p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}

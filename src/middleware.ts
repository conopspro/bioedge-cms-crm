import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

/**
 * Next.js Middleware
 *
 * Runs on every matched request to:
 * 1. Refresh the user's Supabase session (keeps them logged in)
 * 2. Add authentication checks for protected routes (can be added later)
 *
 * Currently configured to run on all routes except:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico
 * - Public assets
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/**
 * Supabase Client for Server Components & Route Handlers
 *
 * Use this in:
 * - Server Components (app/page.tsx, etc.)
 * - Route Handlers (app/api/.../route.ts)
 * - Server Actions
 *
 * If SUPABASE_SERVICE_ROLE_KEY is available, uses that for admin access.
 * Otherwise falls back to cookie-based authentication with anon key.
 *
 * Note: We're not using strict database types here to allow flexibility.
 * The types in @/types/database are used for application-level type safety.
 */
export async function createClient() {
  // Use service role key if available (for admin operations)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceRoleKey) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }

  // Fall back to cookie-based auth with anon key
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

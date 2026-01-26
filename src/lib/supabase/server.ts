import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase Client for Server Components & Pages
 *
 * Use this in:
 * - Server Components (app/page.tsx, etc.)
 * - Pages that need to read data
 *
 * This uses the anon key with cookie-based auth.
 * For API routes that need write access, use createAdminClient() from ./admin.ts
 *
 * Note: We're not using strict database types here to allow flexibility.
 * The types in @/types/database are used for application-level type safety.
 */
export async function createClient() {
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

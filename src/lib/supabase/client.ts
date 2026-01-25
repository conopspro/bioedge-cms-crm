import { createBrowserClient } from "@supabase/ssr"

/**
 * Supabase Client for Browser/Client Components
 *
 * Use this in React components that run in the browser.
 * This client handles authentication state automatically.
 *
 * Note: We're not using strict database types here to allow flexibility.
 * The types in @/types/database are used for application-level type safety.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

import { createClient } from "@supabase/supabase-js"

/**
 * Supabase Admin Client (Service Role)
 *
 * Use this ONLY in server-side code (API routes, server actions) for admin operations.
 * This client bypasses Row Level Security (RLS) entirely.
 *
 * NEVER expose the service role key to the client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
      "Add it to your .env.local file and Vercel environment variables."
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

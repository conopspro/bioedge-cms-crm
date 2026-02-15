import { createClient } from "@supabase/supabase-js"

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars")
    process.exit(1)
  }
  const sb = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data } = await sb
    .from("companies")
    .select("id, name")
    .eq("name", "Everyday Dose")
    .single()

  if (!data) {
    console.error("Company not found")
    process.exit(1)
  }

  console.log(`Testing: ${data.name} (${data.id})`)
  console.log("Calling /api/enhance-company...")

  const res = await fetch("http://localhost:3000/api/enhance-company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId: data.id }),
    signal: AbortSignal.timeout(120000),
  })

  const result = await res.json()
  console.log("\nFields updated:", result.fieldsUpdated)
  console.log("Contacts created:", result.contactsCreated)

  // Now check what was saved
  const { data: updated } = await sb
    .from("companies")
    .select("bioedge_fit, category")
    .eq("id", data.id)
    .single()

  console.log("\nbioedge_fit saved to DB:", updated?.bioedge_fit)
  console.log("category saved to DB:", updated?.category)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

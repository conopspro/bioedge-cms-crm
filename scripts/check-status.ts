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

  const { data: all } = await sb
    .from("companies")
    .select("id, category, bioedge_fit, description")
    .eq("status", "researching")

  if (!all) {
    console.log("No data returned")
    return
  }

  const total = all.length
  const hasDescription = all.filter(c => c.description).length
  const hasCategory = all.filter(c => c.category).length
  const hasBioedgeFit = all.filter(c => c.bioedge_fit).length
  const needsWork = all.filter(c => !c.category || !c.bioedge_fit).length

  console.log("Total researching:", total)
  console.log("Has description:", hasDescription)
  console.log("Has category:", hasCategory)
  console.log("Has bioedge_fit:", hasBioedgeFit)
  console.log("Needs category OR bioedge_fit:", needsWork)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

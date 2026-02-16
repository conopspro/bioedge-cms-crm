import { createClient } from "@supabase/supabase-js"
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  const { data } = await sb.from('companies').select('id, name, category').eq('category', 'longevity_clinics')
  console.log('Companies still with old slug longevity_clinics:', data?.length || 0)
  if (data && data.length > 0) data.forEach((c: any) => console.log('  -', c.name))
  const { data: d2 } = await sb.from('companies').select('id, name, category').eq('category', 'longevity_services')
  console.log('Companies with new slug longevity_services:', d2?.length || 0)
  const { data: d3 } = await sb.from('company_categories').select('*').in('slug', ['longevity_clinics', 'longevity_services'])
  console.log('Category records:', JSON.stringify(d3, null, 2))
}
main()

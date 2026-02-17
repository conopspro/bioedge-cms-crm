import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { getMonthSlug } from "@/lib/news-utils"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bioedgelongevity.com"

// Static system pages
const SYSTEMS = [
  "breath",
  "circulation",
  "consciousness",
  "defense",
  "detoxification",
  "digestive",
  "emotional",
  "energy-production",
  "hormonal",
  "hydration",
  "nervous-system",
  "regeneration",
  "stress-response",
  "structure-movement",
  "temperature",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/leaders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/presentations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/spotlight`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/systems`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/framework`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/nyc-prospectus`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/rfp`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/clinics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // System pages
  const systemPages: MetadataRoute.Sitemap = SYSTEMS.map((system) => ({
    url: `${BASE_URL}/systems/${system}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Fetch published events
  const { data: events } = await supabase
    .from("events")
    .select("slug, updated_at")
    .in("status", ["published", "announced", "registration_open", "sold_out"])
    .not("slug", "is", null)

  const eventPages: MetadataRoute.Sitemap = (events || []).flatMap((event) => [
    {
      url: `${BASE_URL}/${event.slug}`,
      lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${event.slug}/agenda`,
      lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${event.slug}/companies`,
      lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/${event.slug}/leaders`,
      lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ])

  // Fetch published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .not("slug", "is", null)

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Fetch non-draft companies with slugs
  const { data: companies } = await supabase
    .from("companies")
    .select("slug, updated_at")
    .or("is_draft.is.null,is_draft.eq.false")
    .not("slug", "is", null)

  const companyPages: MetadataRoute.Sitemap = (companies || []).map((company) => ({
    url: `${BASE_URL}/companies/${company.slug}`,
    lastModified: company.updated_at ? new Date(company.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Fetch visible leaders (contacts with show_on_articles = true)
  const { data: leaders } = await supabase
    .from("contacts")
    .select("slug, updated_at")
    .eq("show_on_articles", true)
    .not("slug", "is", null)

  const leaderPages: MetadataRoute.Sitemap = (leaders || []).map((leader) => ({
    url: `${BASE_URL}/leaders/${leader.slug}`,
    lastModified: leader.updated_at ? new Date(leader.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Fetch published presentations
  const { data: presentations } = await supabase
    .from("presentations")
    .select("slug, updated_at")
    .eq("status", "published")
    .not("slug", "is", null)

  const presentationPages: MetadataRoute.Sitemap = (presentations || []).map((presentation) => ({
    url: `${BASE_URL}/presentations/${presentation.slug}`,
    lastModified: presentation.updated_at ? new Date(presentation.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Fetch published spotlights
  const { data: spotlights } = await supabase
    .from("spotlights")
    .select("slug, updated_at")
    .eq("status", "published")
    .not("slug", "is", null)

  const spotlightPages: MetadataRoute.Sitemap = (spotlights || []).map((spotlight) => ({
    url: `${BASE_URL}/spotlight/${spotlight.slug}`,
    lastModified: spotlight.updated_at ? new Date(spotlight.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Fetch active clinics
  const { data: clinicData } = await supabase
    .from("clinics")
    .select("slug, state")
    .eq("is_active", true)
    .eq("is_draft", false)
    .not("slug", "is", null)

  const clinicPages: MetadataRoute.Sitemap = (clinicData || []).map((clinic) => ({
    url: `${BASE_URL}/clinics/${clinic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  // Distinct states for /clinics/state/[state] pages
  const STATE_ABBREVS: Record<string, string> = {
    "Alabama": "al", "Alaska": "ak", "Arizona": "az", "Arkansas": "ar", "California": "ca",
    "Colorado": "co", "Connecticut": "ct", "Delaware": "de", "Florida": "fl", "Georgia": "ga",
    "Hawaii": "hi", "Idaho": "id", "Illinois": "il", "Indiana": "in", "Iowa": "ia",
    "Kansas": "ks", "Kentucky": "ky", "Louisiana": "la", "Maine": "me", "Maryland": "md",
    "Massachusetts": "ma", "Michigan": "mi", "Minnesota": "mn", "Mississippi": "ms", "Missouri": "mo",
    "Montana": "mt", "Nebraska": "ne", "Nevada": "nv", "New Hampshire": "nh", "New Jersey": "nj",
    "New Mexico": "nm", "New York": "ny", "North Carolina": "nc", "North Dakota": "nd", "Ohio": "oh",
    "Oklahoma": "ok", "Oregon": "or", "Pennsylvania": "pa", "Rhode Island": "ri", "South Carolina": "sc",
    "South Dakota": "sd", "Tennessee": "tn", "Texas": "tx", "Utah": "ut", "Vermont": "vt",
    "Virginia": "va", "Washington": "wa", "West Virginia": "wv", "Wisconsin": "wi", "Wyoming": "wy",
    "District of Columbia": "dc",
  }
  const stateSlugSet = new Set<string>()
  for (const clinic of clinicData || []) {
    if (!clinic.state) continue
    const abbrev = STATE_ABBREVS[clinic.state] || clinic.state.toLowerCase()
    stateSlugSet.add(abbrev)
  }
  const clinicStatePages: MetadataRoute.Sitemap = [...stateSlugSet].sort().map((stateSlug) => ({
    url: `${BASE_URL}/clinics/state/${stateSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Fetch distinct months for news archives
  const { data: newsDates } = await supabase
    .from("news_articles")
    .select("published_at")
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })

  const newsMonthSet = new Set<string>()
  const newsArchivePages: MetadataRoute.Sitemap = []
  for (const row of newsDates || []) {
    if (!row.published_at) continue
    const slug = getMonthSlug(new Date(row.published_at))
    if (!newsMonthSet.has(slug)) {
      newsMonthSet.add(slug)
      newsArchivePages.push({
        url: `${BASE_URL}/news/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })
    }
  }

  return [
    ...staticPages,
    ...systemPages,
    ...eventPages,
    ...articlePages,
    ...companyPages,
    ...leaderPages,
    ...presentationPages,
    ...spotlightPages,
    ...clinicPages,
    ...clinicStatePages,
    ...newsArchivePages,
  ]
}

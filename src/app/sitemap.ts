import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

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

  return [
    ...staticPages,
    ...systemPages,
    ...eventPages,
    ...articlePages,
    ...companyPages,
    ...leaderPages,
    ...presentationPages,
  ]
}

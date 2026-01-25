import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Building2, BookOpen } from "lucide-react"
import { MarkdownContent } from "@/components/articles/markdown-content"
import { ArticleEnhancements } from "@/components/articles/article-enhancements"
import { LeaderCard, LeaderCardGrid } from "@/components/ui/leader-card"
import { CompanyCard } from "@/components/ui/company-card"
import type { ArticleEnhancement } from "@/types/database"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) {
    return {
      title: "Article Not Found | bioEDGE Magazine",
    }
  }

  return {
    title: `${article.title} | bioEDGE Magazine`,
    description: article.excerpt,
  }
}

interface ArticleWithCompany {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  published_at: string | null
  created_at: string
  company: {
    id: string
    name: string
    slug: string | null
    domain: string | null
    website: string | null
    description: string | null
    logo_url: string | null
  } | null
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      published_at,
      created_at,
      company:companies (
        id,
        name,
        slug,
        domain,
        website,
        description,
        logo_url
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  const article = data as ArticleWithCompany | null

  if (!article) {
    notFound()
  }

  // Fetch article enhancements
  let enhancements: ArticleEnhancement[] = []
  try {
    const { data: enhancementData } = await supabase
      .from("article_enhancements")
      .select("*")
      .eq("article_id", article.id)
      .order("position")

    enhancements = (enhancementData || []) as ArticleEnhancement[]
  } catch {
    // Table may not exist yet
  }

  // Fetch contacts marked as visible on articles for this company
  let contacts: any[] = []
  if (article.company?.id) {
    const { data: contactData } = await supabase
      .from("contacts")
      .select("id, slug, first_name, last_name, title, avatar_url, linkedin_url")
      .eq("company_id", article.company.id)
      .eq("show_on_articles", true)
      .order("last_name")

    contacts = contactData || []
  }

  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <article className="max-w-3xl mx-auto space-y-10">
          {/* Article Content */}
          <section>
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-electric-blue hover:prose-a:text-gold prose-strong:text-navy">
              <MarkdownContent content={article.content || ""} />
            </div>
          </section>

          {/* Article Enhancements */}
          {enhancements.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold" />
                Learn More
              </h2>
              <ArticleEnhancements
                enhancements={enhancements}
                title=""
              />
            </section>
          )}

          {/* Company Section */}
          {article.company && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold" />
                About {article.company.name}
              </h2>
              <CompanyCard
                id={article.company.id}
                name={article.company.name}
                slug={article.company.slug || article.company.domain}
                logoUrl={article.company.logo_url}
                description={article.company.description}
                variant="horizontal"
                showCategory={false}
              />
            </section>
          )}

          {/* Leaders Section */}
          {contacts.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                Leaders
              </h2>
              <LeaderCardGrid>
                {contacts.map((contact: any) => (
                  <LeaderCard
                    key={contact.id}
                    id={contact.id}
                    firstName={contact.first_name}
                    lastName={contact.last_name}
                    title={contact.title}
                    avatarUrl={contact.avatar_url}
                    slug={contact.slug}
                    companyName={article.company?.name}
                    companySlug={article.company?.slug}
                  />
                ))}
              </LeaderCardGrid>
            </section>
          )}
        </article>
      </div>
    </>
  )
}

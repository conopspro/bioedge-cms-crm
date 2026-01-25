# BioEdge CMS/CRM - Complete Recreation Guide

A content management and customer relationship management system for a longevity/health-focused media company. Built to research companies, manage contacts, create articles, and organize events in the health/wellness space.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.1.3 |
| Language | TypeScript | 5.x |
| UI Framework | React | 19.2.3 |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui (Radix primitives) | - |
| Database | Supabase (PostgreSQL) | - |
| AI | Anthropic Claude | SDK 0.71.2 |
| Icons | Lucide React | 0.562.0 |
| Markdown | react-markdown + remark-gfm | 10.1.0 |

---

## Design System

### Brand Colors

```css
/* Primary Palette */
--color-navy: #0d2840;           /* Dark blue - primary brand color */
--color-deep-blue: #0d598a;      /* Mid blue */
--color-electric-blue: #017ab2;  /* Bright blue - links, accents */

/* Accent Colors */
--color-gold: #ff914d;           /* Orange/gold - CTAs, highlights */
--color-pink-accent: #f83b89;    /* Pink - gradients, badges */

/* Neutrals */
--color-off-white: #f8f9fa;      /* Background */
--color-text-dark: #2c3e50;      /* Body text */
--color-text-light: #7f8c8d;     /* Secondary text */
```

### Typography

```css
/* Fonts (Google Fonts) */
--font-heading: "IBM Plex Mono";  /* Monospace for headings */
--font-body: "Source Sans 3";     /* Sans-serif for body */

/* Weights */
Heading: 400, 500, 600, 700
Body: 300, 400, 500, 600, 700
```

### Custom Component Classes

```css
/* Layout */
.be-container     /* max-w-4xl mx-auto px-6 - main content container */

/* Cards */
.be-card          /* White card with border, rounded-lg, p-6 md:p-7 */
.be-card-accent   /* Left gold border accent (border-l-4 border-l-gold) */

/* Buttons/Pills */
.be-pill          /* Rounded-full button base with uppercase tracking */
.be-pill-primary  /* Gold background, navy text */
.be-pill-secondary /* Navy background, white text */

/* Heroes & Gradients */
.be-event-hero    /* Blue gradient hero: navy → deep-blue → electric-blue */
.gradient-blue    /* Navy to electric blue gradient */
.gradient-warm    /* Gold to pink gradient */

/* Avatars */
.be-avatar        /* Base avatar styles */
.be-avatar-sm     /* 48x48px */
.be-avatar-md     /* 64x64px */
.be-avatar-lg     /* 72x72px */
.be-avatar-gradient /* Gold to pink gradient background */
.be-avatar-blue   /* Navy to electric-blue gradient background */

/* Typography */
.section-label    /* Gold uppercase tracking label (text-gold, tracking-[3px]) */
.section-title    /* Navy heading with clamp(28px, 4vw, 40px) */
.body-text        /* text-text-dark, 17px, leading-relaxed */

/* Tiers/Badges */
.be-tier-badge    /* Small badge for exhibitor tiers */
.be-tier-title    /* Gold-to-pink gradient badge */
```

### CSS Variables for shadcn/ui

The design system integrates with shadcn/ui using HSL CSS variables:

```css
:root {
  --background: 210 17% 98%;      /* Off-white */
  --foreground: 210 25% 24%;      /* Dark text */
  --primary: 209 69% 15%;         /* Navy */
  --primary-foreground: 0 0% 100%; /* White */
  --accent: 23 100% 65%;          /* Gold */
  --sidebar-background: 209 69% 15%; /* Navy sidebar */
  --sidebar-primary: 23 100% 65%;    /* Gold accents */
  /* ... etc */
}
```

---

## Project Structure

```
/src
├── /app
│   ├── /dashboard              # Admin interface
│   │   ├── /companies          # Company management (list, [id], [id]/edit)
│   │   ├── /contacts           # Contact CRM (list, [id], [id]/edit)
│   │   ├── /research           # Research tools
│   │   ├── /events             # Event management
│   │   │   └── /[id]           # Event detail with tabs
│   │   │       ├── /sessions   # Session management
│   │   │       ├── /leaders    # Speaker management (renamed from speakers)
│   │   │       └── /exhibitors # Exhibitor management
│   │   └── /enhance            # AI enhancement dashboard
│   ├── /be                     # Public BioEdge pages
│   │   ├── /systems            # 15 biological systems educational pages
│   │   ├── /companies          # Public company directory
│   │   │   └── /[slug]         # Company detail (uses domain as slug)
│   │   ├── /leaders            # Leadership directory (renamed from speakers)
│   │   └── /[slug]             # Dynamic event pages
│   │       └── /leaders        # Event speakers page
│   ├── /api                    # API routes (see API section)
│   ├── /articles               # Public article pages
│   │   └── /[slug]             # Article detail
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Root redirect
│   └── globals.css             # Design system & Tailwind config
├── /components
│   ├── /ui                     # shadcn/ui components (20+)
│   ├── /articles               # Article editor, list, enhancements
│   ├── /companies              # Company forms, cards, status
│   ├── /contacts               # Contact list, import, enrichment
│   ├── /events                 # Event cards, sessions, speakers
│   ├── /enhance                # Enhancement dashboard UI
│   ├── /research               # Research forms, results
│   ├── /brand                  # Logo, public header/footer
│   ├── /import                 # CSV import dialogs
│   └── /layout                 # Sidebar, header, main layout
├── /lib
│   ├── /services               # External API integrations
│   │   ├── anthropic.ts        # Claude AI (excerpts, queries, selection)
│   │   ├── hunter.ts           # Email/domain enrichment
│   │   ├── perplexity.ts       # Papers, books, profile research
│   │   ├── youtube.ts          # Video search
│   │   ├── serper.ts           # Google Scholar search
│   │   └── open-library.ts     # Book data
│   ├── /supabase               # Database clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   └── utils.ts                # Utilities (cn, formatters)
├── /types
│   └── database.ts             # TypeScript types
└── /supabase
    └── /migrations             # SQL migrations (001-012)
```

---

## Database Schema

### 19 Tables + 1 View

#### Core Content Tables

**`companies`**
```sql
- id (UUID, PK)
- name, website, domain, logo_url
- description, analysis
- category, systems_supported[] (text array)
- differentiators, evidence, bioedge_fit, warm_pitch
- function_health_tier (essentials|comprehensive|total)
- status (researching|article_draft|published|outreach|engaged)
- employee_count, industry, company_type, founded_year
- technologies[] (text array)
- linkedin_url, twitter_url, facebook_url, instagram_url
- hunter_enriched_at, ai_summary, ai_talking_points[], ai_enhanced_at
- primary_contact_id (FK → contacts)
- created_at, updated_at
```

**`contacts`**
```sql
- id (UUID, PK)
- company_id (FK → companies, nullable)
- first_name, last_name, name, full_name
- email, email_domain, phone
- title, department, seniority
- linkedin_url, twitter_url, avatar_url
- source, status (active|pending_review|archived)
- outreach_status (not_contacted|contacted|responded|converted)
- show_on_articles (boolean for public visibility)
- hunter_confidence, hunter_verified_at
- bio, ai_researched_at, ai_highlights (JSONB), ai_expertise (JSONB)
- ai_summary, ai_outreach_suggestions, ai_enhanced_at
- notes, created_at, updated_at
```

**`articles`**
```sql
- id (UUID, PK)
- company_id (FK → companies, nullable)
- title, slug (unique), content (markdown), excerpt
- status (draft|review|published)
- published_at, ai_enhanced
- key_people[] (text array)
- featured_image_url, featured_image_alt, featured_image_storage_path
- created_at, updated_at
```

**`article_enhancements`**
```sql
- id (UUID, PK)
- article_id (FK → articles)
- type (youtube|scholar|book|image|link)
- title, url, embed_code
- metadata (JSONB - stores video duration, authors, thumbnails, etc.)
- position (for ordering)
- created_at
```

**`article_companies`** (multi-company support)
```sql
- id, article_id, company_id
- role (primary|featured|mentioned|sponsor)
- position, created_at
```

**`company_leaders`** (public-facing executives)
```sql
- id, company_id
- name, title, bio
- image_url, linkedin_url, source
- created_at
```

#### Events System Tables

**`venues`**
```sql
- id, name, venue_type
- address_line1, address_line2, city, state, postal_code, country
- latitude, longitude
- contact_name, contact_email, contact_phone
- secondary_contact_name, secondary_contact_email, secondary_contact_phone
- capacity, description, notes
- photo_url, floor_plan_url, website
- created_at, updated_at
```

**`venue_rooms`**
```sql
- id, venue_id (FK)
- name, room_type, floor
- capacity, default_setup, av_equipment
- notes, position
- created_at, updated_at
```

**`events`**
```sql
- id, name, slug (unique), tagline, description, extended_info
- venue_id (FK) + inline venue fields (venue_name, venue_address, city, state, country)
- start_date, end_date, timezone
- status (draft|announced|registration_open|sold_out|completed)
- registration_url, is_virtual, virtual_url
- capacity, is_free
- featured_image_url, og_image_url, logo_url
- created_at, updated_at
```

**`event_sessions`**
```sql
- id, event_id (FK), venue_room_id (FK), session_id (FK → sessions template)
- title, description, session_type
- status (draft|confirmed|cancelled)
- start_time, end_time, day_number
- location, track, position
- is_featured, notes
- created_at, updated_at
```

**`sessions`** (reusable templates)
```sql
- id, title, description, session_type
- duration_minutes, topics[]
- default_speaker_id (FK → contacts)
- is_template, notes
- created_at, updated_at
```

**`event_speakers`**
```sql
- id, event_id (FK), contact_id (FK)
- bio_override, title_override, headshot_url
- linkedin_url, twitter_url, instagram_url, website_url
- speaker_fee, payment_status (unpaid|partial|paid)
- position, is_featured, notes
- created_at, updated_at
```

**`session_speakers`** (many-to-many)
```sql
- id, session_id (FK → event_sessions), event_speaker_id (FK), contact_id (FK)
- role (keynote|presenter|panelist|moderator)
- position, created_at
```

**`event_exhibitors`**
```sql
- id, event_id (FK), company_id (FK)
- tier (title|platinum|gold|silver|bronze)
- booth_number, booth_size, booth_price
- sponsorship_price, total_amount
- payment_status
- contact_name, contact_email, contact_phone
- position, is_featured, notes
- created_at, updated_at
```

**`session_sponsors`**
```sql
- id, session_id (FK), company_id (FK)
- sponsor_level (title|presenting|supporting|media)
- sponsor_amount, created_at
```

**`event_articles`** (manual article curation)
```sql
- id, event_id (FK), article_id (FK)
- curation_type (featured|recap|preview|related|sponsor)
- position, is_manual
- created_at
```

**`event_articles_combined`** (VIEW)
- Combines manually curated articles with auto-derived articles from exhibitors

#### Lead Management Tables

**`exhibitor_leads`** (prospecting pipeline)
```sql
- id, event_id (FK)
- company_name, website, domain
- city, state, country, category, description
- pipeline_stage (prospect|contacted|interested|qualified|negotiating|won|lost)
- source, last_contacted_at, next_follow_up_date
- notes, converted_company_id (FK), converted_at
- created_at, updated_at
```

**`exhibitor_lead_contacts`**
```sql
- id, lead_id (FK)
- first_name, last_name, email, phone, title
- linkedin_url, email_confidence, verified_at
- is_primary, notes
- created_at
```

#### Tracking Tables

**`outreach_log`** (contact interaction history)
```sql
- id, contact_id (FK)
- date, type (email|linkedin|call|other)
- notes, response_received
- created_at
```

**`enhancement_logs`** (AI operation tracking)
```sql
- id, entity_type (article|contact|company), entity_id
- enhancement_source, enhancement_type
- request_data (JSONB), response_data (JSONB)
- fields_updated[]
- status (pending|processing|completed|failed)
- error_message, credits_used, duration_ms
- created_at, completed_at
```

---

## External Service Integrations

### 1. Anthropic Claude (`/lib/services/anthropic.ts`)

**Purpose:** AI content generation and intelligent selection

**Features:**
- Generate article excerpts from content
- Extract key people mentioned in articles
- Generate optimized search queries for YouTube/Scholar/Books
- Intelligently select best results from search results
- Generate warm outreach pitch suggestions
- Analyze company fit for BioEdge

**Models Used:**
- `claude-opus-4-20250514` - Best quality for complex analysis
- `claude-sonnet-4-20250514` - Balanced quality/speed
- `claude-3-5-haiku-20241022` - Fast for simple tasks

### 2. Hunter.io (`/lib/services/hunter.ts`)

**Purpose:** Email discovery and verification

**Features:**
- `domainSearch(domain)` - Find all employees at a domain
- `emailFinder(domain, firstName, lastName)` - Find specific person's email
- `verifyEmail(email)` - Validate email deliverability
- `getAccountInfo()` - Check API quota

**Returns:** Confidence scores, seniority levels, departments, social profiles

### 3. Perplexity AI (`/lib/services/perplexity.ts`)

**Purpose:** Web research for papers, books, and profiles

**Features:**
- `searchPapers(query)` - Find academic papers (PubMed, journals)
- `searchBooks(query)` - Find books with Amazon links
- `searchByAuthor(name)` - Find papers by specific author
- `searchBooksByAuthor(name)` - Find books by specific author
- `researchProfile(options)` - Research a person's professional background

**Profile Research Returns:**
```typescript
{
  bio: string,           // 2-3 paragraph professional bio
  highlights: string[],  // Career highlights
  expertise: string[],   // Areas of expertise
  education?: string[],  // Education background
  achievements?: string[] // Awards and achievements
}
```

**Model:** `sonar` (Perplexity's search-enabled model)

### 4. YouTube Data API (`/lib/services/youtube.ts`)

**Purpose:** Video discovery for article enhancement

**Features:**
- Search for relevant educational videos
- Get video metadata (title, duration, views, thumbnail)
- Filter by duration (prefer medium-length educational content)

### 5. Serper API (`/lib/services/serper.ts`)

**Purpose:** Google Scholar search for academic papers

### 6. Open Library API (`/lib/services/open-library.ts`)

**Purpose:** Book metadata lookup

---

## API Routes

### Companies
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/companies` | GET, POST | List/create companies |
| `/api/companies/[id]` | GET, PATCH, DELETE | Manage company |

### Contacts
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/contacts` | GET, POST | List/create contacts |
| `/api/contacts/[id]` | GET, PATCH, DELETE | Manage contact |
| `/api/contacts/[id]/assign` | POST | Assign contact to company |
| `/api/contacts/unassigned` | GET | Get contacts without company |

### Articles
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/articles` | GET, POST | List/create articles |
| `/api/articles/[id]` | GET, PATCH, DELETE | Manage article |
| `/api/articles/[id]/extract-people` | POST | Extract key people from content |
| `/api/articles/[id]/key-people` | POST | Get key people |
| `/api/articles/[id]/create-contacts` | POST | Create contacts from extracted people |

### Enhancements
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/enhancements` | GET, POST | List/create enhancements |
| `/api/enhancements/[id]` | GET, PATCH, DELETE | Manage enhancement |
| `/api/enhance` | GET, POST | Check status / Trigger enhancement pipeline |

### Events
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/events` | GET, POST | List/create events |
| `/api/events/[id]` | GET, PATCH, DELETE | Manage event |
| `/api/events/[id]/sessions` | GET, POST | Event sessions |
| `/api/events/[id]/sessions/[sessionId]` | GET, PATCH, DELETE | Manage session |
| `/api/events/[id]/speakers` | GET, POST | Event speakers |
| `/api/events/[id]/speakers/[speakerId]` | GET, PATCH, DELETE | Manage speaker |

### Research
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/research/save` | POST | Save research to company |
| `/api/research/company` | POST | Research a company |

### Utilities
| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/fetch-metadata` | POST | Fetch URL metadata |

---

## Key Features

### 1. Company Research Pipeline
1. Enter company domain/website
2. Hunter.io enriches company data (employees, social profiles, industry)
3. AI analyzes fit for BioEdge coverage
4. Track through status workflow: researching → article_draft → published → outreach → engaged
5. Create article when research is complete

### 2. Contact CRM
- **CSV Import** with field mapping dialog
- **Email Enrichment** via Hunter.io (confidence scores, verification)
- **AI Profile Research** via Perplexity (generates bio, highlights, expertise from LinkedIn/web)
- **Outreach Tracking** with status progression
- **Public Display Toggle** - show_on_articles controls visibility on public pages

### 3. Article Enhancement Pipeline
1. Write article content in markdown editor
2. AI extracts key people mentioned
3. System searches for related content:
   - YouTube videos (via YouTube Data API)
   - Academic papers (via Perplexity + Serper)
   - Books (via Perplexity with Amazon links)
4. Claude AI selects best, most relevant results
5. Enhancements stored and displayed on article page

### 4. 15 Biological Systems
Educational content pages at `/be/systems/`:
- Hormonal System
- Energy Production
- Hydration
- Circulation
- Breath
- Nervous System
- Consciousness
- Digestive System
- Detoxification
- Emotional Health
- Defense (Immune)
- Stress Response
- Regeneration
- Temperature Regulation
- Structure & Movement

### 5. Event Management
- **Venues** with rooms, capacity, AV equipment
- **Sessions** with speakers, tracks, scheduling
- **Speakers** linked to contacts with fee tracking
- **Exhibitors** with tier system (title/platinum/gold/silver/bronze)
- **Lead Pipeline** for prospecting potential exhibitors

### 6. Public Pages (`/be/*`)
- Company profiles with leaders, articles, systems supported
- Event pages with sessions and speakers
- Leader/speaker directory
- Biological systems educational content

---

## Environment Variables

```bash
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required - AI
ANTHROPIC_API_KEY=sk-ant-...

# Optional - Enrichment & Research
HUNTER_API_KEY=...           # Email/company enrichment
PERPLEXITY_API_KEY=pplx-... # Papers, books, profile research
YOUTUBE_API_KEY=...          # Video search
SERPER_API_KEY=...           # Google Scholar search
```

---

## Setup Instructions

### 1. Create Next.js Project
```bash
npx create-next-app@latest bioedge-app --typescript --tailwind --app
cd bioedge-app
```

### 2. Install Dependencies
```bash
# Core
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk

# UI
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install react-markdown remark-gfm

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input dialog tabs badge alert checkbox \
  dropdown-menu label scroll-area select separator switch table textarea toast
```

### 3. Set Up Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Run migrations 001-012 in SQL Editor (in order)
3. Create storage buckets: `company-logos`, `contact-avatars`, `article-images`
4. Set up RLS policies (migrations include basic policies)

### 4. Configure Tailwind v4
In `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --color-navy: #0d2840;
  --color-deep-blue: #0d598a;
  --color-electric-blue: #017ab2;
  --color-gold: #ff914d;
  --color-pink-accent: #f83b89;
  --color-off-white: #f8f9fa;
  --color-text-dark: #2c3e50;
  --color-text-light: #7f8c8d;
  --font-heading: "IBM Plex Mono", monospace;
  --font-body: "Source Sans 3", sans-serif;
  /* ... shadcn/ui compatibility variables */
}
```

### 5. Create Service Integrations
Each service in `/lib/services/` follows the pattern:
```typescript
class ServiceName {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.SERVICE_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  async someMethod() {
    if (!this.apiKey) throw new Error("API key not configured")
    // ... implementation
  }
}

export const serviceName = new ServiceName()
```

### 6. Build Pages
- Dashboard pages with list, detail, and edit views
- Public pages for companies, articles, events, systems
- API routes for CRUD operations

---

## Data Flow Architecture

### Article Enhancement Flow
```
User triggers enhance
        ↓
Claude extracts key people from article
        ↓
Generate optimized search queries
        ↓
┌───────────────────────────────────────┐
│  Parallel searches:                    │
│  - YouTube (videos)                    │
│  - Perplexity (papers, by author)      │
│  - Perplexity (books, by author)       │
└───────────────────────────────────────┘
        ↓
Claude selects best results (4 each)
        ↓
Store in article_enhancements table
        ↓
Log operation in enhancement_logs
```

### Contact Profile Research Flow
```
User selects contact → Enhance
        ↓
Get contact info (name, title, company, LinkedIn)
        ↓
Perplexity researches professional background
        ↓
Returns: bio, highlights, expertise, education, achievements
        ↓
Update contact record
        ↓
Log in enhancement_logs
```

### Company Enrichment Flow
```
User triggers enhance on company
        ↓
Hunter.io domain search
        ↓
┌─────────────────────────────────┐
│  Returns:                        │
│  - Company info (industry, size) │
│  - Employee emails (80%+ conf)   │
│  - Social profiles               │
│  - Technologies used             │
└─────────────────────────────────┘
        ↓
Create contact records for employees
        ↓
Update company record
        ↓
Log operation
```

---

## Authentication & Authorization

- **Supabase Auth** handles user authentication
- **Row Level Security (RLS)** on all database tables
- **Policies:**
  - Authenticated users: Full CRUD access
  - Anonymous users: Read-only access to public content (`/be/*` routes)
- Current setup uses permissive policies for development

---

## Storage Buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| `company-logos` | Company logo images | Yes |
| `contact-avatars` | Contact profile photos | Yes |
| `article-images` | Article featured images | Yes |

Each has RLS policies allowing public read and authenticated write.

---

## Naming Conventions

- **URLs:** kebab-case (`/be/systems/nervous-system`)
- **Database:** snake_case (`company_leaders`, `event_speakers`)
- **Components:** PascalCase (`EnhanceDashboard.tsx`)
- **Files:** kebab-case for pages, PascalCase for components
- **Public "Speakers"** renamed to **"Leaders"** throughout UI (but `event_speakers` table name retained)

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Design system, colors, component classes |
| `src/lib/supabase/server.ts` | Server-side Supabase client |
| `src/lib/services/anthropic.ts` | Claude AI integration |
| `src/lib/services/perplexity.ts` | Perplexity research integration |
| `src/lib/services/hunter.ts` | Hunter.io email enrichment |
| `src/components/brand/public-header.tsx` | Public site header |
| `src/components/brand/public-footer.tsx` | Public site footer |
| `src/app/api/enhance/route.ts` | Main enhancement API |
| `supabase/migrations/*.sql` | Database schema migrations |

---

*Last updated: January 2025*

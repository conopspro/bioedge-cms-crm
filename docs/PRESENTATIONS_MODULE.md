# Presentations Module

## Overview

The Presentations module manages reusable content for sessions, panels, talks, and other presentation-style content. Each presentation can optionally be linked to a Leader (contact), Company, and Article, and can include a YouTube video recording.

## Naming Conventions

| Concept | UI Name | Database Table | Type Name |
|---------|---------|----------------|-----------|
| Main entity | Presentation | `agenda_items` | `AgendaItem` |
| Status | Status | `agenda_item_status` | `AgendaItemStatus` |

> **Note:** The database uses `agenda_items` for historical reasons, but the UI displays "Presentations" throughout.

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── presentations/
│   │       ├── route.ts          # GET (list), POST (create)
│   │       └── [id]/
│   │           └── route.ts      # GET, PATCH, DELETE by ID
│   │
│   ├── dashboard/
│   │   └── presentations/
│   │       ├── page.tsx          # Dashboard list view
│   │       ├── new/
│   │       │   └── page.tsx      # Create new presentation
│   │       └── [id]/
│   │           └── page.tsx      # Detail/edit view (inline editing)
│   │
│   └── (public)/
│       └── presentations/
│           ├── page.tsx          # Public listing
│           └── [slug]/
│               └── page.tsx      # Public detail page
│
├── components/
│   └── presentations/
│       ├── presentation-form.tsx           # Create/edit form with AI assist
│       └── presentation-detail-editor.tsx  # Inline editing component
│
└── types/
    └── database.ts               # AgendaItem, AgendaItemStatus types
```

## Routes

### Dashboard Routes (Admin)

| Route | Description |
|-------|-------------|
| `/dashboard/presentations` | List all presentations with stats |
| `/dashboard/presentations/new` | Create a new presentation |
| `/dashboard/presentations/[id]` | View/edit presentation details |

### Public Routes

| Route | Description |
|-------|-------------|
| `/presentations` | Public listing of published presentations |
| `/presentations/[slug]` | Public detail page for a presentation |

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/presentations` | List all presentations |
| POST | `/api/presentations` | Create a new presentation |
| GET | `/api/presentations/[id]` | Get presentation by ID |
| PATCH | `/api/presentations/[id]` | Update presentation |
| DELETE | `/api/presentations/[id]` | Delete presentation |

### AI Content Generation

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai-agenda-content` | Generate titles and descriptions |

**Modes:**
- `mode: "titles"` - Generate 3 title suggestions based on context
- `mode: "descriptions"` - Generate short and long descriptions

## Database Schema

```sql
-- Status enum
CREATE TYPE agenda_item_status AS ENUM ('draft', 'published', 'archived');

-- Main table
CREATE TABLE agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,        -- ~100 words
  long_description TEXT,         -- ~400 words

  -- Related entities (all optional)
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,

  -- YouTube recording
  recording_url TEXT,            -- Original YouTube URL
  recording_embed TEXT,          -- Embed URL (youtube.com/embed/...)
  recording_metadata JSONB,      -- { videoId, thumbnail, channel, duration }

  -- Status and timestamps
  status agenda_item_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update timestamp trigger
CREATE TRIGGER update_agenda_items_updated_at
  BEFORE UPDATE ON agenda_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## TypeScript Types

```typescript
// From src/types/database.ts

export type AgendaItemStatus = "draft" | "published" | "archived"

export interface AgendaItem {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  contact_id: string | null
  company_id: string | null
  article_id: string | null
  recording_url: string | null
  recording_embed: string | null
  recording_metadata: YouTubeEnhancementMetadata | null
  status: AgendaItemStatus
  created_at: string
  updated_at: string
}

export interface YouTubeEnhancementMetadata {
  videoId: string
  thumbnail?: string
  channel?: string
  duration?: string
}
```

## Component Props

### PresentationForm

```typescript
interface PresentationFormProps {
  presentation?: AgendaItem & {
    contact?: Contact | null
    company?: Company | null
    article?: Article | null
  }
  companies: PartialCompany[]
  contacts: PartialContact[]
  articles: PartialArticle[]
}
```

### PresentationDetailEditor

```typescript
interface PresentationDetailEditorProps {
  presentation: AgendaItem
  contact: Pick<Contact, "id" | "first_name" | "last_name" | "title" | "avatar_url" | "slug"> | null
  company: Pick<Company, "id" | "name" | "logo_url" | "domain" | "slug"> | null
  article: Pick<Article, "id" | "title" | "slug"> | null
  companies: Pick<Company, "id" | "name">[]
  contacts: Pick<Contact, "id" | "first_name" | "last_name" | "title" | "show_on_articles">[]
  articles: Pick<Article, "id" | "title">[]
}
```

## Features

### 1. AI-Assisted Content Generation

The presentation form includes a 3-step AI workflow:

1. **Select Related Content** - Choose a Leader, Company, and/or Article
2. **Generate Titles** - AI suggests 3 title options based on context
3. **Generate Descriptions** - AI creates short (~100 words) and long (~400 words) descriptions

The AI uses Claude and incorporates:
- Leader's name, title, and bio
- Company's name and description
- Article's title and excerpt
- Optional user notes

### 2. Searchable Dropdowns

All entity selectors (Leader, Company, Article) use the `SearchSelect` component:
- Type to filter through options
- Handles large lists (1000+ items)
- Shows sublabels (e.g., leader's title)

### 3. Auto-Population

When selecting a Leader:
- Company auto-fills from the leader's associated company
- Article dropdown filters to show only that company's articles
- If only one article exists, it auto-selects

### 4. YouTube Integration

- Paste any YouTube URL format
- Auto-extracts video ID
- Fetches metadata (thumbnail, duration, channel)
- Generates embed URL for display

### 5. Inline Editing

The detail page uses `EditableCard` components for section-by-section editing without leaving the page.

## Sidebar Navigation

Location: `src/components/layout/sidebar.tsx`

```typescript
{
  label: "Presentations",
  href: "/dashboard/presentations",
  icon: Presentation,  // lucide-react icon
}
```

The Presentations item appears between Contacts and Articles in the sidebar.

## Public Page Layout

### Listing Page (`/presentations`)
- Shows all published presentations
- Displays embedded video directly in card (if available)
- Shows speaker avatar and company logo
- "View Presentation" link to detail page

### Detail Page (`/presentations/[slug]`)
- Full embedded video player
- Short description as lead text
- Long description with paragraph formatting
- Featured Speaker card (links to leader page)
- Company card (links to company page)
- Related Article card (links to article page)

## Slug Generation

Slugs are auto-generated from titles:
- Lowercase
- Spaces replaced with hyphens
- Special characters removed
- Checked for uniqueness (appends number if duplicate)

Example: "The Future of Longevity Medicine" → `the-future-of-longevity-medicine`

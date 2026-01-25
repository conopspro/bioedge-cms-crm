# BioEdge CMS/CRM

A content management system and CRM for managing company research, articles, and sales contacts in the longevity/preventive medicine space.

## Features

- **Company Management** - Track companies with analysis, status, and Function Health package recommendations
- **Contact CRM** - Multiple contacts per company, Hunter.io CSV import, outreach tracking
- **Article Management** - Create and manage magazine-style articles linked to companies
- **AI Enhancement** - Use Claude Opus to enhance articles with YouTube videos, Google Scholar references, and more
- **Dashboard** - Overview of your content pipeline and outreach status

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** Supabase (PostgreSQL)
- **UI:** shadcn/ui + Tailwind CSS
- **Authentication:** Supabase Auth
- **AI:** Anthropic API (Claude)
- **External APIs:** YouTube Data API, Serper API

---

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd bioedge-cms-crm
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (~2 minutes)
3. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key

### 3. Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run in the SQL Editor
4. Verify tables were created in **Table Editor**

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `ANTHROPIC_API_KEY` - Get from [console.anthropic.com](https://console.anthropic.com)
- `YOUTUBE_API_KEY` - Get from [Google Cloud Console](https://console.cloud.google.com)
- `SERPER_API_KEY` - Get from [serper.dev](https://serper.dev)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the dashboard.

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bioedge-cms-crm.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `bioedge-cms-crm` repository
4. Vercel will auto-detect Next.js settings

### Step 3: Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `YOUTUBE_API_KEY` | Your YouTube API key |
| `SERPER_API_KEY` | Your Serper API key |

### Step 4: Deploy

Click **"Deploy"** - Vercel will build and deploy your app.

Your app will be live at `https://your-project.vercel.app`

---

## Project Structure

```
bioedge-cms-crm/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard and main app pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root page (redirects to dashboard)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components (sidebar, header)
│   ├── lib/
│   │   ├── supabase/           # Supabase client utilities
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── database.ts         # TypeScript types for database
├── supabase/
│   └── migrations/             # SQL migration files
├── .env.example                # Example environment variables
├── .env.local                  # Local environment variables (git ignored)
└── README.md
```

---

## Database Schema

### Tables

- **companies** - Company profiles with analysis and status
- **contacts** - People at companies (supports multiple per company)
- **articles** - Content pieces linked to companies
- **company_leaders** - Key executives (up to 3 per company)
- **article_enhancements** - YouTube, Scholar refs, images, links
- **outreach_log** - Track contact attempts

### Enums

- `function_health_tier`: essentials, comprehensive, total
- `company_status`: researching, article_draft, published, outreach, engaged
- `outreach_status`: not_contacted, contacted, responded, converted
- `article_status`: draft, review, published
- `enhancement_type`: youtube, scholar, book, image, link
- `outreach_type`: email, linkedin, call, other

---

## API Keys Setup Guide

### Supabase (Required)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy URL and anon key

### Anthropic (Required for AI)
1. Create account at [anthropic.com](https://www.anthropic.com)
2. Go to [console.anthropic.com](https://console.anthropic.com)
3. Create new API key

### YouTube Data API (Required for video enhancement)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key

### Serper API (Required for Google Scholar search)
1. Create account at [serper.dev](https://serper.dev)
2. Go to Dashboard
3. Copy your API key

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Next Steps (Phase 2+)

After Phase 1 is complete, the following features will be built:

- [ ] Companies CRUD pages
- [ ] Contacts management with CSV import
- [ ] Article editor with markdown support
- [ ] AI enhancement engine (single + batch)
- [ ] Supabase authentication
- [ ] Dashboard statistics from real data

---

## License

Private - BioEdge Magazine

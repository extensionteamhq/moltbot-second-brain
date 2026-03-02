# System Patterns

## Architecture Overview

```
documents/**/*.md  ─┐
journals/*.md      ─┤  src/lib/documents.ts  ──→  GET /api/documents  ──→  UI (src/app/page.tsx)
briefs/*.md        ─┘

data/accountability/config.json  ─┐
data/accountability/YYYY-MM-DD.json  ─┤  GET /api/accountability  ──→  /accountability page
src/lib/accountability.ts  (utils)  ─┘       ↳ AccountabilityGrid, GridNavBar, HabitCell
```

## Document System

### File-Based Storage

- Documents are `.md` files organized across three root-level directories:
    - `documents/` — company/focus subfolders (recursive scan)
    - `journals/` — daily journal entries (flat)
    - `briefs/` — daily morning briefs (flat)
- Parsed at request time using `gray-matter` for frontmatter + content split
- No database — everything is file system (Supabase migration is a future Backlog item)
- `src/lib/documents.ts` is the single source of truth for document parsing logic

### Scan Directory Configuration

`SCAN_DIRECTORIES` in `documents.ts` defines all content roots:

```typescript
const SCAN_DIRECTORIES: ScanDirectory[] = [
    { base: "documents", section: "documents", recursive: true },
    { base: "journals", section: "journals", recursive: false },
    { base: "briefs", section: "briefs", recursive: false },
];
```

To add a new content area, append one entry — no other code changes required.

### Document Subfolder Structure

```
documents/
├── README.md                  ← stays at root, not served by API
├── dirt-roamers/              tag: dirt-roamers
├── anchor-staff/              tag: anchor-staff
├── partner-with-mateo/        tag: partner-with-mateo
├── rank-n-soar/               tag: rank-n-soar
├── mr-mateo-moore/            tag: mr-mateo-moore
├── marketing/                 tag: marketing
└── system/                    tag: system
```

Each file must include a **folder tag** matching its directory so the UI category filter works correctly.

### Frontmatter Schema

```yaml
---
title: "Document Title"
tags: [tag1, tag2]
date: YYYY-MM-DD # backward compat (or use created/updated)
created: ISO8601_TIMESTAMP
updated: ISO8601_TIMESTAMP
---
```

### Date Priority (in `getDocuments()`)

- `created`: uses `data.created` → `data.date` → file `birthtime`
- `updated`: uses `data.updated` → file `mtime`
- `date` field kept for backward compatibility

### Document Interface

```typescript
interface Document {
    slug: string; // filename without .md (unique across all dirs)
    title: string; // from frontmatter or slug
    content: string; // raw markdown (no frontmatter)
    tags: string[]; // from frontmatter, defaults to ['notes']
    date: string; // for sorting (backward compat alias for created)
    created: string; // ISO timestamp
    updated: string; // ISO timestamp
    excerpt: string; // first 150 chars, markdown stripped
    section: string; // 'documents' | 'journals' | 'briefs'
    subfolder: string; // e.g. 'dirt-roamers', 'system', '' for root
}
```

### Additional Exports in `documents.ts`

- `getDocumentsBySection(section)` — filter by `'journals'`, `'briefs'`, or `'documents'`
- `getDocumentsBySubfolder(subfolder)` — filter by `'dirt-roamers'`, `'system'`, etc.
- `SCAN_DIRECTORIES` — exported constant for inspection/extension

### API

- `GET /api/documents` — returns `{ documents: Document[], tags: string[] }`
- No write API — writes happen via Molly → git commit → git push → Vercel redeploy

### YAML Frontmatter Rules (Critical)

`gray-matter` uses `js-yaml` in YAML 1.1 mode, which **auto-converts** certain scalar values to native JS types. This has caused runtime errors. Follow these rules when authoring documents:

**Safe frontmatter patterns:**

```yaml
# ALWAYS quote ISO timestamps with timezones
created: "2026-03-02T12:00:00+00:00"
updated: "2026-03-02T13:00:00+00:00"

# Tags must be plain lowercase hyphenated strings — never dates/numbers
tags: [notes, dirt-roamers, research]

# Bare dates (no time) are converted to Date objects — use strings for date fields
date: "2026-03-02"
```

**Dangerous patterns to avoid:**

```yaml
# NEVER: bare ISO timestamp with timezone → YAMLException or Date object
created: *T12:00:00+00:00          # INVALID (alias syntax)
created: 2026-03-02T12:00:00+00:00 # parsed as Date, not string

# NEVER: numeric or date-like tags → .toLowerCase() will throw TypeError
tags: [notes, 2026, 2026-03-02]

# NEVER: special chars in filenames
# memory-*.md, my[doc].md, doc?.md → shell/YAML issues
```

**Resilience built into `documents.ts`:**

- All tags coerced via `.map(String)` — non-string tags are safely converted
- `matter()` wrapped in try/catch — a single malformed file is skipped, not fatal

## Task Management

The Kanban board feature was **removed** on 2026-03-02 and replaced with **Trello** (external). All tasks that were in `data/kanban.json` are archived in `documents/kanban-tasks-archive.md`. The following files were deleted:

- `data/kanban.json`
- `src/components/KanbanBoard.tsx`
- `documents/KANBAN.md`
- `documents/molly-kanban.md`

## Accountability System

### Data Format

Each day is a separate JSON file: `data/accountability/YYYY-MM-DD.json`

```json
{
    "date": "2026-03-02",
    "bible": true,
    "reading": null,
    "gym": false,
    "meditation": null
}
```

- `true` = completed
- `false` = missed
- `null` = no data

### Habit Schema (config-driven)

`data/accountability/config.json` defines all habit columns:

```json
{
    "habits": [
        { "key": "bible", "label": "Bible", "emoji": "📖" },
        { "key": "reading", "label": "Reading", "emoji": "📚" },
        { "key": "gym", "label": "Gym", "emoji": "🏋️" },
        { "key": "meditation", "label": "Meditation", "emoji": "🧘" }
    ]
}
```

**To add a new habit:** Add one entry to `config.json`. No UI or API code changes required. Old daily files show `–` automatically for the missing key.

### API Response Shape

```typescript
interface AccountabilityApiResponse {
    config: { habits: HabitConfig[] }; // from config.json
    data: AccountabilityEntry[]; // sorted daily records
}
```

### Utility Library (`src/lib/accountability.ts`)

All date math, habit parsing, and totals computation live here with full JSDoc. Key exports:

- `getHabitStatus(entry, habitKey)` → `true | false | null`
- `computeTotals(days, habits, entries)` → `Record<habitKey, count>`
- `getDisplayDays(date, viewMode)` → `Date[]`
- `navigateDate(date, viewMode, direction)` → `Date`
- `getViewTitle(date, viewMode)` → formatted string
- `formatDateKey(date)` → `"YYYY-MM-DD"` (local time, not UTC)

## Component Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── accountability/route.ts  # Accountability REST endpoint
│   │   └── documents/route.ts       # Documents REST endpoint
│   ├── accountability/page.tsx      # Accountability Grid page (thin orchestrator)
│   ├── globals.css                  # Global Tailwind styles
│   ├── layout.tsx                   # Root layout (Header)
│   └── page.tsx                     # Documents page
├── components/
│   ├── accountability/
│   │   ├── AccountabilityGrid.tsx   # Grid table (columns from config)
│   │   ├── GridNavBar.tsx           # Week/month nav bar (mobile-first)
│   │   └── HabitCell.tsx            # Single cell: ✅ / ❌ / –
│   ├── Header.tsx                   # Navigation (hamburger on mobile)
│   └── index.ts                     # Barrel exports
└── lib/
    ├── accountability.ts            # Accountability utilities + types
    └── documents.ts                 # Document parsing utilities
```

## Deployment Pipeline

```
Molly edits files locally
    ↓
git add + git commit + git push
    ↓
GitHub (extensionteamhq/moltbot-second-brain)
    ↓
Vercel webhook triggers build
    ↓
next build → static + SSR
    ↓
Live site updates (~60 seconds)
```

## Key Design Decisions

| Decision                     | Rationale                                                        |
| ---------------------------- | ---------------------------------------------------------------- |
| File-based docs (no DB)      | Simple, git-native, no infrastructure to manage                  |
| Server-side document parsing | Fresh on every request; no stale cache                           |
| Trello for task management   | Kanban removed from app; Trello handles task tracking externally |
| Vercel deployment            | Zero-config, instant deploys on push                             |
| Next.js App Router           | Modern routing, server components, better performance            |

## Mobile Navigation Pattern

- `SidebarContext` manages open/close state across components
- Hamburger menu in `Header.tsx` toggles sidebar visibility
- Sidebar overlay closes on outside tap
- Hamburger only visible on mobile (`md:hidden`)

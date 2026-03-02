# System Patterns

## Architecture Overview

```
documents/*.md  ──→  src/lib/documents.ts  ──→  GET /api/documents  ──→  UI (src/app/page.tsx)
data/kanban.json  ──→  src/app/projects/page.tsx  ──→  KanbanBoard component
```

## Document System

### File-Based Storage

- All documents are `.md` files in the `documents/` directory
- Parsed at request time using `gray-matter` for frontmatter + content split
- No database — everything is file system (Supabase migration is a future Backlog item)
- `src/lib/documents.ts` is the single source of truth for document parsing logic

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
    slug: string; // filename without .md
    title: string; // from frontmatter or slug
    content: string; // raw markdown (no frontmatter)
    tags: string[]; // from frontmatter, defaults to ['notes']
    date: string; // for sorting
    created: string; // ISO timestamp
    updated: string; // ISO timestamp
    excerpt: string; // first 150 chars, markdown stripped
}
```

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

## Kanban System

### CRITICAL: Data Source

- **Source of truth:** `data/kanban.json`
- **Reference only (not synced):** `documents/KANBAN.md`
- Molly must edit `data/kanban.json` directly and push to GitHub
- This was a known mistake (2026-02-12): pushing to KANBAN.md instead of kanban.json

### Kanban Data Shape

```typescript
interface StoredData {
    projects: Project[];
    activeProjectId: string | null;
}
// Projects: "molly-tasks" | "mateo-tasks"
// Columns: backlog | for-consideration | research-plan | implementing | done
```

### Kanban Persistence

- On the client side, KanbanBoard reads from `data/kanban.json` via the file system
- Changes made in UI persist to `localStorage` under key `second-brain-kanban`
- For permanent changes (Molly's updates), edit `data/kanban.json` and push

## Component Architecture

```
src/
├── app/
│   ├── api/documents/route.ts   # Documents REST endpoint
│   ├── projects/page.tsx        # Kanban board page
│   ├── globals.css              # Global Tailwind styles
│   ├── layout.tsx               # Root layout (Header)
│   └── page.tsx                 # Documents page
├── components/
│   ├── Header.tsx               # Navigation (hamburger on mobile)
│   ├── KanbanBoard.tsx          # Full Kanban implementation
│   └── index.ts                 # Barrel exports
└── lib/
    └── documents.ts             # Document parsing utilities
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

| Decision                           | Rationale                                                      |
| ---------------------------------- | -------------------------------------------------------------- |
| File-based docs (no DB)            | Simple, git-native, no infrastructure to manage                |
| Server-side document parsing       | Fresh on every request; no stale cache                         |
| `data/kanban.json` for Kanban      | Structured data, easy for Molly to edit programmatically       |
| `localStorage` for Kanban UI edits | Zero-backend drag-and-drop; persistent across browser sessions |
| Vercel deployment                  | Zero-config, instant deploys on push                           |
| Next.js App Router                 | Modern routing, server components, better performance          |

## Mobile Navigation Pattern

- `SidebarContext` manages open/close state across components
- Hamburger menu in `Header.tsx` toggles sidebar visibility
- Sidebar overlay closes on outside tap
- Hamburger only visible on mobile (`md:hidden`)

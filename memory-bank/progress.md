# Progress

## What Works

### Core Application

- ✅ **Document browser** — Lists all `.md` files from `documents/`, sorted by date (newest first)
- ✅ **Full-text search** — Searches across title, content, and tags
- ✅ **Tag filtering** — Filter documents by tag; multi-tag support
- ✅ **Markdown rendering** — Full GFM support (tables, task lists, code blocks, syntax highlighting)
- ✅ **Document download** — Download any doc as `.md` file
- ✅ **Responsive layout** — Works on mobile and desktop
- ✅ **Mobile sidebar nav** — Hamburger menu in header toggles document list on mobile (fixed 2026-02-07)
- ✅ **Kanban board** (`/projects`) — Drag-and-drop task management, two projects, 5-column workflow
- ✅ **Kanban persistence** — `data/kanban.json` as source of truth; `localStorage` for UI changes
- ✅ **Auto-deploy pipeline** — Git push → Vercel deploy → live in ~60 seconds
- ✅ **Frontmatter parsing** — `title`, `tags`, `date`, `created`, `updated` all supported
- ✅ **Documents API** — `GET /api/documents` returns all documents + tags
- ✅ **Accountability Grid** (`/accountability`) — week/month calendar grid, dynamic habit columns, mobile-first layout, navigation bar
- ✅ **Accountability config-driven habits** — `data/accountability/config.json` defines columns; no UI code changes needed to add/remove habits
- ✅ **Accountability API** — `GET /api/accountability` returns `{ config, data }` with habit schema + sorted daily records
- ✅ **Accountability utility library** — `src/lib/accountability.ts` with full JSDoc, typed helpers for date math, habit parsing, and totals

### Content (Documents)

- ✅ **29 Dirt Roamers research documents** (topics 01–29 covering land portal, land AI, county records, skip tracing, growth markets, GHL, outreach, due diligence, closing, subdivision, buyer financing, tax, content strategy, deal analysis, GHL automation, buyer list building, seller financing, legal structures, title companies, wholesaling, deal financing, probate, tax liens, homesteading, and 3 update docs)
- ✅ **Workspace sync files** — SOUL, IDENTITY, MEMORY, TOOLS, AGENTS, USER, KANBAN, BUSINESS-PLAN
- ✅ **Daily journal entries** — From 2026-01-28 through 2026-03-02
- ✅ **Email sequences** — Dirt Roamers nurture + cold email sequences
- ✅ **Anchor & Staff docs** — SOPs, brand guides, media kit, intake questionnaires, nurture sequence
- ✅ **AI/LLM comparison docs** — Model comparisons, cold calling comparisons
- ✅ **Accountability docs** — Check-in rules, OC weekly accountability
- ✅ **Marketing frameworks** — StoryBrand, Hormozi value equation, brand story blueprint

## What's Left to Build

### High Priority (Backlog)

- ⏳ **Supabase Database Migration** — Move from file-based to DB storage
    - Phase 1: Setup & Schema (Supabase project, table design)
    - Phase 2: Migration Script (parse existing .md files → DB rows)
    - Phase 3: API Integration (CRUD routes, update Molly to use DB)
    - Phase 4: Cleanup (remove file system dependency)

- ⏳ **CRUD Interface** — Create/edit/delete documents in-browser
    - Phase 1: Create (New Document button, form, markdown editor with preview)
    - Phase 2: Edit (inline/modal editor, auto-save drafts)
    - Phase 3: Delete (soft delete with trash, bulk operations)
    - Phase 4: Enhanced (tag management UI, templates, import/export)

### Medium Priority (For Consideration)

- ⏳ **Cloudflare Tunnel** — Secure Clawdbot dashboard access (port 37842)
- ⏳ **Land Sourcing Tool Comparison** — Landportal vs landinsights decision matrix
- ⏳ **Social Media Content Calendar** — 30-day template for Dirt Roamers + Anchor & Staff

## Current Status

**Application:** Fully functional. No known bugs as of 2026-03-02.

**Content:** Active. Molly pushes new documents regularly (daily journals, research as needed).

**Development:** In maintenance mode. Next major work items are the Supabase migration and CRUD interface — both require Mateo's approval before starting.

## Known Issues / Gotchas

### ✅ FIXED: Malformed frontmatter crashed the entire API (2026-03-02)

**What happened:** A file named `documents/memory-*.md` (literal asterisk in filename) had invalid YAML: `created: *T12:00:00+00:00`. In YAML, `*` is an alias token — this threw a `YAMLException` that crashed `GET /api/documents` with a 500 for ALL documents.

**Root fix:** Deleted the malformed file.

**Resilience fix:** Changed `files.map()` to `files.flatMap()` with try/catch in `getDocuments()`. A bad file now logs to console and is skipped — it can't crash the API for all other documents.

**How to avoid:** Never create files with special characters (`*`, `?`, `[`) in filenames. Always quote YAML values that contain special characters.

---

### ✅ FIXED: `tag.toLowerCase is not a function` TypeError (2026-03-02)

**What happened:** `js-yaml` (YAML 1.1 mode, used by `gray-matter`) auto-converts YAML scalar values to native JS types. A tag value that looks like a date (`2026-03-02`), number (`2026`), or boolean gets converted from a string to `Date`/`number`/`boolean`. `page.tsx`'s `categorizeTag()` calls `tag.toLowerCase()` which fails on non-strings.

**Fix:** In `getDocuments()`, changed `data.tags` handling to coerce all values to strings:

```typescript
tags: (data.tags || ['notes']).map(String),
```

**How to avoid:** All document frontmatter tag values should be plain lowercase strings with no special characters. Avoid tags that look like dates, numbers, or booleans. Always quote ambiguous values:

```yaml
# GOOD
tags: [notes, dirt-roamers, research]

# RISKY (js-yaml converts 2026-03-02 to a Date object)
tags: [notes, 2026-03-02]

# SAFE if quoting is used
tags: [notes, '2026-03-02']
```

---

1. **Frontmatter YAML type coercion** — `gray-matter`/`js-yaml` (YAML 1.1) auto-converts date-like, numeric, and boolean YAML values to native JS types. Tags are now protected via `.map(String)` in `documents.ts`, but be aware other frontmatter fields may also be coerced (e.g. a bare `date: 2026-03-02` becomes a `Date` object, not a string — currently handled downstream but something to watch).

2. **Kanban UI ≠ kanban.json** — Changes dragged in the browser UI write to `localStorage` only. Permanent changes require editing `data/kanban.json` and pushing to GitHub. This is a known limitation, not a bug.

3. **documents/ is flat** — All markdown files must be directly in `documents/`. Subdirectories are not traversed. (There is a `documents/briefs/` subdirectory that exists but its contents won't appear in the UI unless the document parser is updated to support recursive traversal.)

4. **No write API** — Documents cannot be created or edited through the UI. This is intentional for now, pending the CRUD interface feature.

5. **documents/KANBAN.md is not synced** — This file is for human reference only. The actual Kanban data is in `data/kanban.json`. (Mistake was made 2026-02-12; Mateo explicitly said "make sure this doesn't happen again".)

6. **localStorage Kanban overwrites JSON** — If a user drags tasks in the browser, those localStorage values take precedence over the JSON file for that browser session. When Molly pushes updates to `kanban.json`, users may need to clear localStorage to see the new state.

## Milestone History

| Date          | Milestone                                                                          |
| ------------- | ---------------------------------------------------------------------------------- |
| 2026-01-31    | Second Brain deployed on Vercel, pipeline working                                  |
| 2026-02-07    | Kanban board implemented, mobile nav fixed, email sequences created                |
| 2026-02-07–21 | 25+ Dirt Roamers research documents created                                        |
| 2026-02-12    | Kanban data source confusion resolved (kanban.json vs KANBAN.md)                   |
| 2026-02-26–28 | Additional research updates (Land Portal affiliate, Land AI, skip tracing)         |
| 2026-03-02    | Workspace files synced, memory bank initialized                                    |
| 2026-03-02    | Accountability Grid refactored — dynamic config-driven habits, mobile-first, JSDoc |
| 2026-03-02    | Meditation added as 4th habit; Feb 27–Mar 2 daily files updated                    |

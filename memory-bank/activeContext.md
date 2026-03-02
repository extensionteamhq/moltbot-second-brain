# Active Context

## Current Date

2026-03-02 (updated 2026-03-02)

## Current Work Focus

Ongoing maintenance and content updates. The project is a functioning Next.js app with:

- 200+ documents organized in `documents/` subfolders + `journals/` + `briefs/`
- Accountability grid at `/accountability`
- Workspace files (SOUL, IDENTITY, MEMORY, TOOLS, AGENTS, USER, BUSINESS-PLAN) in `documents/system/`
- Task management moved to Trello (Kanban feature removed)

## Recent Changes

- **2026-03-02:** **Documents reorganization** — Restructured the entire content directories:
    - Created `briefs/` at project root — moved all `YYYY-MM-DD-brief.md` files here (18 files)
    - Created `journals/` at project root — moved all date-named journal/daily files here (41 files)
    - Created company/focus subfolders in `documents/`: `dirt-roamers/` (66), `anchor-staff/` (18), `partner-with-mateo/` (5), `rank-n-soar/` (14), `mr-mateo-moore/` (4), `marketing/` (1), `system/` (37)
    - Added frontmatter to 32 files that had none; added required folder tags to 29 files missing them
    - Refactored `src/lib/documents.ts` — recursive multi-dir scanning (`SCAN_DIRECTORIES`), new `section`/`subfolder` fields on `Document`, added `getDocumentsBySection()` and `getDocumentsBySubfolder()`, full JSDoc
    - Updated `src/app/page.tsx` — `journal` and `brief` promoted to CATEGORY tags with color mappings
    - Updated `documents/README.md` — complete structure guide with tag conventions and YAML safety rules
- **2026-03-02:** **Accountability Grid full refactor** — decomposed monolithic 270-line page into focused components driven by a dynamic habit schema:
    - Created `data/accountability/config.json` — defines habits (key, label, emoji); adding a new habit only requires adding one entry here
    - Created `src/lib/accountability.ts` — full JSDoc typed utility library (date math, habit parsing, totals computation)
    - Refactored `src/app/api/accountability/route.ts` — now returns `{ config, data }` so UI columns are schema-driven
    - Created `src/components/accountability/HabitCell.tsx` — renders ✅ / ❌ / – for one cell
    - Created `src/components/accountability/AccountabilityGrid.tsx` — dynamic columns from config, horizontal scroll for many habits
    - Created `src/components/accountability/GridNavBar.tsx` — mobile-first nav, 44px touch targets, stacks on mobile
    - Refactored `src/app/accountability/page.tsx` — thin orchestrator (~130 lines)
    - Added **Meditation** (🧘) as 4th habit to `config.json`
    - Updated daily files Feb 27–Mar 2 with `"meditation": null`
- **2026-03-02:** Logged accountability data: Feb 27 (gym missed), Feb 28/Mar 1/Mar 2 (bible ✅, reading/gym/meditation = no data)
- **2026-03-02:** Fixed two runtime bugs in `src/lib/documents.ts` (see Known Issues in `progress.md`):
    1. **YAMLException crash** — Deleted malformed `documents/memory-*.md` (literal `*` in filename, invalid `created: *T12:00:00+00:00`). Added try/catch so bad files are skipped, not fatal.
    2. **`tag.toLowerCase is not a function`** — `js-yaml` was auto-converting date/number-like YAML tag values to non-string JS types. Fixed by coercing all tags with `.map(String)` in `getDocuments()`.
- **2026-03-02:** Memory bank initialized (this directory)
- **2026-03-02:** **Kanban feature removed** — Deleted `data/kanban.json`, `src/components/KanbanBoard.tsx`, `documents/KANBAN.md`, `documents/molly-kanban.md`. Removed KanbanBoard export from `src/components/index.ts`. Removed "kanban" from `src/app/layout.tsx` metadata keywords. All tasks archived in `documents/system/kanban-tasks-archive.md`. Task management moved to **Trello** (external).
- **2026-03-02:** Workspace core files synced into `documents/system/` (SOUL.md, IDENTITY.md, MEMORY.md, TOOLS.md, AGENTS.md, USER.md, BUSINESS-PLAN.md)
- **2026-02-27:** Latest journal entries and research updates
- **2026-02-12:** Fixed critical bug — Kanban data source confusion (KANBAN.md vs kanban.json)
- **2026-02-07:** Mobile navigation fixed (hamburger menu + SidebarContext)
- **2026-02-07:** Kanban board initial implementation

## Active Tasks

Task management has moved to **Trello**. For archived task history, see `documents/system/kanban-tasks-archive.md`.

Key backlog items (from archive, now tracked in Trello):

- Migrate Files to Supabase Database
- Second Brain CRUD Interface

## Active Decisions & Considerations

### Document Tagging Convention

Each document must include a **folder tag** matching its location. See `documents/README.md` for full details.

| Folder                          | Required Tag         |
| ------------------------------- | -------------------- |
| `documents/dirt-roamers/`       | `dirt-roamers`       |
| `documents/anchor-staff/`       | `anchor-staff`       |
| `documents/partner-with-mateo/` | `partner-with-mateo` |
| `documents/rank-n-soar/`        | `rank-n-soar`        |
| `documents/mr-mateo-moore/`     | `mr-mateo-moore`     |
| `documents/marketing/`          | `marketing`          |
| `documents/system/`             | `system`             |
| `journals/`                     | `journal`            |
| `briefs/`                       | `brief`              |

### No Write API (intentional for now)

- All document creation goes through Molly → git → push workflow
- CRUD interface is a planned feature (tracked in Trello), not yet built

## Next Steps

1. The two highest-priority development tasks are Supabase migration and CRUD interface (track in Trello)
2. Dirt Roamers research is complete (66 documents in `documents/dirt-roamers/`) — no new research needed
3. Any new documents from Molly should be committed and pushed immediately after creation
4. New documents must be placed in the correct subfolder with the required folder tag

## Key Files to Know

| File                                                   | Purpose                                      |
| ------------------------------------------------------ | -------------------------------------------- |
| `src/lib/documents.ts`                                 | All document parsing logic (multi-dir scan)  |
| `src/lib/accountability.ts`                            | Accountability typed utilities + JSDoc       |
| `data/accountability/config.json`                      | Habit schema — add new habits here           |
| `data/accountability/YYYY-MM-DD.json`                  | Daily habit records                          |
| `src/components/accountability/AccountabilityGrid.tsx` | Grid UI (columns driven by config)           |
| `src/components/accountability/GridNavBar.tsx`         | Navigation bar (week/month, prev/next)       |
| `src/components/accountability/HabitCell.tsx`          | Single habit/day cell renderer               |
| `src/app/api/accountability/route.ts`                  | Accountability API endpoint                  |
| `src/app/api/documents/route.ts`                       | Documents API endpoint                       |
| `documents/README.md`                                  | Documents folder structure guide             |
| `documents/system/kanban-tasks-archive.md`             | Archived Kanban tasks (Trello now used)      |
| `documents/system/MEMORY.md`                           | Molly's long-term memory (workspace context) |
| `documents/system/USER.md`                             | Mateo's profile, projects, preferences       |
| `documents/system/SOUL.md`                             | Molly's behavioral guidelines                |

## How to Add a New Habit to the Accountability Grid

1. Add an entry to `data/accountability/config.json`:
    ```json
    { "key": "my_habit", "label": "My Habit", "emoji": "🎯" }
    ```
2. Include `"my_habit": true/false/null` in new daily JSON files going forward.
3. Old daily files automatically show `–` for the missing key — no backfill needed.

## How to Add a New Document

1. Place the `.md` file in the correct subfolder (e.g. `documents/dirt-roamers/my-doc.md`)
2. Include YAML frontmatter with the required folder tag:
    ```yaml
    ---
    title: "My Document"
    tags: [dirt-roamers, research]
    created: "2026-03-02T12:00:00+00:00"
    updated: "2026-03-02T12:00:00+00:00"
    ---
    ```
3. Commit and push → Vercel auto-deploys in ~60 seconds

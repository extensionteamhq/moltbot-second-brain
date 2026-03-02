# Active Context

## Current Date

2026-03-02 (updated 2026-03-02)

## Current Work Focus

The memory bank was just initialized (today). The project itself is a functioning Next.js app with:

- 100+ documents in `documents/`
- Kanban board with two projects (Molly's Tasks, Mateo's Tasks)
- Workspace files (SOUL, IDENTITY, MEMORY, TOOLS, AGENTS, USER, KANBAN, BUSINESS-PLAN) synced from Molly's `~/clawd` workspace

## Recent Changes

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
- **2026-03-02:** Workspace core files synced into `documents/` with `workspace` and `sync` tags (SOUL.md, IDENTITY.md, MEMORY.md, TOOLS.md, AGENTS.md, USER.md, KANBAN.md, BUSINESS-PLAN.md)
- **2026-02-27:** Latest journal entries and research updates
- **2026-02-12:** Fixed critical bug — Kanban data source confusion (KANBAN.md vs kanban.json)
- **2026-02-07:** Mobile navigation fixed (hamburger menu + SidebarContext)
- **2026-02-07:** Kanban board initial implementation

## Active Kanban Tasks

### Molly's Tasks — Backlog (high priority)

1. **Migrate Files to Supabase Database** — Convert file-based system to Supabase DB. Phases: Setup & Schema → Migration Script → API Integration → Cleanup
2. **Second Brain CRUD Interface** — Add create/edit/delete UI. Phases: Create → Edit → Delete → Enhanced features

### Molly's Tasks — For Consideration

1. **Cloudflare Tunnel Setup** — Secure dashboard access for Clawdbot (port 37842)
2. **Land Sourcing Tool Comparison** — Decision matrix for landportal vs landinsights vs alternatives
3. **Social Media Content Calendar** — 30-day template for Dirt Roamers + Anchor & Staff

### Mateo's Tasks — Backlog

1. Affiliate Marketing Book
2. Personal Branding Book
3. Bootcamp/Workshop (Owner's Club)
4. Rank-n-Soar
5. Consulting Agency (Anchor & Staff) — **high priority**
6. Partner With Mateo Resources
7. Dirt Roamers Resources
8. Personal Brand / Social Media

## Active Decisions & Considerations

### Kanban Data Source (RESOLVED — do not forget)

- ✅ **Correct:** Edit `data/kanban.json` → `git push`
- ❌ **Wrong:** Edit `documents/KANBAN.md` (reference only, not synced to UI)

### Document Tagging Convention

- Workspace files use tags: `[workspace, sync]`
- Research uses: `[research, dirt-roamers]`
- Journal entries use: `[journal, sync]`
- Memory logs use: `[memory, journal, sync]`

### No Write API (intentional for now)

- All document creation goes through Molly → git → push workflow
- CRUD interface is a planned feature (Backlog), not yet built

## Next Steps

1. When working on this codebase, check `data/kanban.json` for current task state
2. The two highest-priority development tasks are Supabase migration and CRUD interface
3. Dirt Roamers research is complete (29 documents) — no new research needed there
4. Any new documents from Molly should be committed and pushed immediately after creation

## Key Files to Know

| File                                                   | Purpose                                      |
| ------------------------------------------------------ | -------------------------------------------- |
| `src/lib/documents.ts`                                 | All document parsing logic                   |
| `src/lib/accountability.ts`                            | Accountability typed utilities + JSDoc       |
| `data/kanban.json`                                     | Kanban state (source of truth)               |
| `data/accountability/config.json`                      | Habit schema — add new habits here           |
| `data/accountability/YYYY-MM-DD.json`                  | Daily habit records                          |
| `src/components/accountability/AccountabilityGrid.tsx` | Grid UI (columns driven by config)           |
| `src/components/accountability/GridNavBar.tsx`         | Navigation bar (week/month, prev/next)       |
| `src/components/accountability/HabitCell.tsx`          | Single habit/day cell renderer               |
| `src/app/api/accountability/route.ts`                  | Accountability API endpoint                  |
| `src/components/KanbanBoard.tsx`                       | Kanban UI component                          |
| `src/app/api/documents/route.ts`                       | Documents API endpoint                       |
| `documents/MEMORY.md`                                  | Molly's long-term memory (workspace context) |
| `documents/USER.md`                                    | Mateo's profile, projects, preferences       |
| `documents/SOUL.md`                                    | Molly's behavioral guidelines                |

## How to Add a New Habit to the Accountability Grid

1. Add an entry to `data/accountability/config.json`:
    ```json
    { "key": "my_habit", "label": "My Habit", "emoji": "🎯" }
    ```
2. Include `"my_habit": true/false/null` in new daily JSON files going forward.
3. Old daily files automatically show `–` for the missing key — no backfill needed.

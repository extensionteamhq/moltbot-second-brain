# Product Context

## Why This Exists

Molly (Mateo's AI assistant) resets memory between sessions. This Second Brain repo is the persistence layer — every conversation journal, research document, SOP, and config file gets committed here so that Molly can re-read context on every session start and Mateo can review everything through a clean web interface.

## Problems It Solves

| Problem                           | Solution                                                 |
| --------------------------------- | -------------------------------------------------------- |
| AI memory resets between sessions | Documents committed to repo; Molly reads them on startup |
| Research gets lost or scattered   | All research docs in `documents/` with tags and search   |
| Task tracking is fragmented       | Kanban board in `data/kanban.json`, rendered in UI       |
| Workspace files need versioning   | Git history tracks every change Molly makes              |
| Mateo needs mobile access         | Responsive UI deployed on Vercel                         |

## How It Works

1. **Molly generates content** — journal entries, research, guides, SOPs, workspace sync files
2. **Molly commits + pushes** to the GitHub repo (`cd ~/clawd/projects/second-brain && git push`)
3. **Vercel auto-deploys** within ~60 seconds
4. **Mateo browses** documents via the web UI — search, filter by tag, read full content
5. **Kanban board** at `/projects` shows current task state for both Molly's and Mateo's projects

## User Experience Goals

- **Zero friction browsing** — Full-text search + tag filtering to find any document instantly
- **Mobile-first** — Mateo uses his phone; hamburger sidebar for document navigation on mobile
- **Markdown fidelity** — Code blocks, tables, task lists all render properly
- **Fast** — Vercel edge deployment, server-side rendering via Next.js

## Key User: Mateo Moore

- Accesses via phone and laptop
- Primary need: find research docs and review Molly's work
- Secondary need: check Kanban task status
- Doesn't create documents through the UI (Molly does that via git push)

## Document Categories (Tags)

- `journal` — Daily journal entries from conversations
- `notes` — General notes
- `sync` / `workspace` — Molly's workspace files (SOUL, IDENTITY, MEMORY, etc.)
- `dirt-roamers` — Land flipping business documents (29+ research docs)
- `research` — Research reports
- `email-sequences` — Email templates
- `anchor-staff` — Consulting agency docs
- `project` / `kanban` — Project management docs
- `memory` — Daily memory logs

## Businesses Represented in Documents

1. **Dirt Roamers** (`dirtroamers.com`) — Land flipping business (primary active project)
2. **Anchor & Staff** (`anchorandstaff.com`) — Full-service marketing/consulting agency (with Mike Davis)
3. **Partner With Mateo** (`partnerwithmateo.com`) — Affiliate resources for SubTo/Gator/Top-Tier TC communities
4. **Rank-n-Soar** — Rank and rent model (Payload CMS, Next.js template sites)
5. **Personal brand** — mrmateomoore.com, social media presence

# Project Brief: moltbot-second-brain

## What This Is

A personal knowledge base and project management tool for **Mateo Moore**, built with Next.js and deployed on Vercel. The repo is maintained by **Molly**, Mateo's AI assistant, who generates documents/journal entries and pushes them here so Mateo can access a searchable, browsable "second brain" via the web.

## Repository

- **GitHub:** `extensionteamhq/moltbot-second-brain`
- **Deployed on:** Vercel (auto-deploys on every `git push`)
- **Local path (Molly's workspace):** `~/clawd/projects/second-brain/`

## Core Purpose

1. **Document browser** — Searchable, tag-filtered knowledge base of markdown files
2. **Persistent memory** — Molly's daily journals, research docs, SOPs, and workspace files are committed here so they survive session resets
3. **Accountability tracking** — Daily habit grid for Mateo's personal accountability

## Core Requirements

- Any `.md` file placed in `documents/` automatically appears in the UI
- Documents use YAML frontmatter (`title`, `tags`, `date`/`created`/`updated`)
- Molly pushes updates; Vercel deploys within ~60 seconds
- Must be mobile-friendly

## Task Management

Task management has moved to **Trello** (external). The old Kanban board feature (`data/kanban.json`, `src/components/KanbanBoard.tsx`) was removed. All tasks that were in the Kanban board are archived in `documents/kanban-tasks-archive.md`.

## Scope

- **In scope:** Document viewing, search, tag filtering, accountability grid, mobile nav
- **Future scope:** Supabase DB migration, CRUD interface for creating/editing docs in-browser
- **Out of scope:** Kanban/task management (moved to Trello), multi-user auth, real-time collaboration

## Owner

Mateo Moore — Growth & Marketing Operations Executive, land investor (Dirt Roamers), consultant (Anchor & Staff)

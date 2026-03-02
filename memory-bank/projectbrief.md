# Project Brief: moltbot-second-brain

## What This Is

A personal knowledge base and project management tool for **Mateo Moore**, built with Next.js and deployed on Vercel. The repo is maintained by **Molly**, Mateo's AI assistant, who generates documents/journal entries and pushes them here so Mateo can access a searchable, browsable "second brain" via the web.

## Repository

- **GitHub:** `extensionteamhq/moltbot-second-brain`
- **Deployed on:** Vercel (auto-deploys on every `git push`)
- **Local path (Molly's workspace):** `~/clawd/projects/second-brain/`

## Core Purpose

1. **Document browser** — Searchable, tag-filtered knowledge base of markdown files
2. **Kanban board** — Project management for Mateo's and Molly's tasks
3. **Persistent memory** — Molly's daily journals, research docs, SOPs, and workspace files are committed here so they survive session resets

## Core Requirements

- Any `.md` file placed in `documents/` automatically appears in the UI
- Documents use YAML frontmatter (`title`, `tags`, `date`/`created`/`updated`)
- Kanban state lives in `data/kanban.json` — this is the source of truth (NOT `documents/KANBAN.md`)
- Molly pushes updates; Vercel deploys within ~60 seconds
- Must be mobile-friendly

## Scope

- **In scope:** Document viewing, search, tag filtering, Kanban board management, mobile nav
- **Future scope:** Supabase DB migration, CRUD interface for creating/editing docs in-browser
- **Out of scope:** Multi-user auth, real-time collaboration

## Owner

Mateo Moore — Growth & Marketing Operations Executive, land investor (Dirt Roamers), consultant (Anchor & Staff)

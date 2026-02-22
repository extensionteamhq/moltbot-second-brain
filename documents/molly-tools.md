---
title: "Molly: TOOLS.md"
tags: [system, notes]
created: 2026-02-22T05:00:00-05:00
updated: 2026-02-22T05:00:00-05:00
---

# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## GoHighLevel

### Dirt Roamers
- **Location ID:** FiYFwHcF6HtPefh7QiAK
- **API Key:** Stored securely in `auth-profiles.json` (profile: `ghl:dirt-roamers`) and `.env` (`GHL_API_KEY`)
- **URL:** https://app.gohighlevel.com/v2/location/FiYFwHcF6HtPefh7QiAK

**To access:** Use `${GHL_API_KEY}` env var or read from auth-profiles.json

---

## Google API Access (partnerwithmateo@gmail.com)

**Credentials:** `~/.clawdbot/google-calendar-credentials.json`
- Works for BOTH Gmail and Calendar
- OAuth2 with refresh token (auto-renews)

**What I can do:**
- **Gmail:** Read, search, draft, send emails
- **Calendar:** Read events, create appointments, modify events

**Calendars I can access:**
- `mateo@anchorandstaff.com` — Anchor & Staff (agency)
- `partnerwithmateo@gmail.com` — Main work calendar
- `mateo.moore@subto.com` — SubTo coaching (HIGHEST PRIORITY)
- `xybermatthew@gmail.com` — Personal

---

## Second Brain Sync

**ALWAYS sync generated files to second-brain and push to GitHub.**

### Automated Nightly Sync (Midnight ET)
- Daily journal (conversation history)
- Core workspace files: AGENTS.md, IDENTITY.md, MEMORY.md, SOUL.md, USER.md, TOOLS.md
- **KANBAN.md** → Keep task columns updated in real-time throughout the day

### Ad-Hoc Content Sync
When creating research docs, outlines, guides, or any substantial content:
1. Save to appropriate project folder (e.g., `projects/dirt-roamers/research/`)
2. Copy to `projects/second-brain/documents/` with frontmatter (title, tags, date)
3. Git add, commit, and push immediately

**KANBAN Updates:**
- **CRITICAL:** Second brain reads from `projects/second-brain/data/kanban.json` (NOT KANBAN.md)
- To add/update tasks: Edit `data/kanban.json` directly, then git push
- Workspace `projects/KANBAN.md` is for reference only - does NOT sync to second brain

---

## AI Model Providers

**Full setup guide:** `~/clawd/docs/MODEL-SETUP-GUIDE.md`

### Configured Providers (as of 2026-02-11)

| Provider | Models | Cost (per 1M tokens) | Use Case |
|----------|--------|---------------------|----------|
| Anthropic | Sonnet 4.5, Opus 4.5 | $3/$15 (Sonnet), $15/$75 (Opus) | Default, complex tasks |
| xAI | Grok 3, Grok 3 Mini | ~$3/$15 | Fast reasoning |
| Moonshot | Kimi K2, K2 Turbo | $0.60/$2.50 | Cheapest - simple tasks |
| OpenAI | GPT-4o | $2.50/$10 | Out of budget |

### Auth Architecture (Quick Reference)

**Primary:** `~/.clawdbot/agents/main/agent/auth-profiles.json`
**Fallback:** `~/.clawdbot/.env`

### Model Selection

**Quick Reference:**
- `kimi` → Simple stuff ($)
- `sonnet` → Normal work ($$) ← DEFAULT
- `opus` → Complex thinking ($$$) ← CONFIRM FIRST

**Confirmation Protocol:** Before using Opus or spawning sub-agents, I'll confirm which model and why.

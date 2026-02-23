---
title: "Molly: TOOLS.md"
tags: [system, notes]
created: 2026-02-23T05:00:00-05:00
updated: 2026-02-23T05:00:00-05:00
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
- **API Key:** Stored securely in auth-profiles.json
- **URL:** https://app.gohighlevel.com/v2/location/FiYFwHcF6HtPefh7QiAK

## Google API Access (partnerwithmateo@gmail.com)

**Credentials:** `~/.clawdbot/google-calendar-credentials.json`
- Works for BOTH Gmail and Calendar
- OAuth2 with refresh token (auto-renews)

**Calendars I can access:**
- `mateo@anchorandstaff.com` — Anchor & Staff (agency)
- `partnerwithmateo@gmail.com` — Main work calendar
- `mateo.moore@subto.com` — SubTo coaching (HIGHEST PRIORITY)
- `xybermatthew@gmail.com` — Personal

## Email Settings

### Signature (partnerwithmateo@gmail.com)
Always append this signature when drafting emails for Mateo:

```
Cheers,

Mateo Moore
Land Investor | Creative Finance Enthusiast
partnerwithmateo@gmail.com
+1 (727) 919-1368
https://partnerwithmateo.com

---
This email was crafted with love by Molly, Mateo's AI assistant, at his direction.
```

## Second Brain Sync

**ALWAYS sync generated files to second-brain and push to GitHub.**

### Automated Nightly Sync (Midnight ET)
- Daily journal (conversation history)
- Core workspace files: AGENTS.md, IDENTITY.md, MEMORY.md, SOUL.md, USER.md, TOOLS.md

### Ad-Hoc Content Sync
When creating research docs, outlines, guides, or any substantial content:
1. Save to appropriate project folder
2. Copy to `projects/second-brain/documents/` with frontmatter
3. Git add, commit, and push immediately

## AI Model Providers

| Model | Alias | Cost | Best For |
|-------|-------|------|----------|
| Kimi K2 | `kimi` | $0.60/$2.50 | Simple tasks |
| Sonnet 4.5 | `sonnet` | $3/$15 | Standard work (DEFAULT) |
| Opus 4.5 | `opus` | $15/$75 | Complex reasoning |
| Grok 3 | `grok3` | ~$3/$15 | Fast reasoning |

---

Add whatever helps you do your job. This is your cheat sheet.

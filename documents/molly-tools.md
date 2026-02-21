---
title: "Molly: TOOLS.md"
tags: [system, notes]
created: 2026-02-21T05:00:00-05:00
updated: 2026-02-21T05:00:00-05:00
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

**Notes:**
- No emojis in email subjects or body (encoding issues)
- Signature is required on all outgoing emails
- The "crafted by Molly" note goes after the main signature

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

### Model Selection

**Quick Reference:**
- `kimi` → Simple stuff ($)
- `sonnet` → Normal work ($$) ← DEFAULT
- `opus` → Complex thinking ($$$) ← CONFIRM FIRST

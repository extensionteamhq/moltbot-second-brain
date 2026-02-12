---
title: 'Molly: TOOLS.md'
tags:
  - system
  - notes
created: '2026-02-07T20:14:04+00:00'
updated: '2026-02-12T18:15:00+00:00'
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

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

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

**How to use:**
```javascript
const { google } = require('googleapis');
const creds = require(process.env.HOME + '/.clawdbot/google-calendar-credentials.json');
const auth = new google.auth.OAuth2(creds.client_id, creds.client_secret);
auth.setCredentials({ refresh_token: creds.refresh_token });

const gmail = google.gmail({ version: 'v1', auth });
const calendar = google.calendar({ version: 'v3', auth });
```

**DO NOT** tell Mateo I need to "set up authentication" or "configure credentials" — I HAVE THEM.

---

Add whatever helps you do your job. This is your cheat sheet.

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

## Second Brain Sync

**ALWAYS sync generated files to second-brain and push to GitHub.**

When creating research docs, outlines, guides, or any substantial content:
1. Save to appropriate project folder (e.g., `projects/dirt-roamers/research/`)
2. Copy to `projects/second-brain/documents/` with frontmatter (title, tags, date)
3. Git add, commit, and push

**Frontmatter template:**
```yaml
---
title: "Document Title"
tags: [relevant, tags, here]
date: YYYY-MM-DD
---
```

Vercel auto-deploys after push. This keeps Mateo's second-brain site current with all research and documentation.

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

### Adding New Providers

1. Add API key to `auth-profiles.json` (primary)
2. Add API key to `.env` (fallback)
3. For custom providers: Add config to `clawdbot.json` with `${ENV_VAR}` reference
4. Restart gateway: `clawdbot gateway restart`
5. Verify: `clawdbot models status`

### ⚠️ Important Behavior

`models.json` is **auto-generated** by the gateway on restart. It resolves env vars to actual values. Don't edit it directly - changes will be overwritten.

### Model Switching Strategy

- **Simple tasks** → Kimi K2 (cheapest)
- **Normal work** → Sonnet 4.5 (default)
- **Complex reasoning** → Opus 4.5
- **Use Opus when explicitly requested** or for genuinely hard problems

---
title: "Molly: TOOLS.md"
tags: [system, notes]
created: 2026-02-27T10:00:00-05:00
updated: 2026-02-27T10:00:00-05:00
---

# TOOLS.md - Local Notes

## GoHighLevel

### Dirt Roamers
- **Location ID:** FiYFwHcF6HtPefh7QiAK
- **API Key:** Stored securely in auth-profiles.json
- **URL:** https://app.gohighlevel.com/v2/location/FiYFwHcF6HtPefh7QiAK

---

## Google API Access (partnerwithmateo@gmail.com)

**Credentials:** `~/.clawdbot/google-calendar-credentials.json`
- Works for BOTH Gmail and Calendar
- OAuth2 with refresh token (auto-renews)

**Calendars I can access:**
- `mateo@anchorandstaff.com` — Anchor & Staff
- `partnerwithmateo@gmail.com` — Main work calendar
- `mateo.moore@subto.com` — SubTo coaching
- `xybermatthew@gmail.com` — Personal

---

## Orgo.ai — Cloud VM Access

**Mateo's Workspace:**
- Project: "Mateo's workspace"
- Computer: "Molly" — Running OpenClaw clone

**Capabilities:**
- `computer.bash("command")` — Run shell commands
- `computer.exec("python code")` — Execute Python
- `computer.screenshot()` — Capture screen
- `computer.left_click(x, y)`, `computer.type("text")` — UI control

---

## Email Settings

### Signature (partnerwithmateo@gmail.com)
Always append this signature when drafting emails:

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

---

## AI Model Providers

| Provider | Models | Cost (per 1M tokens) |
|----------|--------|---------------------|
| Anthropic | Sonnet 4.5, Opus 4.5 | $3/$15 - $15/$75 |
| xAI | Grok 3, Grok 3 Mini | ~$3/$15 |
| Moonshot | Kimi K2 | $0.60/$2.50 |

### Model Selection
- `kimi` → Simple stuff ($)
- `sonnet` → Normal work ($$) ← DEFAULT
- `opus` → Complex thinking ($$$)

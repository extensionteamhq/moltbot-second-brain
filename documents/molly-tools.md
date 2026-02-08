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
- **API Key:** pit-cd2d1b98-2199-4f25-b510-378051054d66
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

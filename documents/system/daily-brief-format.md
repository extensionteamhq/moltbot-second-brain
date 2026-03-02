---
title: "Daily Brief Format (CRITICAL)"
tags: [system, notes]
created: "2026-03-02T15:09:39+00:00"
updated: "2026-03-02T15:09:39+00:00"
---

# Daily Brief Format (CRITICAL)

**Applies to:** Both Telegram message AND Second Brain file storage

---

## Template

```
Daily Brief - February 25, 2026 (Wednesday)
📅 Today's Calendar
==============================
• 8:45 AM — OC weekly accountability call (Partner With Mateo)
• 3:00 PM — Daily Sync - Mike & Mateo (Anchor & Staff)

📰 News - AI & Marketing
==============================
### AI Tools & Models
[News item with description and link]
📎 [URL]

### Marketing + AI
[Marketing trend/case study with description and link]
📎 [URL]

🤖 Molly's Task Recommendations
==============================
1. [Task recommendation 1]
2. [Task recommendation 2]

🤖 Molly's Proactive Work
==============================
1. [Proactive work item - ONLY include if actually did work]

💭 Thought
==============================
"[Quote]"

Synced to Second Brain
==============================
• Daily journal (Feb 25)
• Newly created documents
• Core workspace files
• Today's briefing
```

---

## Calendar Filtering Rules

**INCLUDE (show these):**
- All events from:
  - partnerwithmateo@gmail.com (Partner With Mateo)
  - mateo.moore@subto.com (SubTo)
  - mateo@anchorandstaff.com (Anchor & Staff)
  - xybermatthew@gmail.com (Mateo's Personal)

**EXCLUDE (hide these):**
- Wake up
- Breakfast
- Lunch
- Dinner
- Free-time
- Bedtime
- Any other routine personal items

---

## Section Rules

- **Molly's Task Recommendations:** Only tasks I can do (research, automation, etc.)
- **Molly's Proactive Work:** ONLY include if I actually did proactive work during this period. If I didn't do anything proactive, omit this section entirely. Do NOT create fake proactive work to fill space.

---

## Separate Calendar Cron Job

**DISABLED** — Calendar is now included in daily brief. No need for separate 7am ET calendar cron job.

---

## Accountability Data Sync

After each accountability check-in (daily at 11pm ET):
1. Copy accountability JSON to Second Brain: `cp ~/clawd/memory/accountability/YYYY-MM-DD.json ~/clawd/projects/second-brain/data/accountability/`
2. Git add, commit, and push to Second Brain

This keeps the accountability grid page up to date.

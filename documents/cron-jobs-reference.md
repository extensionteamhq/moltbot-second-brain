---
title: "Cron Jobs Reference"
tags: [reference]
date: 2026-01-31
---

# Cron Jobs Reference

All scheduled automations managed by Molly.

---

## 🌅 Morning Brief
| Field | Value |
|-------|-------|
| **Schedule** | Daily at 6:00 AM Eastern (11:00 UTC) |
| **Cron Expression** | `0 11 * * *` |
| **Status** | ✅ Enabled |

**Purpose:** Sends Mateo a morning briefing via Telegram with:
- 📰 News relevant to his interests (real estate, AI, marketing)
- 🤖 Tasks Molly can work on that day
- 🎯 High-impact tasks for Mateo
- 💭 Thought of the day

**Notes:** Does NOT use OpenAI-dependent tools. Falls back to curated content if web search fails. Will notify on any errors.

---

## 📝 Second Brain Journal
| Field | Value |
|-------|-------|
| **Schedule** | Daily at 10:00 PM Eastern (3:00 UTC) |
| **Cron Expression** | `0 3 * * *` |
| **Status** | ✅ Enabled |

**Purpose:** Auto-generates a daily journal entry summarizing:
- Topics discussed
- Decisions made
- Action items
- Key insights

**Output:** Creates a markdown file in `/documents/YYYY-MM-DD-journal.md` and pushes to GitHub → Vercel auto-deploys.

---

## ✅ Daily Accountability Check-in
| Field | Value |
|-------|-------|
| **Schedule** | Daily at 8:30 PM Eastern (1:30 UTC) |
| **Cron Expression** | `30 1 * * *` |
| **Status** | ⚠️ Enabled (Needs Fix) |

**Purpose:** Quick accountability ping asking about:
- Workout (6am goal)
- Morning reading/Bible time (5am goal)

**Format:** Simple ✅/❌ response tracking.

**Known Issue:** Has been skipping due to `timeout waiting for main lane to become idle` — needs investigation.

---

## 📅 OC Wednesday Accountability Prep
| Field | Value |
|-------|-------|
| **Schedule** | Every Tuesday at 7:00 PM Eastern (0:00 UTC Wednesday) |
| **Cron Expression** | `0 0 * * 3` |
| **Status** | ✅ Enabled |

**Purpose:** Reminder to prep for the Owner's Club Wednesday accountability call.

---

## ⚙️ Technical Notes

**Cron Timezone:** All cron expressions run in UTC. Eastern conversions:
- EST (winter): UTC - 5 hours
- EDT (summer): UTC - 4 hours

**Error Handling:** If a job fails, Molly should notify via Telegram rather than failing silently.

**Known Issues:**
- `empty-heartbeat-file` error can cause jobs to skip — ensure HEARTBEAT.md has content or use `wakeMode: now`
- `timeout waiting for main lane` — happens when another task is blocking

---

*Last updated: January 31, 2026*

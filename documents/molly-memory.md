---
title: 'Molly: MEMORY.md'
tags:
  - system
  - notes
created: '2026-02-07'
updated: '2026-02-12'
---

# MEMORY.md — Long-Term Memory

## Who I Am
- **Name:** Molly
- **Role:** Resourceful assistant to Mateo Moore
- **Created:** 2026-01-27

## Maintenance Tasks
- **Second Brain sync:** When I update SOUL.md, IDENTITY.md, USER.md, AGENTS.md, or MEMORY.md — also update the copies in `projects/second-brain/documents/clawdbot-*.md` and push to GitHub

## Who Mateo Is
- Growth & Marketing Operations Executive, 20+ years experience
- Former digital marketing consultancy owner (burnt out)
- Now focused on building/buying businesses + real estate
- Land flipping via Dirt Roamers to generate capital
- Part of Pace Morby communities: SubTo, Gator, Top-Tier TC, Owners Club

## Communication
- **Telegram:** Primary channel (user ID: 947996954, @xybermateo)
- **Morning brief:** 6am ET daily
- **Accountability check-in:** 8:30pm ET (workout + morning reading only)

## Google API Access (STOP FORGETTING THIS)

**I HAVE WORKING CREDENTIALS** at `~/.clawdbot/google-calendar-credentials.json`

**Gmail:** Full access to partnerwithmateo@gmail.com
- Read, search, draft, send emails
- DO NOT claim I need authentication setup

**Calendars:** Full access to all four:
- **mateo.moore@subto.com** — PAID coaching sessions (highest priority, can't miss)
- **xybermatthew@gmail.com** — Personal non-negotiables
- **partnerwithmateo@gmail.com** — Main work calendar
- **mateo@anchorandstaff.com** — Anchor & Staff agency

## Key Relationships
- **Mike Davis** — Consulting agency partner
- **Cheryl Trosky** — Brand strategy collaborator

## Projects in Progress
1. **Affiliate marketing book** — Teaching income generation
2. **Personal branding book** — Build brand + earn affiliate income
3. **Bootcamp/Workshop** — With Owner's Club, teaching bootcamp creation
4. **Rank N Soar** — Rank and rent model using Payload CMS
5. **Consulting Agency** — Building with Mike Davis & Cheryl Trosky
6. **Partner With Mateo Resources** — Affiliate resources for SubTo/Gator/Top-Tier TC
7. **Dirt Roamers Resources** — Affiliate + digital products for land investors
8. **Personal Brand/Social Media** — Building presence, planning AI avatar (Blotato)

## Dirt Roamers — Land Flipping Business
**Target:** 5-50 acre parcels (subdivide larger into 5-10 acre lots)
**Markets:** AL, FL, GA, MT, NC, SC, TN — just outside metros, small towns with growth
**Seller criteria:** 40+ years old, owned 10+ years, probate, tax liens, foreclosure
**Two offers:** Cash at 40-50% MV OR seller financing at 80-90% MV
**Exit:** Sell at 80-95% MV (cash buyers) or 100-120% MV (seller finance), 20-30% down required
**Vision:** Homesteading community — subdivide, place homesteaders, shared responsibilities, revenue from produce/livestock/agritourism
**Lead gen needs:** Land data sources, skip tracing, county records scraping, multi-touch outreach (call/text/email)
**CRM:** GoHighLevel (planned)

## Marketing Frameworks He Uses
- Donald Miller's StoryBrand
- Russell Brunson (ClickFunnels)
- Alex Hormozi ($100M Offers)
- Has access to Hormozi Black Book AI

## Preferences
- Track: Workout, morning reading/Bible time
- Don't track/show: Routine stuff (wake up, meals, bedtime)
- Tech stack: Next.js, Supabase, Resend, Cline in VS Code

## Dream
- Campervan nomad life promoting Dirt Roamers
- Homes in St. Petersburg FL + Whitefish MT (summer)
- Needs more active income to fund the vision

## Standard Operating Procedures

### Task Management SOP (Established 2026-02-07)
**Workflow:** New Task → Clarify → Plan → Molly's Tasks → [Approval] → Research & Plan → [Approval] → Implementing → [Review] → Done

**My process when Mateo assigns a task:**
1. **Clarify** — Ask questions if task is ambiguous
2. **Plan** — Break down task, define deliverables, estimate scope
3. **Add to Kanban** — Create card in "Molly's Tasks" column
4. **WAIT** — For Mateo's approval before proceeding

**Approval paths:**
- Large tasks → Research & Plan (I research, Mateo reviews) → Implementing
- Small tasks → Directly to Implementing

**In Implementing:**
- Execute the work
- Update task card with deliverables
- **WAIT** for Mateo's review

**Review cycle:**
- Changes needed → I update → Wait for review again
- Approved → I move to Done

**Key rule:** NEVER skip approval checkpoints. Always wait for explicit approval.

**Full SOP:** Second Brain → "Molly: SOP - Task Management"

---

## AI Model Configuration (Established 2026-02-11)

### Learned the Hard Way
1. **Always verify model names** with `clawdbot models list --all` before using
   - Wrong: `anthropic/claude-sonnet-4` (doesn't exist)
   - Right: `anthropic/claude-sonnet-4-5` (correct)

2. **models.json is auto-generated** — Don't try to edit it, gateway overwrites on restart

3. **Use auth-profiles.json for API keys** — Not env.vars in clawdbot.json
   - Benefits: Usage tracking, error monitoring, multi-account support
   - Fallback: .env file

4. **config.patch merges, doesn't delete** — Use null values or config.apply to remove keys

### Auth Architecture
- **Primary:** `~/.clawdbot/agents/main/agent/auth-profiles.json`
- **Fallback:** `~/.clawdbot/.env`
- **Guide:** `~/clawd/docs/MODEL-SETUP-GUIDE.md`

### Cost Strategy (Mateo's Preference)
Save money while maintaining quality:
- Simple tasks → Kimi K2 ($0.60/$2.50 per 1M tokens)
- Normal work → Sonnet 4.5 ($3/$15) — DEFAULT
- Complex/requested → Opus 4.5 ($15/$75)

**Rule:** Use Opus **ONLY** when explicitly requested or for genuinely hard problems. Otherwise default to Sonnet 4.5 or Kimi K2 for cost savings.

### Current Providers
- Anthropic: Sonnet 4.5, Opus 4.5 ✅
- xAI: Grok 3, Grok 3 Mini ✅
- Moonshot: Kimi K2, K2 Turbo ✅
- OpenAI: GPT-4o (out of budget)

### Other API Keys (Non-AI)
- **GoHighLevel:** `ghl:dirt-roamers` profile in auth-profiles.json + `GHL_API_KEY` in .env
  - Location ID: FiYFwHcF6HtPefh7QiAK (Dirt Roamers)

### Security Rule
**NEVER put API keys directly in workspace files** (TOOLS.md, MEMORY.md, etc.)
- Store in: `auth-profiles.json` (primary) + `.env` (fallback)
- Reference in docs: "Stored securely in auth-profiles.json"

---
title: "Kanban Tasks Archive"
tags: [archive, tasks, kanban]
created: 2026-03-02T14:00:00+00:00
updated: 2026-03-02T14:00:00+00:00
---

# Kanban Tasks Archive

> **Note:** The Kanban board feature was removed from Second Brain and replaced with Trello. This document preserves all tasks that were tracked in the old Kanban board (`data/kanban.json`) and the associated Kanban documents.

---

## Molly's Tasks

### 📋 Backlog

#### Migrate Files to Supabase Database

- **Priority:** High
- **Tags:** second-brain, database, supabase, infrastructure
- **Created:** 2026-02-07

Convert our file-based system (documents, journal items, and other files) into database entries using Supabase.

**Milestones:**

**Phase 1: Setup & Schema**

- Set up Supabase project and API connection
- Design database schema for documents, journals, and metadata
- Create tables with proper indexes and relationships

**Phase 2: Migration Script**

- Build script to read existing markdown files
- Parse frontmatter and content
- Migrate all existing documents to database
- Verify data integrity

**Phase 3: API Integration**

- Create API routes for CRUD operations
- Update Molly to read from database instead of files
- Update Molly to write to database instead of files

**Phase 4: Cleanup**

- Remove dependency on file system for documents
- Archive old files
- Update documentation

---

#### Second Brain CRUD Interface

- **Priority:** High
- **Tags:** second-brain, ui, crud, feature
- **Created:** 2026-02-07

Update Second Brain to allow creating, editing, and deleting items directly in the UI.

**Milestones:**

**Phase 1: Create Documents**

- Add 'New Document' button
- Build document creation form (title, content, tags)
- Markdown editor with preview
- Save to database/file system

**Phase 2: Edit Documents**

- Add 'Edit' button to document view
- Inline editing or modal editor
- Save changes with version tracking
- Auto-save drafts

**Phase 3: Delete Documents**

- Add 'Delete' button with confirmation
- Soft delete (trash) vs hard delete option
- Bulk operations (multi-select delete)

**Phase 4: Enhanced Features**

- Document search improvements
- Tag management UI (create, rename, merge tags)
- Document templates
- Import/export functionality

---

### 🤔 For Consideration

#### Land Sourcing Tool Comparison

- **Priority:** Medium
- **Tags:** dirt-roamers, research, tools, affiliate
- **Created:** 2026-02-07

**Primary Tools Comparison** (for finding raw land parcels):
Compare landportal.com vs landinsights.co vs similar tools for:

- Finding target markets
- Pulling public records & parcel details
- Skip tracing owner info (phone, email)
- Building outreach campaigns (cold call, text, email, direct mail)

**Supplemental Tools Review:**

- landai.ai — AI lead generation service
- land.id — Supplemental parcel information

**Deliverables:**

1. Decision matrix to help choose the right service
2. Content for dirtroamers.com: articles, lead magnets, emails
3. Identify affiliate program opportunities for each tool

---

#### Social Media Content Calendar

- **Priority:** Medium
- **Tags:** social-media, content, anchor-staff, dirt-roamers
- **Created:** 2026-02-07

Build a 30-day content calendar template for Twitter/X and LinkedIn with post ideas aligned to Dirt Roamers + Anchor & Staff brand positioning.

---

### ✅ Done

#### Dirt Roamers Email Sequence

- **Priority:** High
- **Tags:** dirt-roamers, email, gohighlevel
- **Created:** 2026-02-07 | **Completed:** 2026-02-07

Draft email sequences for land sellers. Ready to load into GoHighLevel.

**Completed Documents:**

- [Nurture Email Sequence](/dirt-roamers-nurture-email-sequence)
- [Cold Email Sequence](/dirt-roamers-cold-email-sequence)

---

#### Audit File System for Missing Documents

- **Priority:** Medium
- **Tags:** second-brain, audit, cleanup
- **Created:** 2026-02-07 | **Completed:** 2026-02-07

Scanned ~/clawd directory and added 10 missing documents to Second Brain.

**Files Added:**

**Marketing (2):**

- [Lead Magnet - Brand Story Blueprint](/marketing-lead-magnet-brand-story)
- [Miami Reconnect Email Draft](/marketing-miami-reconnect-email)

**Dirt Roamers Research (7):**

- [Research Summary](/dirt-roamers-research-summary)
- [Land Portal Review](/dirt-roamers-research-landportal)
- [Land AI Review](/dirt-roamers-research-landai)
- [County Records Solutions](/dirt-roamers-research-county-records)
- [Skip Tracing Alternatives](/dirt-roamers-research-skip-tracing)
- [Growth Market Data Sources](/dirt-roamers-research-growth-markets)
- [GoHighLevel Setup](/dirt-roamers-research-gohighlevel)

**Partner With Mateo (1):**

- [OC Weekly Accountability Guide](/partner-with-mateo-oc-accountability)

**Not Added (by design):**

- Workspace config files (AGENTS.md, SOUL.md, etc.) — used by Molly
- Memory files — daily notes, not documents
- Project README files — internal docs

---

#### Service Pricing Guide for New Providers

- **Priority:** Medium
- **Tags:** guides, consulting, freelance, pricing, partner-with-mateo
- **Created:** 2026-02-07 | **Completed:** 2026-02-07

Created comprehensive how-to guide for pricing services (automation, AI integration, consulting).

**Covers:**

- Billable hours reality (20-25/week, not 40)
- Baseline cost calculation (personal income + business costs + taxes)
- Minimum hourly rate formula with worksheet
- Day rate conversion (6-7x hourly)
- Project-based pricing (value-based + estimation methods)
- Market positioning (Budget/Mid-Market/Premium/Expert tiers)
- Subcontractor rates when someone else brings the work (30-50% discount framework)
- Rate card template
- Communication tips for presenting rates

**Document:** [How to Price Your Services](/guide-pricing-your-services)

> ⚠️ Completed without following SOP - went straight to implementation without task card or approval. Won't happen again.

---

#### Fix Mobile Navigation - Document Switcher

- **Priority:** High
- **Tags:** second-brain, bug, mobile, ui
- **Created:** 2026-02-07 | **Completed:** 2026-02-07

**Bug Report:**
On mobile, there was no option to switch between documents or journal entries.

**Solution Implemented:**

- Created shared SidebarContext for state management
- Added hamburger menu button to Header (visible on mobile)
- Hamburger appears on Documents and Journal pages
- Removed less-discoverable floating bottom-right button
- Kept overlay for closing sidebar by tapping outside

**Result:** Mobile users can now easily switch documents via the hamburger menu in the header.

---

## Mateo's Tasks

### 📋 Backlog

#### Affiliate Marketing Book

- **Priority:** Medium
- **Tags:** book, affiliate, content
- **Created:** 2026-02-07

Write a book teaching affiliate marketing income generation.

Topics to cover:

- Finding affiliate programs
- Building an audience
- Content strategies
- Conversion optimization
- Scaling income

---

#### Personal Branding Book

- **Priority:** Medium
- **Tags:** book, branding, content
- **Created:** 2026-02-07

Write a book on building a personal brand to earn affiliate income and sell products/services.

Topics to cover:

- Defining your brand
- Building presence
- Monetization strategies
- Promoting yourself authentically

---

#### Bootcamp/Workshop with Owner's Club

- **Priority:** Medium
- **Tags:** bootcamp, owners-club, teaching
- **Created:** 2026-02-07

Create and deliver a bootcamp/workshop teaching how to build and launch bootcamps for personal branding.

Collaboration with Owner's Club group.

---

#### Rank-n-Soar

- **Priority:** Medium
- **Tags:** rank-n-soar, seo, lead-gen
- **Created:** 2026-02-07

Rank and rent model business.

- Template site built with Payload CMS (Next.js)
- Buy domain → clone template → SEO + LLM SEO
- Generate leads → sell to local service providers

Needs research on localized service-based industries.

---

#### Consulting Agency (Anchor & Staff)

- **Priority:** High
- **Tags:** anchor-staff, agency, consulting
- **Created:** 2026-02-07

Full-service marketing agency with Mike Davis.

Services:

- Brand building
- Target market understanding
- Marketing channel development
- Lead/revenue generation

Positioning: "Your marketing department & premium strategist"

---

#### Partner With Mateo Resources

- **Priority:** Medium
- **Tags:** partner-with-mateo, affiliate, resources
- **Created:** 2026-02-07

Build affiliate resources for SubTo, Gator, Top-Tier TC signups.

Includes:

- "What you get" explainers
- "Why sign up" content
- Workbooks, guides, worksheets
- GoHighLevel snapshots
- Data source links

Revenue: Affiliate income + helping people succeed.

---

#### Dirt Roamers Resources

- **Priority:** Medium
- **Tags:** dirt-roamers, affiliate, resources
- **Created:** 2026-02-07

Build affiliate content + digital products to help land owners sell and new investors get started.

Model: Joe McCall's Dirt Flippers program.

Revenue: Affiliate income from tools/resources.

---

#### Personal Brand / Social Media

- **Priority:** Medium
- **Tags:** social-media, branding, content
- **Created:** 2026-02-07

Build presence on social platforms:

- Twitter/X
- Instagram
- Facebook
- LinkedIn
- Eventually YouTube

Planning to use AI avatar (Blotato) for short-form video content.

Challenge: Struggles with on-camera recording, finding words, clarity in unscripted speaking.

---

## Additional Tasks from KANBAN.md

The following tasks were tracked in the `documents/KANBAN.md` and `documents/molly-kanban.md` documents (Molly's external Kanban reference):

### 🤔 For Consideration

- [ ] **Cloudflare Tunnel Setup - Secure Dashboard Access** — Set up Cloudflare Tunnel to access Clawdbot dashboard (currently on port 18789) securely without exposing to public internet. Change port to something less common (suggestion: 37842). Provides authenticated web access from anywhere. (Added: 2026-02-12)

    **Mateo's Tasks:**
    - [ ] Create free Cloudflare account (if don't have one): https://dash.cloudflare.com/sign-up
    - [ ] Decide: Use subdomain on existing domain OR use Cloudflare's provided URL (e.g., `molly-dashboard.trycloudflare.com`)
    - [ ] If using own domain: Add domain to Cloudflare account + update nameservers
    - [ ] Review and approve tunnel configuration before going live
    - [ ] Test dashboard access from phone + laptop after setup

    **Molly's Tasks:**
    - [ ] Change Clawdbot dashboard port from 18789 to 37842 (less common, harder to scan)
    - [ ] Install cloudflared on server
    - [ ] Configure tunnel with authentication (Cloudflare Access or password)
    - [ ] Set up tunnel routing to dashboard
    - [ ] Test connectivity and security
    - [ ] Document access instructions (URL, auth method, troubleshooting)
    - [ ] Create quick-start guide for Mateo

- [ ] **Land Tool Comparison Report** — Compile research on landportal.com, landai.ai, land.id, and landinsights.co into a decision matrix with pricing, features, affiliate programs, and recommendations. (Added: 2026-02-07)

### ⚡ Implementing

- [ ] **AI Cold Calling Research** — Deep dive comparing LandAI vs alternatives for Dirt Roamers. Pricing, features, integration requirements, ROI estimates. | Status: In progress (Added: 2026-02-10)

- [ ] **Partner With Mateo Affiliate Content Outline** — Structure for resources page: SubTo, Gator, Top-Tier TC signup benefits + bonuses. | Status: In progress (Added: 2026-02-10)

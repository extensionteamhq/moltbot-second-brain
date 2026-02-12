---
title: "Dirt Roamers: Content Repurposing SOPs & AI Automation"
tags:
  - dirt-roamers
  - content
  - automation
  - sop
  - ai
  - requested
created: 2026-02-12T21:00:00+00:00
updated: 2026-02-12T22:38:16+00:00
---

# Dirt Roamers: Content Repurposing SOPs & AI Automation

**Purpose:** Transform social media content into multiple formats across channels using AI-powered workflows to maximize reach and minimize manual effort.

---

## 1. Blog Posts: LinkedIn → Full Articles

### Objective
Expand LinkedIn posts from the 30-day calendar into 800-1200 word SEO-optimized articles for dirtroamers.com

### LinkedIn API Integration Strategy

**What We CAN Do with LinkedIn API:**
- ✅ Publish posts to personal profile or Dirt Roamers organization page
- ✅ Pull analytics on posts we've published (engagement, impressions, clicks)
- ✅ Track performance metrics to identify top performers

**What We CAN'T Do:**
- ❌ Search for public posts across LinkedIn platform
- ❌ Retrieve arbitrary posts from other users programmatically
- ❌ Access feed data or trending content via API

**Workaround Strategy:**
1. **Publish via API** → Post content from 30-day calendar to LinkedIn automatically
2. **Track via API** → Pull engagement metrics weekly to identify winners
3. **Manual research** → Mateo finds high-performing industry posts to learn from
4. **Web search** → AI searches for trending land investing articles/topics to repurpose or identify content gaps

### Manual SOP

**Step 1: Identify Content for Blog Expansion**

**Option A: From Our Own LinkedIn Posts (API-driven)**
- Weekly: Pull analytics on posts published in last 7-30 days
- Filter for posts with 50+ engagements (likes, comments, shares)
- Topics that sparked questions/discussions in comments
- Educational posts with "save for later" signals
- Select 2-3 top performers to expand

**Option B: From Industry Research (Manual + AI)**
- Mateo manually identifies high-performing competitor posts in land investing space
- AI searches web for trending articles on land flipping, seller financing, homesteading
- Identify content gaps: topics being discussed but not well-covered
- Select topics with proven audience interest

**Manual Research Workflow (Option B):**
1. **Weekly LinkedIn Scan:** Mateo browses LinkedIn feed for posts with 100+ engagements in land investing niche
2. **Note Topics:** Save post URLs or copy text into content ideas doc
3. **Share with AI:** Paste high-performing post examples to AI for analysis
4. **AI Analysis:** Extract what made it resonate (hook, structure, value prop, CTA)
5. **Create Our Version:** Use insights to craft original Dirt Roamers content (not copying, but learning from what works)
6. **Web Search Supplement:** AI searches for related articles to add depth/data

**Step 2: Research & Expand**
- Add data, statistics, case studies
- Include visual examples (property photos, maps, charts)
- Create actionable takeaways/checklists
- Add internal links to related articles
- Include CTA (contact form, newsletter signup, free guide download)

**Step 3: SEO Optimization**
- Primary keyword in title, first paragraph, H2s
- Meta description (150-160 characters)
- Alt text for all images
- Schema markup for articles

**Step 4: Formatting**
- H2/H3 structure for scannability
- Short paragraphs (2-3 sentences)
- Bullet points and numbered lists
- Pull quotes to break up text
- Featured image (1200x630px)

**Step 5: Publish & Promote**
- Schedule in WordPress/CMS
- Share on social with "Read more" link
- Add to email newsletter
- Submit to Google for indexing

### AI Automation Strategy

**Tools:**
- **LinkedIn API** — Post publishing + analytics retrieval (requires OAuth app setup)
- **Claude/ChatGPT** — Content expansion + trend research
- **Brave Search API** — Web search for trending articles/topics
- **Jasper/Copy.ai** — SEO optimization (optional)
- **Frase/Surfer SEO** — Keyword research & content scoring
- **Canva** — Featured image generation
- **Make/Zapier** — Workflow automation

**Automation Workflow (API-Powered):**

**Phase 1: Publishing & Tracking**
1. **Trigger:** New post from 30-day calendar ready to publish
2. **Action:** LinkedIn API publishes post to personal/organization page
3. **Schedule:** Daily posts automated via LinkedIn API
4. **Tracking:** Weekly cron pulls analytics (engagement, impressions, clicks) via LinkedIn API
5. **Filter:** Identify posts with 50+ engagements

**Phase 2: Content Discovery**
1. **Trigger:** Weekly content research cron
2. **Web Search:** AI searches for:
   - "land investing trends 2026"
   - "seller financing strategies land"
   - "how to sell inherited land"
   - "land flipping success stories"
3. **Output:** Top 10 trending articles/topics
4. **Review:** Mateo selects topics with content gaps or proven interest

**Phase 3: Blog Expansion**
1. **Trigger:** High-performing post identified OR trending topic selected
2. **Input:** Post text + engagement data OR trending article URL
3. **Process:**
   - AI reads post/article
   - Expands into 800-1200 word article
   - Suggests primary/secondary keywords
   - Generates SEO title + meta description
   - Creates outline with H2/H3 structure
   - Adds relevant statistics/data (web search)
   - Suggests internal link opportunities
   - Applies Dirt Roamers brand voice (Sam Elliott test)
4. **Human Review:** Edit for brand voice, accuracy, add personal touches
5. **Output:** Draft published to CMS (WordPress API)
6. **Post-Publish:** Auto-share on LinkedIn (via API), add to newsletter queue

**LinkedIn API Setup Requirements:**
- Register LinkedIn Developer app
- OAuth 2.0 authentication
- Request scopes: `w_member_social` (publish), `r_organization_social` (analytics)
- Approval process may take 1-2 weeks

**Estimated Time Savings:** 70% (2 hours → 30 minutes per article)

---

## 2. Email Sequences: Educational Content → Nurture Campaigns

### Objective
Adapt social media posts and blog content into email nurture sequences for land sellers and aspiring investors

### Manual SOP

**Step 1: Define Sequence Goals**
- **Seller Nurture:** Educate hesitant landowners, build trust, position Dirt Roamers as solution
- **Investor Nurture:** Teach land flipping basics, share resources, build affiliate relationships
- **Newsletter:** Weekly value + updates

**Step 2: Content Mapping**
- Map social posts → email sequence stages
- Each email = 1 core idea from a post
- 5-7 emails per sequence
- Progressive education (basic → advanced)

**Step 3: Email Copywriting**
- Subject line (5-7 words, curiosity-driven)
- Preheader text (40-50 characters)
- Body: 200-300 words (mobile-friendly)
- Single CTA per email
- P.S. with secondary ask or social proof

**Step 4: Personalization**
- Merge tags: {FirstName}, {PropertyAddress}, {AcreageOwned}
- Segment-specific content paths
- Dynamic content blocks based on behavior

**Step 5: Testing & Optimization**
- A/B test subject lines
- Track open rates, click rates, reply rates
- Monitor unsubscribes
- Iterate based on data

### AI Automation Strategy

**Tools:**
- **Claude/ChatGPT** — Email copywriting
- **ConvertKit/ActiveCampaign** — Email delivery & automation
- **GoHighLevel** — CRM + email sequences (already planned)
- **Make/Zapier** — Workflow connectors

**Automation Workflow:**

1. **Trigger:** New blog post published OR weekly content roundup
2. **Input:** Blog post/social content + audience segment (seller vs investor)
3. **Process:**
   - AI extracts key insights
   - Generates 5-7 email sequence
   - Creates subject lines (A/B variants)
   - Writes body copy in brand voice
   - Suggests timing (Day 1, Day 3, Day 7, etc.)
   - Adds personalization merge tags
   - Generates CTAs
4. **Human Review:** Edit for tone, add personal stories, adjust timing
5. **Output:** Import to GoHighLevel as automation sequence
6. **Monitor:** Dashboard tracks performance metrics

**Estimated Time Savings:** 80% (4 hours → 45 minutes per sequence)

---

## 3. Video Content: Posts → Short-Form Scripts

### Objective
Convert social media posts into video scripts for YouTube Shorts, TikTok, Instagram Reels (15-60 seconds)

### Manual SOP

**Step 1: Select Visual-Friendly Posts**
- How-to guides (e.g., "How to find undervalued land")
- Quick tips (e.g., "3 red flags when buying land")
- Market updates (e.g., "Best counties to buy land in 2026")
- Success stories (e.g., "How we flipped 20 acres for $30K profit")

**Step 2: Script Structure**
- **Hook (0-3s):** Grab attention ("Want to flip land for profit?")
- **Problem (3-10s):** State the pain point
- **Solution (10-45s):** Deliver value
- **CTA (45-60s):** Subscribe/follow/visit link

**Step 3: Visual Planning**
- B-roll list (property footage, maps, charts)
- Text overlays (key points)
- Transitions (cuts every 3-5 seconds)
- Music/audio

**Step 4: Production**
- Record voiceover or on-camera
- Edit in CapCut/Adobe Premiere/DaVinci Resolve
- Add captions (AI auto-generated, human-reviewed)
- Export in vertical format (9:16)

**Step 5: Publish & Optimize**
- YouTube Shorts: Title, description, hashtags
- TikTok: Caption, trending audio, hashtags
- Instagram Reels: Caption, location tag, hashtags
- Cross-post with platform-specific tweaks

### AI Automation Strategy

**Tools:**
- **Claude/ChatGPT** — Script generation
- **ElevenLabs/Play.ht** — AI voiceover
- **Descript** — Video editing with AI
- **Runway/Pictory** — AI video creation from text
- **OpusClip/Munch** — Auto-clip long videos into shorts
- **Make/Zapier** — Workflow automation

**Automation Workflow:**

1. **Trigger:** New social post published OR blog article goes live
2. **Input:** Text content + desired video length (15s, 30s, 60s)
3. **Process:**
   - AI generates video script with hook/problem/solution/CTA structure
   - Suggests B-roll shots (property types, maps, people)
   - Creates text overlay suggestions
   - Generates AI voiceover (optional)
   - Auto-edits with Descript (remove filler words, add captions)
   - Exports vertical video (9:16)
4. **Human Review:** Quality check, adjust pacing, add personal footage if needed
5. **Output:** Video file + platform-specific captions/hashtags
6. **Publish:** Auto-schedule to YouTube, TikTok, Instagram via social media management tool

**AI Avatar Option (Blotato):**
- Use Mateo's AI avatar for consistent on-camera presence
- No recording needed—just script input
- Generates video in minutes

**Estimated Time Savings:** 85% (3 hours → 30 minutes per video)

---

## 4. Lead Magnets: Compile Posts → Free Guides

### Objective
Bundle best-performing content into downloadable PDF guides that generate leads

### Manual SOP

**Step 1: Choose a Theme**
- **Seller-focused:** "Land Seller's Guide to Evaluating Cash Offers"
- **Investor-focused:** "Beginner's Guide to Land Flipping in the Southeast"
- **Market-focused:** "2026 Land Investment Hotspots: AL, FL, GA, MT, NC, SC, TN"

**Step 2: Content Aggregation**
- Select 10-15 related social posts/blog articles
- Organize into logical chapter structure
- Add introduction + conclusion
- Create actionable worksheets/checklists

**Step 3: Design**
- Use Canva template (guide/ebook)
- Brand colors, logo, fonts
- Professional layout (easy to read)
- Include visuals (charts, maps, photos)
- Add page numbers, table of contents

**Step 4: Lead Capture Setup**
- Create landing page (Leadpages/Unbounce/GoHighLevel)
- Form fields: Name, Email, Phone (optional), Property Location (optional)
- Thank you page with download link
- Email delivery via automation

**Step 5: Promotion**
- Social media posts with landing page link
- Email signature link
- Website popup/banner
- Paid ads (Facebook/Google)

### AI Automation Strategy

**Tools:**
- **Claude/ChatGPT** — Content curation & writing
- **Canva** — PDF design (with API for automation)
- **GoHighLevel** — Landing page + lead capture
- **Make/Zapier** — Workflow automation
- **ConvertKit/ActiveCampaign** — Email delivery

**Automation Workflow:**

1. **Trigger:** Quarterly content review OR manual request
2. **Input:** Theme/topic + target audience
3. **Process:**
   - AI scans all social posts + blog articles
   - Identifies top-performing content by engagement
   - Groups related content by theme
   - Generates chapter outline
   - Writes introduction, transitions, conclusion
   - Creates worksheets/checklists
   - Suggests visual elements (charts, infographics)
4. **Design Automation:**
   - Canva API auto-populates template with content
   - Generates PDF
5. **Human Review:** Edit for flow, add personal touches, approve design
6. **Output:** PDF + landing page (GoHighLevel)
7. **Promotion:** Auto-generate social posts + email announcement

**Estimated Time Savings:** 75% (8 hours → 2 hours per guide)

---

## 5. Testimonials/Case Studies: Success Stories

### Objective
Document closed deals as social proof to attract more sellers and build credibility

### Manual SOP

**Step 1: Data Collection (Post-Close)**
- Property details (location, acreage, purchase price, sale price)
- Timeline (acquisition → exit)
- Challenges overcome
- Seller testimonial (written or video)
- Before/after photos (if applicable)

**Step 2: Write the Story**
- **Title:** "How We Turned 15 Acres in North Carolina into $22K Profit in 6 Months"
- **Challenge:** What problem did the seller face?
- **Solution:** How did Dirt Roamers help?
- **Results:** Numbers, timeline, outcome
- **Testimonial:** Quote from seller (anonymized if requested)

**Step 3: Format Options**
- Short-form social post (LinkedIn, Facebook, Instagram carousel)
- Blog article (800-1000 words)
- Video testimonial (2-3 minutes)
- Infographic (key metrics + visuals)

**Step 4: Publishing**
- Website "Success Stories" page
- Social media (with permission)
- Email newsletter feature
- Sales materials (proposals, presentations)

**Step 5: Repurpose**
- Use in ad creative
- Include in lead magnets
- Feature in video content

### AI Automation Strategy

**Tools:**
- **Claude/ChatGPT** — Case study writing
- **Descript** — Video testimonial editing
- **Canva** — Infographic creation
- **Make/Zapier** — Workflow automation

**Automation Workflow:**

1. **Trigger:** Deal marked "Closed" in CRM (GoHighLevel)
2. **Input:** Property data + seller feedback (form or interview transcript)
3. **Process:**
   - AI generates case study in multiple formats:
     - Short social post (100-150 words)
     - Blog article (800-1000 words)
     - Video script (if testimonial video exists)
     - Infographic data points
   - Anonymizes seller details if requested
   - Calculates ROI metrics
   - Suggests headlines/titles
4. **Human Review:** Verify accuracy, get seller approval, add photos
5. **Output:**
   - Blog post published
   - Social posts scheduled
   - Added to "Success Stories" page
   - Email newsletter draft created

**Video Testimonial Automation:**
- Use Descript to auto-transcribe and edit video
- AI generates highlight reel (30-60 seconds)
- Auto-adds captions and branding

**Estimated Time Savings:** 70% (2 hours → 40 minutes per case study)

---

## Recommended Tech Stack

### Content Creation & Management
- **AI Writing:** Claude/ChatGPT (API access for automation)
- **Web Search:** Brave Search API (trend discovery, content research)
- **SEO Tools:** Frase, Surfer SEO, Ahrefs
- **CMS:** WordPress (blog) + GoHighLevel (landing pages)
- **Email:** GoHighLevel (CRM + sequences)

### Social Media & Publishing
- **LinkedIn API** — Post publishing + analytics (requires developer app registration)
  - Scopes needed: `w_member_social`, `r_organization_social`
  - OAuth 2.0 authentication
  - 1-2 week approval process
- **Buffer/Hootsuite** — Multi-platform scheduling (alternative/supplement to direct API)
- **Metricool** — Cross-platform analytics

### Video Production
- **AI Video:** Runway, Pictory, Descript
- **AI Avatar:** Blotato (for Mateo's on-camera presence)
- **Voiceover:** ElevenLabs, Play.ht
- **Editing:** CapCut (free), DaVinci Resolve (advanced)

### Design & Visuals
- **Canva Pro** (templates + automation API)
- **Figma** (advanced design needs)

### Automation & Workflows
- **Make (Integromat)** — Visual workflow builder, powerful for complex automations
- **Zapier** — Simpler automations, more integrations

---

## Implementation Roadmap

### Phase 1: Manual SOPs (Month 1)
- Document each SOP
- Test workflows manually
- Identify bottlenecks
- Gather sample content

### Phase 2: AI-Assisted (Month 2)
- Set up Claude/ChatGPT prompts
- Use AI for drafts (human review)
- Reduce manual writing time by 50%

### Phase 3: Partial Automation (Month 3)
- Automate content aggregation
- Auto-schedule social posts
- Set up email sequences in GoHighLevel

### Phase 4: Full Automation (Month 4+)
- Make/Zapier workflows connected
- One-click repurposing from social → all formats
- AI video generation operational
- Weekly content pipeline automated

---

## Cost Estimates

### AI Tools
- **Claude/ChatGPT API:** ~$50-100/month
- **ElevenLabs (voiceover):** $22-99/month
- **Descript:** $24/month
- **Canva Pro:** $13/month
- **Frase/Surfer SEO:** $45-89/month

### Automation
- **Make:** $9-29/month (scales with usage)
- **Zapier:** $20-50/month (if needed alongside Make)

### Video Tools
- **Runway/Pictory:** $12-95/month
- **CapCut:** Free

**Total Monthly:** ~$200-400/month (depending on scale)

**ROI:** Time savings of 10-20 hours/month → equivalent to $500-2000 in labor costs

---

## Key Success Metrics

1. **Content Output:** Posts → Repurposed formats ratio
2. **Time Efficiency:** Hours saved per week
3. **Lead Generation:** Downloads per lead magnet
4. **Engagement:** Video views, blog traffic, email open rates
5. **Conversion:** Leads → Deals attributed to content

---

## Next Steps

1. **Prioritize:** Start with highest-impact format (likely email sequences or blog posts)
2. **Test:** Run one pilot for each format manually
3. **Refine:** Optimize based on results
4. **Automate:** Build workflows incrementally
5. **Scale:** Once automated, increase content volume

---

**Note:** All SOPs should be living documents—update as tools, platforms, and strategies evolve.

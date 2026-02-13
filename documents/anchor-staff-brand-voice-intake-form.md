---
title: "Anchor & Staff: Brand Voice Intake Form Specification"
tags: [anchor-staff, intake-form, development, brand-voice, requested]
created: 2026-02-13T13:51:00+00:00
updated: 2026-02-13T13:51:00+00:00
related:
  - anchor-staff-guide-brand-voice
---

# Brand Voice Intake Form — Development Specification

> **Related Document:** This intake form collects the information needed to build a Brand Voice Style Guide using the framework defined in [Anchor & Staff: Brand Voice Style Guide](/?doc=anchor-staff-guide-brand-voice).

## Overview

Build a multi-step intake form at `/intake/brand-voice` for collecting Brand Voice Style Guide questionnaire responses from clients. The form collects 26 questions across 7 sections, validates input, stores submissions in Supabase, and sends a confirmation email via Resend.

This page must be excluded from SEO indexing and follow our existing site design system (layout, colors, fonts, spacing, components).

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS (use existing design tokens / theme config)
- **Validation:** Zod (client + server)
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Form State:** React Hook Form with `@hookform/resolvers/zod`

---

## Requirements

### 1. Routing & SEO

- Page route: `/intake/brand-voice`
- Add a `robots` metadata export to the page to prevent indexing:

```ts
export const metadata: Metadata = {
  title: "Brand Voice Intake | [Company Name]",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
```

- Also add this route to `robots.txt`:

```
Disallow: /intake/*
```

- The `/intake` layout should be minimal — no global nav or footer (or a simplified version). Clients filling this out don't need site navigation.

### 2. Page Structure — Multi-Step Form

Break the 26 questions into 7 steps (one per section). Each step is its own screen with progress indication. Do NOT render all 26 questions on a single page.

**Step 1 — Company Basics (Q1–Q6)**
**Step 2 — Brand Personality (Q7–Q10)**
**Step 3 — Voice & Tone (Q11–Q14)**
**Step 4 — Language & Opinions (Q15–Q19)**
**Step 5 — Competitive Positioning (Q20–Q22)**
**Step 6 — Examples & References (Q23–Q25)**
**Step 7 — Anything Else (Q26) + Review & Submit**

### 3. Questions Reference

Below is the full questionnaire. Use this as the source of truth for field names, types, labels, helper text, and options.

---

#### STEP 1: Company Basics

**Q1. Company Name**
- Type: `text` (single line)
- Label: "Company name (exactly as it should appear in all communications)"
- Required: yes
- Validation: min 1, max 200 characters

**Q2. What does your company do?**
- Type: `textarea`
- Label: "What does your company do? Describe your products, services, or offerings in plain language."
- Helper text: "Be specific. Don't just say 'we're a marketing agency.' Tell us what you actually do, for whom, and how. The more concrete, the better."
- Required: yes
- Validation: min 50, max 3000 characters
- Show character count

**Q3. Target Customer**
- Type: `textarea`
- Label: "Who is your target customer? Describe them in detail."
- Helper text: "Think about demographics, psychographics, lifestyle, and situation. What are they dealing with when they come to you? What do they need?"
- Required: yes
- Validation: min 50, max 3000 characters
- Show character count

**Q4. Problem Solved**
- Type: `textarea`
- Label: "What problem do you solve? What does life look like before and after working with you?"
- Helper text: "Describe the pain points, frustrations, or challenges your customer faces — and what changes once you've helped them."
- Required: yes
- Validation: min 50, max 3000 characters
- Show character count

**Q5. Origin Story**
- Type: `textarea`
- Label: "What's your origin story? How and why was the company started?"
- Helper text: "Who founded it? When? What was the motivation? This helps us capture the human element behind the brand."
- Required: no (but encouraged)
- Validation: max 3000 characters

**Q6. Communication Channels**
- Type: `checkbox` (multi-select)
- Label: "What communication channels does your brand use?"
- Options:
  - `website_blog` — "Website and blog"
  - `instagram` — "Instagram"
  - `tiktok` — "TikTok"
  - `linkedin` — "LinkedIn"
  - `facebook` — "Facebook"
  - `x_twitter` — "X / Twitter"
  - `youtube` — "YouTube"
  - `email_marketing` — "Email marketing / newsletters"
  - `direct_mail` — "Direct mail"
  - `sales_conversations` — "Sales conversations (phone, in-person, video)"
  - `customer_support` — "Customer service / support"
  - `paid_advertising` — "Paid advertising (digital or print)"
  - `podcasts_video` — "Podcasts or video content"
  - `other` — "Other"
- If `other` is selected, show a text input: "Please specify"
- Required: at least 1 selected

---

#### STEP 2: Brand Personality

**Q7. Personality Traits**
- Type: `tag-input` or `text` (comma-separated)
- Label: "List 3–5 adjectives that describe your brand's personality."
- Helper text: "If your brand walked into a room, how would people describe it? Examples: confident, quirky, rugged, warm, rebellious, polished, nerdy, calm, bold, playful, trustworthy."
- Required: yes
- Validation: at least 3 items, max 5 items, each max 50 characters

**Q8. Brand Archetype**
- Type: `radio` (single select)
- Label: "Which brand archetype best represents your company's role?"
- Helper text: "Choose the archetype that best describes the role your brand plays in your customer's life."
- Options:
  - `sage` — "The Sage — Wisdom, knowledge, expertise"
  - `hero` — "The Hero — Courage, achievement, transformation"
  - `caregiver` — "The Caregiver — Nurturing, service, protection"
  - `creator` — "The Creator — Innovation, imagination, vision"
  - `explorer` — "The Explorer — Freedom, discovery, adventure"
  - `ruler` — "The Ruler — Leadership, control, premium quality"
  - `everyman` — "The Everyman — Relatability, belonging, authenticity"
  - `rebel` — "The Rebel — Disruption, change, revolution"
  - `magician` — "The Magician — Transformation, making dreams real"
  - `jester` — "The Jester — Fun, humor, lightheartedness"
  - `not_sure` — "Not sure — I'll describe our role below"
- Required: yes
- Follow-up: `textarea` for optional explanation (shown always, but especially relevant if `not_sure`). Max 1000 characters.

**Q9. Brand as a Person**
- Type: `textarea`
- Label: "If your brand were a person at a party, how would people describe them?"
- Helper text: "Paint a picture. How do they act? What do they talk about? How do they make people feel? This is one of the most important questions — take your time."
- Required: yes
- Validation: min 50, max 3000 characters

**Q10. Celebrity / Character Match**
- Type: `textarea`
- Label: "Name a celebrity, public figure, or fictional character whose vibe matches your brand."
- Helper text: "This is a shortcut to personality. Who 'sounds like' your brand? Feel free to list 2–3 options and explain why each fits."
- Required: yes
- Validation: min 20, max 2000 characters

---

#### STEP 3: Voice & Tone

**Q11. Formality Spectrum**
- Type: `radio` (single select)
- Label: "Where does your brand fall on the formality spectrum?"
- Options:
  - `very_casual` — "Very casual — Like texting a friend. Slang is fine. First names always."
  - `casual_professional` — "Casual-professional — Relaxed but credible. Conversational, not sloppy."
  - `professional_personality` — "Professional with personality — Polished and warm. Approachable but buttoned-up."
  - `mostly_formal` — "Mostly formal — Authoritative, serious, premium. Corporate polish."
- Required: yes

**Q12. Voice Spectrums**
- Type: `range` (slider) + optional `text` for notes — one row per spectrum
- Label: "Rate your brand on each of these spectrums."
- Helper text: "Drag the slider to show where you fall. 0% = fully left side, 100% = fully right side. Add notes to explain."
- Spectrums:
  - `formal_casual` — "Formal ↔ Casual" (0 = Formal, 100 = Casual)
  - `serious_playful` — "Serious ↔ Playful" (0 = Serious, 100 = Playful)
  - `reserved_enthusiastic` — "Reserved ↔ Enthusiastic" (0 = Reserved, 100 = Enthusiastic)
  - `technical_simple` — "Technical ↔ Simple" (0 = Technical, 100 = Simple)
  - `traditional_modern` — "Traditional ↔ Modern" (0 = Traditional, 100 = Modern)
- Each slider: required, default 50, range 0–100
- Each notes field: optional, max 500 characters

**Q13. Humor**
- Type: `radio` (single select)
- Label: "Does your brand use humor?"
- Options:
  - `yes_lots` — "Yes — We use humor a lot. It's core to who we are."
  - `sometimes` — "Sometimes — Light humor where it fits, but we're not comedians."
  - `rarely` — "Rarely — We're more earnest and sincere. Humor feels off-brand."
  - `depends` — "Depends on the channel — Funny on social, serious in sales."
- Required: yes
- Follow-up: `textarea` for optional explanation. Max 1000 characters.

**Q14. Personality Vibes**
- Type: `checkbox` (multi-select, max 2)
- Label: "Pick 1–2 personality vibes that feel most like your brand:"
- Options:
  - `rugged_adventurous` — "Rugged and adventurous"
  - `warm_community` — "Warm and community-driven"
  - `witty_irreverent` — "Witty and irreverent"
  - `calm_inspiring` — "Calm and inspiring"
  - `bold_disruptive` — "Bold and disruptive"
  - `polished_premium` — "Polished and premium"
  - `nerdy_detailed` — "Nerdy and detail-oriented"
  - `friendly_approachable` — "Friendly and approachable"
  - `other` — "Other"
- If `other` is selected, show a text input: "Please specify"
- Required: at least 1, max 2
- Validation: enforce max 2 selections

---

#### STEP 4: Language & Opinions

**Q15. Strong Opinions**
- Type: `textarea`
- Label: "What topics does your brand have strong opinions on?"
- Helper text: "What hills would your brand die on? What do you believe that others in your industry might disagree with?"
- Required: yes
- Validation: min 30, max 3000 characters

**Q16. Off-Limits Topics**
- Type: `textarea`
- Label: "What does your brand never joke about or take lightly?"
- Helper text: "Every brand has boundaries. What topics are always treated with seriousness and respect?"
- Required: no
- Validation: max 2000 characters

**Q17. Words We Love**
- Type: `textarea`
- Label: "Are there specific words or phrases your brand loves to use?"
- Helper text: "Signature phrases, insider language, or terms of art your team has adopted naturally."
- Required: no
- Validation: max 2000 characters

**Q18. Words We Avoid**
- Type: `textarea`
- Label: "Are there words or phrases your brand actively avoids?"
- Helper text: "Corporate jargon? Buzzwords? Terms your competitors overuse?"
- Required: no
- Validation: max 2000 characters

**Q19. Delivering Bad News**
- Type: `textarea`
- Label: "How would your brand deliver bad news to a customer?"
- Helper text: "Imagine something went wrong — a delay, a mistake, a price increase. How would your brand handle it? This reveals a lot about voice and values."
- Required: yes
- Validation: min 30, max 2000 characters

---

#### STEP 5: Competitive Positioning

**Q20. Competitors**
- Type: `textarea`
- Label: "Who are your top 2–3 competitors? How is your voice or approach different from theirs?"
- Required: no
- Validation: max 3000 characters

**Q21. Customer Feedback**
- Type: `textarea`
- Label: "What do customers say they love about communicating with you?"
- Helper text: "Compliments, testimonials, or feedback about your tone, emails, sales calls, or content. Direct quotes are gold."
- Required: no
- Validation: max 3000 characters

**Q22. Brand Recognition**
- Type: `textarea`
- Label: "What would make someone immediately recognize a message as coming from your brand?"
- Helper text: "If someone saw a social post or email with no logo, what would tip them off that it's yours?"
- Required: no
- Validation: max 2000 characters

---

#### STEP 6: Examples & References

**Q23. On-Brand Content Examples**
- Type: Repeatable field group (2–3 entries)
- Label: "Share 2–3 pieces of existing content that feel 'most like us.'"
- Helper text: "These can be social posts, emails, blog articles, ad copy — anything. Paste the content and explain why it feels right."
- Each entry has:
  - `content` — `textarea` (max 3000 characters)
  - `why` — `textarea` "Why does this feel right?" (max 1000 characters)
- Required: at least 1 entry with content filled
- Allow adding/removing entries (min 1, max 3)

**Q24. Anti-Examples**
- Type: Repeatable field group (1–2 entries)
- Label: "Share 1–2 pieces of content that feel 'not like us' (from your own brand or others)."
- Helper text: "Anti-examples are just as useful. What doesn't sound right? What makes you cringe?"
- Each entry has:
  - `content` — `textarea` (max 3000 characters)
  - `why` — `textarea` "What feels off?" (max 1000 characters)
- Required: no
- Allow adding/removing entries (min 0, max 2)

**Q25. Brands You Admire**
- Type: `textarea`
- Label: "Are there any other brands (in any industry) whose voice you admire?"
- Helper text: "This doesn't mean you want to copy them — just that something about how they communicate resonates. Tell us what you admire about each."
- Required: no
- Validation: max 2000 characters

---

#### STEP 7: Anything Else + Review

**Q26. Anything Else**
- Type: `textarea`
- Label: "Is there anything else we should know about your brand, your voice, or your communication goals?"
- Helper text: "Anything that didn't fit above. Industry context, team culture, upcoming changes, or challenges with brand consistency."
- Required: no
- Validation: max 3000 characters

**After Q26, show a Review Summary:**
- Display a read-only summary of all answers, organized by section
- Each section should be collapsible/expandable
- Each section should have an "Edit" button that jumps back to that step
- Show a final "Submit" button and a disclaimer:
  > "By submitting, you confirm that the information provided is accurate to the best of your knowledge. We'll use your responses to build your Brand Voice Style Guide."

---

### 4. Form UX Requirements

#### Progress Indicator
- Show a progress bar or step indicator at the top of the form at all times
- Display: step number, step name, and completion percentage
- Example: "Step 2 of 7 — Brand Personality"
- Steps should be clickable ONLY for previously completed steps (users can go back but not skip ahead)

#### Navigation
- "Back" and "Continue" buttons at the bottom of each step
- "Continue" validates the current step before advancing
- "Back" preserves all entered data
- On the final step: "Back" and "Submit" buttons

#### Auto-Save (Recommended)
- Save form progress to `localStorage` on every field change (debounced, 1 second)
- On page load, check for saved progress and offer to resume:
  > "It looks like you have an unfinished submission. Would you like to continue where you left off?"
- Clear `localStorage` on successful submission

#### Validation UX
- Validate on blur for individual fields
- Validate all fields on "Continue" (step-level validation)
- Show inline error messages below each field
- Scroll to the first error if validation fails on "Continue"
- Error messages should be friendly and specific:
  - ❌ "This field is required"
  - ✅ "Please describe what your company does (at least 50 characters)"

#### Responsive Design
- Must be fully responsive: mobile-first
- On mobile: single column layout, full-width inputs
- On desktop: max-width container (e.g., `max-w-3xl`), centered
- Textareas should auto-grow or be tall enough to be comfortable (min 4 rows for short, 6 rows for long questions)

#### Accessibility
- All inputs must have associated `<label>` elements
- Use `aria-describedby` for helper text
- Use `aria-invalid` and `aria-errormessage` for validation errors
- Focus management: move focus to the first field of each new step
- Keyboard navigable (Tab, Shift+Tab, Enter to submit)

---

### 5. Zod Schema

Create a single Zod schema for the complete form, then derive per-step schemas for step-level validation. Export all schemas from a shared file (e.g., `lib/schemas/brand-voice-intake.ts`).

```ts
// Example structure — implement the full schema based on the questions above

import { z } from "zod";

/** Step 1: Company Basics */
export const companyBasicsSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  whatYouDo: z.string().min(50, "Please provide at least 50 characters").max(3000),
  targetCustomer: z.string().min(50, "Please provide at least 50 characters").max(3000),
  problemSolved: z.string().min(50, "Please provide at least 50 characters").max(3000),
  originStory: z.string().max(3000).optional().or(z.literal("")),
  channels: z.array(z.string()).min(1, "Please select at least one channel"),
  channelsOther: z.string().max(200).optional().or(z.literal("")),
});

// ... define schemas for each step ...

/** Full form schema (union of all steps) */
export const brandVoiceIntakeSchema = companyBasicsSchema
  .merge(brandPersonalitySchema)
  .merge(voiceToneSchema)
  .merge(languageOpinionsSchema)
  .merge(competitivePositioningSchema)
  .merge(examplesReferencesSchema)
  .merge(anythingElseSchema);

/** Inferred TypeScript type */
export type BrandVoiceIntakeData = z.infer<typeof brandVoiceIntakeSchema>;
```

Use `.refine()` or `.superRefine()` for cross-field validation (e.g., if `other` channel is selected, `channelsOther` is required).

---

### 6. Supabase Schema

Create a `brand_voice_submissions` table. Store the form data as structured JSONB alongside metadata columns for querying.

```sql
CREATE TABLE brand_voice_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Metadata
  company_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  
  -- Contact (if you want to add contact fields to the form, otherwise remove)
  contact_name TEXT,
  contact_email TEXT,
  
  -- Form data (full questionnaire response as structured JSON)
  form_data JSONB NOT NULL,
  
  -- Individual sections as JSONB for easier querying
  company_basics JSONB,
  brand_personality JSONB,
  voice_tone JSONB,
  language_opinions JSONB,
  competitive_positioning JSONB,
  examples_references JSONB,
  anything_else JSONB,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for querying by status and date
CREATE INDEX idx_submissions_status ON brand_voice_submissions (status, submitted_at DESC);

-- RLS: Only authenticated users (your team) can read. Anonymous can insert.
ALTER TABLE brand_voice_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON brand_voice_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads"
  ON brand_voice_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated updates"
  ON brand_voice_submissions FOR UPDATE
  TO authenticated
  USING (true);
```

---

### 7. Server Action / API Route

Use a Next.js Server Action (preferred) or Route Handler at `app/intake/brand-voice/actions.ts`:

```ts
"use server";

/**
 * Submits the completed Brand Voice Intake form.
 *
 * - Validates the full form data against the Zod schema
 * - Inserts into Supabase `brand_voice_submissions` table
 * - Sends confirmation email to the client via Resend
 * - Sends notification email to the internal team via Resend
 * - Returns success/error result
 */
export async function submitBrandVoiceIntake(
  data: BrandVoiceIntakeData
): Promise<{ success: boolean; error?: string }> {
  // 1. Server-side validation with Zod
  // 2. Insert into Supabase
  // 3. Send confirmation email to client (if contact_email provided)
  // 4. Send notification email to team
  // 5. Return result
}
```

---

### 8. Resend Emails

Send two emails on successful submission:

#### Client Confirmation Email
- To: client's email (if provided)
- From: `noreply@[yourdomain].com`
- Subject: "We received your Brand Voice questionnaire"
- Body: Friendly confirmation that their answers were received and what to expect next. Include their company name. Keep it short and on-brand.

#### Internal Team Notification
- To: `[your team email]`
- From: `noreply@[yourdomain].com`
- Subject: "New Brand Voice Intake: [Company Name]"
- Body: Summary of key fields (company name, what they do, archetype, celebrity match). Link to Supabase dashboard or admin panel to view the full submission.

Use React Email components for both templates if possible.

---

### 9. File & Folder Structure

```
app/
  intake/
    layout.tsx              ← Minimal layout (no nav/footer), noindex meta
    brand-voice/
      page.tsx              ← Main form page component
      actions.ts            ← Server action for form submission
      loading.tsx           ← Loading skeleton
      components/
        IntakeForm.tsx      ← Main multi-step form controller
        StepProgress.tsx    ← Progress bar / step indicator
        steps/
          CompanyBasics.tsx
          BrandPersonality.tsx
          VoiceTone.tsx
          LanguageOpinions.tsx
          CompetitivePositioning.tsx
          ExamplesReferences.tsx
          AnythingElse.tsx
        ReviewSummary.tsx   ← Final review before submit
        FormField.tsx       ← Reusable form field wrapper (label, helper, error)
        SliderInput.tsx     ← Custom range slider for Q12
        TagInput.tsx        ← Tag input for Q7 (personality traits)
        RepeatableGroup.tsx ← Add/remove field groups for Q23, Q24

lib/
  schemas/
    brand-voice-intake.ts  ← All Zod schemas
  supabase/
    client.ts              ← Supabase client (if not already existing)
  email/
    brand-voice-confirmation.tsx  ← React Email template
    brand-voice-notification.tsx  ← React Email template

types/
  brand-voice-intake.ts    ← TypeScript types (inferred from Zod)
```

---

### 10. Design Guidelines

Follow the existing site design system. Do not invent new design patterns. Specifically:

- **Use existing color variables / Tailwind theme tokens** — Do not hardcode hex values. Reference the theme.
- **Use existing font families** — Match the site's heading and body fonts.
- **Use existing component patterns** — If the site has a `<Button>`, `<Input>`, `<Card>`, etc., use them. Do not create new primitives.
- **Spacing and sizing** — Match the site's existing spacing scale. When in doubt, refer to other form pages or contact pages on the site.
- **Form field styling** — Inputs should match any existing form styling (border radius, border color, focus ring, padding, etc.).
- **Error state styling** — Use the site's existing error color (typically red-500 or similar). Match existing validation patterns.
- **Helper text styling** — Muted, smaller text below labels. Match existing patterns.

**If no existing design system or components exist**, use these sensible defaults:
- Container: `max-w-3xl mx-auto px-4 py-12`
- Headings: Site's heading font, `text-2xl font-bold` for step titles
- Body: Site's body font, `text-base`
- Inputs: `rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary px-4 py-3`
- Buttons: Primary CTA matches site's primary button style. Secondary/back button is outlined or ghost.
- Cards: Subtle background for question groups (e.g., `bg-gray-50 rounded-xl p-6`)
- Helper text: `text-sm text-gray-500`
- Error text: `text-sm text-red-600`

---

### 11. JSDoc Requirements

Every component, function, type, and schema must have JSDoc comments. Follow this standard:

```ts
/**
 * Multi-step intake form for collecting Brand Voice Style Guide data from clients.
 *
 * @remarks
 * Uses React Hook Form for state management with Zod validation at each step.
 * Progress is auto-saved to localStorage and restored on return visits.
 * On submission, data is sent to Supabase and confirmation emails are dispatched via Resend.
 *
 * @example
 * ```tsx
 * <IntakeForm />
 * ```
 */
export function IntakeForm() { ... }

/**
 * Validates and submits the completed Brand Voice intake form.
 *
 * @param data - The validated form data conforming to {@link BrandVoiceIntakeData}
 * @returns A result object indicating success or containing an error message
 *
 * @throws Will return `{ success: false, error: string }` if validation or database insertion fails.
 * Does not throw exceptions — all errors are returned in the result object.
 */
export async function submitBrandVoiceIntake(data: BrandVoiceIntakeData) { ... }
```

---

### 12. Post-Submission UX

After successful submission:

1. Clear `localStorage` saved progress
2. Navigate to a success state (either a new page `/intake/brand-voice/success` or replace the form with a success message)
3. Success message should include:
   - A thank you message with the company name
   - What happens next (e.g., "We'll review your responses and deliver your Brand Voice Style Guide within [X] business days.")
   - A way to contact you if they have questions
4. If submission fails:
   - Show a friendly error message
   - Do NOT clear the form data
   - Allow retry
   - Log the error server-side

---

### 13. Edge Cases to Handle

- **Partial completion / abandonment:** Auto-save handles this. Data persists in localStorage.
- **Duplicate submissions:** Add a `submitting` state to prevent double-clicks. Optionally check Supabase for recent submissions with the same company name + email.
- **Very long text inputs:** Enforce max character limits with both Zod validation and `maxLength` on the HTML element. Show a character counter for textareas with limits.
- **Browser back button:** Should work naturally with the multi-step form (consider using URL params or hash for step state, e.g., `/intake/brand-voice?step=3`).
- **JavaScript disabled:** The form requires JavaScript. Show a `<noscript>` message directing users to contact you directly.
- **Session timeout / connection loss:** Auto-save to localStorage means data is not lost. Server action should handle Supabase connection errors gracefully.

---

### 14. Testing Considerations

- Validate every Zod schema with edge cases (empty strings, boundary lengths, missing required fields)
- Test step navigation (forward, backward, jumping to completed steps)
- Test auto-save and restore
- Test submission with valid and invalid data
- Test Resend email delivery in development (use Resend test mode)
- Test responsive layout at mobile, tablet, and desktop breakpoints
- Test accessibility with keyboard-only navigation and a screen reader

---

### 15. Summary Checklist

Before considering this complete, verify:

- [ ] Page lives at `/intake/brand-voice`
- [ ] Page is excluded from indexing (`robots` metadata + `robots.txt`)
- [ ] Intake layout has no global nav/footer (or minimal version)
- [ ] All 26 questions are present and match the spec above
- [ ] Multi-step form with 7 steps + progress indicator
- [ ] Step-level Zod validation on "Continue"
- [ ] Full-form Zod validation on "Submit"
- [ ] Auto-save to localStorage with resume prompt
- [ ] Review summary before final submission
- [ ] Supabase table created and insertion works
- [ ] Confirmation email sent to client via Resend
- [ ] Notification email sent to team via Resend
- [ ] Success state shown after submission
- [ ] Error handling for failed submissions (no data loss)
- [ ] Fully responsive (mobile-first)
- [ ] Accessible (labels, aria attributes, focus management, keyboard nav)
- [ ] JSDoc on every component, function, type, and schema
- [ ] Follows existing site design system
- [ ] TypeScript strict mode, no `any` types

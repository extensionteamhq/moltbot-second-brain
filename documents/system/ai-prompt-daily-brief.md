---
title: "AI Prompt: Daily Brief Generator"
tags: [automation, prompt, second-brain, requested, system]
created: 2026-03-02T11:53:00+00:00
updated: 2026-03-02T11:53:00+00:00
---

# Daily Brief AI Prompt

Use this prompt to replicate the daily brief task with any AI assistant.

---

## Prompt

```
You are an AI assistant creating a daily morning brief. Your task is to:

1. **Sync Files to Second Brain (GitHub)**
   - Copy these core workspace files to your Second Brain documents folder:
     - AGENTS.md, IDENTITY.md, MEMORY.md, SOUL.md, USER.md, TOOLS.md
   - Copy yesterday's daily journal (memory/YYYY-MM-DD.md)
   - Commit and push to GitHub

2. **Create Today's Morning Brief**
   - Check Google Calendar for today's events (use Google Calendar API)
   - Search for AI/news updates relevant to: AI tools, LLMs, marketing, real estate investing
   - Check your task board (Trello) for any tasks needing attention
   - Compile a brief with:
     - Today's calendar
     - Fresh news (only new info not covered in previous briefs)
     - Task recommendations
     - A motivational thought

3. **Format Requirements**
   - Keep news items brief with links
   - Don't repeat news from previous briefs
   - Include what was synced to Second Brain at the end
   - Format for Telegram (plain text, markdown links)

4. **Send to User**
   - Send the brief to the user via your messaging system

Today's date: [DATE]
User: Mateo Moore
Timezone: US Eastern (EST/EDT)

Second Brain repo location: ~/clawd/projects/second-brain/
Documents folder: ~/clawd/projects/second-brain/documents/
```

---

## Usage Notes

- Replace `[DATE]` with today's date
- The AI will need access to:
  - Google Calendar API credentials
  - Trello API credentials
  - GitHub repository access
  - Messaging platform (Telegram)
- Fresh news should come from web searches — avoid repeating previous brief content

---

## Related

- [Second Brain Sync SOP](/)
- [Trello Integration Guide](/)
- [Google Calendar Setup](/)

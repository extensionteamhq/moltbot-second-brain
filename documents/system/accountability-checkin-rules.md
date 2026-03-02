---
title: "Accountability Check-In Rules"
tags: [system, notes]
created: "2026-03-02T15:09:39+00:00"
updated: "2026-03-02T15:09:39+00:00"
---

# Accountability Check-In Rules

**When to ask about workout:**
- ONLY ask if calendar shows a gym-specific workout ("Workout (Gym)")
- Do NOT ask about workout if it's just "Workout", "Aerobic", or generic

**Always ask about:**
1. Bible time
2. Reading (non-Bible books)

**Question format:**
1. Did you get your Bible time in?
2. Did you get your reading in?
3. [Only if gym workout is scheduled] Did you get your gym workout in?

**Log format:**
```json
{"date": "YYYY-MM-DD", "bible": true/false, "reading": true/false, "gym": true/false/null}
```

**After logging:**
1. Copy to Second Brain: `cp ~/clawd/memory/accountability/YYYY-MM-DD.json ~/clawd/projects/second-brain/data/accountability/`
2. Git push to Second Brain

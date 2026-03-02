# Tech Context

## Tech Stack

| Layer              | Technology           | Version |
| ------------------ | -------------------- | ------- |
| Framework          | Next.js (App Router) | 16.1.6  |
| UI Library         | React                | 19.2.3  |
| Styling            | Tailwind CSS         | 4.x     |
| Language           | TypeScript           | 5.x     |
| Markdown parsing   | gray-matter          | 4.0.3   |
| Markdown rendering | react-markdown       | 10.x    |
| GFM support        | remark-gfm           | 4.x     |
| Syntax highlight   | rehype-highlight     | 7.x     |
| Package manager    | **pnpm** (never npm) | —       |

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm

### Install & Run

```bash
# Install dependencies (use pnpm, not npm)
pnpm install

# Run dev server (assume already running — don't start again)
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint
```

> **Note:** Assume the dev server is already running. Do not ask to restart it.

## Project Structure

```
moltbot-second-brain/
├── documents/                   # All markdown content (auto-served by API)
├── data/
│   └── accountability/
│       ├── config.json          # Habit schema (key, label, emoji) — add new habits here
│       └── YYYY-MM-DD.json      # One file per day; fields: date + one bool/null per habit
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── accountability/route.ts  # GET /api/accountability → { config, data }
│   │   │   └── documents/route.ts       # GET /api/documents → { documents, tags }
│   │   ├── accountability/page.tsx      # Accountability Grid page (thin orchestrator)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── accountability/
│   │   │   ├── AccountabilityGrid.tsx   # Grid table — columns driven by config
│   │   │   ├── GridNavBar.tsx           # Week/month navigation bar (mobile-first)
│   │   │   └── HabitCell.tsx            # Single cell renderer (✅/❌/–)
│   │   ├── Header.tsx
│   │   └── index.ts
│   └── lib/
│       ├── accountability.ts    # Typed utilities + JSDoc for accountability feature
│       └── documents.ts
├── public/
├── scripts/
├── memory-bank/                 # Cline memory bank (this directory)
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── postcss.config.mjs
```

## Configuration Files

- `next.config.ts` — Next.js config
- `tsconfig.json` — TypeScript config (strict mode)
- `eslint.config.mjs` — ESLint with Next.js rules
- `postcss.config.mjs` — PostCSS for Tailwind 4

## TypeScript & Code Standards

- Full TypeScript coverage required
- JSDoc comments on all exported functions and interfaces
- Never remove existing JSDoc — update as needed
- Strict type checking enforced via `tsconfig.json`

## Dependencies

### Production

```json
{
    "gray-matter": "^4.0.3", // Frontmatter parsing
    "next": "16.1.6", // Framework
    "react": "19.2.3", // UI
    "react-dom": "19.2.3", // DOM rendering
    "react-markdown": "^10.1.0", // Markdown→HTML
    "rehype-highlight": "^7.0.2", // Code syntax highlighting
    "remark-gfm": "^4.0.1" // GitHub Flavored Markdown
}
```

### Dev

```json
{
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
}
```

## Deployment

- **Platform:** Vercel
- **Trigger:** Auto-deploy on push to main branch
- **Build command:** `next build`
- **Deploy time:** ~60 seconds after push

## Repository

- **GitHub:** `https://github.com/extensionteamhq/moltbot-second-brain.git`
- **Remote alias:** `origin`

## Known Technical Constraints

1. **No write API** — Documents are read-only through the UI; writes happen via git push
2. **No database** — All data is file-system based (Supabase migration is planned but not implemented)
3. **Kanban removed** — The Kanban board and `data/kanban.json` were removed on 2026-03-02. Task management moved to Trello (external). Tasks archived in `documents/kanban-tasks-archive.md`.
4. **Documents directory is flat** — No subdirectory support (all `.md` files must be directly in `documents/`)
5. **Next.js 16** — Not latest stable; upgrade not needed unless required by features

## Environment

- **OS:** macOS Tahoe
- **IDE:** VS Code with Cline extension
- **Shell:** zsh
- **Working directory:** `/Users/mateo/extension-team/moltbot-second-brain`

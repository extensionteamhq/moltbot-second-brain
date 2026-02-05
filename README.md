# 🧠 Second Brain

A personal knowledge base and project management tool built with Next.js.

## Features

### 📄 Documents
- Markdown documents with frontmatter support
- Full-text search across all documents
- Tag-based filtering and categorization
- Download documents as `.md` files
- Responsive design with mobile sidebar

### 📋 Projects (Kanban Board)
- Create and manage multiple projects
- Drag-and-drop task management
- 5-column workflow: Backlog → To Do → In Progress → Review → Done
- Task priorities (Low, Medium, High)
- Tags and due dates
- Local storage persistence

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Adding Documents

Place markdown files in the `documents/` directory with frontmatter:

```markdown
---
title: "My Document Title"
tags: [notes, ideas]
date: 2026-02-05
---

# Content here

Your markdown content...
```

### Available Tags
- `journal` - Daily journal entries
- `notes` - General notes
- `newsletters` - Newsletter drafts
- `scripts` - Video/content scripts
- `ideas` - Ideas and brainstorms
- `concepts` - Framework and concept docs
- `dirt-roamers` - Dirt Roamers business docs
- `email-sequences` - Email sequence templates
- `sales` - Sales-related content

## Project Structure

```
second-brain/
├── documents/           # Markdown documents
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── documents/
│   │   │       └── route.ts    # Documents API
│   │   ├── projects/
│   │   │   └── page.tsx        # Kanban board page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout with header
│   │   └── page.tsx            # Documents page
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── KanbanBoard.tsx     # Kanban board component
│   │   └── index.ts            # Component exports
│   └── lib/
│       └── documents.ts        # Document utilities
├── package.json
└── README.md
```

## Navigation

- **📄 Documents** (`/`) - Browse and search markdown documents
- **📋 Projects** (`/projects`) - Kanban board for project management

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Markdown**: react-markdown with remark-gfm
- **State**: React hooks + localStorage
- **TypeScript**: Full type coverage with JSDoc documentation

## API

### GET /api/documents

Returns all documents and tags.

```typescript
interface Response {
  documents: Document[];
  tags: string[];
}

interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}
```

## Local Storage

The Kanban board persists data to localStorage under the key `second-brain-kanban`:

```typescript
interface StoredData {
  projects: Project[];
  activeProjectId: string | null;
}
```

## Development

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## License

Private - All rights reserved

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCUMENTS_DIR = path.join(process.cwd(), 'documents');

export interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

export function getDocuments(): Document[] {
  // Create documents directory if it doesn't exist
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
    // Create a sample document
    const sampleDoc = `---
title: Welcome to Second Brain
tags: [notes]
date: ${new Date().toISOString().split('T')[0]}
---

# Welcome to Your Second Brain

This is your personal knowledge base. Documents placed in the \`documents\` folder will appear here automatically.

## Features

- **Markdown Support**: Write in markdown with full formatting
- **Tags**: Organize with tags (journal, notes, newsletters, scripts, ideas)
- **Search**: Find anything instantly
- **Dark Mode**: Easy on the eyes

## Getting Started

1. Add \`.md\` files to the \`documents\` folder
2. Use frontmatter for metadata (title, tags, date)
3. Refresh to see your documents

Happy organizing! 🧠
`;
    fs.writeFileSync(path.join(DOCUMENTS_DIR, 'welcome.md'), sampleDoc);
  }

  const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.md'));
  
  const documents = files.map(filename => {
    const filePath = path.join(DOCUMENTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const slug = filename.replace('.md', '');
    const excerpt = content.slice(0, 150).replace(/[#*`]/g, '').trim() + '...';
    
    return {
      slug,
      title: data.title || slug,
      content,
      tags: data.tags || ['notes'],
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt,
    };
  });

  // Sort by date, newest first
  return documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDocument(slug: string): Document | null {
  const documents = getDocuments();
  return documents.find(d => d.slug === slug) || null;
}

export function getAllTags(): string[] {
  const documents = getDocuments();
  const tagSet = new Set<string>();
  documents.forEach(doc => doc.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

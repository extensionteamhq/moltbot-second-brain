import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Directory path for storing markdown documents
 * @constant {string}
 */
const DOCUMENTS_DIR = path.join(process.cwd(), 'documents');

/**
 * Document interface representing a parsed markdown document
 * @interface Document
 * @property {string} slug - URL-friendly identifier derived from filename
 * @property {string} title - Document title from frontmatter
 * @property {string} content - Raw markdown content (without frontmatter)
 * @property {string[]} tags - Tags for categorization and filtering
 * @property {string} date - ISO date string for sorting and display
 * @property {string} excerpt - Short preview of content (first 150 chars)
 */
export interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

/**
 * Retrieves all documents from the documents directory
 * 
 * Reads all markdown files from the documents directory, parses their
 * frontmatter and content, and returns them sorted by date (newest first).
 * 
 * If the documents directory doesn't exist, it creates it with a sample document.
 * 
 * @function getDocuments
 * @returns {Document[]} Array of parsed documents sorted by date descending
 * 
 * @example
 * const docs = getDocuments();
 * console.log(docs[0].title); // "Latest Document Title"
 * 
 * @throws {Error} If file reading fails (non-existence is handled gracefully)
 */
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

/**
 * Retrieves a single document by its slug
 * 
 * @function getDocument
 * @param {string} slug - The URL-friendly identifier of the document
 * @returns {Document | null} The document if found, null otherwise
 * 
 * @example
 * const doc = getDocument('my-document');
 * if (doc) {
 *   console.log(doc.content);
 * }
 */
export function getDocument(slug: string): Document | null {
  const documents = getDocuments();
  return documents.find(d => d.slug === slug) || null;
}

/**
 * Retrieves all unique tags from all documents
 * 
 * Aggregates tags from all documents and returns them as a sorted array
 * of unique values. Useful for building tag filter UIs.
 * 
 * @function getAllTags
 * @returns {string[]} Sorted array of unique tag names
 * 
 * @example
 * const tags = getAllTags();
 * // ['concepts', 'ideas', 'journal', 'notes', 'scripts']
 */
export function getAllTags(): string[] {
  const documents = getDocuments();
  const tagSet = new Set<string>();
  documents.forEach(doc => doc.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

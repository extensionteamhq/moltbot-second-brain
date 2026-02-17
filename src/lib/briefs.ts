import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Directory path for storing daily briefs
 */
const BRIEFS_DIR = path.join(process.cwd(), 'documents', 'briefs');

/**
 * Brief interface representing a parsed brief document
 */
export interface Brief {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

/**
 * Retrieves all briefs from the briefs directory
 * 
 * Reads all markdown files from the documents/briefs directory, parses their
 * frontmatter and content, and returns them sorted by date (newest first).
 */
export function getBriefs(): Brief[] {
  // Create briefs directory if it doesn't exist
  if (!fs.existsSync(BRIEFS_DIR)) {
    fs.mkdirSync(BRIEFS_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BRIEFS_DIR).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    return [];
  }

  const briefs = files.map(filename => {
    const filePath = path.join(BRIEFS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const slug = filename.replace('.md', '');
    const excerpt = content.slice(0, 150).replace(/[#*`]/g, '').trim() + '...';
    
    // Extract date from filename (YYYY-MM-DD-brief.md) or frontmatter
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const dateFromFilename = dateMatch ? dateMatch[1] : null;
    const date = data.date || dateFromFilename || new Date().toISOString().split('T')[0];
    
    return {
      slug,
      title: data.title || `Daily Brief - ${date}`,
      content,
      tags: data.tags || ['brief'],
      date,
      excerpt,
    };
  });

  // Sort by date, newest first
  return briefs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Retrieves a single brief by its slug
 */
export function getBrief(slug: string): Brief | null {
  const briefs = getBriefs();
  return briefs.find(b => b.slug === slug) || null;
}

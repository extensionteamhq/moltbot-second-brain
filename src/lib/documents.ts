import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents a top-level directory scanned by the document system.
 *
 * @interface ScanDirectory
 * @property {string} base - Path relative to project root (e.g. 'documents', 'journals')
 * @property {string} section - Logical section name returned on each Document (e.g. 'documents', 'journals', 'briefs')
 * @property {boolean} recursive - Whether to traverse subdirectories within this base path
 */
export interface ScanDirectory {
  base: string;
  section: string;
  recursive: boolean;
}

/**
 * Represents a parsed markdown document with frontmatter metadata.
 *
 * @interface Document
 * @property {string} slug - URL-friendly identifier derived from filename (no extension, no path)
 * @property {string} title - Document title from frontmatter, falls back to slug
 * @property {string} content - Raw markdown content (frontmatter stripped)
 * @property {string[]} tags - Tags for categorisation and filtering (coerced to strings)
 * @property {string} date - ISO date string used for sorting (backward-compat alias for created)
 * @property {string} created - ISO timestamp when document was created
 * @property {string} updated - ISO timestamp when document was last updated
 * @property {string} excerpt - First 150 chars of content with markdown stripped
 * @property {string} section - Top-level directory section: 'documents' | 'journals' | 'briefs'
 * @property {string} subfolder - Subdirectory within section (e.g. 'dirt-roamers', 'system') or '' for root
 */
export interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  created: string;
  updated: string;
  excerpt: string;
  section: string;
  subfolder: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ordered list of top-level directories to scan for markdown documents.
 *
 * To add a new content area (e.g. `notes/`), append an entry here — no other
 * code changes are required.
 *
 * @constant {ScanDirectory[]}
 */
export const SCAN_DIRECTORIES: ScanDirectory[] = [
  { base: 'documents', section: 'documents', recursive: true },
  { base: 'journals', section: 'journals', recursive: false },
  { base: 'briefs', section: 'briefs', recursive: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a short plain-text excerpt from raw markdown content.
 *
 * Strips common markdown syntax characters (`#`, `*`, `` ` ``) and trims
 * whitespace before truncating to `maxLength` characters.
 *
 * @param {string} content - Raw markdown string (frontmatter already removed)
 * @param {number} [maxLength=150] - Maximum number of characters in the excerpt
 * @returns {string} Plain-text excerpt ending with '...'
 */
function buildExcerpt(content: string, maxLength = 150): string {
  return content.slice(0, maxLength).replace(/[#*`]/g, '').trim() + '...';
}

/**
 * Recursively collects all `.md` file paths within a directory.
 *
 * For non-recursive directories only immediate children are returned.
 * Symlinks to directories are not followed to avoid infinite loops.
 *
 * @param {string} dirPath - Absolute path of the directory to scan
 * @param {boolean} recursive - Whether to descend into subdirectories
 * @returns {{ filePath: string; subfolder: string }[]} Flat list of file paths and their relative subfolder
 */
function collectMarkdownFiles(
  dirPath: string,
  recursive: boolean
): { filePath: string; subfolder: string }[] {
  if (!fs.existsSync(dirPath)) return [];

  const results: { filePath: string; subfolder: string }[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && recursive) {
      // Descend into subdirectory — subfolder is the immediate child name
      const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });
      for (const sub of subEntries) {
        if (sub.isFile() && sub.name.endsWith('.md')) {
          results.push({
            filePath: path.join(fullPath, sub.name),
            subfolder: entry.name,
          });
        }
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({ filePath: fullPath, subfolder: '' });
    }
  }

  return results;
}

/**
 * Parses a single markdown file into a `Document` object.
 *
 * Extracts frontmatter via `gray-matter`, resolves dates with a
 * priority chain, and coerces all tag values to strings (guards
 * against `js-yaml` auto-converting date/number-like tag values).
 *
 * Returns `null` if the file cannot be read or parsed.
 *
 * @param {string} filePath - Absolute path to the `.md` file
 * @param {string} section - Logical section this file belongs to
 * @param {string} subfolder - Subdirectory within the section ('' for root)
 * @returns {Document | null} Parsed document or null on error
 */
function parseMarkdownFile(
  filePath: string,
  section: string,
  subfolder: string
): Document | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const stats = fs.statSync(filePath);

    const filename = path.basename(filePath);
    const slug = filename.replace(/\.md$/, '');
    const excerpt = buildExcerpt(content);

    // Date priority: created > date > file birthtime
    const created: string =
      String(data.created ?? data.date ?? stats.birthtime.toISOString());
    // Updated priority: updated > file mtime
    const updated: string =
      String(data.updated ?? stats.mtime.toISOString());

    return {
      slug,
      title: data.title ? String(data.title) : slug,
      content,
      // Coerce all tags to strings — js-yaml (YAML 1.1) auto-converts date/number values
      tags: (Array.isArray(data.tags) ? data.tags : ['notes']).map(String),
      date: data.date ? String(data.date) : created,
      created,
      updated,
      excerpt,
      section,
      subfolder,
    };
  } catch (err) {
    console.error(`[documents] Failed to parse ${filePath}:`, err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retrieves all documents from every configured scan directory.
 *
 * Scans `SCAN_DIRECTORIES` in order, recursively traversing subdirectories
 * where configured. Files that fail to parse are skipped (logged to console)
 * so a single malformed file cannot crash the entire document list.
 *
 * Results are sorted by `updated` date descending (most recently modified first).
 *
 * @returns {Document[]} All parsed documents across all sections, newest first
 *
 * @example
 * const docs = getDocuments();
 * console.log(docs[0].title); // Most recently updated document
 */
export function getDocuments(): Document[] {
  const documents: Document[] = [];

  for (const scanDir of SCAN_DIRECTORIES) {
    const basePath = path.join(process.cwd(), scanDir.base);
    const files = collectMarkdownFiles(basePath, scanDir.recursive);

    for (const { filePath, subfolder } of files) {
      const doc = parseMarkdownFile(filePath, scanDir.section, subfolder);
      if (doc) documents.push(doc);
    }
  }

  // Sort by updated date, newest first
  return documents.sort(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );
}

/**
 * Retrieves a single document by its slug.
 *
 * Searches across all scan directories. The slug is the filename without
 * the `.md` extension. Because filenames are unique across all directories,
 * no path prefix is needed.
 *
 * @param {string} slug - Filename without `.md` (e.g. `'dirt-roamers-business-plan'`)
 * @returns {Document | null} The matching document, or null if not found
 *
 * @example
 * const doc = getDocument('dirt-roamers-business-plan');
 * if (doc) console.log(doc.content);
 */
export function getDocument(slug: string): Document | null {
  return getDocuments().find(d => d.slug === slug) ?? null;
}

/**
 * Retrieves all documents belonging to a specific top-level section.
 *
 * Valid section values are defined by `SCAN_DIRECTORIES[].section`:
 * `'documents'`, `'journals'`, or `'briefs'`.
 *
 * @param {string} section - Section identifier (e.g. `'journals'`)
 * @returns {Document[]} Documents in that section, sorted newest first
 *
 * @example
 * const journals = getDocumentsBySection('journals');
 */
export function getDocumentsBySection(section: string): Document[] {
  return getDocuments().filter(d => d.section === section);
}

/**
 * Retrieves all documents within a specific subfolder of `documents/`.
 *
 * The subfolder corresponds to the immediate child directory under `documents/`
 * (e.g. `'dirt-roamers'`, `'anchor-staff'`, `'system'`).
 *
 * @param {string} subfolder - Subfolder name (e.g. `'dirt-roamers'`)
 * @returns {Document[]} Documents in that subfolder, sorted newest first
 *
 * @example
 * const dirtRoamersDocs = getDocumentsBySubfolder('dirt-roamers');
 */
export function getDocumentsBySubfolder(subfolder: string): Document[] {
  return getDocuments().filter(d => d.subfolder === subfolder);
}

/**
 * Retrieves all unique tags across every document in all sections.
 *
 * Aggregates tags from the full document set and returns a sorted array
 * of unique values, suitable for building tag-filter UIs.
 *
 * @returns {string[]} Alphabetically sorted array of unique tag strings
 *
 * @example
 * const tags = getAllTags();
 * // ['anchor-staff', 'brief', 'dirt-roamers', 'journal', 'notes', ...]
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getDocuments().forEach(doc => doc.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
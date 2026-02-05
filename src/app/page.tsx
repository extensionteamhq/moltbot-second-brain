'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Document interface representing a markdown document
 * @typedef {Object} Document
 * @property {string} slug - URL-friendly identifier derived from filename
 * @property {string} title - Document title from frontmatter
 * @property {string} content - Raw markdown content
 * @property {string[]} tags - Tags for categorization
 * @property {string} date - ISO date string
 * @property {string} excerpt - Short preview of content
 */
interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

/**
 * Tag color configuration for visual categorization
 * @constant {Record<string, string>}
 */
const tagColors: Record<string, string> = {
  journal: 'bg-blue-500',
  notes: 'bg-green-500',
  newsletters: 'bg-amber-500',
  scripts: 'bg-pink-500',
  ideas: 'bg-violet-500',
  concepts: 'bg-cyan-500',
  'dirt-roamers': 'bg-orange-500',
  'email-sequences': 'bg-teal-500',
  sales: 'bg-red-500',
};

/**
 * Documents Page Component
 * 
 * Main page displaying the document browser with sidebar navigation,
 * search functionality, tag filtering, and markdown rendering.
 * 
 * @page
 * @route /
 * @example
 * // Access at: http://localhost:3000/
 */
export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  /**
   * Fetch documents from API on component mount
   */
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents);
        setAllTags(data.tags);
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
      });
  }, []);

  /**
   * Filter documents based on search query and selected tag
   * @returns {Document[]} Filtered documents
   */
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === null || doc.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Separate journal entries from other documents
  const journalDocs = filteredDocs.filter(d => d.tags.includes('journal'));
  const otherDocs = filteredDocs.filter(d => !d.tags.includes('journal'));

  /**
   * Handles document selection with optimized rendering
   * @param {Document} doc - The document to select
   */
  const handleDocSelect = (doc: Document) => {
    setSidebarOpen(false);
    startTransition(() => {
      setSelectedDoc(doc);
    });
    requestAnimationFrame(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  /**
   * Handles tag filter selection
   * @param {string | null} tag - The tag to filter by, or null for all
   */
  const handleTagSelect = (tag: string | null) => {
    startTransition(() => {
      setSelectedTag(tag);
    });
    requestAnimationFrame(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  /**
   * Downloads the current document as a markdown file
   */
  const handleDownload = () => {
    if (!selectedDoc) return;
    
    const frontmatter = `---
title: "${selectedDoc.title}"
tags: [${selectedDoc.tags.join(', ')}]
date: ${selectedDoc.date}
---

`;
    const fullContent = frontmatter + selectedDoc.content;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 right-4 z-30 p-3 bg-[var(--accent)] text-white rounded-full shadow-lg hover:bg-[var(--accent-hover)] transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-72 bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        top-14 md:top-0 h-[calc(100vh-3.5rem)]
      `}>
        {/* Search */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Tags */}
        <div className="px-3 pb-3 flex flex-wrap gap-1">
          <button
            onClick={() => handleTagSelect(null)}
            className={`px-2 py-1 text-xs rounded-full transition ${
              selectedTag === null ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--border)]'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(selectedTag === tag ? null : tag)}
              className={`px-2 py-1 text-xs rounded-full transition ${
                selectedTag === tag ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--border)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          {journalDocs.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                📅 Journal Entries
              </div>
              {journalDocs.map(doc => (
                <DocItem
                  key={doc.slug}
                  doc={doc}
                  isSelected={selectedDoc?.slug === doc.slug}
                  onClick={() => handleDocSelect(doc)}
                  tagColors={tagColors}
                />
              ))}
            </>
          )}
          
          {otherDocs.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mt-2">
                📄 Documents
              </div>
              {otherDocs.map(doc => (
                <DocItem
                  key={doc.slug}
                  doc={doc}
                  isSelected={selectedDoc?.slug === doc.slug}
                  onClick={() => handleDocSelect(doc)}
                  tagColors={tagColors}
                />
              ))}
            </>
          )}

          {filteredDocs.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--muted)] text-sm">
              No documents found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          {documents.length} documents
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto md:ml-0">
        {selectedDoc ? (
          <article className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Document Header */}
            <header className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedDoc.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded-full text-white ${tagColors[tag] || 'bg-gray-500'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--card)] hover:bg-[var(--border)] border border-[var(--border)] rounded-lg transition"
                  title="Download as Markdown"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{selectedDoc.title}</h1>
              <time className="text-[var(--muted)] text-sm">{selectedDoc.date}</time>
            </header>

            {/* Document Content */}
            <div className="prose prose-sm md:prose-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedDoc.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--muted)]">
            <div className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <p>Select a document to view</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Document Item Component
 * 
 * Renders a single document in the sidebar list with title, date, and tag indicators.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Document} props.doc - The document to display
 * @param {boolean} props.isSelected - Whether this document is currently selected
 * @param {() => void} props.onClick - Click handler for selection
 * @param {Record<string, string>} props.tagColors - Mapping of tag names to color classes
 */
function DocItem({ 
  doc, 
  isSelected, 
  onClick,
  tagColors 
}: { 
  doc: Document; 
  isSelected: boolean; 
  onClick: () => void;
  tagColors: Record<string, string>;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition ${
        isSelected 
          ? 'bg-[var(--accent)]/10 border-l-2 border-[var(--accent)]' 
          : 'hover:bg-[var(--card)] border-l-2 border-transparent'
      }`}
    >
      <div className="font-medium text-sm truncate">{doc.title}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{doc.date}</div>
      <div className="flex gap-1 mt-2">
        {doc.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className={`w-2 h-2 rounded-full ${tagColors[tag] || 'bg-gray-500'}`}
          />
        ))}
      </div>
    </button>
  );
}

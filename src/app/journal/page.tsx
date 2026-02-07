'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

/**
 * Document interface representing a markdown document
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
 * Journal Page Component
 * Shows only journal entries sorted by date (most recent first)
 */
export default function JournalPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        // Filter only journal entries and sort by date (most recent first)
        const journalDocs = data.documents
          .filter((doc: Document) => 
            doc.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === 'journal')
          )
          .sort((a: Document, b: Document) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        
        setDocuments(journalDocs);
        if (journalDocs.length > 0) {
          setSelectedDoc(journalDocs[0]);
        }
      });
  }, []);

  // Filter documents by search
  const filteredDocs = documents.filter(doc => {
    return searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
        {/* Navigation */}
        <div className="flex border-b border-[var(--border)]">
          <div className="flex-1 px-4 py-3 text-sm font-medium text-center bg-[var(--accent)]/10 text-[var(--accent)] border-r border-[var(--border)]">
            📅 Journal
          </div>
          <Link 
            href="/"
            className="flex-1 px-4 py-3 text-sm font-medium text-center hover:bg-[var(--card)] transition"
          >
            📄 Documents
          </Link>
        </div>

        {/* Search */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search journal entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Journal Entry List */}
        <div className="flex-1 overflow-y-auto border-t border-[var(--border)]">
          {filteredDocs.map(doc => (
            <button
              key={doc.slug}
              onClick={() => handleDocSelect(doc)}
              className={`w-full text-left px-4 py-3 transition ${
                selectedDoc?.slug === doc.slug
                  ? 'bg-[var(--accent)]/10 border-l-2 border-[var(--accent)]' 
                  : 'hover:bg-[var(--card)] border-l-2 border-transparent'
              }`}
            >
              <div className="font-medium text-sm truncate">{doc.title}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{doc.date}</div>
            </button>
          ))}

          {filteredDocs.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--muted)] text-sm">
              No journal entries found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          {filteredDocs.length} journal entries
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto md:ml-0">
        {selectedDoc ? (
          <article className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Document Header */}
            <header className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                  Journal
                </span>
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
              <div className="text-6xl mb-4">📅</div>
              <p>Select a journal entry to view</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

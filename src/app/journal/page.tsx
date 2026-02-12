'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSidebar } from '@/lib/SidebarContext';

interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

/**
 * Format date as YYYY-MM-DD HH:MM ET
 */
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} ET`;
}

/**
 * Format journal title with day of week
 * Example: "Daily Journal - February 12, 2026 (Thursday)"
 */
function formatJournalTitle(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'America/New_York',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  const [weekday, ...dateParts] = formatted.split(', ');
  const dateWithoutWeekday = dateParts.join(', ');
  return `Daily Journal - ${dateWithoutWeekday} (${weekday})`;
}

/**
 * Remove duplicate h1 from content
 */
function removeFirstH1(content: string): string {
  return content.replace(/^#\s+.*$/m, '').trim();
}

/**
 * Journal Page - Shows only journal entries
 */
export default function JournalPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen: sidebarOpen, close: closeSidebar } = useSidebar();
  const mainContentRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const todayET = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(now);
        const [month, day, year] = todayET.split('/');
        const todayDateStr = `${year}-${month}-${day}`;
        
        // Filter only journal entries, exclude today's entry, and sort by date
        const journalDocs = data.documents
          .filter((doc: Document) => {
            const isJournal = doc.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === 'journal');
            const isToday = doc.slug.startsWith(todayDateStr);
            return isJournal && !isToday;
          })
          .sort((a: Document, b: Document) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        
        setDocuments(journalDocs);
        if (journalDocs.length > 0) {
          setSelectedDoc(journalDocs[0]);
        }
      });
  }, []);

  const filteredDocs = documents.filter(doc => {
    return searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDocSelect = (doc: Document) => {
    closeSidebar();
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
      {/* Overlay for mobile - closes sidebar when tapping outside */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
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
            placeholder="Search journal..."
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
              <div className="font-medium text-sm">{formatJournalTitle(doc.date)}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{formatDateTime(doc.date)}</div>
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{formatJournalTitle(selectedDoc.date)}</h1>
              <time className="text-[var(--muted)] text-sm">{formatDateTime(selectedDoc.date)}</time>
            </header>

            {/* Document Content */}
            <div className="prose prose-sm md:prose-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {removeFirstH1(selectedDoc.content)}
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

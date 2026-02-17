'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSidebar } from '@/lib/SidebarContext';

interface Brief {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(dateStr: string): string {
  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Parse date as local time by adding T12:00:00 to avoid timezone shift
  const dateWithTime = dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`;
  const date = new Date(dateWithTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format brief title with day of week
 * Example: "Daily Brief - February 12, 2026 (Thursday)"
 */
function formatBriefTitle(dateStr: string): string {
  // Parse the date parts directly to avoid any timezone issues
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return `Daily Brief - ${dateStr}`;
  
  const [, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
  const day = parseInt(dayStr, 10);
  
  // Create date using UTC to avoid timezone shifts, then format
  const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const weekday = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  
  return `Daily Brief - ${monthName} ${day}, ${year} (${weekday})`;
}

/**
 * Remove duplicate h1 from content
 */
function removeFirstH1(content: string): string {
  return content.replace(/^#\s+.*$/m, '').trim();
}

/**
 * Briefs Page - Shows daily briefs
 */
export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isOpen: sidebarOpen, close: closeSidebar } = useSidebar();
  const mainContentRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/briefs', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setBriefs(data.briefs || []);
        if (data.briefs && data.briefs.length > 0) {
          setSelectedBrief(data.briefs[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredBriefs = briefs.filter(brief => {
    return searchQuery === '' || 
      brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleBriefSelect = (brief: Brief) => {
    closeSidebar();
    startTransition(() => {
      setSelectedBrief(brief);
    });
    requestAnimationFrame(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const handleDownload = () => {
    if (!selectedBrief) return;
    
    const frontmatter = `---
title: "${selectedBrief.title}"
tags: [${selectedBrief.tags.join(', ')}]
date: ${selectedBrief.date}
---

`;
    const fullContent = frontmatter + selectedBrief.content;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBrief.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-[var(--muted)]">Loading briefs...</div>
      </div>
    );
  }

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
            placeholder="Search briefs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Brief List */}
        <div className="flex-1 overflow-y-auto border-t border-[var(--border)]">
          {filteredBriefs.length > 0 ? (
            filteredBriefs.map(brief => (
              <button
                key={brief.slug}
                onClick={() => handleBriefSelect(brief)}
                className={`w-full text-left px-4 py-3 transition ${
                  selectedBrief?.slug === brief.slug
                    ? 'bg-[var(--accent)]/10 border-l-2 border-[var(--accent)]' 
                    : 'hover:bg-[var(--card)] border-l-2 border-transparent'
                }`}
              >
                <div className="font-medium text-sm">{formatBriefTitle(brief.date)}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{formatDate(brief.date)}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-[var(--muted)] text-sm">
              {searchQuery ? 'No briefs match your search' : 'No daily briefs yet'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          {filteredBriefs.length} brief{filteredBriefs.length !== 1 ? 's' : ''}
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto md:ml-0">
        {selectedBrief ? (
          <article className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Document Header */}
            <header className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white">
                  Daily Brief
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{formatBriefTitle(selectedBrief.date)}</h1>
              <time className="text-[var(--muted)] text-sm">{formatDate(selectedBrief.date)}</time>
            </header>

            {/* Document Content */}
            <div className="prose prose-sm md:prose-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {removeFirstH1(selectedBrief.content)}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--muted)]">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <p>No daily briefs available yet</p>
              <p className="text-sm mt-2">Briefs will appear here once generated</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

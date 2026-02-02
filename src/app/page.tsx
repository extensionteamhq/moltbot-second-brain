'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  excerpt: string;
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

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

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === null || doc.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const journalDocs = filteredDocs.filter(d => d.tags.includes('journal'));
  const otherDocs = filteredDocs.filter(d => !d.tags.includes('journal'));

  const tagColors: Record<string, string> = {
    journal: 'bg-blue-500',
    notes: 'bg-green-500',
    newsletters: 'bg-amber-500',
    scripts: 'bg-pink-500',
    ideas: 'bg-violet-500',
    concepts: 'bg-cyan-500',
  };

  const handleDocSelect = (doc: Document) => {
    setSelectedDoc(doc);
    setSidebarOpen(false); // Close sidebar on mobile when doc selected
    // Scroll to top when switching documents
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    // Scroll to top when switching tags
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    if (!selectedDoc) return;
    
    // Reconstruct markdown with frontmatter
    const frontmatter = `---
title: "${selectedDoc.title}"
tags: [${selectedDoc.tags.join(', ')}]
date: ${selectedDoc.date}
---

`;
    const fullContent = frontmatter + selectedDoc.content;
    
    // Create blob and download
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
    <div className="flex h-screen relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[var(--sidebar)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 hover:bg-[var(--card)] rounded-lg transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <span>🧠</span> Second Brain
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

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
        pt-14 md:pt-0
      `}>
        {/* Header - hidden on mobile (we have the fixed header) */}
        <div className="hidden md:block p-4 border-b border-[var(--border)]">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span>🧠</span> Second Brain
          </h1>
        </div>

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
      <main ref={mainContentRef} className="flex-1 overflow-y-auto pt-14 md:pt-0 md:ml-0">
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
        {doc.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className={`w-2 h-2 rounded-full ${tagColors[tag] || 'bg-gray-500'}`}
          />
        ))}
      </div>
    </button>
  );
}

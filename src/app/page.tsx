'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
 * Business Model Tags - Primary categorization
 * Each has light (unselected) and dark (selected/display) variants
 */
const BUSINESS_MODELS: Record<string, { light: string; dark: string; label: string }> = {
  'anchor-staff': { 
    light: 'bg-blue-200 text-blue-800 hover:bg-blue-300', 
    dark: 'bg-blue-600 text-white',
    label: 'Anchor & Staff'
  },
  'mr-mateo-moore': { 
    light: 'bg-purple-200 text-purple-800 hover:bg-purple-300', 
    dark: 'bg-purple-600 text-white',
    label: 'Mr Mateo Moore'
  },
  'dirt-roamers': { 
    light: 'bg-orange-200 text-orange-800 hover:bg-orange-300', 
    dark: 'bg-orange-600 text-white',
    label: 'Dirt Roamers'
  },
  'rank-n-soar': { 
    light: 'bg-green-200 text-green-800 hover:bg-green-300', 
    dark: 'bg-green-600 text-white',
    label: 'Rank-n-Soar'
  },
  'partner-with-mateo': { 
    light: 'bg-teal-200 text-teal-800 hover:bg-teal-300', 
    dark: 'bg-teal-600 text-white',
    label: 'Partner With Mateo'
  },
  'other': { 
    light: 'bg-gray-200 text-gray-800 hover:bg-gray-300', 
    dark: 'bg-gray-600 text-white',
    label: 'Other'
  },
};

/**
 * Document Type Tags - Secondary categorization
 */
const DOCUMENT_TYPES: Record<string, { color: string; label: string }> = {
  'guide': { color: 'bg-sky-500', label: 'Guide' },
  'newsletter': { color: 'bg-amber-500', label: 'Newsletter' },
  'sop': { color: 'bg-rose-500', label: 'SOP' },
  'email-sequence': { color: 'bg-teal-500', label: 'Email Sequence' },
  'script': { color: 'bg-pink-500', label: 'Script' },
  'notes': { color: 'bg-indigo-500', label: 'Notes' },
  'journal': { color: 'bg-blue-500', label: 'Journal' },
  'ideas': { color: 'bg-violet-500', label: 'Ideas' },
  'research': { color: 'bg-emerald-500', label: 'Research' },
  'template': { color: 'bg-cyan-500', label: 'Template' },
};

/**
 * Helper to categorize a tag
 */
function categorizeTag(tag: string): { type: 'business' | 'doctype' | 'other'; key: string } {
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
  if (BUSINESS_MODELS[normalizedTag]) {
    return { type: 'business', key: normalizedTag };
  }
  if (DOCUMENT_TYPES[normalizedTag]) {
    return { type: 'doctype', key: normalizedTag };
  }
  return { type: 'other', key: tag };
}

/**
 * Get business model and document types from a document's tags
 */
function getTagCategories(tags: string[]): { business: string | null; types: string[] } {
  let business: string | null = null;
  const types: string[] = [];
  
  for (const tag of tags) {
    const cat = categorizeTag(tag);
    if (cat.type === 'business' && !business) {
      business = cat.key;
    } else if (cat.type === 'doctype') {
      types.push(cat.key);
    }
  }
  
  return { business, types };
}

/**
 * Documents Page Component
 */
export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  // Collect available tags from documents
  const [availableBusinesses, setAvailableBusinesses] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents);
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
        
        // Extract available tags
        const businesses = new Set<string>();
        const types = new Set<string>();
        
        for (const doc of data.documents) {
          for (const tag of doc.tags) {
            const cat = categorizeTag(tag);
            if (cat.type === 'business') businesses.add(cat.key);
            if (cat.type === 'doctype') types.add(cat.key);
          }
        }
        
        setAvailableBusinesses(Array.from(businesses));
        setAvailableTypes(Array.from(types));
      });
  }, []);

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const { business, types } = getTagCategories(doc.tags);
    const matchesBusiness = selectedBusiness === null || business === selectedBusiness;
    const matchesType = selectedType === null || types.includes(selectedType);
    
    return matchesSearch && matchesBusiness && matchesType;
  });

  // Separate journal entries from other documents
  const journalDocs = filteredDocs.filter(d => d.tags.some(t => categorizeTag(t).key === 'journal'));
  const otherDocs = filteredDocs.filter(d => !d.tags.some(t => categorizeTag(t).key === 'journal'));

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

  const clearFilters = () => {
    setSelectedBusiness(null);
    setSelectedType(null);
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

        {/* Business Model Tags */}
        <div className="px-3 pb-2">
          <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Business
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={clearFilters}
              className={`px-2 py-1 text-xs rounded-full transition ${
                selectedBusiness === null && selectedType === null
                  ? 'bg-[var(--accent)] text-white' 
                  : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--border)]'
              }`}
            >
              All
            </button>
            {availableBusinesses.map(key => {
              const config = BUSINESS_MODELS[key];
              const isSelected = selectedBusiness === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedBusiness(isSelected ? null : key)}
                  className={`px-2 py-1 text-xs rounded-full transition ${
                    isSelected ? config.dark : config.light
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Type Tags */}
        <div className="px-3 pb-3">
          <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Document Type
          </div>
          <div className="flex flex-wrap gap-1">
            {availableTypes.map(key => {
              const config = DOCUMENT_TYPES[key];
              const isSelected = selectedType === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(isSelected ? null : key)}
                  className={`px-2 py-1 text-xs rounded-full transition ${
                    isSelected 
                      ? `${config.color} text-white` 
                      : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--border)]'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(selectedBusiness || selectedType) && (
          <div className="px-3 pb-2">
            <button
              onClick={clearFilters}
              className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          </div>
        )}

        {/* Document List */}
        <div className="flex-1 overflow-y-auto border-t border-[var(--border)]">
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
          {filteredDocs.length} of {documents.length} documents
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainContentRef} className="flex-1 overflow-y-auto md:ml-0">
        {selectedDoc ? (
          <article className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Document Header */}
            <header className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <DocumentTags tags={selectedDoc.tags} />
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
 * Document Tags Display Component
 * Shows tags in format: <Business Model>: <Type>|<Type>
 */
function DocumentTags({ tags }: { tags: string[] }) {
  const { business, types } = getTagCategories(tags);
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {business && BUSINESS_MODELS[business] && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${BUSINESS_MODELS[business].dark}`}>
          {BUSINESS_MODELS[business].label}
        </span>
      )}
      {business && types.length > 0 && (
        <span className="text-[var(--muted)]">:</span>
      )}
      {types.map((type, idx) => (
        <span key={type} className="flex items-center">
          {idx > 0 && <span className="text-[var(--muted)] mx-1">|</span>}
          <span className={`px-2 py-0.5 text-xs rounded-full text-white ${DOCUMENT_TYPES[type]?.color || 'bg-gray-500'}`}>
            {DOCUMENT_TYPES[type]?.label || type}
          </span>
        </span>
      ))}
      {!business && types.length === 0 && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500 text-white">
          Uncategorized
        </span>
      )}
    </div>
  );
}

/**
 * Document Item Component for sidebar
 */
function DocItem({ 
  doc, 
  isSelected, 
  onClick,
}: { 
  doc: Document; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const { business, types } = getTagCategories(doc.tags);
  
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
      <div className="flex items-center gap-1 mt-2">
        {business && BUSINESS_MODELS[business] && (
          <span className={`w-2 h-2 rounded-full`} style={{
            backgroundColor: BUSINESS_MODELS[business].dark.includes('blue') ? '#2563eb' :
                            BUSINESS_MODELS[business].dark.includes('purple') ? '#9333ea' :
                            BUSINESS_MODELS[business].dark.includes('orange') ? '#ea580c' :
                            BUSINESS_MODELS[business].dark.includes('green') ? '#16a34a' :
                            BUSINESS_MODELS[business].dark.includes('teal') ? '#0d9488' :
                            '#4b5563'
          }} />
        )}
        {types.slice(0, 2).map(type => (
          <span
            key={type}
            className={`w-2 h-2 rounded-full`}
            style={{
              backgroundColor: DOCUMENT_TYPES[type]?.color.includes('sky') ? '#0ea5e9' :
                              DOCUMENT_TYPES[type]?.color.includes('amber') ? '#f59e0b' :
                              DOCUMENT_TYPES[type]?.color.includes('rose') ? '#f43f5e' :
                              DOCUMENT_TYPES[type]?.color.includes('teal') ? '#14b8a6' :
                              DOCUMENT_TYPES[type]?.color.includes('pink') ? '#ec4899' :
                              DOCUMENT_TYPES[type]?.color.includes('indigo') ? '#6366f1' :
                              DOCUMENT_TYPES[type]?.color.includes('blue') ? '#3b82f6' :
                              DOCUMENT_TYPES[type]?.color.includes('violet') ? '#8b5cf6' :
                              DOCUMENT_TYPES[type]?.color.includes('emerald') ? '#10b981' :
                              DOCUMENT_TYPES[type]?.color.includes('cyan') ? '#06b6d4' :
                              '#6b7280'
            }}
          />
        ))}
      </div>
    </button>
  );
}

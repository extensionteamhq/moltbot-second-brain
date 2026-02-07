'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Document {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

/**
 * Business Model Tags
 */
const BUSINESS_MODELS: Record<string, { dark: string; label: string }> = {
  'anchor-staff': { dark: 'bg-blue-600 text-white', label: 'Anchor & Staff' },
  'mr-mateo-moore': { dark: 'bg-purple-600 text-white', label: 'Mr Mateo Moore' },
  'dirt-roamers': { dark: 'bg-orange-600 text-white', label: 'Dirt Roamers' },
  'rank-n-soar': { dark: 'bg-green-600 text-white', label: 'Rank-n-Soar' },
  'partner-with-mateo': { dark: 'bg-teal-600 text-white', label: 'Partner With Mateo' },
  'marketing': { dark: 'bg-rose-600 text-white', label: 'Marketing' },
  'system': { dark: 'bg-slate-600 text-white', label: 'System' },
  'other': { dark: 'bg-gray-600 text-white', label: 'Other' },
};

/**
 * Document Type Tags
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
  'social-media': { color: 'bg-fuchsia-500', label: 'Social Media' },
  'framework': { color: 'bg-lime-500', label: 'Framework' },
  'uncategorized': { color: 'bg-gray-400', label: 'Uncategorized' },
};

function categorizeTag(tag: string): { type: 'business' | 'doctype' | 'other'; key: string } {
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
  if (BUSINESS_MODELS[normalizedTag]) return { type: 'business', key: normalizedTag };
  if (DOCUMENT_TYPES[normalizedTag]) return { type: 'doctype', key: normalizedTag };
  return { type: 'other', key: tag };
}

function getTagCategories(tags: string[]): { business: string | null; types: string[] } {
  let business: string | null = null;
  const types: string[] = [];
  for (const tag of tags) {
    const cat = categorizeTag(tag);
    if (cat.type === 'business' && !business) business = cat.key;
    else if (cat.type === 'doctype') types.push(cat.key);
  }
  return { business, types };
}

interface DocumentModalProps {
  slug: string;
  onClose: () => void;
}

/**
 * DocumentModal Component
 * 
 * Displays a document in a modal with download capability.
 * Fetches document by slug from the API.
 */
export default function DocumentModal({ slug, onClose }: DocumentModalProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch('/api/documents');
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        const doc = data.documents.find((d: Document) => d.slug === slug);
        if (doc) {
          setDocument(doc);
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [slug]);

  const handleDownload = () => {
    if (!document) return;
    
    const frontmatter = `---
title: "${document.title}"
tags: [${document.tags.join(', ')}]
date: ${document.date}
---

`;
    const fullContent = frontmatter + document.content;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.slug}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--card)] rounded-lg border border-[var(--border)] w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition"
            >
              Close
            </button>
          </div>
        ) : document ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {(() => {
                    const { business, types } = getTagCategories(document.tags);
                    return (
                      <>
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
                      </>
                    );
                  })()}
                </div>
                <h2 className="text-xl font-bold truncate">{document.title}</h2>
                <time className="text-[var(--muted)] text-sm">{document.date}</time>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition"
                  title="Download as Markdown"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--background)] rounded-lg transition text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.content}
                </ReactMarkdown>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

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
                  {document.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded-full text-white ${tagColors[tag] || 'bg-gray-500'}`}
                    >
                      {tag}
                    </span>
                  ))}
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

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
  excerpt: string;
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

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
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
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
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-1 text-xs rounded-full transition ${
              selectedTag === null ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--border)]'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
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
                  onClick={() => setSelectedDoc(doc)}
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
                  onClick={() => setSelectedDoc(doc)}
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
      <main className="flex-1 overflow-y-auto">
        {selectedDoc ? (
          <article className="max-w-4xl mx-auto p-8">
            {/* Document Header */}
            <header className="mb-8 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-3">
                {selectedDoc.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 text-xs rounded-full text-white ${tagColors[tag] || 'bg-gray-500'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold mb-2">{selectedDoc.title}</h1>
              <time className="text-[var(--muted)] text-sm">{selectedDoc.date}</time>
            </header>

            {/* Document Content */}
            <div className="prose">
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

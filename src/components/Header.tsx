'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Navigation item configuration
 * @typedef {Object} NavItem
 * @property {string} href - The URL path for the navigation item
 * @property {string} label - Display text for the navigation item
 * @property {string} icon - Emoji icon for the navigation item
 */
interface NavItem {
  href: string;
  label: string;
  icon: string;
}

/**
 * Navigation items for the header
 * @constant {NavItem[]}
 */
const navItems: NavItem[] = [
  { href: '/', label: 'Documents', icon: '📄' },
  { href: '/projects', label: 'Projects', icon: '📋' },
];

/**
 * Header component with navigation
 * 
 * Provides a consistent navigation header across all pages of the Second Brain app.
 * Features responsive design with mobile hamburger menu support.
 * 
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */
export default function Header() {
  const pathname = usePathname();

  /**
   * Determines if a navigation item is currently active
   * @param {string} href - The href to check against current pathname
   * @returns {boolean} True if the nav item is active
   */
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/documents');
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--sidebar)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-semibold hover:text-[var(--accent)] transition"
          >
            <span className="text-xl">🧠</span>
            <span className="hidden sm:inline">Second Brain</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${isActive(item.href)
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)]'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)] transition"
              title="Search (Coming Soon)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

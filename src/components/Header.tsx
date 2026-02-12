'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/SidebarContext';

/**
 * Navigation items for the header
 */
const navItems = [
  { href: '/', label: 'Documents', icon: '📄' },
  { href: '/journal', label: 'Journal', icon: '📅' },
];

/**
 * Header component with navigation and mobile hamburger menu
 */
export default function Header() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Show hamburger on pages with sidebars (not on /projects)
  const showHamburger = pathname === '/' || pathname === '/journal';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--sidebar)] border-b border-[var(--border)]">
      <div className="flex items-center h-14 px-4">
        {/* Mobile Hamburger Menu - Only on pages with sidebars */}
        {showHamburger && (
          <button
            onClick={toggle}
            className="md:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-[var(--card)] transition"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-lg font-semibold hover:text-[var(--accent)] transition mr-auto"
        >
          <span className="text-xl">🧠</span>
          <span className="hidden sm:inline">Second Brain</span>
        </Link>

        {/* Navigation - Center */}
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

        {/* Spacer for balance */}
        <div className="ml-auto w-[100px] hidden sm:block" />
      </div>
    </header>
  );
}

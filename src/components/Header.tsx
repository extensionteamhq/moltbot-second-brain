'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Navigation items for the header
 */
const navItems = [
  { href: '/journal', label: 'Journal', icon: '📅' },
  { href: '/', label: 'Documents', icon: '📄' },
  { href: '/projects', label: 'Projects', icon: '📋' },
];

/**
 * Header component with navigation
 */
export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--sidebar)] border-b border-[var(--border)]">
      <div className="flex items-center h-14 px-4">
        {/* Logo - Far Left */}
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

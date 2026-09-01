'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import type { NavSection } from '@/lib/nav';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';


function activeSection(nav: NavSection[], pathname: string): string | null {
  for (const section of nav) {
    if (section.pages.some(p => p.href === pathname)) return section.title;
  }
  return null;
}

interface Props {
  user: { name: string; role: string };
  /**
   * Already filtered to what this user may reach — see visibleNav() in
   * src/convex/access.ts. The sidebar renders what it is given and makes no
   * access decision of its own.
   */
  nav: NavSection[];
}

export default function Sidebar({ user, nav }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { signOut } = useAuthActions();
  const [open, setOpen] = useState<string | null>(() => activeSection(nav, pathname));

  useEffect(() => {
    const section = activeSection(nav, pathname);
    if (section) setOpen(section);
  }, [nav, pathname]);

  function toggle(title: string) {
    setOpen(prev => (prev === title ? null : title));
  }

  async function handleLogout() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size={22} />
        <span className="logo-text">Code<span>lude</span></span>
        <span className="hq-badge">HQ</span>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/dashboard"
          className={`sidebar-link${pathname === '/dashboard' ? ' active' : ''}`}
          style={{ marginBottom: '0.25rem' }}
        >
          AI
        </Link>

        {nav.map(section => {
          const isOpen = open === section.title;
          const hasActive = section.pages.some(p => p.href === pathname);

          return (
            <div key={section.title} className="sidebar-section">
              <button
                className="sidebar-section-trigger"
                onClick={() => toggle(section.title)}
              >
                <span
                  className="sidebar-section-title"
                  style={hasActive ? { opacity: 1, color: 'var(--accent-text)' } : {}}
                >
                  {section.title}
                </span>
                <span className={`sidebar-section-arrow${isOpen ? ' open' : ''}`}>▼</span>
              </button>

              <div className={`sidebar-section-items${isOpen ? ' open' : ''}`}>
                {section.pages.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link${pathname === item.href ? ' active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-role">{user.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <button onClick={handleLogout} className="sidebar-logout">Sign out →</button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  {
    title: 'Home',
    items: [
      { label: 'Tasks',    href: '/dashboard/tasks' },
      { label: 'Events',   href: '/dashboard/events' },
      { label: 'News',     href: '/dashboard/news' },
      { label: 'Travels',  href: '/dashboard/travels' },
      { label: 'Files',    href: '/dashboard/files' },
      { label: 'Handbook', href: '/dashboard/handbook' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Plan',      href: '/dashboard/plan' },
      { label: 'Strategy',  href: '/dashboard/strategy' },
      { label: 'Partners',  href: '/dashboard/partners' },
      { label: 'Activity',  href: '/dashboard/activity' },
      { label: 'Channel',   href: '/dashboard/channel' },
      { label: 'Resources', href: '/dashboard/resources' },
      { label: 'Relations', href: '/dashboard/relations' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Projects',    href: '/dashboard/projects' },
      { label: 'Office',      href: '/dashboard/office' },
      { label: 'Departments', href: '/dashboard/departments' },
      { label: 'Franchise',   href: '/dashboard/franchise' },
      { label: 'Properties',  href: '/dashboard/properties' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Model',     href: '/dashboard/financial-model' },
      { label: 'Fundraise', href: '/dashboard/fundraise' },
      { label: 'Budget',    href: '/dashboard/budget' },
      { label: 'Expenses',  href: '/dashboard/expenses' },
      { label: 'Accounts',  href: '/dashboard/accounts' },
      { label: 'Wallets',   href: '/dashboard/wallets' },
      { label: 'Invoice',   href: '/dashboard/invoice' },
      { label: 'Payee',     href: '/dashboard/payee' },
      { label: 'Shares',    href: '/dashboard/shares' },
      { label: 'Investors', href: '/dashboard/investors' },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Attendance',  href: '/dashboard/attendance' },
      { label: 'Application', href: '/dashboard/application' },
      { label: 'Positions',   href: '/dashboard/positions' },
      { label: 'Onboarding',  href: '/dashboard/onboarding' },
      { label: 'Team',        href: '/dashboard/users' },
      { label: 'Payroll',     href: '/dashboard/payroll' },
      { label: 'Training',    href: '/dashboard/training' },
      { label: 'Offboarding', href: '/dashboard/offboarding' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'NDA',       href: '/dashboard/nda' },
      { label: 'Contracts', href: '/dashboard/contracts' },
      { label: 'Govt',      href: '/dashboard/govt' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Brand',       href: '/dashboard/brand' },
      { label: 'Market',      href: '/dashboard/market' },
      { label: 'Competition', href: '/dashboard/competition' },
      { label: 'Campaign',    href: '/dashboard/campaign' },
      { label: 'Content',     href: '/dashboard/content' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Prospects', href: '/dashboard/prospects' },
      { label: 'Leads',     href: '/dashboard/leads' },
      { label: 'Deals',     href: '/dashboard/deals' },
      { label: 'Clients',   href: '/dashboard/clients' },
    ],
  },
  {
    title: 'Software',
    items: [
      { label: 'Platform', href: '/dashboard/platform' },
      { label: 'Features', href: '/dashboard/features' },
      { label: 'Bugs',     href: '/dashboard/bugs' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Tickets',   href: '/dashboard/tickets' },
      { label: 'Help Desk', href: '/dashboard/helpdesk' },
    ],
  },
];

function activeSection(pathname: string): string | null {
  for (const section of NAV) {
    if (section.items.some(i => i.href === pathname)) return section.title;
  }
  return null;
}

interface Props {
  user: { name: string; role: string };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState<string | null>(() => activeSection(pathname));

  useEffect(() => {
    const section = activeSection(pathname);
    if (section) setOpen(section);
  }, [pathname]);

  function toggle(title: string) {
    setOpen(prev => (prev === title ? null : title));
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">Code<span>lude</span></span>
        <span className="hq-badge">HQ</span>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/dashboard"
          className={`sidebar-link${pathname === '/dashboard' ? ' active' : ''}`}
          style={{ marginBottom: '0.25rem' }}
        >
          Home
        </Link>

        {NAV.map(section => {
          const isOpen = open === section.title;
          const hasActive = section.items.some(i => i.href === pathname);

          return (
            <div key={section.title} className="sidebar-section">
              <button
                className="sidebar-section-trigger"
                onClick={() => toggle(section.title)}
              >
                <span
                  className="sidebar-section-title"
                  style={hasActive ? { opacity: 1, color: 'var(--accent)' } : {}}
                >
                  {section.title}
                </span>
                <span className={`sidebar-section-arrow${isOpen ? ' open' : ''}`}>▼</span>
              </button>

              <div className={`sidebar-section-items${isOpen ? ' open' : ''}`}>
                {section.items.map(item => (
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
        <button onClick={handleLogout} className="sidebar-logout">Sign out →</button>
      </div>
    </aside>
  );
}

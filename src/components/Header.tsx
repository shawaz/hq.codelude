'use client';

import { usePathname } from 'next/navigation';

function toTitle(segment: string): string {
  const MAP: Record<string, string> = { helpdesk: 'Help Desk' };
  return MAP[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Header({ user }: { user: { name: string; role: string } }) {
  const pathname = usePathname();
  const segments = pathname.replace('/dashboard', '').split('/').filter(Boolean);
  const title = segments.length ? toTitle(segments[segments.length - 1]) : 'Overview';

  return (
    <header className="hq-header">
      <div className="hq-header-title">{title}</div>
      <div className="hq-header-user">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <div className="user-avatar">{user.name[0].toUpperCase()}</div>
      </div>
    </header>
  );
}

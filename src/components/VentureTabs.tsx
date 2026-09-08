'use client';

import { ALL_SCOPES } from '@/convex/access';

/**
 * The venture selector used by Plan, and now by Platform, Features and Bugs.
 *
 * Tabs come from the registry rather than from each page's own data, so a
 * venture with nothing recorded still gets a tab and an empty state instead of
 * silently vanishing — "no bugs logged" and "this venture does not exist" are
 * different answers and the page should not conflate them.
 */
export interface VentureTabsProps {
  active: string;
  onChange: (name: string) => void;
}

export default function VentureTabs({ active, onChange }: VentureTabsProps) {
  return (
    <div style={{
      display: 'flex', gap: '1px', background: 'var(--card-border)',
      border: '1px solid var(--card-border)', marginBottom: '1.5rem',
    }}>
      {ALL_SCOPES.map((s) => {
        const on = s.name === active;
        return (
          <button
            key={s.name}
            onClick={() => onChange(s.name)}
            style={{
              flex: 1, padding: '0.85rem 1rem', background: on ? s.color : 'var(--card-bg)',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.08em', color: on ? 'var(--black)' : 'var(--muted)',
              fontWeight: on ? 700 : 400, transition: 'all 0.15s',
            }}
          >
            {s.name}
          </button>
        );
      })}
    </div>
  );
}

/** Shared empty state, so all three pages say it the same way. */
export function VentureEmpty({ what, venture }: { what: string; venture: string }) {
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      padding: '2.5rem 1.75rem', textAlign: 'center',
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 300,
    }}>
      No {what} recorded for {venture} yet.
    </div>
  );
}

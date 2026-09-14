'use client';

/**
 * Shared empty state for venture-scoped pages.
 *
 * This file used to export a venture tab strip as well. That strip was the one
 * place rendering ALL_SCOPES *unfiltered by permission* — every other selector
 * went through usePageScopes — so replacing it with the sidebar switcher closed
 * a real inconsistency as well as removing a duplicate control.
 */

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

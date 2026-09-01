'use client';

/**
 * The Finance section's page shell: venture strip → venture header → tab row.
 *
 * Lifted out of the Financial Model page so the eight Finance pages share one
 * implementation instead of eight near-identical copies of the same 40 lines.
 *
 * The strip shows the five ventures only, matching Financial Model. HoldCo-level
 * rows (the cap table's Codelude entries, treasury wallets, the Dubai and India
 * bank accounts) have no tab of their own — see `isHoldCo` in src/lib/finance.ts
 * for how those surface instead.
 *
 * Ventures are filtered by the caller's access, so a member scoped to Dextrip
 * sees one tab here, not five.
 */

import { useState, type ReactNode } from 'react';
import { usePageScopes, clampIndex } from '@/lib/use-page-scopes';
import { VENTURES, type Scope } from '@/lib/ventures';

export interface VentureTab {
  key: string;
  label: string;
}

export default function VenturePageLayout({
  title,
  subtitle,
  pageSlug,
  eyebrow,
  heading,
  tabs,
  children,
}: {
  title: string;
  subtitle: string;
  /** Permission key from src/convex/access.ts — filters the strip. */
  pageSlug: string;
  /** Small caps line above the heading, e.g. "INR model". Gets "VENTURE · " prefixed. */
  eyebrow?: (venture: Scope) => string;
  /** Big line under the strip. Defaults to "<Venture> <title>". */
  heading?: (venture: Scope) => string;
  tabs?: VentureTab[];
  children: (ctx: { venture: Scope; tab: string }) => ReactNode;
}) {
  const { names: allowed, loading } = usePageScopes(pageSlug);
  const ventures = VENTURES.filter(v => allowed.includes(v.name));

  const [vi, setVi] = useState(0);
  const [tab, setTab] = useState(tabs?.[0]?.key ?? '');

  const index = clampIndex(vi, ventures.length);
  const venture = ventures[index];

  if (loading) return null;

  if (!venture) {
    return (
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{subtitle}</p>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-sub">{subtitle}</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)',
        border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {ventures.map((v, i) => (
          <button
            key={v.name}
            onClick={() => { setVi(i); setTab(tabs?.[0]?.key ?? ''); }}
            style={{
              flex: 1, padding: '0.8rem 0.5rem',
              background: index === i ? 'var(--accent)' : 'var(--card-bg)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
              color: index === i ? 'var(--on-accent)' : 'var(--muted)',
              fontWeight: index === i ? 700 : 400, transition: 'all 0.15s',
            }}
          >{v.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: venture.color,
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          {venture.name}{eyebrow ? ` · ${eyebrow(venture)}` : ''}
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
          {heading ? heading(venture) : `${venture.name} ${title}`}
        </div>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'all 0.15s',
              background: tab === t.key ? 'var(--off-white)' : 'transparent',
              borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
              color: tab === t.key ? 'var(--black)' : 'var(--muted)',
            }}>{t.label}</button>
          ))}
        </div>
      )}

      {children({ venture, tab })}
    </div>
  );
}

/** Shared empty state, so eight pages do not each invent one. */
export function NoRows({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem',
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

/** Marks a row that belongs to the HoldCo rather than the selected venture. */
export function HoldCoTag() {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '0.1rem 0.4rem', marginLeft: '0.4rem',
      border: '1px solid var(--card-border)', color: 'var(--muted)', whiteSpace: 'nowrap',
    }}>HoldCo</span>
  );
}

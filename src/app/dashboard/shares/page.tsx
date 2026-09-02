'use client';

import { SHARES, forVenture, isHoldCo } from '@/lib/finance';
import VenturePageLayout, { NoRows, HoldCoTag, type VentureTab } from '@/components/VenturePageLayout';

const ENTITY_COLORS: Record<string, string> = {
  'Codelude HoldCo (Dubai)':  '#eeeeee',
  'Roborns (Project Entity)': '#dbdbdb',
  'Franchiseen (Project)':    '#c8c8c8',
  'Nanotrade (Project)':        '#adadad',
  'HubCV (Project)':          '#b5b5b5',
  'Llife (Project)':        '#a5a5a5',
};

// The cap table's own second dimension is share class.
const TABS: VentureTab[] = [
  { key: 'all',        label: 'All'        },
  { key: 'Ordinary',   label: 'Ordinary'   },
  { key: 'Ordinary A', label: 'Ordinary A' },
  { key: 'Token Pool', label: 'Token Pool' },
  { key: 'Options',    label: 'Options'    },
];

export default function SharesPage() {
  return (
    <VenturePageLayout
      title="Shares"
      subtitle="Cap table and equity ledger — HoldCo and all project entities."
      pageSlug="shares"
      eyebrow={() => 'cap table'}
      heading={v => `${v.name} Cap Table`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        const scoped = forVenture(SHARES, venture.name);
        const rows = tab === 'all' ? scoped : scoped.filter(s => s.shareClass === tab);
        // Still grouped by legal entity — the HoldCo and the project entity are
        // separate cap tables even when both show under one venture tab.
        const entities = [...new Set(rows.map(s => s.entity))];

        return (
          <>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cap table structure</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
                Codelude HoldCo (Dubai) sits at the top. All five ventures are subsidiaries. Token holders receive <strong style={{ color: 'var(--off-white)' }}>revenue share</strong>, not equity — token issuance does not dilute the cap table. Equity dilution only occurs at the project entity level (Franchiseen, Llife) through SAFE/seed rounds.
              </p>
            </div>

            {entities.length === 0 ? (
              <NoRows>No {tab === 'all' ? '' : `${tab} `}entries for {venture.name}.</NoRows>
            ) : entities.map(entity => {
              const entityRows = rows.filter(s => s.entity === entity);
              const color = ENTITY_COLORS[entity] || 'var(--muted)';
              return (
                <div key={entity} style={{ marginBottom: '1.5rem' }}>
                  <div className="section-label" style={{ color }}>
                    {entity}{isHoldCo(entityRows[0]) && <HoldCoTag />}
                  </div>
                  <table className="tasks-table">
                    <thead>
                      <tr>
                        <th>Shareholder</th>
                        <th>Share class</th>
                        <th style={{ textAlign: 'right' }}>%</th>
                        <th style={{ textAlign: 'right' }}>Shares</th>
                        <th>Vesting</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entityRows.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, fontSize: '0.78rem' }}>{r.shareholder}</td>
                          <td><span className="category-label">{r.shareClass}</span></td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: r.percentage === 100 ? '#dbdbdb' : r.percentage === 0 ? 'var(--muted)' : 'var(--off-white)' }}>
                            {r.percentage > 0 ? `${r.percentage}%` : '—'}
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{r.shares}</td>
                          <td><span className="category-label">{r.vestingSchedule}</span></td>
                          <td><span className="category-label" style={{ fontSize: '0.62rem' }}>{r.notes}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </>
        );
      }}
    </VenturePageLayout>
  );
}

'use client';
import { useState } from 'react';
import { VENTURES, VENTURE_RESOURCES, type ResType, type ResStatus, type ResPriority } from '@/lib/mgmt-ventures';
import VentureTabs from '@/components/VentureTabs';
import { useVenture } from '@/contexts/venture-context';

type Tab = 'human' | 'technology' | 'legal' | 'summary';

const STATUS_STYLES: Record<ResStatus, { color: string; label: string }> = {
  active:  { color: '#5DCAA5', label: 'Active'  },
  needed:  { color: '#FAC775', label: 'Needed'  },
  planned: { color: '#7a7870', label: 'Planned' },
};
const PRIORITY_COLOR: Record<ResPriority, string> = {
  critical: '#ff8080', high: '#FAC775', medium: '#7a7870', low: '#4a4845',
};
const TYPE_COLORS: Record<ResType, string> = {
  Human: '#c8f53a', Technology: '#7F77DD', Legal: '#F0997B', Physical: '#5DCAA5', Financial: '#FAC775',
};

function fmtCost(n: number) {
  if (n === 0) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

import type { Resource } from '@/lib/mgmt-ventures';

function ResourceTable({ resources }: { resources: Resource[] }) {
  if (!resources.length) return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>No resources in this category yet.</div>
  );
  return (
    <table className="tasks-table">
      <thead>
        <tr>
          <th style={{ width: '28%' }}>Resource</th>
          <th>Priority</th>
          <th style={{ textAlign: 'right' }}>Monthly</th>
          <th style={{ textAlign: 'right' }}>One-time</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((r, i) => {
          const ss = STATUS_STYLES[r.status];
          return (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontSize: '0.78rem' }}>{r.name}</td>
              <td>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${PRIORITY_COLOR[r.priority]}40`, color: PRIORITY_COLOR[r.priority] }}>
                  {r.priority}
                </span>
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: r.monthlyCost > 0 ? 'var(--off-white)' : 'var(--muted)' }}>
                {fmtCost(r.monthlyCost)}{r.monthlyCost > 0 ? '/mo' : ''}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: r.oneTimeCost > 0 ? '#FAC775' : 'var(--muted)' }}>
                {fmtCost(r.oneTimeCost)}
              </td>
              <td>
                <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span>
              </td>
              <td>
                <span className="category-label" style={{ fontSize: '0.62rem' }}>{r.notes}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function ResourcesPage() {
  const { vi } = useVenture();
  const [tab, setTab] = useState<Tab>('human');
  const venture = VENTURES[vi];
  const all     = VENTURE_RESOURCES[venture.name] ?? [];

  const byType = (type: ResType) => all.filter(r => r.type === type);

  const tabResources: Record<Tab, Resource[]> = {
    human:      byType('Human'),
    technology: byType('Technology'),
    legal:      [...byType('Legal'), ...byType('Physical'), ...byType('Financial')],
    summary:    [...all].sort((a, b) => {
      const ord = { critical: 0, high: 1, medium: 2, low: 3 };
      return ord[a.priority] - ord[b.priority];
    }),
  };

  const totalMonthly  = all.reduce((s, r) => s + r.monthlyCost, 0);
  const totalOneTime  = all.reduce((s, r) => s + r.oneTimeCost, 0);
  const activeMonthly = all.filter(r => r.status === 'active').reduce((s, r) => s + r.monthlyCost, 0);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'human',      label: `Human (${byType('Human').length})` },
    { key: 'technology', label: `Technology (${byType('Technology').length})` },
    { key: 'legal',      label: `Legal / Physical (${byType('Legal').length + byType('Physical').length + byType('Financial').length})` },
    { key: 'summary',    label: 'Cost Summary' },
  ];

  return (
    <div>
      <h1 className="page-title">Resources</h1>
      <p className="page-sub">All resources needed per venture — human, technology, legal, and physical — with costs.</p>

      <VentureTabs />

      {/* Header + cost snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{venture.sector}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{venture.name} Resources</div>
        </div>
        <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {[
            { label: 'Active monthly',     val: fmtCost(activeMonthly), color: '#5DCAA5' },
            { label: 'Full monthly (needed)', val: fmtCost(totalMonthly), color: '#FAC775' },
            { label: 'One-time capex',     val: fmtCost(totalOneTime),  color: '#F0997B' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--card-bg)', padding: '0.75rem 1.1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: c.color }}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.55rem 1.1rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === t.key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === t.key ? 'var(--black)' : 'var(--muted)',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab !== 'summary' && <ResourceTable resources={tabResources[tab]} />}

      {tab === 'summary' && (
        <div>
          {/* By type breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
            {(['Human', 'Technology', 'Legal', 'Physical', 'Financial'] as ResType[]).map(type => {
              const items    = byType(type);
              const monthly  = items.reduce((s, r) => s + r.monthlyCost, 0);
              const oneTime  = items.reduce((s, r) => s + r.oneTimeCost,  0);
              if (!items.length) return null;
              return (
                <div key={type} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem', borderTop: `2px solid ${TYPE_COLORS[type]}` }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: TYPE_COLORS[type], letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{type}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--off-white)', marginBottom: '0.2rem' }}>{fmtCost(monthly)}/mo</div>
                  {oneTime > 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FAC775' }}>{fmtCost(oneTime)} one-time</div>}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{items.length} resource{items.length !== 1 ? 's' : ''}</div>
                </div>
              );
            })}
            <div style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem', borderTop: '2px solid var(--accent)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.2rem' }}>{fmtCost(totalMonthly)}/mo</div>
              {totalOneTime > 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FAC775' }}>{fmtCost(totalOneTime)} one-time</div>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{all.length} total resources</div>
            </div>
          </div>

          {/* Full sorted table */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
            All resources — sorted by priority
          </div>
          <ResourceTable resources={tabResources.summary} />
        </div>
      )}
    </div>
  );
}

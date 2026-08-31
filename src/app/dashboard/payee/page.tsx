'use client';

import { useState } from 'react';
import { PAYEES, type PayeeStatus, type PayeeFrequency } from '@/lib/finance';
import VenturePageLayout, { NoRows, type VentureTab } from '@/components/VenturePageLayout';
import { sc, scBorder } from '@/lib/status-colors';

const TABS: VentureTab[] = [
  { key: 'all',      label: 'All'      },
  { key: 'monthly',  label: 'Monthly'  },
  { key: 'annual',   label: 'Annual'   },
  { key: 'one-time', label: 'One-time' },
  { key: 'variable', label: 'Variable' },
];

const STATUS_STYLES: Record<PayeeStatus, { color: string; label: string }> = {
  active:    { color: '#5DCAA5', label: 'Active'    },
  pending:   { color: '#FAC775', label: 'Pending'   },
  paused:    { color: 'var(--muted)', label: 'Paused'    },
  cancelled: { color: '#ff8080', label: 'Cancelled' },
};

const FREQ_COLORS: Record<PayeeFrequency, string> = {
  monthly:   '#c8f53a',
  annual:    '#7F77DD',
  'one-time':'#F0997B',
  variable:  '#85B7EB',
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
};

const CATEGORIES = ['All', 'Infrastructure', 'Legal', 'AI Infrastructure', 'Compliance', 'Payments', 'Engineering', 'Manufacturing', 'Operations', 'SaaS'];

export default function PayeePage() {
  const [cat, setCat] = useState('All');

  return (
    <VenturePageLayout
      title="Payee"
      subtitle="Vendor, contractor, and subscription payment registry."
      pageSlug="payee"
      eyebrow={() => 'payees'}
      heading={v => `${v.name} Payees`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        // A payee can serve several ventures, so match on membership.
        const scoped   = PAYEES.filter(p => p.ventures.includes(venture.name));
        const byFreq   = tab === 'all' ? scoped : scoped.filter(p => p.frequency === tab);
        const filtered = byFreq.filter(p => cat === 'All' || p.category === cat);
        const active   = byFreq.filter(p => p.status === 'active').length;
        const monthly  = byFreq.filter(p => p.frequency === 'monthly' && p.status === 'active');

        return (
          <>
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{byFreq.length}</div>
          <div className="tasks-count-label">Total payees</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: sc('#5DCAA5') }}>{active}</div>
          <div className="tasks-count-label">Active</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--accent-text)' }}>~${monthly.reduce((s) => s + 440, 0)}</div>
          <div className="tasks-count-label">Est. monthly (active)</div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? <NoRows>No payees for {venture.name}{cat === 'All' ? '' : ` in ${cat}`}.</NoRows> : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((p, i) => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 100px 120px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>{p.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {p.ventures.map(v => (
                    <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${scBorder(VENTURE_COLORS[v])}`, color: sc(VENTURE_COLORS[v]) }}>{v}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', marginBottom: '0.3rem' }}>{p.amount}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{p.currency}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(FREQ_COLORS[p.frequency])}`, color: sc(FREQ_COLORS[p.frequency]), alignSelf: 'flex-start' }}>{p.frequency}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{p.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color), whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
      )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}

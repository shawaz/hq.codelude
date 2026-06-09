'use client';

import { useState } from 'react';
import { PAYEES, type PayeeStatus, type PayeeFrequency } from '@/lib/finance';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<PayeeStatus, { color: string; label: string }> = {
  active:    { color: '#5DCAA5', label: 'Active'    },
  pending:   { color: '#FAC775', label: 'Pending'   },
  paused:    { color: '#7a7870', label: 'Paused'    },
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
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const CATEGORIES = ['All', 'Infrastructure', 'Legal', 'AI Infrastructure', 'Compliance', 'Payments', 'Engineering', 'Manufacturing', 'Operations', 'SaaS'];

export default function PayeePage() {
  const [cat, setCat] = useState('All');

  const filtered = PAYEES.filter(p => cat === 'All' || p.category === cat);
  const active   = PAYEES.filter(p => p.status === 'active').length;
  const monthly  = PAYEES.filter(p => p.frequency === 'monthly' && p.status === 'active');

  return (
    <div>
      <h1 className="page-title">Payee</h1>
      <p className="page-sub">Vendor, contractor, and subscription payment registry.</p>
      <VentureTabs />

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{PAYEES.length}</div>
          <div className="tasks-count-label">Total payees</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{active}</div>
          <div className="tasks-count-label">Active</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--accent)' }}>~${monthly.reduce((s) => s + 440, 0)}</div>
          <div className="tasks-count-label">Est. monthly (active)</div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((p, i) => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 100px 120px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>{p.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {p.ventures.map(v => (
                    <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${VENTURE_COLORS[v]}40`, color: VENTURE_COLORS[v] }}>{v}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', marginBottom: '0.3rem' }}>{p.amount}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{p.currency}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${FREQ_COLORS[p.frequency]}40`, color: FREQ_COLORS[p.frequency], alignSelf: 'flex-start' }}>{p.frequency}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{p.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${ss.color}40`, color: ss.color, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

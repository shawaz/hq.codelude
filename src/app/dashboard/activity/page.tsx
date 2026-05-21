'use client';

import { useState } from 'react';
import { ACTIVITIES, type ActivityCategory } from '@/lib/management';

const VENTURES  = ['All', 'Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];
const CATEGORIES: (ActivityCategory | 'All')[] = ['All', 'Milestone', 'Launch', 'Decision', 'Product', 'Engineering', 'Partnership', 'Finance', 'Legal', 'Marketing', 'Meeting'];

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const CAT_COLORS: Record<string, string> = {
  Milestone: '#c8f53a', Launch: '#5DCAA5', Decision: '#FAC775',
  Product: '#7F77DD', Engineering: '#85B7EB', Partnership: '#F0997B',
  Finance: '#5DCAA5', Legal: '#FAC775', Marketing: '#c8f53a', Meeting: '#7a7870',
};

export default function ActivityPage() {
  const [venture,  setVenture]  = useState('All');
  const [category, setCategory] = useState<ActivityCategory | 'All'>('All');

  const filtered = ACTIVITIES.filter(a =>
    (venture  === 'All' || a.venture  === venture) &&
    (category === 'All' || a.category === category)
  );

  return (
    <div>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Chronological log of decisions, milestones, and events across all ventures.</p>

      <div className="filter-bar" style={{ marginBottom: '0.5rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: VENTURE_COLORS[v] } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${category === c ? ' active' : ''}`}
            style={category === c && c !== 'All' ? { borderColor: CAT_COLORS[c] || 'var(--accent)', color: CAT_COLORS[c] || 'var(--accent)' } : {}}
            onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((a, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', display: 'grid', gridTemplateColumns: '110px 110px 110px 1fr', gap: '1rem', alignItems: 'start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', paddingTop: '0.1rem' }}>{a.date}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', color: VENTURE_COLORS[a.venture] || 'var(--muted)', paddingTop: '0.1rem' }}>{a.venture}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${CAT_COLORS[a.category] || 'var(--card-border)'}40`, color: CAT_COLORS[a.category] || 'var(--muted)', alignSelf: 'flex-start' }}>{a.category}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.3rem' }}>{a.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{a.description}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ background: 'var(--card-bg)', padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>No activity matches the current filter.</div>
        )}
      </div>
    </div>
  );
}

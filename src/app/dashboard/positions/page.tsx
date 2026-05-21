'use client';
import { useState } from 'react';
import { POSITIONS } from '@/lib/people';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  open:      { color: '#c8f53a', label: 'Open'     },
  hiring:    { color: '#5DCAA5', label: 'Hiring'   },
  filled:    { color: '#7a7870', label: 'Filled'   },
  'on-hold': { color: '#FAC775', label: 'On Hold'  },
};
const PRIORITY_COLOR: Record<string, string> = { critical: '#ff8080', high: '#FAC775', medium: '#7a7870' };
const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};
const TYPES = ['all', 'Full-time', 'Contract', 'Advisory'];

export default function PositionsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const filtered = POSITIONS.filter(p => typeFilter === 'all' || p.type === typeFilter);
  const open = POSITIONS.filter(p => p.status === 'open' || p.status === 'hiring').length;

  return (
    <div>
      <h1 className="page-title">Positions</h1>
      <p className="page-sub">Open roles and headcount plan across all ventures.</p>
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell"><div className="tasks-count-num">{POSITIONS.length}</div><div className="tasks-count-label">Total positions</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#c8f53a' }}>{open}</div><div className="tasks-count-label">Open / Hiring</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#ff8080' }}>{POSITIONS.filter(p => p.priority === 'critical').length}</div><div className="tasks-count-label">Critical priority</div></div>
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {TYPES.map(t => <button key={t} className={`filter-pill${typeFilter === t ? ' active' : ''}`} onClick={() => setTypeFilter(t)}>{t === 'all' ? 'All types' : t}</button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map(p => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={p.id} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderLeft: p.priority === 'critical' ? '2px solid #ff8080' : p.priority === 'high' ? '2px solid #FAC775' : '2px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{p.department} · {p.location} · {p.targetStart}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${PRIORITY_COLOR[p.priority]}40`, color: PRIORITY_COLOR[p.priority] }}>{p.priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', border: `1px solid ${VENTURE_COLORS[p.venture]}40`, color: VENTURE_COLORS[p.venture] }}>{p.venture}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
                {p.keySkills.map((s, i) => <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.15rem 0.55rem', border: '1px solid var(--card-border)' }}>{s}</span>)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{p.notes}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

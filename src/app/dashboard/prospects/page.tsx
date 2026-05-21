'use client';
import { useState } from 'react';
import { PROSPECTS, type ProspectStatus } from '@/lib/sales';

const STATUS_STYLES: Record<ProspectStatus, { color: string; label: string }> = {
  identified:     { color: '#7a7870', label: 'Identified'     },
  researching:    { color: '#85B7EB', label: 'Researching'   },
  'outreach-ready':{ color: '#FAC775', label: 'Ready'        },
  contacted:      { color: '#c8f53a', label: 'Contacted'     },
  responded:      { color: '#5DCAA5', label: 'Responded'     },
};
const TYPE_COLORS: Record<string, string> = { Investor: '#5DCAA5', Partner: '#7F77DD', Customer: '#c8f53a', 'Franchise Brand': '#FAC775', Recruiter: '#85B7EB' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B' };
const PRIORITY_COLOR: Record<string, string> = { high: '#FAC775', medium: '#7a7870' };

export default function ProspectsPage() {
  const [status, setStatus] = useState<ProspectStatus | 'all'>('all');
  const filtered = PROSPECTS.filter(p => status === 'all' || p.status === status);
  return (
    <div>
      <h1 className="page-title">Prospects</h1>
      <p className="page-sub">Top-of-funnel prospect registry — investors, partners, customers, and franchise brands.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${status === 'all' ? ' active' : ''}`} onClick={() => setStatus('all')}>All</button>
        {(Object.entries(STATUS_STYLES) as [ProspectStatus, typeof STATUS_STYLES[ProspectStatus]][]).map(([key, s]) => (
          <button key={key} className={`filter-pill${status === key ? ' active' : ''}`} style={status === key ? { borderColor: s.color, color: s.color } : {}} onClick={() => setStatus(key)}>{s.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((p, i) => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 100px 80px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{p.company}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.08em', padding: '0.12rem 0.45rem', border: `1px solid ${TYPE_COLORS[p.type]}40`, color: TYPE_COLORS[p.type] }}>{p.type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: VENTURE_COLORS[p.venture] }}>{p.venture}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.12rem 0.45rem', border: `1px solid ${PRIORITY_COLOR[p.priority]}40`, color: PRIORITY_COLOR[p.priority], alignSelf: 'flex-start' }}>{p.priority}</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{p.notes}</div>
              <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { GOVT_FILINGS, type GovtStatus, type GovtJurisdiction } from '@/lib/legal-data';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<GovtStatus, { color: string; label: string }> = {
  required:      { color: '#9d9d9d', label: 'Required'     },
  'in-progress': { color: '#eeeeee', label: 'In Progress'  },
  submitted:     { color: '#b5b5b5', label: 'Submitted'    },
  approved:      { color: '#dbdbdb', label: 'Approved'     },
  'not-required':{ color: 'var(--muted)', label: 'Not Required' },
};
const JURIS_COLORS: Record<GovtJurisdiction, string> = { India: '#dbdbdb', UAE: '#eeeeee', International: '#a5a5a5' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8', HubCV: '#b5b5b5', Llife: '#a5a5a5', Nanotrade: '#adadad' };
const JURISDICTIONS: (GovtJurisdiction | 'all')[] = ['all', 'India', 'UAE', 'International'];

export default function GovtPage() {
  const [juris, setJuris] = useState<GovtJurisdiction | 'all'>('all');
  const filtered = GOVT_FILINGS.filter(g => juris === 'all' || g.jurisdiction === juris);
  return (
    <div>
      <h1 className="page-title">Govt</h1>
      <p className="page-sub">Government filings, regulatory clearances, and compliance requirements.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {JURISDICTIONS.map(j => <button key={j} className={`filter-pill${juris === j ? ' active' : ''}`} style={juris === j && j !== 'all' ? { borderColor: JURIS_COLORS[j as GovtJurisdiction], color: sc(JURIS_COLORS[j as GovtJurisdiction]) } : {}} onClick={() => setJuris(j)}>{j === 'all' ? 'All jurisdictions' : j}</button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((g, i) => {
          const ss = STATUS_STYLES[g.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 80px 80px 1fr auto', gap: '1.25rem', alignItems: 'start', borderLeft: g.status === 'required' ? '2px solid #9d9d9d' : '2px solid transparent' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{g.id}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{g.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{g.authority}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(JURIS_COLORS[g.jurisdiction])}`, color: sc(JURIS_COLORS[g.jurisdiction]), alignSelf: 'flex-start' }}>{g.jurisdiction}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: sc(VENTURE_COLORS[g.venture]) }}>{g.venture}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Deadline: {g.deadline}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{g.notes}</div>
              </div>
              <span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}`, whiteSpace: 'nowrap' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

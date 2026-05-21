'use client';

import { useState } from 'react';
import { PARTNERS, type PartnerStatus, type PartnerType } from '@/lib/management';

const STATUSES: (PartnerStatus | 'all')[] = ['all', 'active', 'negotiating', 'prospecting', 'on-hold'];
const TYPES: (PartnerType | 'all')[]      = ['all', 'Technology', 'Distribution', 'Financial', 'Strategic', 'Government', 'Manufacturing'];

const STATUS_STYLES: Record<PartnerStatus, { color: string }> = {
  active:       { color: '#5DCAA5' },
  negotiating:  { color: '#c8f53a' },
  prospecting:  { color: '#FAC775' },
  'on-hold':    { color: '#7a7870' },
};

const TYPE_COLORS: Record<PartnerType, string> = {
  Technology:     '#7F77DD',
  Distribution:   '#85B7EB',
  Financial:      '#5DCAA5',
  Strategic:      '#c8f53a',
  Government:     '#F0997B',
  Manufacturing:  '#FAC775',
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function PartnersPage() {
  const [status, setStatus] = useState<PartnerStatus | 'all'>('all');
  const [type,   setType]   = useState<PartnerType | 'all'>('all');

  const filtered = PARTNERS.filter(p =>
    (status === 'all' || p.status === status) &&
    (type   === 'all' || p.type   === type)
  );

  const counts = {
    active:      PARTNERS.filter(p => p.status === 'active').length,
    negotiating: PARTNERS.filter(p => p.status === 'negotiating').length,
    prospecting: PARTNERS.filter(p => p.status === 'prospecting').length,
  };

  return (
    <div>
      <h1 className="page-title">Partners</h1>
      <p className="page-sub">Strategic partner registry — technology, distribution, financial, and government relationships.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',       val: PARTNERS.length,   color: 'var(--off-white)' },
          { label: 'Active',      val: counts.active,     color: '#5DCAA5' },
          { label: 'Negotiating', val: counts.negotiating,color: '#c8f53a' },
          { label: 'Prospecting', val: counts.prospecting,color: '#FAC775' },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '0.5rem' }}>
        {STATUSES.map(s => (
          <button key={s} className={`filter-pill${status === s ? ' active' : ''}`}
            style={status === s && s !== 'all' ? { borderColor: STATUS_STYLES[s].color, color: STATUS_STYLES[s].color } : {}}
            onClick={() => setStatus(s)}>{s === 'all' ? 'All status' : s}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} className={`filter-pill${type === t ? ' active' : ''}`}
            style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t], color: TYPE_COLORS[t] } : {}}
            onClick={() => setType(t)}>{t === 'all' ? 'All types' : t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((p, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 110px 120px 1fr', gap: '1.25rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem' }}>{p.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {p.ventures.map(v => (
                  <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${VENTURE_COLORS[v]}40`, color: VENTURE_COLORS[v] }}>{v}</span>
                ))}
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[p.type]}40`, color: TYPE_COLORS[p.type] }}>{p.type}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${STATUS_STYLES[p.status].color}40`, color: STATUS_STYLES[p.status].color, alignSelf: 'flex-start' }}>{p.status}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.6rem' }}>{p.role}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--accent)', flexShrink: 0, paddingTop: '0.05rem' }}>→</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{p.nextAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

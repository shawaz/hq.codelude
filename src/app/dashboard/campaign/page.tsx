'use client';
import { useState } from 'react';
import { CAMPAIGNS, type CampaignStatus } from '@/lib/mktg';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<CampaignStatus, { color: string; label: string }> = {
  live:      { color: '#dbdbdb', label: 'Live'      },
  planned:   { color: '#eeeeee', label: 'Planned'   },
  draft:     { color: '#b5b5b5', label: 'Draft'     },
  completed: { color: 'var(--muted)', label: 'Completed' },
};
const TYPE_COLORS: Record<string, string> = { Content: '#c8c8c8', Email: '#a5a5a5', Social: '#eeeeee', PR: '#dbdbdb', Community: '#adadad', Paid: '#b5b5b5' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8', HubCV: '#b5b5b5', Llife: '#a5a5a5', Nanotrade: '#adadad' };

export default function CampaignPage() {
  const [status, setStatus] = useState<CampaignStatus | 'all'>('all');
  const filtered = CAMPAIGNS.filter(c => status === 'all' || c.status === status);
  return (
    <div>
      <h1 className="page-title">Campaign</h1>
      <p className="page-sub">Marketing campaigns across all ventures — planning, execution, and goals.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${status === 'all' ? ' active' : ''}`} onClick={() => setStatus('all')}>All</button>
        {(Object.entries(STATUS_STYLES) as [CampaignStatus, typeof STATUS_STYLES[CampaignStatus]][]).map(([key, s]) => (
          <button key={key} className={`filter-pill${status === key ? ' active' : ''}`} style={status === key ? { borderColor: s.color, color: sc(s.color) } : {}} onClick={() => setStatus(key)}>{s.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((c, i) => {
          const ss = STATUS_STYLES[c.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 90px auto', gap: '1rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>{c.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>{c.channel}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>Goal: {c.goal}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 300, marginTop: '0.3rem' }}>{c.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: sc(VENTURE_COLORS[c.venture]), alignSelf: 'flex-start' }}>{c.venture}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[c.type])}`, color: sc(TYPE_COLORS[c.type]), alignSelf: 'flex-start' }}>{c.type}</span>
              <span className="category-label">{c.start}</span>
              <span className="category-label">{c.end}</span>
              <span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}`, whiteSpace: 'nowrap' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

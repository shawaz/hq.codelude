'use client';
import { useState } from 'react';
import { COMPETITORS } from '@/lib/mktg';
import { usePageScopes } from '@/lib/use-page-scopes';
import { sc, scBorder } from '@/lib/status-colors';
import { scopeColor } from '@/lib/ventures';

const TYPE_COLORS: Record<string, string> = { Direct: '#9d9d9d', Indirect: '#b5b5b5', Adjacent: '#a5a5a5' };


export default function CompetitionPage() {
  const { names: allowed } = usePageScopes('competition');
  const VENTURES = ['All', ...allowed];
  const [venture, setVenture] = useState('All');
  const filtered = COMPETITORS.filter(c =>
    allowed.includes(c.venture) && (venture === 'All' || c.venture === venture),
  );
  return (
    <div>
      <h1 className="page-title">Competition</h1>
      <p className="page-sub">Competitor intelligence — direct, indirect, and adjacent competition per venture.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {VENTURES.map(v => <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`} style={venture === v && v !== 'All' ? { borderColor: scopeColor(v), color: sc(scopeColor(v)) } : {}} onClick={() => setVenture(v)}>{v}</button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((c, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '180px 90px 1fr 1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>{c.name}</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: sc(scopeColor(c.venture)) }}>{c.venture}</span>
              {c.url && (
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                   style={{ display: 'block', marginTop: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {c.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[c.type])}`, color: sc(TYPE_COLORS[c.type]), alignSelf: 'flex-start' }}>{c.type}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: sc('#dbdbdb'), letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Strength</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{c.strength}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: sc('#9d9d9d'), letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Weakness</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{c.weakness}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--accent-text)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Our edge</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{c.ourEdge}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

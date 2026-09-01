'use client';

import { useState } from 'react';
import { STRATEGIES } from '@/lib/management';
import { sc, scBorder } from '@/lib/status-colors';

type Tab = 'positioning' | 'initiatives' | 'risks' | 'vision';

const TABS: { key: Tab; label: string }[] = [
  { key: 'positioning',  label: 'Positioning' },
  { key: 'initiatives',  label: 'Initiatives' },
  { key: 'risks',        label: 'Risks' },
  { key: 'vision',       label: '3-Year Vision' },
];

const PRIORITY_COLOR = { critical: '#9d9d9d', high: '#b5b5b5', medium: 'var(--muted)' };
const STATUS_COLOR   = { active: '#dbdbdb',  planned: '#eeeeee', 'on-hold': 'var(--muted)' };
const SEVERITY_COLOR = { high: '#9d9d9d', medium: '#b5b5b5', low: 'var(--muted)' };

export default function StrategyPage() {
  const [vi, setVi] = useState(0);
  const [tab, setTab] = useState<Tab>('positioning');
  const s = STRATEGIES[vi];

  return (
    <div>
      <h1 className="page-title">Strategy</h1>
      <p className="page-sub">Strategic positioning, key initiatives, risks, and 3-year vision per venture.</p>

      {/* Venture tabs */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {STRATEGIES.map((v, i) => (
          <button key={v.name} onClick={() => { setVi(i); setTab('positioning'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem', background: vi === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            letterSpacing: '0.06em', color: vi === i ? 'var(--black)' : 'var(--muted)', fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.name}</button>
        ))}
      </div>

      <div style={{ borderLeft: `2px solid ${s.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: sc(s.color), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{s.name}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Strategic overview</div>
      </div>

      {/* Plan type tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === t.key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === t.key ? 'var(--black)' : 'var(--muted)',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'positioning' && (
        <div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `2px solid ${s.color}`, padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Strategic positioning</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300 }}>{s.positioning}</p>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-text)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Competitive advantages</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {s.competitiveAdvantages.map((a, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '0.9rem 1.25rem', display: 'grid', gridTemplateColumns: '1.5rem 1fr', gap: '0.75rem', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: sc(s.color), paddingTop: '0.1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)', lineHeight: 1.7, fontWeight: 300 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'initiatives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {s.initiatives.map((init, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{init.title}</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(PRIORITY_COLOR[init.priority])}`, color: sc(PRIORITY_COLOR[init.priority]) }}>{init.priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(STATUS_COLOR[init.status])}`, color: sc(STATUS_COLOR[init.status]) }}>{init.status}</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{init.description}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {s.risks.map((r, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Risk</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{r.risk}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Mitigation</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{r.mitigation}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', border: `1px solid ${scBorder(SEVERITY_COLOR[r.severity])}`, color: sc(SEVERITY_COLOR[r.severity]), whiteSpace: 'nowrap' }}>{r.severity}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'vision' && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `2px solid ${s.color}`, padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: sc(s.color), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>3-year vision — {s.name}</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--off-white)', lineHeight: 2, fontWeight: 300 }}>{s.threeYearVision}</p>
        </div>
      )}
    </div>
  );
}

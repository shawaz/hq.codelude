'use client';

import { useState } from 'react';
import { RELATIONS, type RelationCategory, type RelationHealth } from '@/lib/management';

const CATEGORIES: (RelationCategory | 'all')[] = ['all', 'Investor', 'Government', 'Media', 'Community', 'Advisor', 'Customer'];

const HEALTH_STYLES: Record<RelationHealth, { color: string; label: string }> = {
  strong:     { color: '#5DCAA5', label: 'Strong'     },
  developing: { color: '#c8f53a', label: 'Developing' },
  cold:       { color: '#7a7870', label: 'Cold'       },
  target:     { color: '#F0997B', label: 'Target'     },
};

const CAT_COLORS: Record<RelationCategory, string> = {
  Investor:   '#5DCAA5',
  Government: '#F0997B',
  Media:      '#c8f53a',
  Community:  '#7F77DD',
  Advisor:    '#FAC775',
  Customer:   '#85B7EB',
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function RelationsPage() {
  const [category, setCategory] = useState<RelationCategory | 'all'>('all');
  const [health,   setHealth]   = useState<RelationHealth | 'all'>('all');

  const filtered = RELATIONS.filter(r =>
    (category === 'all' || r.category === category) &&
    (health   === 'all' || r.health   === health)
  );

  return (
    <div>
      <h1 className="page-title">Relations</h1>
      <p className="page-sub">Stakeholder map — investors, government, media, community, advisors, and customers.</p>

      {/* Health summary */}
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {(Object.entries(HEALTH_STYLES) as [RelationHealth, typeof HEALTH_STYLES[RelationHealth]][]).map(([key, s]) => (
          <div key={key} className="tasks-count-cell" style={{ cursor: 'pointer' }} onClick={() => setHealth(health === key ? 'all' : key)}>
            <div className="tasks-count-num" style={{ color: s.color }}>{RELATIONS.filter(r => r.health === key).length}</div>
            <div className="tasks-count-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '0.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${category === c ? ' active' : ''}`}
            style={category === c && c !== 'all' ? { borderColor: CAT_COLORS[c], color: CAT_COLORS[c] } : {}}
            onClick={() => setCategory(c)}>{c === 'all' ? 'All categories' : c}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${health === 'all' ? ' active' : ''}`} onClick={() => setHealth('all')}>All health</button>
        {(Object.entries(HEALTH_STYLES) as [RelationHealth, typeof HEALTH_STYLES[RelationHealth]][]).map(([key, s]) => (
          <button key={key} className={`filter-pill${health === key ? ' active' : ''}`}
            style={health === key ? { borderColor: s.color, color: s.color } : {}}
            onClick={() => setHealth(key)}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((r, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 100px 100px 1fr', gap: '1.25rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>{r.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {r.ventures.map(v => (
                  <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${VENTURE_COLORS[v]}40`, color: VENTURE_COLORS[v] }}>{v}</span>
                ))}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${CAT_COLORS[r.category]}40`, color: CAT_COLORS[r.category], alignSelf: 'flex-start' }}>{r.category}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${HEALTH_STYLES[r.health].color}40`, color: HEALTH_STYLES[r.health].color, alignSelf: 'flex-start' }}>{HEALTH_STYLES[r.health].label}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.5rem' }}>{r.description}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Last contact</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>{r.lastContact}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Next step</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', lineHeight: 1.5 }}>{r.nextStep}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

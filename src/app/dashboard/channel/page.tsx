'use client';

import { useState } from 'react';
import { CHANNELS, type ChannelType, type ChannelStatus } from '@/lib/management';

const TYPES: (ChannelType | 'all')[]       = ['all', 'Marketing', 'Sales', 'Distribution', 'Community', 'Internal'];
const STATUSES: (ChannelStatus | 'all')[]  = ['all', 'active', 'building', 'planned'];

const TYPE_COLORS: Record<ChannelType, string> = {
  Marketing:    '#c8f53a',
  Sales:        '#F0997B',
  Distribution: '#7F77DD',
  Community:    '#5DCAA5',
  Internal:     '#85B7EB',
};

const STATUS_STYLES: Record<ChannelStatus, { color: string; label: string }> = {
  active:   { color: '#5DCAA5', label: 'Active'   },
  building: { color: '#c8f53a', label: 'Building' },
  planned:  { color: '#7a7870', label: 'Planned'  },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function ChannelPage() {
  const [type,   setType]   = useState<ChannelType | 'all'>('all');
  const [status, setStatus] = useState<ChannelStatus | 'all'>('all');

  const filtered = CHANNELS.filter(c =>
    (type   === 'all' || c.type   === type) &&
    (status === 'all' || c.status === status)
  );

  const active   = CHANNELS.filter(c => c.status === 'active').length;
  const building = CHANNELS.filter(c => c.status === 'building').length;
  const planned  = CHANNELS.filter(c => c.status === 'planned').length;

  return (
    <div>
      <h1 className="page-title">Channel</h1>
      <p className="page-sub">All marketing, sales, distribution, community, and internal channels across every venture.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',    val: CHANNELS.length, color: 'var(--off-white)' },
          { label: 'Active',   val: active,           color: '#5DCAA5' },
          { label: 'Building', val: building,          color: '#c8f53a' },
          { label: 'Planned',  val: planned,           color: '#7a7870' },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '0.5rem' }}>
        {TYPES.map(t => (
          <button key={t} className={`filter-pill${type === t ? ' active' : ''}`}
            style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t], color: TYPE_COLORS[t] } : {}}
            onClick={() => setType(t)}>{t === 'all' ? 'All types' : t}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {STATUSES.map(s => (
          <button key={s} className={`filter-pill${status === s ? ' active' : ''}`}
            style={status === s && s !== 'all' ? { borderColor: STATUS_STYLES[s].color, color: STATUS_STYLES[s].color } : {}}
            onClick={() => setStatus(s)}>{s === 'all' ? 'All status' : STATUS_STYLES[s]?.label ?? s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((c, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', display: 'grid', gridTemplateColumns: '180px 110px 110px 1fr auto', gap: '1rem', alignItems: 'start' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{c.name}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[c.type]}40`, color: TYPE_COLORS[c.type], alignSelf: 'flex-start' }}>{c.type}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {c.ventures.map(v => (
                <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${VENTURE_COLORS[v]}40`, color: VENTURE_COLORS[v] }}>{v}</span>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.4rem' }}>{c.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--accent)' }}>metric</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--off-white)' }}>{c.metric}</span>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${STATUS_STYLES[c.status].color}40`, color: STATUS_STYLES[c.status].color, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{STATUS_STYLES[c.status].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

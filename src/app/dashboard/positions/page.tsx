'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { POSITIONS, APPLICATIONS } from '@/lib/people';

const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5', sector: 'Zero-Waste Data Infrastructure' },
  { name: 'Franchiseen', color: '#7F77DD', sector: 'Franchise Investment Platform'  },
  { name: 'HubCV',       color: '#FAC775', sector: 'AI Talent Marketplace'           },
  { name: 'Cuestay',     color: '#85B7EB', sector: 'Smart Home Ecosystem'            },
  { name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Copy-Trading'      },
];

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  open:      { color: '#c8f53a', label: 'Open'    },
  'on-hold': { color: '#FAC775', label: 'On Hold' },
  closed:    { color: '#7a7870', label: 'Closed'  },
};
const PRIORITY_COLOR: Record<string, string> = {
  critical: '#ff8080', high: '#FAC775', medium: '#7a7870',
};
const PHASE_COLORS: Record<string, string> = {
  'Y1 — Pre-ops':    '#5DCAA5',
  'Y1 — Operations': '#3da882',
  'Y2 — Scale':      '#FAC775',
  'Y3 — Growth':     '#85B7EB',
  'Y4 — Mature':     '#7F77DD',
};

export default function PositionsPage() {
  const router = useRouter();
  const [vi,           setVi]           = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter,   setTypeFilter]   = useState('all');

  const venture  = VENTURES[vi];
  const allForV  = POSITIONS.filter(p => p.venture === venture.name);
  const filtered = allForV.filter(p =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (typeFilter   === 'all' || p.type   === typeFilter)
  );

  const openCount = allForV.filter(p => p.status === 'open').length;
  const holdCount = allForV.filter(p => p.status === 'on-hold').length;
  const critCount = allForV.filter(p => p.priority === 'critical').length;

  const appCount = (posId: string) =>
    APPLICATIONS.filter(a => a.positionId === posId).length;

  return (
    <div>
      <h1 className="page-title">Positions</h1>
      <p className="page-sub">Headcount plan and open roles — per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => { setVi(i); setStatusFilter('all'); setTypeFilter('all'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem',
            background: vi === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: vi === i ? 'var(--black)' : 'var(--muted)',
            fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          {venture.sector}
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{venture.name} Positions</div>
      </div>

      {/* Stats */}
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#c8f53a' }}>{openCount}</div><div className="tasks-count-label">Open</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#FAC775' }}>{holdCount}</div><div className="tasks-count-label">On hold</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#ff8080' }}>{critCount}</div><div className="tasks-count-label">Critical priority</div></div>
      </div>

      {/* Single filter row */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'open', 'on-hold', 'closed'] as const).map(s => (
          <button key={s} className={`filter-pill${statusFilter === s ? ' active' : ''}`}
            style={statusFilter === s && s !== 'all' ? { borderColor: STATUS_STYLES[s].color, color: STATUS_STYLES[s].color } : {}}
            onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'All statuses' : STATUS_STYLES[s].label}
          </button>
        ))}
        <span style={{ color: 'var(--card-border)', padding: '0 0.1rem', alignSelf: 'center', fontSize: '0.9rem' }}>|</span>
        {(['all', 'Full-time', 'Contract', 'Advisory'] as const).map(t => (
          <button key={t} className={`filter-pill${typeFilter === t ? ' active' : ''}`}
            style={typeFilter === t && t !== 'all' ? { borderColor: venture.color, color: venture.color } : {}}
            onClick={() => setTypeFilter(t)}>
            {t === 'all' ? 'All types' : t}
          </button>
        ))}
      </div>

      {/* Position list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map(p => {
          const ss         = STATUS_STYLES[p.status] ?? { color: '#7a7870', label: p.status };
          const phaseColor = p.phase ? (PHASE_COLORS[p.phase] ?? '#7a7870') : null;
          const apps       = appCount(p.id);
          return (
            <div key={p.id}
              onClick={() => router.push(`/dashboard/application?position=${p.id}`)}
              style={{
                background: 'var(--card-bg)', padding: '1.25rem 1.5rem', cursor: 'pointer',
                borderLeft: p.priority === 'critical' ? '2px solid #ff8080'
                          : p.priority === 'high'     ? '2px solid #FAC775'
                          : '2px solid transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--card-bg)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.title}</div>
                    {apps > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', padding: '0.1rem 0.45rem', background: `${venture.color}20`, border: `1px solid ${venture.color}60`, color: venture.color, borderRadius: 0 }}>
                        {apps} application{apps > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span>{p.department}</span>
                    <span>·</span>
                    <span>{p.location}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--off-white)' }}>{p.targetStart}</span>
                    {p.salaryRange && <><span>·</span><span style={{ color: venture.color }}>{p.salaryRange}</span></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '50%' }}>
                  {p.phase && phaseColor && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem', border: `1px solid ${phaseColor}40`, color: phaseColor }}>{p.phase}</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${PRIORITY_COLOR[p.priority]}40`, color: PRIORITY_COLOR[p.priority] }}>{p.priority}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', border: `1px solid ${venture.color}40`, color: venture.color }}>{p.type}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
                {p.keySkills.map((s, i) => (
                  <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.15rem 0.55rem', border: '1px solid var(--card-border)' }}>{s}</span>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{p.notes}</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ background: 'var(--card-bg)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>No positions match filter.</div>
        )}
      </div>
    </div>
  );
}

'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { APPLICATIONS, POSITIONS } from '@/lib/people';

const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5', sector: 'Zero-Waste Data Infrastructure' },
  { name: 'Franchiseen', color: '#7F77DD', sector: 'Franchise Investment Platform'  },
  { name: 'HubCV',       color: '#FAC775', sector: 'AI Talent Marketplace'           },
  { name: 'Cuestay',     color: '#85B7EB', sector: 'Smart Home Ecosystem'            },
  { name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Copy-Trading'      },
];

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  new:       { color: '#c8f53a', label: 'New'       },
  screening: { color: '#FAC775', label: 'Screening' },
  interview: { color: '#85B7EB', label: 'Interview' },
  offer:     { color: '#5DCAA5', label: 'Offer'     },
  hired:     { color: '#5DCAA5', label: 'Hired'     },
  rejected:  { color: '#7a7870', label: 'Rejected'  },
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#ff8080', high: '#FAC775', medium: '#7a7870',
};

function ApplicationsContent() {
  const params   = useSearchParams();
  const router   = useRouter();
  const posParam = params.get('position');

  // Derive initial venture from URL position param
  const initVi = () => {
    if (posParam) {
      const pos = POSITIONS.find(p => p.id === posParam);
      if (pos) {
        const idx = VENTURES.findIndex(v => v.name === pos.venture);
        if (idx >= 0) return idx;
      }
    }
    return 0;
  };

  const [vi,           setVi]           = useState<number>(initVi);
  const [posFilter,    setPosFilter]    = useState<string>(posParam ?? 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  const venture = VENTURES[vi];

  // All applications belonging to this venture
  const ventureApps = APPLICATIONS.filter(a => {
    const pos = POSITIONS.find(p => p.id === a.positionId);
    return pos?.venture === venture.name;
  });

  // Positions for this venture that have at least one application
  const positionsWithApps = POSITIONS.filter(p =>
    p.venture === venture.name && APPLICATIONS.some(a => a.positionId === p.id)
  );

  // Apply filters
  const filtered = ventureApps.filter(a =>
    (posFilter    === 'all' || a.positionId === posFilter) &&
    (statusFilter === 'all' || a.status    === statusFilter)
  );

  const byStatus = (s: string) => ventureApps.filter(a => a.status === s).length;

  const selectedPos = posFilter !== 'all'
    ? POSITIONS.find(p => p.id === posFilter)
    : null;

  return (
    <div>
      <h1 className="page-title">Applications</h1>
      <p className="page-sub">Candidate pipeline across all open positions — per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {VENTURES.map((v, i) => (
          <button key={v.name}
            onClick={() => { setVi(i); setPosFilter('all'); setStatusFilter('all'); setExpandedId(null); router.replace('/dashboard/application'); }}
            style={{
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
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{venture.name} Applications</div>
      </div>

      {/* Stats */}
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell"><div className="tasks-count-num">{ventureApps.length}</div><div className="tasks-count-label">Total</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#FAC775' }}>{byStatus('screening')}</div><div className="tasks-count-label">Screening</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#85B7EB' }}>{byStatus('interview')}</div><div className="tasks-count-label">Interview</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{byStatus('offer') + byStatus('hired')}</div><div className="tasks-count-label">Offer / Hired</div></div>
      </div>

      {/* Position context chip (when arriving from positions page) */}
      {selectedPos && (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>Showing:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.2rem 0.6rem', background: `${venture.color}15`, border: `1px solid ${venture.color}50`, color: venture.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedPos.title}
            <button onClick={() => { setPosFilter('all'); router.replace('/dashboard/application'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: '0.7rem', lineHeight: 1, opacity: 0.7 }}>×</button>
          </span>
        </div>
      )}

      {/* Filters — single row */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Status filter */}
        {(['all', 'new', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const).map(s => (
          <button key={s} className={`filter-pill${statusFilter === s ? ' active' : ''}`}
            style={statusFilter === s && s !== 'all' ? { borderColor: STATUS_STYLES[s]?.color, color: STATUS_STYLES[s]?.color } : {}}
            onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'All stages' : STATUS_STYLES[s].label}
          </button>
        ))}
        {/* Separator — only if positions with apps exist */}
        {positionsWithApps.length > 0 && (
          <>
            <span style={{ color: 'var(--card-border)', padding: '0 0.1rem', alignSelf: 'center', fontSize: '0.9rem' }}>|</span>
            <button className={`filter-pill${posFilter === 'all' ? ' active' : ''}`}
              onClick={() => { setPosFilter('all'); router.replace('/dashboard/application'); }}>
              All positions
            </button>
            {positionsWithApps.map(p => (
              <button key={p.id} className={`filter-pill${posFilter === p.id ? ' active' : ''}`}
                style={posFilter === p.id ? { borderColor: venture.color, color: venture.color } : {}}
                onClick={() => { setPosFilter(p.id); router.replace(`/dashboard/application?position=${p.id}`); }}>
                {p.title}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Application list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--card-bg)', padding: '3rem 2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.8 }}>
            No applications yet for {venture.name}.<br />
            <span style={{ fontSize: '0.62rem' }}>Applications will appear here once candidates are added.</span>
          </div>
        ) : filtered.map(a => {
          const ss       = STATUS_STYLES[a.status] ?? { color: '#7a7870', label: a.status };
          const pos      = POSITIONS.find(p => p.id === a.positionId);
          const isOpen   = expandedId === a.id;
          return (
            <div key={a.id} style={{ background: 'var(--card-bg)', borderLeft: `2px solid ${ss.color}40` }}>
              {/* Card header — always visible, clickable */}
              <div
                onClick={() => setExpandedId(isOpen ? null : a.id)}
                style={{ padding: '1.1rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
                  transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{a.name}</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ color: venture.color }}>{a.position}</span>
                    <span>·</span>
                    <span>{a.source}</span>
                    <span>·</span>
                    <span>{a.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {pos && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem',
                      border: `1px solid ${PRIORITY_COLOR[pos.priority]}40`, color: PRIORITY_COLOR[pos.priority] }}>{pos.priority}</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', transition: 'transform 0.15s',
                    display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.25rem', borderTop: '1px solid var(--card-border)' }}>
                  {/* Notes */}
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: venture.color, marginBottom: '0.5rem' }}>Notes</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{a.notes}</div>
                  </div>

                  {/* Position context */}
                  {pos && (
                    <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', marginBottom: '1rem' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: venture.color, marginBottom: '0.5rem' }}>Position</div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>{pos.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span>{pos.department}</span><span>·</span>
                        <span>{pos.location}</span><span>·</span>
                        <span style={{ color: 'var(--off-white)' }}>{pos.targetStart}</span>
                        {pos.salaryRange && <><span>·</span><span style={{ color: venture.color }}>{pos.salaryRange}</span></>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {pos.keySkills.map((s, i) => (
                          <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', padding: '0.12rem 0.45rem', border: '1px solid var(--card-border)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['screening', 'interview', 'offer', 'hired', 'rejected'] as const)
                      .filter(s => s !== a.status)
                      .map(s => (
                        <button key={s} style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '0.3rem 0.8rem', border: `1px solid ${STATUS_STYLES[s]?.color ?? '#7a7870'}40`,
                          color: STATUS_STYLES[s]?.color ?? '#7a7870', background: 'transparent', cursor: 'pointer',
                          transition: 'all 0.12s',
                        }}>
                          → {STATUS_STYLES[s]?.label ?? s}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>Loading…</div>}>
      <ApplicationsContent />
    </Suspense>
  );
}

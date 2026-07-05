'use client';
import { useState } from 'react';
import { VENTURES, VENTURE_PARTNERS, type PartnerStatus, type PartnerType } from '@/lib/mgmt-ventures';
import VentureTabs from '@/components/VentureTabs';
import { useVenture } from '@/contexts/venture-context';

const STATUS_STYLES: Record<PartnerStatus, { color: string; label: string }> = {
  active:       { color: '#5DCAA5', label: 'Active'      },
  negotiating:  { color: '#c8f53a', label: 'Negotiating' },
  prospecting:  { color: '#FAC775', label: 'Prospecting' },
  'on-hold':    { color: '#7a7870', label: 'On Hold'     },
  identified:   { color: '#85B7EB', label: 'Identified'  },
};
const TYPE_COLORS: Record<PartnerType, string> = {
  Technology: '#7F77DD', Distribution: '#85B7EB', Financial: '#5DCAA5',
  Strategic: '#c8f53a', Government: '#F0997B', Manufacturing: '#FAC775', Legal: '#ff8080',
};

export default function PartnersPage() {
  const { vi } = useVenture();
  const [filter, setFilter] = useState<PartnerStatus | 'all'>('all');
  const venture  = VENTURES[vi];
  const all      = VENTURE_PARTNERS[venture.name] ?? [];
  const partners = all.filter(p => filter === 'all' || p.status === filter);

  return (
    <div>
      <h1 className="page-title">Partners</h1>
      <p className="page-sub">Strategic partner registry — per venture.</p>
      <VentureTabs />
      <div style={{ borderLeft:`2px solid ${venture.color}`,paddingLeft:'1rem',marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:venture.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize:'1.3rem',fontWeight:700,letterSpacing:'-0.01em' }}>{venture.name} Partners</div>
      </div>
      <div className="filter-bar" style={{ marginBottom:'1.5rem' }}>
        {(['all','active','negotiating','prospecting','on-hold'] as const).map(s => (
          <button key={s} className={`filter-pill${filter===s?' active':''}`}
            style={filter===s&&s!=='all'?{ borderColor:STATUS_STYLES[s]?.color,color:STATUS_STYLES[s]?.color }:{}}
            onClick={() => setFilter(s)}>{s==='all'?`All (${all.length})`:STATUS_STYLES[s].label}</button>
        ))}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)' }}>
        {partners.map((p, i) => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={i} style={{ background:'var(--card-bg)',padding:'1.25rem 1.5rem',display:'grid',gridTemplateColumns:'200px 110px 1fr auto',gap:'1.25rem',alignItems:'start' }}>
              <div>
                <div style={{ fontWeight:600,fontSize:'0.82rem',marginBottom:'0.25rem' }}>{p.name}</div>
                <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.12rem 0.45rem',border:`1px solid ${TYPE_COLORS[p.type]}40`,color:TYPE_COLORS[p.type] }}>{p.type}</span>
              </div>
              <span className="status-badge" style={{ color:ss.color,borderColor:`${ss.color}40`,alignSelf:'flex-start' }}>{ss.label}</span>
              <div>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--muted)',lineHeight:1.7,fontWeight:300,marginBottom:'0.5rem' }}>{p.role}</div>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'0.4rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',color:'var(--accent)',flexShrink:0,paddingTop:'0.05rem' }}>→</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--off-white)',lineHeight:1.6,fontWeight:300 }}>{p.nextAction}</span>
                </div>
              </div>
            </div>
          );
        })}
        {partners.length===0&&<div style={{ background:'var(--card-bg)',padding:'2rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)',textAlign:'center' }}>No partners match filter.</div>}
      </div>
    </div>
  );
}

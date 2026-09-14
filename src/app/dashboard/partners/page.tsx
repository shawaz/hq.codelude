'use client';
import { useState } from 'react';
import { VENTURE_PARTNERS, type PartnerStatus, type PartnerType } from '@/lib/mgmt-ventures';
import { useActiveScope } from '@/lib/use-active-scope';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<PartnerStatus, { color: string; label: string }> = {
  active:       { color: '#dbdbdb', label: 'Active'      },
  negotiating:  { color: '#eeeeee', label: 'Negotiating' },
  prospecting:  { color: '#b5b5b5', label: 'Prospecting' },
  'on-hold':    { color: 'var(--muted)', label: 'On Hold'     },
};
const TYPE_COLORS: Record<PartnerType, string> = {
  Technology: '#c8c8c8', Distribution: '#a5a5a5', Financial: '#dbdbdb',
  Strategic: '#eeeeee', Government: '#adadad', Manufacturing: '#b5b5b5', Legal: '#9d9d9d',
};

export default function PartnersPage() {
  const { scope: venture, loading } = useActiveScope('partners');
  const [filter, setFilter] = useState<PartnerStatus | 'all'>('all');

  // A member with no grant on this page has no venture to render.
  if (loading) return null;
  if (!venture) {
    return (
      <div>
        <h1 className="page-title">Partners</h1>
        <div style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',padding:'2rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)' }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }
  const all      = VENTURE_PARTNERS[venture.name] ?? [];
  const partners = all.filter(p => filter === 'all' || p.status === filter);

  return (
    <div>
      <h1 className="page-title">Partners</h1>
      <p className="page-sub">Strategic partner registry — per venture.</p>
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
                <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.12rem 0.45rem',border:`1px solid ${scBorder(TYPE_COLORS[p.type])}`,color:sc(TYPE_COLORS[p.type]) }}>{p.type}</span>
              </div>
              <span className="status-badge" style={{ color:sc(ss.color),borderColor:`${scBorder(ss.color)}`,alignSelf:'flex-start' }}>{ss.label}</span>
              <div>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--muted)',lineHeight:1.7,fontWeight:300,marginBottom:'0.5rem' }}>{p.role}</div>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'0.4rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',color:'var(--accent-text)',flexShrink:0,paddingTop:'0.05rem' }}>→</span>
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

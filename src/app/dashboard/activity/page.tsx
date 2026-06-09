'use client';
import { useState } from 'react';
import { VENTURES, VENTURE_ACTIVITIES } from '@/lib/mgmt-ventures';
import VentureTabs from '@/components/VentureTabs';
import { useVenture } from '@/contexts/venture-context';

const CAT_COLORS: Record<string, string> = {
  Milestone:'#c8f53a',Launch:'#5DCAA5',Decision:'#FAC775',Product:'#7F77DD',
  Engineering:'#85B7EB',Partnership:'#F0997B',Finance:'#5DCAA5',Legal:'#FAC775',Marketing:'#c8f53a',Meeting:'#7a7870',
};

export default function ActivityPage() {
  const { vi } = useVenture();
  const venture = VENTURES[vi];
  const items = [...(VENTURE_ACTIVITIES[venture.name] ?? [])].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Chronological log of decisions, milestones, and events — per venture.</p>
      <VentureTabs />
      <div style={{ borderLeft:`2px solid ${venture.color}`,paddingLeft:'1rem',marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:venture.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize:'1.3rem',fontWeight:700,letterSpacing:'-0.01em' }}>{venture.name} — {items.length} events</div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)' }}>
        {items.map((a,i) => (
          <div key={i} style={{ background:'var(--card-bg)',padding:'1rem 1.5rem',display:'grid',gridTemplateColumns:'100px 110px 1fr',gap:'1rem',alignItems:'start' }}>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--muted)',paddingTop:'0.1rem' }}>{a.date}</span>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.58rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.15rem 0.5rem',border:`1px solid ${CAT_COLORS[a.category]||'var(--card-border)'}40`,color:CAT_COLORS[a.category]||'var(--muted)',alignSelf:'flex-start' }}>{a.category}</span>
            <div>
              <div style={{ fontWeight:600,fontSize:'0.78rem',marginBottom:'0.25rem' }}>{a.title}</div>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.67rem',color:'var(--muted)',lineHeight:1.7,fontWeight:300 }}>{a.description}</div>
            </div>
          </div>
        ))}
        {items.length===0&&<div style={{ background:'var(--card-bg)',padding:'2rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)',textAlign:'center' }}>No activity logged for {venture.name} yet.</div>}
      </div>
    </div>
  );
}

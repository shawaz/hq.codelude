'use client';
import { useState } from 'react';
import { VENTURES, VENTURE_RELATIONS, type RHealth } from '@/lib/mgmt-ventures';
import { usePageScopes, clampIndex } from '@/lib/use-page-scopes';

const HEALTH_STYLES: Record<RHealth,{color:string;label:string}> = {
  strong:{color:'#5DCAA5',label:'Strong'},developing:{color:'#c8f53a',label:'Developing'},cold:{color:'#7a7870',label:'Cold'},target:{color:'#F0997B',label:'Target'},
};
const CAT_COLORS: Record<string,string> = {
  Investor:'#5DCAA5',Government:'#F0997B',Media:'#c8f53a',Community:'#7F77DD',Advisor:'#FAC775',Customer:'#85B7EB',
};

export default function RelationsPage() {
  const { names: allowed, loading } = usePageScopes('relations');
  const ventures = VENTURES.filter(v => allowed.includes(v.name));
  const [vi, setVi] = useState(0);
  const index = clampIndex(vi, ventures.length);
  const venture   = ventures[index];

  // A member with no grant on this page has no venture to render.
  if (loading) return null;
  if (!venture) {
    return (
      <div>
        <h1 className="page-title">Relations</h1>
        <div style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',padding:'2rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)' }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }
  const relations = VENTURE_RELATIONS[venture.name] ?? [];

  return (
    <div>
      <h1 className="page-title">Relations</h1>
      <p className="page-sub">Stakeholder relationships — investors, government, media, and customers per venture.</p>
      <div style={{ display:'flex',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)',marginBottom:'1.5rem' }}>
        {ventures.map((v,i) => (
          <button key={v.name} onClick={() => setVi(i)} style={{ flex:1,padding:'0.8rem 0.5rem',background:index===i?v.color:'var(--card-bg)',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'0.68rem',letterSpacing:'0.06em',color:index===i?'var(--black)':'var(--muted)',fontWeight:index===i?700:400,transition:'all 0.15s' }}>{v.name}</button>
        ))}
      </div>
      <div style={{ borderLeft:`2px solid ${venture.color}`,paddingLeft:'1rem',marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:venture.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize:'1.3rem',fontWeight:700,letterSpacing:'-0.01em' }}>{venture.name} Relations</div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)' }}>
        {relations.map((r,i) => {
          const hs = HEALTH_STYLES[r.health];
          return (
            <div key={i} style={{ background:'var(--card-bg)',padding:'1.25rem 1.5rem',display:'grid',gridTemplateColumns:'200px 90px 100px 1fr',gap:'1.25rem',alignItems:'start' }}>
              <div>
                <div style={{ fontWeight:600,fontSize:'0.82rem',marginBottom:'0.3rem' }}>{r.name}</div>
                <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.58rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.12rem 0.45rem',border:`1px solid ${CAT_COLORS[r.category]||'var(--card-border)'}40`,color:CAT_COLORS[r.category]||'var(--muted)' }}>{r.category}</span>
              </div>
              <span className="status-badge" style={{ color:hs.color,borderColor:`${hs.color}40`,alignSelf:'flex-start' }}>{hs.label}</span>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--muted)',lineHeight:1.6 }}>
                <div style={{ textTransform:'uppercase',fontSize:'0.52rem',letterSpacing:'0.1em',marginBottom:'0.2rem' }}>Last contact</div>
                {r.lastContact}
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--muted)',lineHeight:1.7,fontWeight:300,marginBottom:'0.5rem' }}>{r.description}</div>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'0.4rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',color:'var(--accent)',flexShrink:0 }}>→</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--accent)',lineHeight:1.5 }}>{r.nextStep}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

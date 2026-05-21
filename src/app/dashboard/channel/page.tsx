'use client';
import { useState } from 'react';
import { VENTURES, VENTURE_CHANNELS, type ChStatus } from '@/lib/mgmt-ventures';

const STATUS_STYLES: Record<ChStatus,{color:string;label:string}> = {
  active:{color:'#5DCAA5',label:'Active'},building:{color:'#c8f53a',label:'Building'},planned:{color:'#7a7870',label:'Planned'},
};
const TYPE_COLORS: Record<string,string> = {
  Marketing:'#c8f53a',Sales:'#F0997B',Distribution:'#7F77DD',Community:'#5DCAA5',Internal:'#85B7EB',
};

export default function ChannelPage() {
  const [vi, setVi] = useState(0);
  const venture  = VENTURES[vi];
  const channels = VENTURE_CHANNELS[venture.name] ?? [];
  const counts   = { active:channels.filter(c=>c.status==='active').length, building:channels.filter(c=>c.status==='building').length, planned:channels.filter(c=>c.status==='planned').length };

  return (
    <div>
      <h1 className="page-title">Channel</h1>
      <p className="page-sub">Marketing, sales, distribution, and community channels — per venture.</p>
      <div style={{ display:'flex',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)',marginBottom:'1.5rem' }}>
        {VENTURES.map((v,i) => (
          <button key={v.name} onClick={() => setVi(i)} style={{ flex:1,padding:'0.8rem 0.5rem',background:vi===i?v.color:'var(--card-bg)',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'0.68rem',letterSpacing:'0.06em',color:vi===i?'var(--black)':'var(--muted)',fontWeight:vi===i?700:400,transition:'all 0.15s' }}>{v.name}</button>
        ))}
      </div>
      <div style={{ borderLeft:`2px solid ${venture.color}`,paddingLeft:'1rem',marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:venture.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize:'1.3rem',fontWeight:700,letterSpacing:'-0.01em',display:'flex',alignItems:'center',gap:'1rem' }}>
          {venture.name}
          <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--muted)',fontWeight:400 }}>{counts.active} active · {counts.building} building · {counts.planned} planned</span>
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)' }}>
        {channels.map((c,i) => {
          const ss = STATUS_STYLES[c.status];
          return (
            <div key={i} style={{ background:'var(--card-bg)',padding:'1.1rem 1.5rem',display:'grid',gridTemplateColumns:'180px 100px 1fr auto',gap:'1.25rem',alignItems:'start' }}>
              <div style={{ fontWeight:600,fontSize:'0.8rem' }}>{c.name}</div>
              <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.58rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.15rem 0.5rem',border:`1px solid ${TYPE_COLORS[c.type]||'var(--card-border)'}40`,color:TYPE_COLORS[c.type]||'var(--muted)',alignSelf:'flex-start' }}>{c.type}</span>
              <div>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--muted)',lineHeight:1.7,fontWeight:300,marginBottom:'0.35rem' }}>{c.description}</div>
                <div style={{ display:'flex',alignItems:'center',gap:'0.4rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.56rem',color:'var(--accent)' }}>metric</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--off-white)' }}>{c.metric}</span>
                </div>
              </div>
              <span className="status-badge" style={{ color:ss.color,borderColor:`${ss.color}40`,whiteSpace:'nowrap',alignSelf:'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

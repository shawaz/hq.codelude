'use client';
import { VENTURE_ACTIVITIES } from '@/lib/mgmt-ventures';
import { useActiveScope } from '@/lib/use-active-scope';
import { scBorder } from '@/lib/status-colors';

const CAT_COLORS: Record<string, string> = {
  Milestone:'#eeeeee',Launch:'#dbdbdb',Decision:'#b5b5b5',Product:'#c8c8c8',
  Engineering:'#a5a5a5',Partnership:'#adadad',Finance:'#dbdbdb',Legal:'#b5b5b5',Marketing:'#eeeeee',Meeting:'var(--muted)',
};

export default function ActivityPage() {
  const { scope: venture, loading } = useActiveScope('activity');

  // A member with no grant on this page has no venture to render.
  if (loading) return null;
  if (!venture) {
    return (
      <div>
        <h1 className="page-title">Activity</h1>
        <div style={{ background:'var(--card-bg)',border:'1px solid var(--card-border)',padding:'2rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)' }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }
  const items = [...(VENTURE_ACTIVITIES[venture.name] ?? [])].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Chronological log of decisions, milestones, and events — per venture.</p>
      <div style={{ borderLeft:`2px solid ${venture.color}`,paddingLeft:'1rem',marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:venture.color,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize:'1.3rem',fontWeight:700,letterSpacing:'-0.01em' }}>{venture.name} — {items.length} events</div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'1px',background:'var(--card-border)',border:'1px solid var(--card-border)' }}>
        {items.map((a,i) => (
          <div key={i} style={{ background:'var(--card-bg)',padding:'1rem 1.5rem',display:'grid',gridTemplateColumns:'100px 110px 1fr',gap:'1rem',alignItems:'start' }}>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--muted)',paddingTop:'0.1rem' }}>{a.date}</span>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.58rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.15rem 0.5rem',border:`1px solid ${scBorder(CAT_COLORS[a.category]||'var(--card-border)')}`,color:CAT_COLORS[a.category]||'var(--muted)',alignSelf:'flex-start' }}>{a.category}</span>
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

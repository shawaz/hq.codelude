'use client';
import { useState } from 'react';
import { HELP_ARTICLES } from '@/lib/support';
import VentureTabs from '@/components/VentureTabs';

const CAT_COLORS: Record<string, string> = { Infrastructure: '#7F77DD', Admin: '#85B7EB', Platform: '#F0997B' };

export default function HelpDeskPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <h1 className="page-title">Help Desk</h1>
      <p className="page-sub">Internal knowledge base — how to handle common technical and operational situations.</p>
      <VentureTabs />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {HELP_ARTICLES.map((a, i) => {
          const isOpen = open === a.title;
          const cc = CAT_COLORS[a.category] || 'var(--accent)';
          return (
            <div key={i}>
              <button onClick={() => setOpen(isOpen ? null : a.title)}
                style={{ width: '100%', background: isOpen ? '#131311' : 'var(--card-bg)', border: 'none', padding: '1rem 1.5rem', cursor: 'pointer', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', borderLeft: isOpen ? `2px solid ${cc}` : '2px solid transparent' }}>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--off-white)' }}>{a.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '0.12rem 0.5rem', border: `1px solid ${cc}40`, color: cc }}>{a.category}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {isOpen && (
                <div style={{ background: 'var(--card-bg)', padding: '1rem 1.5rem 1.5rem', borderLeft: `2px solid ${cc}` }}>
                  {a.content.split('\n').map((line, j) => (
                    <p key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: line.startsWith('ssh') || line.startsWith('pm2') || line.startsWith('sudo') || line.startsWith('until') || line.startsWith('nano') || line.startsWith('npm') ? 'var(--accent)' : 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: line === '' ? '0.5rem' : 0 }}>{line || ' '}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

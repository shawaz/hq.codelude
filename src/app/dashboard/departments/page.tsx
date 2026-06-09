'use client';

import { DEPARTMENTS } from '@/lib/ops';
import { useVenture } from '@/contexts/venture-context';
import { VENTURES } from '@/lib/ventures';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:   { color: '#5DCAA5', label: 'Active'   },
  forming:  { color: '#c8f53a', label: 'Forming'  },
  planned:  { color: '#7a7870', label: 'Planned'  },
};

export default function DepartmentsPage() {
  const { vi } = useVenture();
  const ventureName = VENTURES[vi].name;
  const ventureColor = VENTURES[vi].color;
  const filtered = DEPARTMENTS.filter(d => d.ventures.includes(ventureName));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Departments</h1>
        <button style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.55rem 1.1rem', border: '1px solid var(--accent)', color: 'var(--accent)',
          background: 'transparent', cursor: 'pointer',
        }}>
          + Add Department
        </button>
      </div>
      <p className="page-sub">Organisational structure — current departments, leads, headcount, and responsibilities.</p>
      <VentureTabs />
      {filtered.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          No departments assigned to <span style={{ color: ventureColor }}>{ventureName}</span> yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((d, i) => {
            const ss = STATUS_STYLES[d.status];
            return (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{d.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>Lead: {d.lead} · {d.headcount} {d.headcount === 1 ? 'person' : 'people'}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {d.responsibilities.map((r, j) => <span key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', padding: '0.2rem 0.65rem', border: '1px solid var(--card-border)' }}>{r}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

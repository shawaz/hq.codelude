import { DEPARTMENTS } from '@/lib/ops';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:   { color: '#5DCAA5', label: 'Active'   },
  forming:  { color: '#c8f53a', label: 'Forming'  },
  planned:  { color: '#7a7870', label: 'Planned'  },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function DepartmentsPage() {
  return (
    <div>
      <h1 className="page-title">Departments</h1>
      <p className="page-sub">Organisational structure — current departments, leads, headcount, and responsibilities.</p>
      <VentureTabs />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {DEPARTMENTS.map((d, i) => {
          const ss = STATUS_STYLES[d.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>Lead: {d.lead} · {d.headcount} {d.headcount === 1 ? 'person' : 'people'}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {d.ventures.map(v => <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '0.1rem 0.5rem', border: `1px solid ${VENTURE_COLORS[v] || 'var(--card-border)'}40`, color: VENTURE_COLORS[v] || 'var(--muted)' }}>{v}</span>)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {d.responsibilities.map((r, j) => <span key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', padding: '0.2rem 0.65rem', border: '1px solid var(--card-border)' }}>{r}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

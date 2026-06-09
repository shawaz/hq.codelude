import { OFFICES } from '@/lib/ops';
import VentureTabs from '@/components/VentureTabs';

const TYPE_COLORS: Record<string, string> = { Registered: '#c8f53a', Engineering: '#5DCAA5', Remote: '#85B7EB', Server: '#7F77DD' };
const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:  { color: '#5DCAA5', label: 'Active'  },
  planned: { color: '#FAC775', label: 'Planned' },
  virtual: { color: '#7a7870', label: 'Virtual' },
};

export default function OfficePage() {
  return (
    <div>
      <h1 className="page-title">Office</h1>
      <p className="page-sub">Physical and virtual office locations — registered addresses, engineering bases, and infrastructure.</p>
      <VentureTabs />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {OFFICES.map((o, i) => {
          const ss = STATUS_STYLES[o.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.4rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 90px 120px 1fr auto', gap: '1.25rem', alignItems: 'start', borderLeft: `2px solid ${TYPE_COLORS[o.type]}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{o.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{o.city}, {o.country}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[o.type]}40`, color: TYPE_COLORS[o.type], alignSelf: 'flex-start' }}>{o.type}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${ss.color}40`, color: ss.color, alignSelf: 'flex-start' }}>{ss.label}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', marginBottom: '0.4rem', fontWeight: 300 }}>{o.purpose}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{o.notes}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

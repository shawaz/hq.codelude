import { OFFICES } from '@/lib/ops';
import { sc, scBorder } from '@/lib/status-colors';

const TYPE_COLORS: Record<string, string> = { Registered: '#eeeeee', Engineering: '#dbdbdb', Remote: '#a5a5a5', Server: '#c8c8c8' };
const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:  { color: '#dbdbdb', label: 'Active'  },
  planned: { color: '#b5b5b5', label: 'Planned' },
  virtual: { color: 'var(--muted)', label: 'Virtual' },
};

export default function OfficePage() {
  return (
    <div>
      <h1 className="page-title">Office</h1>
      <p className="page-sub">Physical and virtual office locations — registered addresses, engineering bases, and infrastructure.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {OFFICES.map((o, i) => {
          const ss = STATUS_STYLES[o.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.4rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 90px 120px 1fr auto', gap: '1.25rem', alignItems: 'start', borderLeft: `2px solid ${TYPE_COLORS[o.type]}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{o.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{o.city}, {o.country}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[o.type])}`, color: sc(TYPE_COLORS[o.type]), alignSelf: 'flex-start' }}>{o.type}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color), alignSelf: 'flex-start' }}>{ss.label}</span>
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

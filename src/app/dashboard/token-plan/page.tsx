import { TOKEN_MILESTONES } from '@/lib/fundraising';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  'done':        { color: '#5DCAA5', label: 'Done'        },
  'in-progress': { color: '#c8f53a', label: 'In Progress' },
  'blocked':     { color: '#ff8080', label: 'Blocked'     },
  'planned':     { color: '#7a7870', label: 'Planned'     },
};

const PHASES = [...new Set(TOKEN_MILESTONES.map(m => m.phase))];

export default function TokenPlanPage() {
  const done = TOKEN_MILESTONES.filter(m => m.status === 'done').length;

  return (
    <div>
      <h1 className="page-title">Token Structure</h1>
      <p className="page-sub">Dubai HoldCo token — legal, technical, and operational milestones to issuance.</p>

      {/* Progress summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total milestones', val: String(TOKEN_MILESTONES.length), color: 'var(--off-white)' },
          { label: 'Completed',        val: String(done),                    color: '#5DCAA5' },
          { label: 'In progress',      val: String(TOKEN_MILESTONES.filter(m => m.status === 'in-progress').length), color: '#c8f53a' },
          { label: 'Total cost',       val: '~$60–80K',                     color: '#FAC775' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: c.color, lineHeight: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--card-border)', marginBottom: '2rem', borderRadius: 2 }}>
        <div style={{ height: '100%', background: '#c8f53a', width: `${Math.round((done / TOKEN_MILESTONES.length) * 100)}%`, borderRadius: 2 }} />
      </div>

      {/* Milestones by phase */}
      {PHASES.map(phase => {
        const items = TOKEN_MILESTONES.filter(m => m.phase === phase);
        return (
          <div key={phase} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>{phase}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
              {items.map((m, i) => {
                const ss = STATUS_STYLES[m.status];
                return (
                  <div key={i} style={{ background: m.status === 'done' ? '#0d1a12' : 'var(--card-bg)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '50px 1fr 130px 80px 80px', gap: '1rem', alignItems: 'start' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{m.id}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem', color: m.status === 'done' ? '#5DCAA5' : 'var(--off-white)' }}>{m.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{m.notes}</div>
                      {m.blockedBy && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#ff8080', marginTop: '0.3rem' }}>⊗ Blocked by: {m.blockedBy}</div>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{m.owner}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{m.cost}</div>
                    <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, alignSelf: 'flex-start' }}>{ss.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

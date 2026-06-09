export default function OfficePage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Office</h1>
        <button style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.55rem 1.1rem', border: '1px solid var(--accent)', color: 'var(--accent)',
          background: 'transparent', cursor: 'pointer',
        }}>
          + Add Team
        </button>
      </div>
      <p className="page-sub">Back-office teams — each with its own task board, budget, and team roster.</p>

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderLeft: '2px solid var(--accent)', padding: '2rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Planned
        </div>
        Back-office teams will appear here — Engineering, Finance, HR, Legal, and other internal functions — each with its own task progress card, team roster, and budget lines.
      </div>
    </div>
  );
}

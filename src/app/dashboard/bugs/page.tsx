export default function BugsPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="page-title">Bugs</h1>
      <p className="page-sub">Automated bug detection, reporting, and resolution across all platforms.</p>

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderLeft: '2px solid var(--accent)', padding: '1.75rem 2rem', marginBottom: '1.5rem',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Planned — AI Agent
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
          Autonomous bug agent
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, marginBottom: '1.25rem' }}>
          An AI agent will be wired into this section to automatically scan all platforms hosted on this server, detect bugs and regressions, log them here with severity and context, and — where safe — apply and deploy fixes autonomously.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {[
            { step: '01', title: 'Scan',   desc: 'Agent crawls all live platforms — runtime errors, broken routes, failed API calls, console errors' },
            { step: '02', title: 'Report', desc: 'Each bug logged here with URL, error type, severity (critical / high / medium / low), and reproduction steps' },
            { step: '03', title: 'Fix',    desc: 'Agent proposes a code fix, opens a diff for review, and — on approval or auto-mode — deploys the patch via PM2 restart' },
            { step: '04', title: 'Verify', desc: 'Post-fix scan confirms the bug is resolved and no regressions introduced' },
          ].map(item => (
            <div key={item.step} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '2rem 1fr', gap: '1rem', alignItems: 'start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', paddingTop: '0.1rem' }}>{item.step}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>
        Once the agent is connected, all bugs will appear here as a live table — sortable by platform, severity, and date. No manual reporting needed.
      </div>
    </div>
  );
}

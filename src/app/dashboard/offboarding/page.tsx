export default function OffboardingPage() {
  const steps = [
    { phase: 'Day of departure', items: ['Collect all company devices and access cards', 'Revoke all system access immediately (Google, GitHub, HQ, server SSH)', 'Change all shared passwords the departing member had access to', 'Transfer all open tasks in HQ → Tasks to remaining team members', 'Export and archive any files owned by the departing member from Google Drive'] },
    { phase: 'Within 24 hours', items: ['Disable Google Workspace account (retain email for 30 days, then delete)', 'Remove from GitHub organisation', 'Remove from HQ → .env.local TEAM_USERS and restart hq-codelude', 'Remove from all WhatsApp / Telegram groups', 'Revoke 2FA tokens and access manager entries'] },
    { phase: 'Within 1 week', items: ['Conduct exit interview — what worked, what didn\'t, honest feedback only', 'Update HQ → Departments headcount', 'Update HQ → Positions if the role needs to be backfilled', 'Log departure in HQ → Activity with role and tenure', 'Review any IP or NDA obligations with legal counsel if applicable'] },
    { phase: 'Within 30 days', items: ['Redirect the departing member\'s email to a team inbox', 'Archive project files and document any institutional knowledge not yet captured', 'Delete the departing member\'s Google Workspace account', 'Confirm all outstanding invoices and reimbursements are settled'] },
  ];

  return (
    <div>
      <h1 className="page-title">Offboarding</h1>
      <p className="page-sub">Standard offboarding process — access revocation, knowledge transfer, and exit documentation.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', borderLeft: '2px solid #F0997B' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#F0997B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{s.phase}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {s.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--card-border)', flexShrink: 0, paddingTop: '0.1rem' }}>☐</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

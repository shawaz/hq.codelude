import { APPLICATIONS } from '@/lib/people';

export default function ApplicationPage() {
  return (
    <div>
      <h1 className="page-title">Application</h1>
      <p className="page-sub">Job application pipeline — candidates across all open positions.</p>
      {APPLICATIONS.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>No applications yet</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Applications will appear here when candidates apply for open positions. Share role links from the Positions page to start receiving applications.<br /><br />
            <strong style={{ color: 'var(--off-white)' }}>Next step:</strong> Define the application intake process (email, form, or LinkedIn) for the first three roles — Thermal Engineer, Legal Counsel (Dubai), and Legal Counsel (Franchiseen).
          </p>
        </div>
      ) : null}
    </div>
  );
}

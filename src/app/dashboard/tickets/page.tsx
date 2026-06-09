import { TICKETS } from '@/lib/support';
import VentureTabs from '@/components/VentureTabs';

export default function TicketsPage() {
  return (
    <div>
      <h1 className="page-title">Tickets</h1>
      <p className="page-sub">Support ticket queue — bugs, feature requests, and help requests from users and partners.</p>
      <VentureTabs />
      {TICKETS.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>No tickets open</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Support tickets will appear here from Dextrip users (public beta launch), Franchiseen investors, and HubCV professionals. Set up the intake channel — email or in-app form — before each venture goes live.
            <br /><br />
            <strong style={{ color: 'var(--off-white)' }}>Priority:</strong> Dextrip support channel should be ready before public beta (July 10). Franchiseen investor support channel before pilot (July 15).
          </p>
        </div>
      ) : null}
    </div>
  );
}

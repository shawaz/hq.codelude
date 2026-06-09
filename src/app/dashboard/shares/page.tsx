import { SHARES } from '@/lib/finance';
import VentureTabs from '@/components/VentureTabs';

const ENTITY_COLORS: Record<string, string> = {
  'Codelude HoldCo (Dubai)':  '#c8f53a',
  'Roborns (Project Entity)': '#5DCAA5',
  'Franchiseen (Project)':    '#7F77DD',
  'Dextrip (Project)':        '#F0997B',
  'HubCV (Project)':          '#FAC775',
  'Cuestay (Project)':        '#85B7EB',
};

export default function SharesPage() {
  const entities = [...new Set(SHARES.map(s => s.entity))];

  return (
    <div>
      <h1 className="page-title">Shares</h1>
      <p className="page-sub">Cap table and equity ledger — HoldCo and all project entities.</p>
      <VentureTabs />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cap table structure</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          Codelude HoldCo (Dubai) sits at the top. All five ventures are subsidiaries. Token holders receive <strong style={{ color: 'var(--off-white)' }}>revenue share</strong>, not equity — token issuance does not dilute the cap table. Equity dilution only occurs at the project entity level (Franchiseen, Cuestay) through SAFE/seed rounds.
        </p>
      </div>

      {entities.map(entity => {
        const rows = SHARES.filter(s => s.entity === entity);
        const color = ENTITY_COLORS[entity] || 'var(--muted)';
        return (
          <div key={entity} style={{ marginBottom: '1.5rem' }}>
            <div className="section-label" style={{ color }}>{entity}</div>
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Shareholder</th>
                  <th>Share class</th>
                  <th style={{ textAlign: 'right' }}>%</th>
                  <th style={{ textAlign: 'right' }}>Shares</th>
                  <th>Vesting</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: '0.78rem' }}>{r.shareholder}</td>
                    <td><span className="category-label">{r.shareClass}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: r.percentage === 100 ? '#5DCAA5' : r.percentage === 0 ? 'var(--muted)' : 'var(--off-white)' }}>
                      {r.percentage > 0 ? `${r.percentage}%` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{r.shares}</td>
                    <td><span className="category-label">{r.vestingSchedule}</span></td>
                    <td><span className="category-label" style={{ fontSize: '0.62rem' }}>{r.notes}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

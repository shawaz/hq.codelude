import { FRANCHISE_BRANDS } from '@/lib/ops';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  prospecting: { color: '#FAC775', label: 'Prospecting' },
  negotiating: { color: '#c8f53a', label: 'Negotiating' },
  signed:      { color: '#5DCAA5', label: 'Signed'      },
  live:        { color: '#5DCAA5', label: 'Live'         },
  active:      { color: '#5DCAA5', label: 'Active'       },
};

export default function FranchisePage() {
  return (
    <div>
      <h1 className="page-title">Franchise</h1>
      <p className="page-sub">Franchiseen brand partner registry — target brands, status, and deal parameters.</p>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid #7F77DD', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: sc('#7F77DD'), letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target: Q3 2026</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          First franchise brand partner signed by Q3 2026. Focus on <strong style={{ color: 'var(--off-white)' }}>mid-size regional F&B or retail chains</strong> with 5–20 units and verified unit economics. The first brand defines the pilot — choose carefully.
        </p>
      </div>
      <table className="tasks-table">
        <thead>
          <tr><th>Brand</th><th>Category</th><th>Country</th><th style={{ textAlign: 'right' }}>Min. Investment</th><th style={{ textAlign: 'right' }}>Expected Revenue</th><th>Status</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {FRANCHISE_BRANDS.map((b, i) => {
            const ss = STATUS_STYLES[b.status];
            return (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{b.name}</td>
                <td><span className="category-label">{b.category}</span></td>
                <td><span className="category-label">{b.country}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)' }}>{b.investmentMin}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: sc('#5DCAA5') }}>{b.expectedRevenue}</td>
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.62rem' }}>{b.notes}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

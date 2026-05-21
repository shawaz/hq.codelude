import { CLIENTS } from '@/lib/sales';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:   { color: '#5DCAA5', label: 'Active'   },
  'at-risk':{ color: '#FAC775', label: 'At Risk'  },
  churned:  { color: '#ff8080', label: 'Churned'  },
};
const VENTURE_COLORS: Record<string, string> = { Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B' };

export default function ClientsPage() {
  const mrr = CLIENTS.filter(c => c.status === 'active').reduce((s, c) => s + parseInt(c.value.replace(/\D/g, '')), 0);
  return (
    <div>
      <h1 className="page-title">Clients</h1>
      <p className="page-sub">Active client accounts — current customers across all ventures.</p>
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell"><div className="tasks-count-num">{CLIENTS.length}</div><div className="tasks-count-label">Total clients</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{CLIENTS.filter(c => c.status === 'active').length}</div><div className="tasks-count-label">Active</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: 'var(--accent)' }}>${mrr}/mo</div><div className="tasks-count-label">MRR</div></div>
      </div>
      <table className="tasks-table">
        <thead><tr><th>Client</th><th>Type</th><th>Venture</th><th>Since</th><th>Value</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          {CLIENTS.map((c, i) => {
            const ss = STATUS_STYLES[c.status];
            return (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{c.name}</td>
                <td><span className="category-label">{c.type}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[c.venture] }}>{c.venture}</span></td>
                <td><span className="category-label">{c.since}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#5DCAA5' }}>{c.value}</span></td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.62rem' }}>{c.notes}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

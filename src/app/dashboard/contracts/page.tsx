import { CONTRACTS, type ContractStatus } from '@/lib/legal-data';

const STATUS_STYLES: Record<ContractStatus, { color: string; label: string }> = {
  draft:      { color: '#7a7870', label: 'Draft'      },
  review:     { color: '#FAC775', label: 'Review'     },
  signed:     { color: '#c8f53a', label: 'Signed'     },
  active:     { color: '#5DCAA5', label: 'Active'     },
  expired:    { color: '#7a7870', label: 'Expired'    },
  terminated: { color: '#ff8080', label: 'Terminated' },
};
const TYPE_COLORS: Record<string, string> = { Service: '#7F77DD', Employment: '#5DCAA5', Partnership: '#c8f53a', Investment: '#FAC775', Lease: '#85B7EB', SaaS: '#F0997B', Advisory: '#FAC775' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B' };

export default function ContractsPage() {
  const active = CONTRACTS.filter(c => c.status === 'active').length;
  return (
    <div>
      <h1 className="page-title">Contracts</h1>
      <p className="page-sub">Contract registry — all vendor, service, SaaS, and partnership agreements.</p>
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell"><div className="tasks-count-num">{CONTRACTS.length}</div><div className="tasks-count-label">Total contracts</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{active}</div><div className="tasks-count-label">Active</div></div>
        <div className="tasks-count-cell"><div className="tasks-count-num" style={{ color: '#FAC775' }}>{CONTRACTS.filter(c => c.status === 'draft').length}</div><div className="tasks-count-label">Draft</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {CONTRACTS.map((c, i) => {
          const ss = STATUS_STYLES[c.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 90px 80px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{c.id}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem' }}>{c.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{c.party}</div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[c.type]}40`, color: TYPE_COLORS[c.type] }}>{c.type}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: VENTURE_COLORS[c.venture] }}>{c.venture}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', marginBottom: '0.3rem' }}>{c.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 300 }}>{c.keyTerms}</div>
              </div>
              <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, whiteSpace: 'nowrap' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

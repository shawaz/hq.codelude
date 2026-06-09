import { ACCOUNTS, type AccountStatus, type AccountType } from '@/lib/finance';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<AccountStatus, { color: string; label: string }> = {
  active:  { color: '#5DCAA5', label: 'Active'  },
  pending: { color: '#c8f53a', label: 'Pending' },
  planned: { color: '#7a7870', label: 'Planned' },
};

const TYPE_COLORS: Record<AccountType, string> = {
  Current:  '#c8f53a',
  Savings:  '#5DCAA5',
  Escrow:   '#F0997B',
  Exchange: '#7F77DD',
};

export default function AccountsPage() {
  const active  = ACCOUNTS.filter(a => a.status === 'active').length;
  const pending = ACCOUNTS.filter(a => a.status === 'pending').length;
  const planned = ACCOUNTS.filter(a => a.status === 'planned').length;

  return (
    <div>
      <h1 className="page-title">Accounts</h1>
      <p className="page-sub">Bank and exchange accounts across all entities — current, pending, and planned.</p>
      <VentureTabs />

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',   val: ACCOUNTS.length, color: 'var(--off-white)' },
          { label: 'Active',  val: active,           color: '#5DCAA5' },
          { label: 'Pending', val: pending,           color: '#c8f53a' },
          { label: 'Planned', val: planned,           color: '#7a7870' },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {ACCOUNTS.map((a, i) => {
          const ss = STATUS_STYLES[a.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 110px 100px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>{a.entity}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{a.bank}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[a.type]}40`, color: TYPE_COLORS[a.type], alignSelf: 'flex-start' }}>{a.type}</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)' }}>{a.currency}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.3rem' }}>{a.purpose}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.7, lineHeight: 1.5 }}>{a.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${ss.color}40`, color: ss.color, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

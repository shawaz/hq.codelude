import { INVOICES, type InvoiceStatus } from '@/lib/finance';

const STATUS_STYLES: Record<InvoiceStatus, { color: string; label: string }> = {
  paid:    { color: '#5DCAA5', label: 'Paid'    },
  pending: { color: '#FAC775', label: 'Pending' },
  overdue: { color: '#ff8080', label: 'Overdue' },
  draft:   { color: '#7a7870', label: 'Draft'   },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function InvoicePage() {
  const paid    = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const draft   = INVOICES.filter(i => i.status === 'draft').reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <h1 className="page-title">Invoice</h1>
      <p className="page-sub">Outgoing invoices across all ventures — issued, pending, and drafted.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total invoices',  val: INVOICES.length,         color: 'var(--off-white)', fmt: false },
          { label: 'Collected',       val: `$${paid}`,              color: '#5DCAA5',          fmt: false },
          { label: 'Pending',         val: `$${pending}`,           color: '#FAC775',          fmt: false },
          { label: 'Draft',           val: `$${draft.toLocaleString()}`, color: '#7a7870',     fmt: false },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Venture</th>
            <th>Client</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th>Issue date</th>
            <th>Due date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {INVOICES.map((inv, i) => {
            const ss = STATUS_STYLES[inv.status];
            return (
              <tr key={i}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{inv.id}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: VENTURE_COLORS[inv.venture] }}>{inv.venture}</span></td>
                <td><span className="category-label">{inv.client}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.67rem' }}>{inv.description}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{inv.currency} {inv.amount.toLocaleString()}</td>
                <td><span className="category-label">{inv.issueDate}</span></td>
                <td><span className="category-label">{inv.dueDate}</span></td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

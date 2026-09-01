'use client';

import { INVOICES, type InvoiceStatus } from '@/lib/finance';
import VenturePageLayout, { NoRows, type VentureTab } from '@/components/VenturePageLayout';
import { sc, scBorder } from '@/lib/status-colors';

const TABS: VentureTab[] = [
  { key: 'all',     label: 'All'     },
  { key: 'paid',    label: 'Paid'    },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'draft',   label: 'Draft'   },
];

const STATUS_STYLES: Record<InvoiceStatus, { color: string; label: string }> = {
  paid:    { color: '#dbdbdb', label: 'Paid'    },
  pending: { color: '#b5b5b5', label: 'Pending' },
  overdue: { color: '#9d9d9d', label: 'Overdue' },
  draft:   { color: 'var(--muted)', label: 'Draft'   },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8',
  HubCV: '#b5b5b5', Llife: '#a5a5a5', Dextrip: '#adadad',
};

export default function InvoicePage() {
  return (
    <VenturePageLayout
      title="Invoice"
      subtitle="Outgoing invoices across all ventures — issued, pending, and drafted."
      pageSlug="invoice"
      eyebrow={() => 'invoices'}
      heading={v => `${v.name} Invoices`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        const scoped = INVOICES.filter(i => i.venture === venture.name);
        const rows = tab === 'all' ? scoped : scoped.filter(i => i.status === tab);
        const paid    = rows.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
        const pending = rows.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
        const draft   = rows.filter(i => i.status === 'draft').reduce((s, i) => s + i.amount, 0);

        return (
          <>
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total invoices',  val: rows.length,         color: 'var(--off-white)', fmt: false },
          { label: 'Collected',       val: `$${paid}`,              color: '#dbdbdb',          fmt: false },
          { label: 'Pending',         val: `$${pending}`,           color: '#b5b5b5',          fmt: false },
          { label: 'Draft',           val: `$${draft.toLocaleString()}`, color: 'var(--muted)',     fmt: false },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: sc(c.color) }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 ? <NoRows>No {tab === 'all' ? '' : `${tab} `}invoices for {venture.name}.</NoRows> : (
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
          {rows.map((inv, i) => {
            const ss = STATUS_STYLES[inv.status];
            return (
              <tr key={i}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{inv.id}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: sc(VENTURE_COLORS[inv.venture]) }}>{inv.venture}</span></td>
                <td><span className="category-label">{inv.client}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.67rem' }}>{inv.description}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{inv.currency} {inv.amount.toLocaleString()}</td>
                <td><span className="category-label">{inv.issueDate}</span></td>
                <td><span className="category-label">{inv.dueDate}</span></td>
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}

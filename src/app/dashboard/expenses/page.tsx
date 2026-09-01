'use client';

import { useState } from 'react';
import { EXPENSES, type ExpenseStatus } from '@/lib/budget-data';
import VenturePageLayout, { type VentureTab } from '@/components/VenturePageLayout';
import { sc, scBorder } from '@/lib/status-colors';

// The venture strip now comes from VenturePageLayout; status becomes the tab row.
const TABS: VentureTab[] = [
  { key: 'all',        label: 'All'        },
  { key: 'paid',       label: 'Paid'       },
  { key: 'pending',    label: 'Pending'    },
  { key: 'recurring',  label: 'Recurring'  },
  { key: 'reimbursed', label: 'Reimbursed' },
];

const STATUS_STYLES: Record<ExpenseStatus, { color: string; label: string }> = {
  paid:       { color: '#dbdbdb', label: 'Paid'       },
  pending:    { color: '#b5b5b5', label: 'Pending'    },
  reimbursed: { color: '#c8c8c8', label: 'Reimbursed' },
  recurring:  { color: '#a5a5a5', label: 'Recurring'  },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8',
  HubCV: '#b5b5b5', Llife: '#a5a5a5', Dextrip: '#adadad',
};

const CATS      = ['All', 'Infrastructure', 'Engineering', 'Legal', 'Domain', 'SaaS', 'AI Infrastructure'];

export default function ExpensesPage() {
  const [cat, setCat] = useState('All');

  return (
    <VenturePageLayout
      title="Expenses"
      subtitle="All company expenses — paid, pending, and recurring across all ventures."
      pageSlug="expenses"
      eyebrow={() => 'expenses'}
      heading={v => `${v.name} Expenses`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        // Stat cards reflect the selected venture, not the whole company —
        // otherwise the totals contradict the table underneath them.
        const scoped = EXPENSES.filter(e => e.venture === venture.name);
        const byStatus = tab === 'all' ? scoped : scoped.filter(e => e.status === tab);
        const filtered = byStatus.filter(e => cat === 'All' || e.category === cat);

        const paid      = scoped.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
        const pending   = scoped.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
        const recurring = scoped.filter(e => e.status === 'recurring').reduce((s, e) => s + e.amount, 0);
        const totalMtd  = scoped.filter(e => e.status === 'paid' || e.status === 'recurring')
          .filter(e => e.date.startsWith('2026-05'))
          .reduce((s, e) => s + e.amount, 0);

        return (
          <>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Paid (May)',      val: `$${paid.toLocaleString()}`,       color: '#dbdbdb' },
          { label: 'Pending',        val: `$${pending.toLocaleString()}`,     color: '#b5b5b5' },
          { label: 'Recurring / mo', val: `$${recurring.toLocaleString()}`,   color: '#a5a5a5' },
          { label: 'MTD total',      val: `$${totalMtd.toLocaleString()}`,    color: '#eeeeee' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: sc(c.color), lineHeight: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATS.map(c => (
          <button key={c} className={`filter-pill${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <table className="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th style={{ width: '30%' }}>Description</th>
            <th>Venture</th>
            <th>Category</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th>Receipt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => {
            const ss = STATUS_STYLES[e.status];
            return (
              <tr key={i}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{e.id}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{e.date}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.15rem' }}>{e.description}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{e.notes}</div>
                </td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: sc(VENTURE_COLORS[e.venture]) }}>{e.venture}</span></td>
                <td><span className="category-label">{e.category}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: e.amount > 0 ? 'var(--off-white)' : 'var(--muted)', fontWeight: 600 }}>
                  {e.amount > 0 ? `$${e.amount.toLocaleString()}` : 'Free'}
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: e.receipt ? '#dbdbdb' : 'var(--muted)' }}>
                    {e.receipt ? '✓' : '—'}
                  </span>
                </td>
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>No expenses match the current filter.</td></tr>
          )}
        </tbody>
      </table>
          </>
        );
      }}
    </VenturePageLayout>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { EXPENSES, type ExpenseStatus } from '@/lib/budget-data';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<ExpenseStatus, { color: string; label: string }> = {
  paid:       { color: '#5DCAA5', label: 'Paid'       },
  pending:    { color: '#FAC775', label: 'Pending'    },
  reimbursed: { color: '#7F77DD', label: 'Reimbursed' },
  recurring:  { color: '#85B7EB', label: 'Recurring'  },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const VENTURES  = ['All', 'Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];
const STATUSES  = ['all', 'paid', 'pending', 'recurring', 'reimbursed'] as const;
const CATS      = ['All', 'Infrastructure', 'Engineering', 'Legal', 'Domain', 'SaaS', 'AI Infrastructure'];

export default function ExpensesPage() {
  const [venture, setVenture] = useState('All');
  const [status,  setStatus]  = useState<'all' | ExpenseStatus>('all');
  const [cat,     setCat]     = useState('All');

  const filtered = useMemo(() => EXPENSES.filter(e =>
    (venture === 'All' || e.venture === venture) &&
    (status  === 'all' || e.status  === status) &&
    (cat     === 'All' || e.category === cat)
  ), [venture, status, cat]);

  const paid      = EXPENSES.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
  const pending   = EXPENSES.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  const recurring = EXPENSES.filter(e => e.status === 'recurring').reduce((s, e) => s + e.amount, 0);
  const totalMtd  = EXPENSES.filter(e => e.status === 'paid' || e.status === 'recurring')
    .filter(e => e.date.startsWith('2026-05'))
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <h1 className="page-title">Expenses</h1>
      <p className="page-sub">All company expenses — paid, pending, and recurring across all ventures.</p>
      <VentureTabs />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Paid (May)',      val: `$${paid.toLocaleString()}`,       color: '#5DCAA5' },
          { label: 'Pending',        val: `$${pending.toLocaleString()}`,     color: '#FAC775' },
          { label: 'Recurring / mo', val: `$${recurring.toLocaleString()}`,   color: '#85B7EB' },
          { label: 'MTD total',      val: `$${totalMtd.toLocaleString()}`,    color: '#c8f53a' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: c.color, lineHeight: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: VENTURE_COLORS[v] } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {STATUSES.map(s => (
          <button key={s} className={`filter-pill${status === s ? ' active' : ''}`}
            style={status === s && s !== 'all' ? { borderColor: STATUS_STYLES[s]?.color, color: STATUS_STYLES[s]?.color } : {}}
            onClick={() => setStatus(s)}>{s === 'all' ? 'All status' : STATUS_STYLES[s].label}</button>
        ))}
      </div>
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
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[e.venture] }}>{e.venture}</span></td>
                <td><span className="category-label">{e.category}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: e.amount > 0 ? 'var(--off-white)' : 'var(--muted)', fontWeight: 600 }}>
                  {e.amount > 0 ? `$${e.amount.toLocaleString()}` : 'Free'}
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: e.receipt ? '#5DCAA5' : '#7a7870' }}>
                    {e.receipt ? '✓' : '—'}
                  </span>
                </td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>No expenses match the current filter.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

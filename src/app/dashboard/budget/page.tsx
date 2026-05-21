'use client';

import { useState } from 'react';
import { BUDGET, type BudgetStatus } from '@/lib/finance';

const VENTURES = ['All', 'Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const STATUS_STYLES: Record<BudgetStatus, { color: string; label: string }> = {
  'on-track':   { color: '#5DCAA5', label: 'On Track'    },
  'over':       { color: '#ff8080', label: 'Over Budget' },
  'under':      { color: '#FAC775', label: 'Under'       },
  'not-started':{ color: '#7a7870', label: 'Not Started' },
};

function fmt(n: number, currency: string) {
  if (n === 0) return '—';
  if (currency === 'INR') return `₹${n.toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}

export default function BudgetPage() {
  const [venture, setVenture] = useState('All');

  const filtered = BUDGET.filter(b => venture === 'All' || b.venture === venture);

  const totalBudget = filtered.filter(b => b.currency === 'USD').reduce((s, b) => s + b.monthlyBudget, 0);
  const totalSpent  = filtered.filter(b => b.currency === 'USD').reduce((s, b) => s + b.spentToDate, 0);

  return (
    <div>
      <h1 className="page-title">Budget</h1>
      <p className="page-sub">Monthly operating budget vs spend across all ventures — May 2026.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">${totalBudget.toLocaleString()}</div>
          <div className="tasks-count-label">Monthly budget (USD)</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#c8f53a' }}>${totalSpent.toLocaleString()}</div>
          <div className="tasks-count-label">Spent MTD (USD)</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#5DCAA5' }}>${(totalBudget - totalSpent).toLocaleString()}</div>
          <div className="tasks-count-label">Remaining (USD)</div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: VENTURE_COLORS[v] } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Venture</th>
            <th>Category</th>
            <th style={{ textAlign: 'right' }}>Monthly Budget</th>
            <th style={{ textAlign: 'right' }}>Spent MTD</th>
            <th style={{ textAlign: 'right' }}>Remaining</th>
            <th>Status</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b, i) => {
            const remaining = b.monthlyBudget - b.spentToDate;
            const ss = STATUS_STYLES[b.status];
            return (
              <tr key={i}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: VENTURE_COLORS[b.venture] }}>{b.venture}</span></td>
                <td><span className="category-label">{b.category}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{fmt(b.monthlyBudget, b.currency)}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: b.spentToDate > 0 ? 'var(--accent)' : 'var(--muted)' }}>{fmt(b.spentToDate, b.currency)}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: remaining < 0 ? '#ff8080' : 'var(--muted)' }}>{fmt(remaining, b.currency)}</td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.62rem' }}>{b.note}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

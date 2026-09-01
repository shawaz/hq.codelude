'use client';

import { useState } from 'react';
import { PAYROLL, type PayrollType, type PayrollStatus } from '@/lib/budget-data';
import { usePageScopes } from '@/lib/use-page-scopes';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<PayrollStatus, { color: string; label: string }> = {
  active:  { color: '#dbdbdb', label: 'Active'  },
  planned: { color: '#b5b5b5', label: 'Planned' },
  open:    { color: '#eeeeee', label: 'Hiring'  },
};

const TYPE_COLORS: Record<PayrollType, string> = {
  founder:    '#eeeeee',
  employee:   '#dbdbdb',
  contractor: '#a5a5a5',
  advisor:    '#b5b5b5',
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8',
  HubCV: '#b5b5b5', Llife: '#a5a5a5', Dextrip: '#adadad',
};


export default function PayrollPage() {
  const { names: allowed } = usePageScopes('payroll');
  const VENTURES = ['All', ...allowed];
  const [venture, setVenture] = useState('All');
  const [status,  setStatus]  = useState<PayrollStatus | 'all'>('all');

  const filtered = PAYROLL.filter(p =>
    // A payroll row spans ventures; showing it needs access to at least one.
    p.ventures.some((v: string) => allowed.includes(v)) &&
    (venture === 'All' || p.ventures.includes(venture)) &&
    (status  === 'all' || p.status === status)
  );

  const activeMonthly  = PAYROLL.filter(p => p.status === 'active').reduce((s, p) => s + p.monthlyCost, 0);
  const plannedMonthly = PAYROLL.filter(p => p.status !== 'active').reduce((s, p) => s + p.monthlyCost, 0);
  const oneTimePlanned = PAYROLL.filter(p => p.status !== 'active').reduce((s, p) => s + p.oneTimeCost, 0);
  const headcount      = PAYROLL.filter(p => p.status === 'active').length;

  return (
    <div>
      <h1 className="page-title">Payroll</h1>
      <p className="page-sub">Team compensation — current, planned hires, and open roles with cost breakdown.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Active headcount', val: String(headcount),             color: '#dbdbdb', sub: 'Current team' },
          { label: 'Active monthly',   val: `$${activeMonthly}/mo`,        color: '#eeeeee', sub: 'Current payroll burn' },
          { label: 'Planned monthly',  val: `$${plannedMonthly.toLocaleString()}/mo`, color: '#b5b5b5', sub: 'When all hires made' },
          { label: 'One-time costs',   val: `$${oneTimePlanned.toLocaleString()}`, color: '#adadad', sub: 'Signing, setup, audit' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: sc(c.color), marginBottom: '0.15rem', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: sc(VENTURE_COLORS[v]) } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {(['all', 'active', 'planned', 'open'] as const).map(s => (
          <button key={s} className={`filter-pill${status === s ? ' active' : ''}`}
            style={status === s && s !== 'all' ? { borderColor: STATUS_STYLES[s]?.color, color: STATUS_STYLES[s]?.color } : {}}
            onClick={() => setStatus(s)}>{s === 'all' ? 'All' : STATUS_STYLES[s].label}</button>
        ))}
      </div>

      {/* Payroll cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {filtered.map((p, i) => {
          const ss = STATUS_STYLES[p.status];
          return (
            <div key={i} style={{
              background: 'var(--card-bg)', padding: '1.25rem 1.5rem',
              borderLeft: `2px solid ${p.status === 'active' ? TYPE_COLORS[p.type] : 'var(--card-border)'}`,
              opacity: p.status === 'active' ? 1 : 0.85,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 120px auto', gap: '1.25rem', alignItems: 'start' }}>
                {/* Name + role */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.12rem 0.45rem', border: `1px solid ${scBorder(TYPE_COLORS[p.type])}`, color: sc(TYPE_COLORS[p.type]) }}>{p.type}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>{p.role}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {p.ventures.map(v => <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', padding: '0.1rem 0.4rem', border: `1px solid ${scBorder(VENTURE_COLORS[v])}`, color: sc(VENTURE_COLORS[v]) }}>{v}</span>)}
                  </div>
                </div>

                {/* Monthly cost */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Monthly</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: p.monthlyCost > 0 ? '#eeeeee' : 'var(--muted)' }}>
                    {p.monthlyCost > 0 ? `$${p.monthlyCost.toLocaleString()}` : p.type === 'founder' ? 'Equity' : '—'}
                  </div>
                </div>

                {/* One-time */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>One-time</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: p.oneTimeCost > 0 ? '#b5b5b5' : 'var(--muted)' }}>
                    {p.oneTimeCost > 0 ? `$${p.oneTimeCost.toLocaleString()}` : '—'}
                  </div>
                </div>

                {/* Equity */}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Equity</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.5 }}>{p.equityNote}</div>
                </div>

                {/* Status + start */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                  <span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{p.startDate}</span>
                </div>
              </div>

              {/* Notes */}
              {p.notes && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)' }}>
                  {p.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

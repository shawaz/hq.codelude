'use client';

import { useState, useMemo } from 'react';
import { VENTURE_BUDGETS, type BudgetLine } from '@/lib/budget-data';

type Tab = 'planned' | 'actual' | 'variance';

const TABS: { key: Tab; label: string }[] = [
  { key: 'planned',  label: 'Planned'  },
  { key: 'actual',   label: 'Actual'   },
  { key: 'variance', label: 'Variance' },
];

function fmt(n: number) {
  if (n === 0) return '—';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function pct(actual: number, planned: number) {
  if (planned === 0) return actual > 0 ? '∞' : '—';
  return `${Math.round((actual / planned) * 100)}%`;
}

function StatusDot({ actual, planned }: { actual: number; planned: number }) {
  if (planned === 0 && actual === 0) return <span style={{ color: 'var(--hq-muted)', fontSize: '0.55rem' }}>—</span>;
  if (actual === 0) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#7a7870' }}>not started</span>;
  if (actual > planned * 1.1) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#ff8080' }}>over</span>;
  if (actual < planned * 0.8) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#FAC775' }}>under</span>;
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#5DCAA5' }}>on track</span>;
}

function groupByCategory(lines: BudgetLine[]) {
  const map = new Map<string, BudgetLine[]>();
  lines.forEach(l => {
    const existing = map.get(l.category) ?? [];
    existing.push(l);
    map.set(l.category, existing);
  });
  return map;
}

export default function BudgetPage() {
  const [vi,  setVi]  = useState(0);
  const [tab, setTab] = useState<Tab>('planned');
  const vb = VENTURE_BUDGETS[vi];

  const totalPlanned  = useMemo(() => vb.lines.reduce((s, l) => s + l.planned,  0), [vb]);
  const totalActual   = useMemo(() => vb.lines.reduce((s, l) => s + l.actual,   0), [vb]);
  const totalYtd      = useMemo(() => vb.lines.reduce((s, l) => s + l.ytdActual, 0), [vb]);
  const variance      = totalActual - totalPlanned;
  const grouped       = useMemo(() => groupByCategory(vb.lines), [vb]);

  // Per-tab summary cards
  const cards = {
    planned: [
      { label: 'Monthly budget',  val: fmt(totalPlanned), sub: 'Total planned spend',       color: 'var(--off-white)' },
      { label: 'Categories',      val: String(grouped.size), sub: 'Budget line categories', color: 'var(--off-white)' },
      { label: 'Currency',        val: vb.currency,       sub: 'Reporting currency',          color: 'var(--off-white)' },
      { label: 'Period',          val: vb.period,         sub: 'Current budget period',       color: 'var(--off-white)' },
    ],
    actual: [
      { label: 'Actual MTD',      val: fmt(totalActual),  sub: 'Spent this month to date',  color: totalActual > 0 ? '#c8f53a' : '#7a7870' },
      { label: 'YTD actual',      val: fmt(totalYtd),     sub: 'Year to date total',         color: '#FAC775' },
      { label: 'MTD utilisation', val: pct(totalActual, totalPlanned), sub: 'Of monthly budget used', color: totalActual > totalPlanned ? '#ff8080' : '#5DCAA5' },
      { label: 'Not started',     val: String(vb.lines.filter(l => l.actual === 0 && l.planned > 0).length), sub: 'Lines with $0 actual', color: '#7a7870' },
    ],
    variance: [
      { label: 'MTD variance',    val: `${variance >= 0 ? '+' : ''}${fmt(Math.abs(variance))}`, sub: variance >= 0 ? 'Over budget' : 'Under budget', color: variance > 0 ? '#ff8080' : '#5DCAA5' },
      { label: 'Planned',         val: fmt(totalPlanned), sub: 'Monthly budget',               color: 'var(--off-white)' },
      { label: 'Actual',          val: fmt(totalActual),  sub: 'Spent MTD',                    color: '#c8f53a' },
      { label: 'Remaining',       val: fmt(Math.max(0, totalPlanned - totalActual)), sub: 'Budget headroom', color: '#5DCAA5' },
    ],
  };

  return (
    <div>
      <h1 className="page-title">Budget</h1>
      <p className="page-sub">Monthly planned vs actual spend — per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {VENTURE_BUDGETS.map((v, i) => (
          <button key={v.venture} onClick={() => { setVi(i); setTab('planned'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem', background: vi === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            letterSpacing: '0.06em', color: vi === i ? 'var(--black)' : 'var(--muted)',
            fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.venture}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${vb.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: vb.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{vb.sector}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{vb.venture} Budget — {vb.period}</div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === t.key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === t.key ? 'var(--black)' : 'var(--muted)',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {cards[tab].map((c, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: c.color, marginBottom: '0.2rem', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Budget lines grouped by category */}
      {Array.from(grouped.entries()).map(([category, lines]) => {
        const catPlanned = lines.reduce((s, l) => s + l.planned, 0);
        const catActual  = lines.reduce((s, l) => s + l.actual,  0);
        const catYtd     = lines.reduce((s, l) => s + l.ytdActual, 0);

        return (
          <div key={category} style={{ marginBottom: '1.25rem' }}>
            {/* Category header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: vb.color, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{category}</span>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {tab !== 'actual' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>planned: {fmt(catPlanned)}/mo</span>}
                {tab !== 'planned' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#c8f53a' }}>actual: {fmt(catActual)}</span>}
                {tab === 'variance' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: catActual > catPlanned ? '#ff8080' : '#5DCAA5' }}>
                  {catActual - catPlanned >= 0 ? '+' : ''}{fmt(Math.abs(catActual - catPlanned))}
                </span>}
              </div>
            </div>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
              {lines.map((line, j) => (
                <div key={j} style={{ background: 'var(--card-bg)', padding: '0.8rem 1.1rem', display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 90px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{line.subcategory ?? line.category}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{line.note}</div>
                  </div>

                  {/* Planned column */}
                  <div style={{ textAlign: 'right' }}>
                    {tab !== 'actual' && (
                      <>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>planned</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{fmt(line.planned)}</div>
                      </>
                    )}
                  </div>

                  {/* Actual MTD */}
                  <div style={{ textAlign: 'right' }}>
                    {tab !== 'planned' && (
                      <>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>actual MTD</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: line.actual > 0 ? '#c8f53a' : 'var(--muted)' }}>{fmt(line.actual)}</div>
                      </>
                    )}
                  </div>

                  {/* YTD or variance */}
                  <div style={{ textAlign: 'right' }}>
                    {tab === 'actual' && (
                      <>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>YTD</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{fmt(line.ytdActual)}</div>
                      </>
                    )}
                    {tab === 'variance' && (
                      <>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>variance</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: (line.actual - line.planned) > 0 ? '#ff8080' : '#5DCAA5' }}>
                          {line.actual - line.planned === 0 ? '—' : `${line.actual - line.planned > 0 ? '+' : ''}${fmt(Math.abs(line.actual - line.planned))}`}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: 'right' }}>
                    {tab !== 'planned' && <StatusDot actual={line.actual} planned={line.planned} />}
                    {tab === 'planned' && line.planned > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>/mo</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Total row */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `2px solid ${vb.color}`, padding: '1rem 1.1rem', display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 90px', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Total — {vb.venture}</div>
        {tab !== 'actual' && (
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: vb.color, fontWeight: 600 }}>{fmt(totalPlanned)}/mo</div>
        )}
        {tab !== 'planned' && (
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#c8f53a', fontWeight: 600 }}>{fmt(totalActual)}</div>
        )}
        {tab === 'actual' && (
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>{fmt(totalYtd)}</div>
        )}
        {tab === 'variance' && (
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: variance >= 0 ? '#ff8080' : '#5DCAA5', fontWeight: 600 }}>
            {variance >= 0 ? '+' : ''}{fmt(Math.abs(variance))}
          </div>
        )}
        {tab === 'planned' && <div />}
        {tab !== 'planned' && <div />}
      </div>
    </div>
  );
}

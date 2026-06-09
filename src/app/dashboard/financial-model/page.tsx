'use client';

import { useEffect, useRef, useState } from 'react';
import { MODELS, type VentureModel } from '@/lib/fin-models';
import { useVenture } from '@/contexts/venture-context';

type Tab = 'pnl' | 'capex' | 'unit' | 'assumptions';
const TABS: { key: Tab; label: string }[] = [
  { key: 'pnl',         label: 'P&L (5 year)'    },
  { key: 'capex',       label: 'Capex'            },
  { key: 'unit',        label: 'Unit Economics'   },
  { key: 'assumptions', label: 'Assumptions'      },
];
const YEARS = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'];

const CARD_COLORS = {
  green:   '#5DCAA5',
  blue:    '#4a9ee8',
  amber:   '#FAC775',
  default: 'var(--off-white)',
};

// ─── METRIC CARDS ─────────────────────────────────────────────────────────────
function MetricCards({ cards }: { cards: VentureModel['pnlCards'] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: CARD_COLORS[c.color], marginBottom: '0.2rem', lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.4 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── P&L TAB ──────────────────────────────────────────────────────────────────
function PnLTab({ model, chartRef }: { model: VentureModel; chartRef: React.RefObject<HTMLCanvasElement> }) {
  const fmt = (v: number | null, type: string) => {
    if (v === null) return '—';
    if (type === 'margin') return `${v}%`;
    const abs = Math.abs(v);
    let str: string;
    if (model.currency === 'INR') {
      str = model.currencySymbol + abs + ' Cr';
    } else {
      str = model.currencySymbol + (abs >= 1000 ? (abs / 1000).toFixed(1) + 'M' : abs + 'K');
    }
    return v < 0 ? `(${str})` : str;
  };

  const rowColor = (type: string) => {
    if (type === 'total-rev') return '#5DCAA5';
    if (type === 'total-cost') return '#F0997B';
    if (type === 'ebitda') return model.color;
    if (type === 'margin') return model.color;
    return 'var(--off-white)';
  };

  return (
    <>
      {/* Chart */}
      <div style={{ position: 'relative', height: 240, marginBottom: '1rem' }}>
        <canvas ref={chartRef} />
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {model.chartDatasets.map(d => (
          <span key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: d.type === 'line' ? 2 : 2, background: d.color, display: 'inline-block' }} />{d.label}
          </span>
        ))}
      </div>
      {/* Table */}
      <table className="tasks-table">
        <thead>
          <tr>
            <th style={{ width: '36%' }}>Line item</th>
            {YEARS.map(y => <th key={y} style={{ textAlign: 'right' }}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {model.pnlRows.map((row, i) => {
            const isHighlight = ['total-rev', 'total-cost', 'ebitda', 'margin'].includes(row.type);
            return (
              <tr key={i} style={isHighlight ? { background: 'rgba(255,255,255,0.03)', fontWeight: 600 } : {}}>
                <td>
                  <span style={{ fontSize: '0.78rem', color: rowColor(row.type) }}>{row.label}</span>
                  {row.note && <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '1px' }}>{row.note}</span>}
                </td>
                {row.values.map((v, j) => (
                  <td key={j} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: v !== null && v < 0 ? '#ff8080' : rowColor(row.type) }}>
                    {fmt(v, row.type)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// ─── CAPEX TAB ────────────────────────────────────────────────────────────────
function CapexTab({ model }: { model: VentureModel }) {
  const phaseColor: Record<string, string> = {
    'Seed': '#c8f53a', 'Series A': '#FAC775', 'Pre-seed': '#c8f53a',
    'Y1': '#c8f53a', 'Y2': '#FAC775', 'Y1–Y2': '#5DCAA5',
  };
  return (
    <table className="tasks-table">
      <thead>
        <tr>
          <th style={{ width: '38%' }}>Item</th>
          <th>Phase</th>
          <th style={{ textAlign: 'right' }}>Amount</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {model.capexRows.map((row, i) => (
          <tr key={i} style={row.highlight ? { background: 'rgba(255,255,255,0.04)', fontWeight: 600 } : {}}>
            <td style={{ fontSize: '0.78rem', color: row.highlight ? model.color : 'var(--off-white)' }}>{row.item}</td>
            <td>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', border: `1px solid ${phaseColor[row.phase] || 'var(--card-border)'}40`, color: phaseColor[row.phase] || 'var(--muted)' }}>
                {row.phase}
              </span>
            </td>
            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: row.highlight ? model.color : 'var(--off-white)' }}>{row.amount}</td>
            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── UNIT ECONOMICS TAB ───────────────────────────────────────────────────────
function UnitTab({ model }: { model: VentureModel }) {
  const typeColor = { pos: '#5DCAA5', neg: '#ff8080', neutral: 'var(--muted)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
      {model.unitRows.map((row, i) => (
        <div key={i} style={{ background: 'var(--card-bg)', padding: '0.9rem 1.25rem', display: 'grid', gridTemplateColumns: '220px 140px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>{row.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: row.type ? typeColor[row.type] : model.color }}>{row.value}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>{row.note}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ASSUMPTIONS TAB ──────────────────────────────────────────────────────────
function AssumptionsTab({ model }: { model: VentureModel }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem' }}>
      {model.assumptions.map((group, i) => (
        <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: model.color, marginBottom: '0.75rem' }}>{group.title}</div>
          {group.rows.map((r, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: j < group.rows.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)', fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function FinancialModelPage() {
  const { vi, setVi } = useVenture();
  const [tab, setTab] = useState<Tab>('pnl');
  const chartRef  = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<unknown>(null);
  const model = MODELS[vi];

  useEffect(() => {
    if (tab !== 'pnl' || !chartRef.current) return;
    import('chart.js/auto').then(mod => {
      const Chart = mod.default as any;
      if (chartInst.current) (chartInst.current as any).destroy();
      chartInst.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: YEARS,
          datasets: model.chartDatasets.map(d => ({
            label: d.label,
            data: d.data,
            backgroundColor: d.type === 'line' ? 'rgba(163,45,45,0.2)' : d.color,
            borderColor: d.type === 'line' ? '#A32D2D' : undefined,
            borderWidth: d.type === 'line' ? 1.5 : 0,
            type: d.type ?? 'bar',
            stack: d.type === 'line' ? undefined : 'rev',
            fill: false,
            pointRadius: d.type === 'line' ? 4 : undefined,
            pointBackgroundColor: d.type === 'line' ? '#A32D2D' : undefined,
          })),
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#7a7870', font: { size: 11 } } },
            y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7a7870', font: { size: 11 } } },
          },
        },
      });
    });
    return () => { if (chartInst.current) (chartInst.current as any).destroy(); };
  }, [vi, tab]);

  const cards = tab === 'pnl' ? model.pnlCards : tab === 'capex' ? model.capexCards : tab === 'unit' ? model.unitCards : model.pnlCards;

  return (
    <div>
      <h1 className="page-title">Financial Model</h1>
      <p className="page-sub">5-year financial model, capex, unit economics, and assumptions — per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {MODELS.map((m, i) => (
          <button key={m.name} onClick={() => { setVi(i); setTab('pnl'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem',
            background: vi === i ? m.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: vi === i ? 'var(--black)' : 'var(--muted)',
            fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
          }}>{m.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${model.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: model.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          {model.name} · {model.currency} model
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{model.name} Financial Model</div>
      </div>

      {/* Tabs */}
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

      {/* Per-tab metric cards (not shown on assumptions) */}
      {tab !== 'assumptions' && <MetricCards cards={cards} />}

      {/* Tab content */}
      {tab === 'pnl'         && <PnLTab model={model} chartRef={chartRef as React.RefObject<HTMLCanvasElement>} />}
      {tab === 'capex'       && <CapexTab model={model} />}
      {tab === 'unit'        && <UnitTab model={model} />}
      {tab === 'assumptions' && <AssumptionsTab model={model} />}
    </div>
  );
}

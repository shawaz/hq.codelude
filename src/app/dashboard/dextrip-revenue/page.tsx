'use client';

import { useEffect, useState } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DextripRevenuePage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dextrip').then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const s = data?.summary;

  // Revenue projections (target vs actual)
  const now = new Date();
  const currentMonth = now.getMonth();

  const MONTHLY_TARGETS = [
    { month: 'Jan', sub: 0,   trading: 0,    label: 'Pre-beta' },
    { month: 'Feb', sub: 0,   trading: 0,    label: 'Pre-beta' },
    { month: 'Mar', sub: 58,  trading: 0,    label: 'Closed beta begins' },
    { month: 'Apr', sub: 116, trading: 50,   label: '' },
    { month: 'May', sub: 227, trading: s ? Math.max(0, s.totalPnl) : 0, label: 'Current' },
    { month: 'Jun', sub: 500, trading: 100,  label: 'Target (public beta)' },
    { month: 'Jul', sub: 1200,trading: 200,  label: 'Target (marketplace live)' },
    { month: 'Aug', sub: 2500,trading: 400,  label: 'Target' },
    { month: 'Sep', sub: 4000,trading: 600,  label: 'Target' },
    { month: 'Oct', sub: 6000,trading: 800,  label: 'Target' },
    { month: 'Nov', sub: 8500,trading: 1000, label: 'Target' },
    { month: 'Dec', sub: 12000,trading:1200, label: 'Target (Y1 end)' },
  ];

  const currentData = MONTHLY_TARGETS[currentMonth];
  const totalRevMtd = (s?.subscriptionMrr ?? 0) + Math.max(0, s?.totalPnl ?? 0);
  const y1Target = MONTHLY_TARGETS.reduce((sum, m) => sum + m.sub + m.trading, 0);

  return (
    <div>
      <h1 className="page-title">Revenue</h1>
      <p className="page-sub">Dextrip monthly revenue — subscriptions + trading P&L vs targets.</p>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Subscription MRR',   val: `$${s?.subscriptionMrr ?? 227}/mo`, color: '#5DCAA5', sub: '3 beta subscribers' },
          { label: 'Trading PnL (MTD)',   val: `${(s?.totalPnl ?? 0) >= 0 ? '+' : ''}$${(s?.totalPnl ?? 0).toFixed(2)}`, color: (s?.totalPnl ?? 0) >= 0 ? '#c8f53a' : '#ff8080', sub: 'All strategies combined' },
          { label: 'Total revenue MTD',   val: `$${totalRevMtd.toFixed(0)}`, color: '#5DCAA5', sub: 'Subs + trading' },
          { label: 'Y1 revenue target',   val: `$${(y1Target/1000).toFixed(0)}K`, color: '#FAC775', sub: 'By Dec 2026' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: c.color, marginBottom: '0.15rem', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly breakdown table */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
        2026 Monthly Revenue — Subscriptions + Trading P&L
      </div>
      <table className="tasks-table" style={{ marginBottom: '1.5rem' }}>
        <thead>
          <tr>
            <th>Month</th>
            <th style={{ textAlign: 'right' }}>Sub revenue</th>
            <th style={{ textAlign: 'right' }}>Trading P&L</th>
            <th style={{ textAlign: 'right' }}>Total</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {MONTHLY_TARGETS.map((m, i) => {
            const total   = m.sub + m.trading;
            const isCurrent = i === currentMonth;
            const isPast    = i < currentMonth;
            return (
              <tr key={m.month} style={isCurrent ? { background: 'rgba(200,245,58,0.04)' } : {}}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isCurrent ? '#c8f53a' : isPast ? 'var(--muted)' : 'var(--off-white)', fontWeight: isCurrent ? 700 : 400 }}>{m.month} 2026</span>
                  {isCurrent && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: '#c8f53a', marginLeft: '0.4rem', letterSpacing: '0.1em' }}>◀ NOW</span>}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: m.sub > 0 ? '#5DCAA5' : 'var(--muted)' }}>{m.sub > 0 ? `$${m.sub}` : '—'}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: m.trading > 0 ? '#FAC775' : 'var(--muted)' }}>{m.trading > 0 ? `$${m.trading}` : '—'}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: total > 0 ? 'var(--off-white)' : 'var(--muted)' }}>{total > 0 ? `$${total}` : '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{m.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Subscription breakdown */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
        Current subscriptions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {[
          { tier: 'Pro',  price: '$99/mo', count: 2, total: '$198/mo', color: '#5DCAA5' },
          { tier: 'Base', price: '$29/mo', count: 1, total: '$29/mo',  color: '#FAC775' },
          { tier: 'MRR total', price: '', count: 3, total: '$227/mo', color: '#c8f53a' },
        ].map((row, i) => (
          <div key={i} style={{ background: i === 2 ? 'rgba(255,255,255,0.02)' : 'var(--card-bg)', padding: '0.85rem 1.25rem', display: 'grid', gridTemplateColumns: '100px 100px 80px 1fr', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: row.color, fontWeight: i === 2 ? 700 : 400 }}>{row.tier}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{row.price}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{row.count} subscriber{row.count !== 1 ? 's' : ''}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: row.color, fontWeight: i === 2 ? 700 : 400 }}>{row.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

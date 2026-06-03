'use client';

import { useEffect, useState } from 'react';

const STEP_COLORS: Record<number, string> = {
  0:'#5DCAA5', 1:'#c8f53a', 2:'#FAC775', 3:'#F0997B', 4:'#ff8080', 5:'#ff5050',
};

export default function TradingPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState<'all'|'indicator'|'webhook'>('all');

  async function load() {
    try {
      const res = await fetch('/api/dextrip');
      if (!res.ok) throw new Error('API error');
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i); }, []);

  const allStrategies = data ? [
    ...(filter !== 'webhook' ? (data.strategies ?? []) : []),
    ...(filter !== 'indicator' ? (data.webhooks ?? []) : []),
  ] : [];

  const s = data?.summary;

  return (
    <div>
      <h1 className="page-title">Trading Performance</h1>
      <p className="page-sub">Live strategy P&L across all Dextrip bots — refreshes every 15 seconds.</p>

      {loading && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '2rem' }}>Loading live data...</div>}
      {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#ff8080', padding: '1rem', border: '1px solid rgba(255,128,128,0.3)', marginBottom: '1.5rem' }}>Error: {error} — ensure HQ is running on the same server as Dextrip.</div>}

      {s && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total PnL',        val: `${s.totalPnl >= 0 ? '+' : ''}$${s.totalPnl.toFixed(2)}`,   color: s.totalPnl >= 0 ? '#5DCAA5' : '#ff8080' },
            { label: 'Total trades',     val: String(s.totalTrades),       color: 'var(--off-white)' },
            { label: 'Win rate',         val: `${s.winRate}%`,             color: s.winRate >= 55 ? '#5DCAA5' : '#FAC775' },
            { label: 'Active strategies',val: String(s.activeStrategies),  color: '#c8f53a' },
            { label: 'Sub MRR',          val: `$${s.subscriptionMrr}/mo`, color: '#5DCAA5' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {(['all', 'indicator', 'webhook'] as const).map(f => (
          <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${allStrategies.length})` : f}
          </button>
        ))}
      </div>

      {/* Strategy cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {allStrategies.map((st: any) => {
          const winRate = st.totalTrades > 0 ? Math.round((st.wins / st.totalTrades) * 100) : 0;
          const stepColor = STEP_COLORS[st.currentStep] ?? '#ff5050';
          return (
            <div key={st.id} style={{ background: st.openPosition ? '#0a1508' : 'var(--card-bg)', padding: '1.1rem 1.25rem', borderLeft: st.openPosition ? '2px solid #5DCAA5' : '2px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.15rem' }}>{st.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{st.tf}{st.entryMode ? ` · ${st.entryMode}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {st.paused && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: '#FAC775', border: '1px solid rgba(250,199,117,0.3)', padding: '0.1rem 0.4rem' }}>PAUSED</span>}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.15rem 0.5rem', border: `1px solid ${stepColor}40`, color: stepColor }}>S{st.currentStep}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: st.openPosition ? '0.6rem' : 0 }}>
                {[
                  { l: 'Trades', v: st.totalTrades, c: 'var(--off-white)' },
                  { l: 'W',      v: st.wins,        c: '#5DCAA5' },
                  { l: 'L',      v: st.losses,      c: '#ff8080' },
                  { l: 'PnL',    v: `${st.totalPnl >= 0 ? '+' : ''}$${st.totalPnl.toFixed(1)}`, c: st.totalPnl >= 0 ? '#5DCAA5' : '#ff8080' },
                ].map(c => (
                  <div key={c.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: c.c, fontWeight: 600 }}>{c.v}</div>
                  </div>
                ))}
              </div>
              {st.openPosition && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#5DCAA5', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem' }}>
                  ● OPEN {st.openPosition.display_side} @ ${st.openPosition.entry_price?.toFixed(4)}
                </div>
              )}
            </div>
          );
        })}
        {!loading && allStrategies.length === 0 && (
          <div style={{ background: 'var(--card-bg)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', gridColumn: '1/-1', textAlign: 'center' }}>
            No strategy data available. Check the API connection.
          </div>
        )}
      </div>
    </div>
  );
}

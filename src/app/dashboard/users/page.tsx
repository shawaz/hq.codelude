'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const HUMANS = [
  {
    name:   'Shawaz',
    role:   'Founder & CEO',
    email:  'codelude@gmail.com',
    location: 'Mangaluru, India',
    timezone: 'IST (UTC+5:30)',
    ventures: ['Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'],
    responsibilities: ['Strategy', 'Engineering', 'Finance', 'Operations', 'Investor Relations'],
    status: 'active' as const,
  },
];

const AI_AGENTS = [
  // ── Claude AI Agents (agent.py) ──────────────────────────────
  {
    name: 'Alpha',       emoji: '🔴', color: '#ff8080',
    type: 'Claude Agent', model: 'claude-3-5-haiku',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Aggressive UP-biased trader. Strong in breakout and bullish continuation regimes.',
    tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'],
    status: 'active' as const,
  },
  {
    name: 'Sigma',       emoji: '🔵', color: '#85B7EB',
    type: 'Claude Agent', model: 'claude-3-5-haiku',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Balanced risk manager. Reads regime before committing direction. Holds more than most.',
    tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'],
    status: 'active' as const,
  },
  {
    name: 'Delta',       emoji: '🟢', color: '#5DCAA5',
    type: 'Claude Agent', model: 'claude-3-5-haiku',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Contrarian fade specialist. Hunts overextended moves and fades them with RSI + VWAP.',
    tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'],
    status: 'active' as const,
  },
  // ── Springfield Strategy Agents ──────────────────────────────
  {
    name: 'Lisa',        emoji: '🟡', color: '#FAC775',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Volume Surge specialist. Trades breakout candles when volume spikes above baseline.',
    tools: ['Volume Surge', 'VWAP Reclaim'],
    status: 'active' as const,
  },
  {
    name: 'Bart',        emoji: '🟠', color: '#F0997B',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Momentum Break hunter. Enters when price breaks out of recent range with directional force.',
    tools: ['Momentum Break', 'Volume Surge', 'Liquidity Sweep Reversal'],
    status: 'active' as const,
  },
  {
    name: 'Marge',       emoji: '🔵', color: '#7F77DD',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'VWAP Reclaim trader. Buys or sells when price reclaims VWAP with supporting volume.',
    tools: ['VWAP Reclaim', 'RSI Reversal'],
    status: 'active' as const,
  },
  {
    name: 'Homer',       emoji: '🟡', color: '#FAC775',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'RSI Reversal fader. Looks for overstretched moves and fades them at RSI extremes.',
    tools: ['RSI Reversal'],
    status: 'active' as const,
  },
  {
    name: 'Mr Burns',    emoji: '⚫', color: '#7a7870',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['1h', '4h'],
    role: 'Trend Ride player. Follows sustained directional moves using MA slope and higher highs/lows.',
    tools: ['Trend Ride', 'Trend Pullback', 'Volume Surge'],
    status: 'active' as const,
  },
  {
    name: 'Nelson',      emoji: '🔴', color: '#ff8080',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Aggressive downside hunter. Best at sharp downside continuation and trap reversals.',
    tools: ['Liquidity Sweep Reversal', 'Momentum Break', 'RSI Reversal'],
    status: 'active' as const,
  },
  {
    name: 'Maggie',      emoji: '🟣', color: '#c8f53a',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'AntiRekt Trend Oscillator — SMMA jaw/lips crossover. Avoids breakout and chaos regimes.',
    tools: ['AntiRekt Trend Oscillator'],
    status: 'active' as const,
  },
  {
    name: 'Milhouse',    emoji: '🔵', color: '#85B7EB',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Cautious trend follower. Can become timid after failures but reliable in clean trends.',
    tools: ['Trend Ride', 'VWAP Reclaim'],
    status: 'active' as const,
  },
  {
    name: 'Apu',         emoji: '🟢', color: '#5DCAA5',
    type: 'Strategy Agent', model: 'Rules-based',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Multi-strategy opportunist. Avoids chaos regimes. Picks the strongest signal available.',
    tools: ['Volume Surge', 'Momentum Break', 'VWAP Reclaim'],
    status: 'active' as const,
  },
  // ── Infrastructure Bots ──────────────────────────────────────
  {
    name: 'Multi-Bot',   emoji: '⚙️', color: '#c8f53a',
    type: 'Execution Bot', model: 'Node.js',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Core multi-exchange trading execution engine. Routes orders across Binance, Bybit, OKX.',
    tools: ['Order execution', 'Balance management', 'Multi-exchange routing'],
    status: 'active' as const,
  },
  {
    name: 'TV Bot',      emoji: '📺', color: '#F0997B',
    type: 'Feed Bot', model: 'Python 3',
    venture: 'Dextrip',  tf: ['5m', '15m'],
    role: 'Processes live market signals and pushes to TV dashboard via /webhook/5m and /webhook/15m.',
    tools: ['Webhook ingestion', 'Signal broadcast', 'TV feed'],
    status: 'active' as const,
  },
  {
    name: 'Spot Bot',    emoji: '🎯', color: '#FAC775',
    type: 'Execution Bot', model: 'Python 3',
    venture: 'Dextrip',  tf: ['live'],
    role: 'Automated spot trade execution. Monitors signals and places spot orders autonomously.',
    tools: ['Spot execution', 'Balance tracking', 'Signal monitoring'],
    status: 'active' as const,
  },
];

const VENTURE_COLORS: Record<string, string> = {
  Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775',
  Cuestay: '#85B7EB', Dextrip: '#F0997B', Codelude: '#c8f53a',
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function HumansTab() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {HUMANS.map(h => (
          <div key={h.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.75rem', borderTop: '2px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, background: 'var(--accent)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, flexShrink: 0 }}>
                {h.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{h.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h.role}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: '1px solid rgba(93,202,165,0.3)', color: '#5DCAA5' }}>Active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', marginBottom: '1rem' }}>
              {[
                { k: 'Email',     v: h.email },
                { k: 'Location',  v: h.location },
                { k: 'Timezone',  v: h.timezone },
              ].map(row => (
                <div key={row.k} style={{ background: 'var(--card-bg)', padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Ventures</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {h.ventures.map(v => <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '0.1rem 0.45rem', border: `1px solid ${VENTURE_COLORS[v]}40`, color: VENTURE_COLORS[v] }}>{v}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Responsibilities</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {h.responsibilities.map(r => <span key={r} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '0.1rem 0.45rem', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>{r}</span>)}
              </div>
            </div>
          </div>
        ))}
        {/* Hiring placeholder */}
        <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)', padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: 200 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hiring</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7, fontWeight: 300 }}>Next hire: Thermal Engineer (Roborns) or Full-Stack Engineer</div>
          <a href="/dashboard/positions" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.08em', textDecoration: 'none', marginTop: '0.5rem' }}>View open positions →</a>
        </div>
      </div>
    </div>
  );
}

function AgentsTab() {
  const [filter, setFilter] = useState<'all' | 'Claude Agent' | 'Strategy Agent' | 'Execution Bot' | 'Feed Bot'>('all');
  const types = ['all', 'Claude Agent', 'Strategy Agent', 'Execution Bot', 'Feed Bot'] as const;
  const filtered = AI_AGENTS.filter(a => filter === 'all' || a.type === filter);

  return (
    <div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {types.map(t => (
          <button key={t} className={`filter-pill${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? `All agents (${AI_AGENTS.length})` : t}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map(a => (
          <div key={a.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', borderTop: `2px solid ${a.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{a.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: a.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{a.type}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: '1px solid rgba(93,202,165,0.3)', color: '#5DCAA5' }}>Active</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>{a.tf.join(' / ')}</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem' }}>{a.role}</p>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                {a.type === 'Claude Agent' ? 'Tools' : 'Strategies'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {a.tools.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '0.1rem 0.45rem', border: `1px solid ${a.color}30`, color: a.color }}>{t}</span>)}
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', opacity: 0.6 }}>model: {a.model}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgChartTab() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 700, paddingBottom: '2rem' }}>

        {/* HoldCo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', padding: '0.85rem 2rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>HoldCo</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Codelude HoldCo</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>Dubai, UAE</div>
          </div>
        </div>

        {/* Connector */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
          <div style={{ width: 1, height: 24, background: 'var(--card-border)' }} />
        </div>

        {/* Founder */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderTop: '2px solid var(--accent)', padding: '0.85rem 2rem', textAlign: 'center', minWidth: 200 }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', margin: '0 auto 0.5rem' }}>S</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Shawaz</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Founder & CEO</div>
          </div>
        </div>

        {/* Branching line */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 1, height: 24, background: 'var(--card-border)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
          <div style={{ height: 1, background: 'var(--card-border)', width: '75%' }} />
        </div>

        {/* Ventures row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '0 2rem' }}>
          {[
            { name: 'Roborns',     sector: 'Coastal AI', color: '#5DCAA5', status: 'Building' },
            { name: 'Franchiseen', sector: 'Franchise OS', color: '#7F77DD', status: 'Building' },
            { name: 'HubCV',       sector: 'AI Careers', color: '#FAC775', status: 'Building' },
            { name: 'Cuestay',     sector: 'Home AI', color: '#85B7EB', status: 'Building' },
            { name: 'Dextrip',     sector: 'Trading', color: '#F0997B', status: 'Live' },
          ].map(v => (
            <div key={v.name} style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 1, height: 24, background: 'var(--card-border)' }} />
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderTop: `2px solid ${v.color}`, padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: v.color, marginBottom: '0.2rem' }}>{v.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{v.sector}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: v.status === 'Live' ? '#5DCAA5' : '#c8f53a', marginTop: '0.4rem' }}>{v.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dextrip sub-agents */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 2rem', marginTop: '0' }}>
          <div style={{ flex: 1, maxWidth: '20%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 1, height: 24, background: 'var(--card-border)' }} />
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#F0997B', marginBottom: '0.25rem', fontWeight: 600 }}>AI Agents</div>
              {['Alpha', 'Sigma', 'Delta', 'Lisa', 'Bart', 'Homer', '+ 7 more'].map(n => (
                <div key={n} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', lineHeight: 1.6 }}>{n}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--accent)', label: 'Founder / HoldCo' },
            { color: '#5DCAA5',       label: 'Venture — Live' },
            { color: '#c8f53a',       label: 'Venture — Building' },
            { color: '#F0997B',       label: 'AI Agents (Dextrip)' },
          ].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, background: l.color, display: 'inline-block' }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type Tab = 'humans' | 'agents' | 'org';

const TABS: { key: Tab; label: string; count?: number }[] = [
  { key: 'humans', label: 'Humans',    count: HUMANS.length },
  { key: 'agents', label: 'AI Agents', count: AI_AGENTS.length },
  { key: 'org',    label: 'Org Chart' },
];

export default function TeamPage() {
  const [tab, setTab] = useState<Tab>('humans');

  return (
    <div>
      <h1 className="page-title">Team</h1>
      <p className="page-sub">Humans, AI agents, and organisational structure across Codelude.</p>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '2rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.6rem 1.4rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === t.key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === t.key ? 'var(--black)' : 'var(--muted)',
          }}>
            {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      {tab === 'humans' && <HumansTab />}
      {tab === 'agents' && <AgentsTab />}
      {tab === 'org'    && <OrgChartTab />}
    </div>
  );
}

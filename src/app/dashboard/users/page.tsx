'use client';

import { useState } from 'react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure' },
  { name: 'Franchiseen', color: '#7F77DD', sector: 'Franchise Finance OS' },
  { name: 'HubCV',       color: '#FAC775', sector: 'AI Career Intelligence' },
  { name: 'Cuestay',     color: '#85B7EB', sector: 'Home AI Automation' },
  { name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Trading' },
];

interface Human {
  name: string; role: string; type: 'founder' | 'hire' | 'open';
  email?: string; location?: string; note?: string;
}

interface Agent {
  name: string; emoji: string; color: string; type: string;
  model: string; tf: string[]; role: string; tools: string[];
}

const VENTURE_DATA: Record<string, { humans: Human[]; agents: Agent[]; openRoles: string[] }> = {
  Roborns: {
    humans: [
      { name: 'Shawaz', role: 'Founder — Venture Lead', type: 'founder', email: 'shawaz@codelude.com', location: 'Mangaluru, India', note: 'Overseeing site survey, engineering partner search, and seed round preparation.' },
      { name: 'Thermal Engineer', role: 'Coastal Heat Exchange Lead', type: 'open', note: 'Critical hire — must have coastal industrial heat exchange and desalination experience. Contract role for Phase 1 feasibility.' },
      { name: 'Government Liaison', role: 'Permits & Compliance', type: 'open', note: 'Karnataka coastal authority, MESCOM grid connection, CRZ clearance pathway.' },
    ],
    agents: [],
    openRoles: ['Thermal Engineer', 'Government Liaison', 'Site Survey Coordinator'],
  },
  Franchiseen: {
    humans: [
      { name: 'Shawaz', role: 'Founder — Venture Lead', type: 'founder', email: 'shawaz@codelude.com', location: 'Mangaluru, India', note: 'Leading platform development, franchise brand acquisition, and investor compliance structure.' },
      { name: 'Franchise Partnership Manager', role: 'Brand Acquisition', type: 'open', note: 'Owns franchise brand signing. Target: 5+ brands in first 6 months. B2B sales, franchise industry knowledge required.' },
      { name: 'Investment Legal Counsel', role: 'SEBI / Platform Compliance', type: 'open', note: 'External counsel — investment platform regulatory pathway, KYC/AML, investor agreements.' },
    ],
    agents: [],
    openRoles: ['Franchise Partnership Manager', 'Investment Legal Counsel', 'KYC Integration Engineer'],
  },
  HubCV: {
    humans: [
      { name: 'Shawaz', role: 'Founder — Venture Lead', type: 'founder', email: 'shawaz@codelude.com', location: 'Mangaluru, India', note: 'Building the matching engine and recruiter onboarding pipeline. Owns first 5 design partner relationships.' },
      { name: 'AI / ML Engineer', role: 'Matching Engine', type: 'open', note: 'Owns the AI candidate matching core — Python, LLM integration, vector databases, NLP. Remote.' },
      { name: 'Skill Verifiers', role: 'Human Assessment Network', type: 'open', note: 'Domain experts (engineering, finance, design) — paid per verification. Freelance / contract.' },
    ],
    agents: [
      {
        name: 'HubCV Matcher', emoji: '🔍', color: '#FAC775',
        type: 'Claude Agent', model: 'claude-3-5-haiku',
        tf: ['async'],
        role: 'Analyzes professional profiles against recruiter requirements using Anthropic SDK. Scores match quality, identifies skill gaps, and surfaces upskilling recommendations.',
        tools: ['profile_analysis', 'skill_scoring', 'job_matching', 'gap_detection'],
      },
    ],
    openRoles: ['AI/ML Engineer', 'Skill Verifiers (×20)', 'Recruiter Success Manager'],
  },
  Cuestay: {
    humans: [
      { name: 'Shawaz', role: 'Founder — Venture Lead', type: 'founder', email: 'shawaz@codelude.com', location: 'Mangaluru, India', note: 'Finalised protocol spec. Leading hardware partner negotiation and property developer channel development.' },
      { name: 'Hardware Product Manager', role: 'Hub Device & Supply Chain', type: 'open', note: 'Owns ODM manufacturing partner relationship, Matter certification, MOQ management. IoT hardware experience required.' },
      { name: 'Firmware Engineer', role: 'Matter Protocol & Hub OS', type: 'open', note: 'Builds the Cuestay Hub firmware — Matter 1.3+ integration, device management, on-device AI layer.' },
    ],
    agents: [
      {
        name: 'Cuestay Ambience', emoji: '🏠', color: '#85B7EB',
        type: 'Claude Agent', model: 'claude-3-5-haiku',
        tf: ['realtime'],
        role: 'Ambient home intelligence agent — learns household routines, anticipates needs, and coordinates device actions proactively. Runs on-device with cloud fallback.',
        tools: ['routine_learning', 'device_control', 'environment_sensing', 'proactive_action'],
      },
    ],
    openRoles: ['Hardware Product Manager', 'Firmware Engineer', 'IoT QA Engineer'],
  },
  Dextrip: {
    humans: [
      { name: 'Shawaz', role: 'Founder — Venture Lead', type: 'founder', email: 'shawaz@codelude.com', location: 'Mangaluru, India', note: 'Owns strategy development, creator programme launch, and public beta go-to-market.' },
      { name: 'Strategy Creator Programme', role: 'Community Lead', type: 'open', note: 'Recruits and onboards strategy creators to the marketplace. Target: 20 creators before public beta. Crypto-native community experience.' },
    ],
    agents: [
      { name: 'Alpha', emoji: '🔴', color: '#ff8080', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Aggressive UP-biased trader. Strong in breakout and bullish continuation regimes.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Sigma', emoji: '🔵', color: '#85B7EB', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Balanced risk manager. Reads regime before committing direction. Holds more than most.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Delta', emoji: '🟢', color: '#5DCAA5', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Contrarian fade specialist. Hunts overextended moves and fades them with RSI + VWAP.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Lisa',      emoji: '🟡', color: '#FAC775', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Volume Surge specialist. Trades breakout candles when volume spikes above baseline.',         tools: ['Volume Surge', 'VWAP Reclaim'] },
      { name: 'Bart',      emoji: '🟠', color: '#F0997B', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Momentum Break hunter. Enters when price breaks out of recent range with directional force.', tools: ['Momentum Break', 'Volume Surge', 'Liquidity Sweep Reversal'] },
      { name: 'Marge',     emoji: '🔵', color: '#7F77DD', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'VWAP Reclaim trader. Buys or sells when price reclaims VWAP with supporting volume.',       tools: ['VWAP Reclaim', 'RSI Reversal'] },
      { name: 'Homer',     emoji: '🟡', color: '#FAC775', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'RSI Reversal fader. Looks for overstretched moves and fades them at RSI extremes.',           tools: ['RSI Reversal'] },
      { name: 'Mr Burns',  emoji: '⚫', color: '#7a7870', type: 'Strategy Agent', model: 'Rules-based', tf: ['1h', '4h'],  role: 'Trend Ride player. Follows sustained directional moves using MA slope and higher highs/lows.',  tools: ['Trend Ride', 'Trend Pullback', 'Volume Surge'] },
      { name: 'Nelson',    emoji: '🔴', color: '#ff8080', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Aggressive downside hunter. Best at sharp downside continuation and trap reversals.',         tools: ['Liquidity Sweep Reversal', 'Momentum Break', 'RSI Reversal'] },
      { name: 'Maggie',    emoji: '🟣', color: '#c8f53a', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'AntiRekt Trend Oscillator — SMMA jaw/lips crossover. Avoids breakout and chaos regimes.',     tools: ['AntiRekt Trend Oscillator'] },
      { name: 'Milhouse',  emoji: '🔵', color: '#85B7EB', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Cautious trend follower. Reliable in clean trends, timid after failures.',                   tools: ['Trend Ride', 'VWAP Reclaim'] },
      { name: 'Apu',       emoji: '🟢', color: '#5DCAA5', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Multi-strategy opportunist. Avoids chaos regimes. Picks the strongest signal available.',    tools: ['Volume Surge', 'Momentum Break', 'VWAP Reclaim'] },
      { name: 'Multi-Bot', emoji: '⚙️', color: '#c8f53a', type: 'Execution Bot',  model: 'Node.js',     tf: ['5m', '15m'], role: 'Core multi-exchange execution engine. Routes orders across Binance, Bybit, OKX.',           tools: ['Order execution', 'Balance management', 'Multi-exchange routing'] },
      { name: 'TV Bot',    emoji: '📺', color: '#F0997B', type: 'Feed Bot',       model: 'Python 3',    tf: ['5m', '15m'], role: 'Processes live market signals and pushes to TV dashboard via /webhook/5m and /webhook/15m.', tools: ['Webhook ingestion', 'Signal broadcast', 'TV feed'] },
      { name: 'Spot Bot',  emoji: '🎯', color: '#FAC775', type: 'Execution Bot',  model: 'Python 3',    tf: ['live'],      role: 'Automated spot trade execution. Monitors signals and places spot orders autonomously.',        tools: ['Spot execution', 'Balance tracking', 'Signal monitoring'] },
    ],
    openRoles: ['Strategy Creator Programme Lead'],
  },
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function HumansSection({ venture }: { venture: string }) {
  const { humans } = VENTURE_DATA[venture];
  const color = VENTURES.find(v => v.name === venture)!.color;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {humans.map(h => (
        <div key={h.name} style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderTop: `2px solid ${h.type === 'founder' ? color : h.type === 'open' ? 'var(--card-border)' : color}`,
          padding: '1.5rem',
          opacity: h.type === 'open' ? 0.75 : 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, background: h.type === 'open' ? 'var(--card-border)' : color, color: h.type === 'open' ? 'var(--muted)' : 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
              {h.type === 'open' ? '+' : h.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: h.type === 'open' ? 'var(--muted)' : color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h.role}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${h.type === 'founder' ? 'rgba(93,202,165,0.3)' : 'var(--card-border)'}`, color: h.type === 'founder' ? '#5DCAA5' : 'var(--muted)', flexShrink: 0 }}>
              {h.type === 'founder' ? 'Active' : 'Hiring'}
            </span>
          </div>
          {h.email && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{h.email}</div>}
          {h.location && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{h.location}</div>}
          {h.note && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{h.note}</p>}
        </div>
      ))}
    </div>
  );
}

function AgentsSection({ venture }: { venture: string }) {
  const { agents } = VENTURE_DATA[venture];
  if (!agents.length) return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
      No AI agents assigned to {venture} yet. Agents will be added as the platform enters development.
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {agents.map(a => (
        <div key={a.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', borderTop: `2px solid ${a.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{a.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{a.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: a.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{a.type}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: '1px solid rgba(93,202,165,0.3)', color: '#5DCAA5' }}>Active</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>{a.tf.join(' / ')}</span>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem' }}>{a.role}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {a.tools.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', padding: '0.1rem 0.45rem', border: `1px solid ${a.color}30`, color: a.color }}>{t}</span>)}
          </div>
          <div style={{ marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', opacity: 0.6 }}>model: {a.model}</div>
        </div>
      ))}
    </div>
  );
}

function OrgSection({ venture }: { venture: string }) {
  const { humans, agents, openRoles } = VENTURE_DATA[venture];
  const color = VENTURES.find(v => v.name === venture)!.color;
  const sector = VENTURES.find(v => v.name === venture)!.sector;
  const activeHumans = humans.filter(h => h.type === 'founder' || h.type === 'hire');
  const openHumans   = humans.filter(h => h.type === 'open');

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Venture node */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderTop: `2px solid ${color}`, padding: '0.85rem 2.5rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{sector}</div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{venture}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 1, height: 20, background: 'var(--card-border)' }} /></div>

      {/* Active humans */}
      {activeHumans.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
            <div style={{ height: 1, background: 'var(--card-border)', width: '40%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: 0 }}>
            {activeHumans.map(h => (
              <div key={h.name} style={{ background: 'var(--card-bg)', padding: '0.75rem 1.5rem', textAlign: 'center', flex: 1 }}>
                <div style={{ width: 30, height: 30, background: color, color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 0.3rem' }}>{h.name[0]}</div>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{h.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>{h.role.split(' — ')[1] || h.role}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* AI agents */}
      {agents.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 1, height: 20, background: 'var(--card-border)' }} /></div>
          <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Agents ({agents.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
              {agents.map(a => <span key={a.name} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.15rem 0.5rem', border: `1px solid ${a.color}40`, color: a.color }}>{a.emoji} {a.name}</span>)}
            </div>
          </div>
        </>
      )}

      {/* Open roles */}
      {openHumans.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 1, height: 20, background: 'var(--card-border)' }} /></div>
          <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)', padding: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Open roles ({openHumans.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {openHumans.map(h => (
                <div key={h.name} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)' }}>+</span>{h.role}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

type Tab = 'humans' | 'agents' | 'org';

const TABS: { key: Tab; label: string }[] = [
  { key: 'humans', label: 'Humans'    },
  { key: 'agents', label: 'AI Agents' },
  { key: 'org',    label: 'Org Chart' },
];

export default function TeamPage() {
  const [vi,  setVi]  = useState(0);
  const [tab, setTab] = useState<Tab>('humans');
  const venture = VENTURES[vi];
  const data    = VENTURE_DATA[venture.name];

  return (
    <div>
      <h1 className="page-title">Team</h1>
      <p className="page-sub">Humans, AI agents, and org chart — per venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => { setVi(i); setTab('humans'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem',
            background: vi === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: vi === i ? 'var(--black)' : 'var(--muted)',
            fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {venture.name}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 400, letterSpacing: '0.1em' }}>
            {data.humans.filter(h => h.type !== 'open').length} human{data.humans.filter(h => h.type !== 'open').length !== 1 ? 's' : ''} · {data.agents.length} agent{data.agents.length !== 1 ? 's' : ''} · {data.humans.filter(h => h.type === 'open').length} open role{data.humans.filter(h => h.type === 'open').length !== 1 ? 's' : ''}
          </span>
        </div>
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

      {tab === 'humans' && <HumansSection venture={venture.name} />}
      {tab === 'agents' && <AgentsSection venture={venture.name} />}
      {tab === 'org'    && <OrgSection    venture={venture.name} />}
    </div>
  );
}

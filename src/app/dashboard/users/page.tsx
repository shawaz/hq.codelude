'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import MemberForm, { type MemberDraft } from '@/components/MemberForm';
import { usePageScopes, clampIndex } from '@/lib/use-page-scopes';
import { ALL_SCOPES, isUnrestricted, type Grant } from '@/lib/nav';

/** A row from team.getTeam — a real user, or an invite not yet redeemed. */
interface Member {
  _id: string;
  pending: boolean;
  name: string;
  email: string;
  image?: string;
  role: string;
  title?: string;
  access?: Grant[];
  ventureRoles: { venture: string; role: string }[];
}

/** Members holding at least one grant on this venture. */
function membersOf(team: Member[] | undefined, venture: string): Member[] {
  return (team ?? []).filter(m =>
    isUnrestricted(m) || (m.access ?? []).some(g => g.venture === venture && g.pages.length > 0),
  );
}

function roleLabel(m: Member, venture: string): string {
  return (
    m.ventureRoles.find(r => r.venture === venture)?.role ||
    m.title ||
    (m.role === 'admin' ? 'Admin' : 'Member')
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface Agent {
  name: string; emoji: string; color: string; type: string;
  model: string; tf: string[]; role: string; tools: string[];
}

const VENTURE_DATA: Record<string, { agents: Agent[]; openRoles: string[] }> = {
  Roborns: {
    agents: [],
    openRoles: ['Thermal Engineer', 'Government Liaison', 'Site Survey Coordinator'],
  },
  Franchiseen: {
    agents: [],
    openRoles: ['Franchise Partnership Manager', 'Investment Legal Counsel', 'KYC Integration Engineer'],
  },
  HubCV: {
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
  Llife: {
    agents: [
      {
        name: 'Llife Daily', emoji: '🗓️', color: '#85B7EB',
        type: 'Claude Agent', model: 'claude-3-5-haiku',
        tf: ['daily'],
        role: 'Personal life agent — reviews the day across Finances, Education, Earnings, Mind and Body, flags what slipped, and prepares tomorrow\u2019s time blocks.',
        tools: ['domain_review', 'net_worth_rollup', 'streak_tracking', 'daily_briefing'],
      },
    ],
    openRoles: ['Integrations Engineer', 'Product Engineer (Mobile)', 'Privacy & Compliance Lead'],
  },
  Dextrip: {
    agents: [
      { name: 'Alpha', emoji: '🔴', color: '#ff8080', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Aggressive UP-biased trader. Strong in breakout and bullish continuation regimes.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Sigma', emoji: '🔵', color: '#85B7EB', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Balanced risk manager. Reads regime before committing direction. Holds more than most.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Delta', emoji: '🟢', color: '#5DCAA5', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Contrarian fade specialist. Hunts overextended moves and fades them with RSI + VWAP.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Lisa',      emoji: '🟡', color: '#FAC775', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Volume Surge specialist. Trades breakout candles when volume spikes above baseline.',         tools: ['Volume Surge', 'VWAP Reclaim'] },
      { name: 'Bart',      emoji: '🟠', color: '#F0997B', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Momentum Break hunter. Enters when price breaks out of recent range with directional force.', tools: ['Momentum Break', 'Volume Surge', 'Liquidity Sweep Reversal'] },
      { name: 'Marge',     emoji: '🔵', color: '#7F77DD', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'VWAP Reclaim trader. Buys or sells when price reclaims VWAP with supporting volume.',       tools: ['VWAP Reclaim', 'RSI Reversal'] },
      { name: 'Homer',     emoji: '🟡', color: '#FAC775', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'RSI Reversal fader. Looks for overstretched moves and fades them at RSI extremes.',           tools: ['RSI Reversal'] },
      { name: 'Mr Burns',  emoji: '⚫', color: 'var(--muted)', type: 'Strategy Agent', model: 'Rules-based', tf: ['1h', '4h'],  role: 'Trend Ride player. Follows sustained directional moves using MA slope and higher highs/lows.',  tools: ['Trend Ride', 'Trend Pullback', 'Volume Surge'] },
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

function HumansSection({
  venture,
  team,
  canManage,
  onEdit,
}: {
  venture: string;
  team: Member[] | undefined;
  canManage: boolean;
  onEdit: (m: Member) => void;
}) {
  const revokeInvite = useMutation(api.team.revokeInvite);
  const color = ALL_SCOPES.find(v => v.name === venture)!.color;
  const people = membersOf(team, venture);
  const { openRoles } = VENTURE_DATA[venture];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      {people.map(m => (
        <div
          key={m._id}
          onClick={canManage && !m.pending ? () => onEdit(m) : undefined}
          style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderTop: `2px solid ${m.pending ? 'var(--card-border)' : color}`,
            padding: '1.5rem',
            opacity: m.pending ? 0.75 : 1,
            cursor: canManage && !m.pending ? 'pointer' : 'default',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, background: m.pending ? 'var(--card-border)' : color, color: m.pending ? 'var(--muted)' : 'var(--on-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
              {(m.name || m.email || '?')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name || m.email}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: m.pending ? 'var(--muted)' : color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{roleLabel(m, venture)}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${m.pending ? 'var(--card-border)' : 'rgba(93,202,165,0.3)'}`, color: m.pending ? 'var(--muted)' : '#5DCAA5', flexShrink: 0 }}>
              {m.pending ? 'Invited' : 'Active'}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{m.email}</div>
          {m.pending && (
            <>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                Access applies the first time they sign in with this Google account.
              </p>
              {canManage && (
                <button
                  onClick={() => revokeInvite({ inviteId: m._id as Id<'invites'> })}
                  style={{ marginTop: '0.6rem', padding: '0.2rem 0.55rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Revoke invite
                </button>
              )}
            </>
          )}
        </div>
      ))}

      {/* Open roles — job reqs, not people */}
      {openRoles.map(r => (
        <div key={r} style={{
          background: 'var(--card-bg)', border: '1px dashed var(--card-border)',
          padding: '1.5rem', opacity: 0.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--card-border)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>+</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Open role</div>
            </div>
          </div>
        </div>
      ))}

      {people.length === 0 && openRoles.length === 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          Nobody has access to {venture} yet.
        </div>
      )}
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

function OrgSection({ venture, team }: { venture: string; team: Member[] | undefined }) {
  const { agents, openRoles } = VENTURE_DATA[venture];
  const scope  = ALL_SCOPES.find(v => v.name === venture)!;
  const color  = scope.color;
  const sector = scope.sector;
  const activeHumans = membersOf(team, venture).filter(m => !m.pending);

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
            {activeHumans.map(m => (
              <div key={m._id} style={{ background: 'var(--card-bg)', padding: '0.75rem 1.5rem', textAlign: 'center', flex: 1 }}>
                <div style={{ width: 30, height: 30, background: color, color: 'var(--on-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 0.3rem' }}>{(m.name || m.email || '?')[0].toUpperCase()}</div>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{m.name || m.email}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>{roleLabel(m, venture)}</div>
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
      {openRoles.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 1, height: 20, background: 'var(--card-border)' }} /></div>
          <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)', padding: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Open roles ({openRoles.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {openRoles.map(r => (
                <div key={r} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-text)' }}>+</span>{r}
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
  const { scopes, loading } = usePageScopes('users');
  const me   = useQuery(api.team.getCurrentUser);
  const team = useQuery(api.team.getTeam) as Member[] | undefined;

  const [vi,  setVi]  = useState(0);
  const [tab, setTab] = useState<Tab>('humans');
  const [form, setForm] = useState<{ initial?: MemberDraft; venture: string } | null>(null);

  // Only ventures that carry static agent/open-role content can be rendered here.
  const ventures = scopes.filter(v => VENTURE_DATA[v.name]);
  const index    = clampIndex(vi, ventures.length);
  const venture  = ventures[index];
  const canManage = me?.role === 'admin';

  if (loading) return null;
  if (!venture) {
    return (
      <div>
        <h1 className="page-title">Team</h1>
        <p className="page-sub">Humans, AI agents, and org chart — per venture.</p>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }

  const data    = VENTURE_DATA[venture.name];
  const people  = membersOf(team, venture.name);
  const active  = people.filter(m => !m.pending).length;
  const invited = people.filter(m => m.pending).length;

  function openAdd() {
    setForm({ venture: venture.name });
  }

  function openEdit(m: Member) {
    setForm({
      venture: venture.name,
      initial: {
        userId: m._id,
        pending: m.pending,
        name: m.name,
        email: m.email,
        title: m.title,
        role: m.role === 'admin' ? 'admin' : 'member',
        access: m.access ?? [],
        ventureRoles: m.ventureRoles,
      },
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-sub">Humans, AI agents, and org chart — per venture.</p>
        </div>
        {canManage && (
          <button onClick={openAdd} style={{
            padding: '0.5rem 1.1rem', background: 'var(--accent)', border: '1px solid var(--accent)',
            color: 'var(--black)', cursor: 'pointer', fontWeight: 700, flexShrink: 0,
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>+ Add team member</button>
        )}
      </div>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {ventures.map((v, i) => (
          <button key={v.name} onClick={() => { setVi(i); setTab('humans'); }} style={{
            flex: 1, padding: '0.8rem 0.5rem',
            background: index === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: index === i ? 'var(--on-brand)' : 'var(--muted)',
            fontWeight: index === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {venture.name}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 400, letterSpacing: '0.1em' }}>
            {active} human{active !== 1 ? 's' : ''}
            {invited > 0 && ` · ${invited} invited`}
            {' '}· {data.agents.length} agent{data.agents.length !== 1 ? 's' : ''} · {data.openRoles.length} open role{data.openRoles.length !== 1 ? 's' : ''}
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

      {tab === 'humans' && (
        <HumansSection venture={venture.name} team={team} canManage={canManage} onEdit={openEdit} />
      )}
      {tab === 'agents' && <AgentsSection venture={venture.name} />}
      {tab === 'org'    && <OrgSection    venture={venture.name} team={team} />}

      {canManage && tab === 'humans' && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.7 }}>
          Click a member to edit their page access. Access is granted per venture and per page —
          everything is off by default.
        </p>
      )}

      {form && (
        <MemberForm
          initial={form.initial}
          defaultVenture={form.venture}
          onClose={() => setForm(null)}
        />
      )}
    </div>
  );
}

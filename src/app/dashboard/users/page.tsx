'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import MemberForm, { type MemberDraft } from '@/components/MemberForm';
import { useActiveScope } from '@/lib/use-active-scope';
import { scopeColor, type Scope } from '@/lib/ventures';
import { isUnrestricted, type Grant } from '@/lib/nav';
import { sc, scBorder } from '@/lib/status-colors';
import { openRolesFor } from '@/lib/agents';
import AgentForm, { type AgentDraft } from '@/components/AgentForm';
import { agentTool } from '@/lib/agent-tools';

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
  // Both lookups miss for any organization created after this file was
  // written. The non-null assertion threw, and VENTURE_DATA only ever had a
  // Llife key — so this already crashed for five of the six seeded scopes.
  const color = scopeColor(venture);
  const people = membersOf(team, venture);
  const openRoles = openRolesFor(venture);

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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${m.pending ? 'var(--card-border)' : 'rgba(93,202,165,0.3)'}`, color: m.pending ? 'var(--muted)' : '#dbdbdb', flexShrink: 0 }}>
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

function AgentsSection({
  venture,
  canManage,
  onAdd,
  onEdit,
}: {
  venture: string;
  canManage: boolean;
  onAdd: () => void;
  onEdit: (a: AgentDraft) => void;
}) {
  const agents = useQuery(api.agents.listByVenture, { venture });

  if (agents === undefined) return <div className="empty-note">Loading agents…</div>;

  return (
    <>
      {canManage && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={onAdd}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1rem', cursor: 'pointer',
              background: 'var(--accent)', border: '1px solid var(--accent)',
              color: 'var(--on-accent)', fontWeight: 700,
            }}
          >+ New agent</button>
        </div>
      )}

      {agents.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          No AI agents on {venture} yet.{canManage ? ' Use New agent to create one — then assign it a task and press Run.' : ''}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {agents.map(a => (
            <div
              key={a._id}
              onClick={canManage ? () => onEdit({
                id: a._id, name: a.name, emoji: a.emoji, type: a.type,
                role: a.role, provider: a.provider, tools: a.tools, status: a.status,
              }) : undefined}
              style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                padding: '1.5rem', borderTop: `2px solid ${a.color}`,
                cursor: canManage ? 'pointer' : 'default',
                opacity: a.status === 'paused' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{a.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: a.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{a.type}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(a.color, 30)}`, color: a.status === 'active' ? sc('#dbdbdb') : 'var(--muted)' }}>
                    {a.status}
                  </span>
                  {a.tf.length > 0 && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>{a.tf.join(' / ')}</span>
                  )}
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem' }}>{a.role}</p>

              {/* The allowlist, not a description of one — this is what the
                  runner filters against. An agent with none reasons from its
                  role alone, which is worth saying rather than showing a gap. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {a.tools.length === 0 ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', opacity: 0.7 }}>No tools granted</span>
                ) : a.tools.map(t => (
                  <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', padding: '0.1rem 0.45rem', border: `1px solid ${scBorder(a.color, 30)}`, color: a.color }}>
                    {agentTool(t)?.label ?? t}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', opacity: 0.6 }}>model: {a.provider}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function OrgSection({ venture, team, scope }: { venture: string; team: Member[] | undefined; scope?: Scope }) {
  // Paused agents are left off the chart — it is a picture of who is working.
  const agents = (useQuery(api.agents.listByVenture, { venture }) ?? [])
    .filter(a => a.status === 'active');
  const openRoles = openRolesFor(venture);
  const color  = scope?.color ?? scopeColor(venture);
  const sector = scope?.sector ?? '';
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
              {agents.map(a => <span key={a._id} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(a.color)}`, color: a.color }}>{a.emoji} {a.name}</span>)}
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
  const { scope: venture, loading } = useActiveScope('users');
  const me   = useQuery(api.team.getCurrentUser);
  const team = useQuery(api.team.getTeam) as Member[] | undefined;

  const [tab, setTab] = useState<Tab>('humans');
  const [form, setForm] = useState<{ initial?: MemberDraft; venture: string } | null>(null);
  const [agentForm, setAgentForm] = useState<{ initial?: AgentDraft } | null>(null);

  // The header count needs agents even while the Humans tab is showing, so the
  // query lives here rather than inside AgentsSection. Convex dedupes the two
  // subscriptions, so this is one websocket read, not two.
  const agentCount = (useQuery(
    api.agents.listByVenture,
    venture ? { venture: venture.name } : 'skip',
  ) ?? []).length;

  // VENTURE_DATA only ever had a Llife key, so filtering the strip by it hid
  // five of the six seeded scopes. The organization comes from the switcher
  // now, and the sections below fall back to empty rather than being hidden.
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

  // Captured so the callbacks below keep the narrowed type — TypeScript will
  // not carry the null check into a closure.
  const ventureName = venture.name;
  const openRoles = openRolesFor(venture.name);
  const people  = membersOf(team, venture.name);
  const active  = people.filter(m => !m.pending).length;
  const invited = people.filter(m => m.pending).length;

  function openAdd() {
    setForm({ venture: ventureName });
  }

  function openEdit(m: Member) {
    setForm({
      venture: ventureName,
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

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {venture.name}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 400, letterSpacing: '0.1em' }}>
            {active} human{active !== 1 ? 's' : ''}
            {invited > 0 && ` · ${invited} invited`}
            {' '}· {agentCount} agent{agentCount !== 1 ? 's' : ''} · {openRoles.length} open role{openRoles.length !== 1 ? 's' : ''}
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
      {tab === 'agents' && (
        <AgentsSection
          venture={venture.name}
          canManage={canManage}
          onAdd={() => setAgentForm({})}
          onEdit={initial => setAgentForm({ initial })}
        />
      )}
      {tab === 'org'    && <OrgSection    venture={venture.name} team={team} scope={venture} />}

      {canManage && tab === 'humans' && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.7 }}>
          Click a member to edit their page access. Access is granted per venture and per page —
          everything is off by default.
        </p>
      )}

      {agentForm && (
        <AgentForm
          initial={agentForm.initial}
          venture={ventureName}
          onClose={() => setAgentForm(null)}
        />
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

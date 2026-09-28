'use client';

/**
 * Pick who owns a task — a teammate, or one of the venture's AI agents.
 *
 * Both kinds live in one `<select>` under two optgroups, because a task has a
 * single owner and splitting the choice across two controls would let both be
 * set at once. The option value encodes the kind (`human:<userId>` /
 * `agent:<slug>`) so one change handler covers both.
 *
 * Controlled: the task-detail page writes straight through to
 * tasks.setAssignee, while NewTaskForm holds the choice until submit.
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { isUnrestricted, type Grant } from '@/lib/nav';

export interface AssigneeValue {
  assigneeType?: 'human' | 'agent';
  assigneeId?: string;
  assigneeName?: string;
}

interface Member {
  _id: string;
  pending: boolean;
  name: string;
  email: string;
  role: string;
  access?: Grant[];
}

/** Members holding at least one grant on this venture — the same rule the Users page uses. */
function membersOf(team: Member[] | undefined, venture: string): Member[] {
  return (team ?? []).filter(
    m => !m.pending && (isUnrestricted(m) || (m.access ?? []).some(g => g.venture === venture && g.pages.length > 0)),
  );
}

export default function AssigneeSelect({
  venture,
  value,
  onChange,
  style,
  disabled = false,
}: {
  venture: string;
  value: AssigneeValue;
  onChange: (next: AssigneeValue) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const team = useQuery(api.team.getTeam, {}) as Member[] | undefined;
  const people = membersOf(team, venture);
  // Paused agents are left out: handing work to one that will not run is worse
  // than not offering it.
  const agents = (useQuery(api.agents.listByVenture, { venture }) ?? [])
    .filter(a => a.status === 'active');

  const selected = value.assigneeType && value.assigneeId
    ? `${value.assigneeType}:${value.assigneeId}`
    : '';

  function handle(raw: string) {
    if (!raw) { onChange({}); return; }
    const [kind, id] = [raw.slice(0, raw.indexOf(':')), raw.slice(raw.indexOf(':') + 1)];
    if (kind === 'human') {
      const m = people.find(p => p._id === id);
      onChange({ assigneeType: 'human', assigneeId: id, assigneeName: m?.name || m?.email || 'Member' });
    } else {
      const a = agents.find(x => x._id === id);
      onChange({ assigneeType: 'agent', assigneeId: id, assigneeName: a?.name ?? id });
    }
  }

  return (
    <select
      value={selected}
      disabled={disabled}
      onClick={e => e.stopPropagation()}
      onChange={e => handle(e.target.value)}
      style={{
        background: 'var(--black)',
        border: '1px solid var(--card-border)',
        color: 'var(--off-white)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        padding: '0.35rem 0.5rem',
        outline: 'none',
        cursor: disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      <option value="">Unassigned</option>

      {people.length > 0 && (
        <optgroup label="Humans">
          {people.map(m => (
            <option key={m._id} value={`human:${m._id}`}>
              {m.name || m.email}
            </option>
          ))}
        </optgroup>
      )}

      {agents.length > 0 && (
        <optgroup label="AI agents">
          {agents.map(a => (
            <option key={a._id} value={`agent:${a._id}`}>
              {a.emoji} {a.name} · {a.type}
            </option>
          ))}
        </optgroup>
      )}

      {/* A stored assignee who is no longer in either list still has to render,
          or the control would silently show "Unassigned" over a set value. */}
      {selected
        && !people.some(p => `human:${p._id}` === selected)
        && !agents.some(a => `agent:${a._id}` === selected) && (
        <option value={selected}>{value.assigneeName ?? 'Assigned'}</option>
      )}
    </select>
  );
}

/** Read-only rendering of an assignment, for tables and cards. */
export function AssigneeBadge({ task }: { task: AssigneeValue }) {
  if (!task.assigneeType || !task.assigneeName) {
    return <span className="category-label">—</span>;
  }
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        color: task.assigneeType === 'agent' ? 'var(--accent-text)' : 'var(--off-white)',
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      }}
      title={task.assigneeType === 'agent' ? 'AI agent' : 'Team member'}
    >
      <span aria-hidden>{task.assigneeType === 'agent' ? '🤖' : '👤'}</span>
      {task.assigneeName}
    </span>
  );
}

'use client';

/**
 * Create or edit an AI agent.
 *
 * Deliberately the same shape as MemberForm — same overlay, same field styles,
 * same create-vs-update switch on whether an id was passed. Agents and people
 * are both roster entries; they should not feel like two different products.
 *
 * The tool list is the part that matters. It is the allowlist the runner
 * filters against, so it is rendered as two groups rather than one flat list:
 * granting an agent the ability to write to HQ should be a deliberate act, not
 * a checkbox indistinguishable from the ones above it.
 *
 * Admin-only, like MemberForm — the mutations call requireAdmin server-side
 * regardless of what the UI shows.
 */

import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AGENT_TOOLS, READ_ONLY_TOOL_NAMES } from '@/lib/agent-tools';
import { scopeColor } from '@/lib/ventures';
import { sc, scBorder } from '@/lib/status-colors';

export interface AgentDraft {
  id?: string;
  name: string;
  emoji: string;
  type: string;
  role: string;
  provider: 'gemini' | 'opencode' | 'deepseek' | 'claude';
  tools: string[];
  status: 'active' | 'paused';
}

/**
 * Providers, labelled by what they actually are.
 *
 * Only Gemini and OpenCode are keyed in production. An agent pinned to one of
 * the others still works — resolveProvider falls back rather than failing — but
 * the form says so rather than letting it look deliberate.
 */
const PROVIDERS: { value: AgentDraft['provider']; label: string }[] = [
  { value: 'gemini',   label: 'Gemini 3.6 Flash' },
  { value: 'opencode', label: 'Big Pickle (OpenCode)' },
  { value: 'deepseek', label: 'DeepSeek Flash' },
  { value: 'claude',   label: 'Claude Sonnet' },
];

const TYPES = ['Claude Agent', 'Strategy Agent', 'Research Agent', 'Execution Bot', 'Feed Bot'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.65rem',
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.55rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '0.3rem',
};

export default function AgentForm({
  initial,
  venture,
  onClose,
}: {
  initial?: AgentDraft;
  venture: string;
  onClose: () => void;
}) {
  const create = useMutation(api.agents.create);
  const update = useMutation(api.agents.update);
  const remove = useMutation(api.agents.remove);

  const editing = Boolean(initial?.id);
  const accent = scopeColor(venture);

  const [name,     setName]     = useState(initial?.name ?? '');
  const [emoji,    setEmoji]    = useState(initial?.emoji ?? '🤖');
  const [type,     setType]     = useState(initial?.type ?? TYPES[0]);
  const [role,     setRole]     = useState(initial?.role ?? '');
  const [provider, setProvider] = useState<AgentDraft['provider']>(initial?.provider ?? 'gemini');
  const [tools,    setTools]    = useState<string[]>(initial?.tools ?? READ_ONLY_TOOL_NAMES);
  const [status,   setStatus]   = useState<AgentDraft['status']>(initial?.status ?? 'active');
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const toggleTool = (toolName: string) =>
    setTools(prev =>
      prev.includes(toolName) ? prev.filter(t => t !== toolName) : [...prev, toolName],
    );

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await update({
          id: initial!.id as Id<'agents'>,
          name, emoji, type, role, provider, tools, status,
        });
      } else {
        await create({ venture, name, emoji, type, role, provider, tools, status });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the agent');
    } finally {
      setBusy(false);
    }
  }

  async function destroy() {
    if (!initial?.id || busy) return;
    setBusy(true);
    setError(null);
    try {
      await remove({ id: initial.id as Id<'agents'> });
      onClose();
    } catch (err) {
      // The mutation refuses while tasks are still assigned, and says how many.
      setError(err instanceof Error ? err.message : 'Could not delete the agent');
    } finally {
      setBusy(false);
    }
  }

  const reads  = AGENT_TOOLS.filter(t => !t.writes);
  const writes = AGENT_TOOLS.filter(t => t.writes);

  function toolGroup(title: string, note: string, list: typeof AGENT_TOOLS) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ ...labelStyle, marginBottom: '0.15rem' }}>{title}</div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)',
          lineHeight: 1.7, margin: '0 0 0.5rem',
        }}>{note}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.35rem' }}>
          {list.map(t => {
            const on = tools.includes(t.name);
            return (
              <label
                key={t.name}
                style={{
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start', cursor: 'pointer',
                  padding: '0.45rem 0.55rem',
                  background: on ? 'var(--hover-wash)' : 'transparent',
                  border: `1px solid ${on ? scBorder(accent, 40) : 'var(--card-border)'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleTool(t.name)}
                  style={{ marginTop: '0.15rem', accentColor: accent }}
                />
                <span>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.64rem',
                    color: on ? sc(accent) : 'var(--off-white)',
                  }}>{t.label}</span>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
                    color: 'var(--muted)', lineHeight: 1.6, marginTop: '0.15rem',
                  }}>{t.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 100,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '3rem 1rem', overflowY: 'auto',
      }}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: 'var(--black)', border: '1px solid var(--card-border)',
          borderTop: `2px solid ${accent}`, padding: '1.5rem', width: '100%', maxWidth: 720,
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {editing ? `Edit ${initial?.name}` : `New ${venture} agent`}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)',
            lineHeight: 1.7, margin: '0.4rem 0 0',
          }}>
            Assign it a task, then press Run on that task. It works under your own
            permissions — it can never reach a venture you cannot.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem', marginBottom: '1rem',
        }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              style={inputStyle} value={name} required autoFocus
              onChange={e => setName(e.target.value)}
              placeholder="Researcher"
            />
          </div>
          <div>
            <label style={labelStyle}>Icon</label>
            <input
              style={inputStyle} value={emoji}
              onChange={e => setEmoji(e.target.value)}
              placeholder="🤖"
            />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Model</label>
            <select
              style={inputStyle} value={provider}
              onChange={e => setProvider(e.target.value as AgentDraft['provider'])}
            >
              {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Role</label>
          <textarea
            style={{ ...inputStyle, minHeight: 110, resize: 'vertical', lineHeight: 1.7 }}
            value={role} required
            onChange={e => setRole(e.target.value)}
            placeholder="What this agent is for, and how it should work. This becomes its instructions on every run — write it as behaviour, not as a job title."
          />
        </div>

        {toolGroup(
          'Tools it can read with',
          'What it may look up in HQ before answering. Nothing here changes a record.',
          reads,
        )}
        {toolGroup(
          'Tools it can write with',
          'These change HQ records. Grant only what this agent is actually for.',
          writes,
        )}

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={labelStyle}>Status</label>
          <select
            style={{ ...inputStyle, maxWidth: 220 }}
            value={status}
            onChange={e => setStatus(e.target.value as AgentDraft['status'])}
          >
            <option value="active">Active — can be assigned and run</option>
            <option value="paused">Paused — hidden from the assignee picker</option>
          </select>
        </div>

        {error && (
          <div style={{
            marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--st-red)', lineHeight: 1.7,
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          {editing && (
            <button
              type="button" onClick={destroy} disabled={busy}
              style={{
                padding: '0.5rem 1.1rem', background: 'transparent',
                border: '1px solid var(--card-border)', color: 'var(--st-red)',
                cursor: busy ? 'wait' : 'pointer', fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                marginRight: 'auto',
              }}
            >Delete</button>
          )}
          <button
            type="button" onClick={onClose}
            style={{
              padding: '0.5rem 1.1rem', background: 'transparent',
              border: '1px solid var(--card-border)', color: 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >Cancel</button>
          <button
            type="submit" disabled={busy}
            style={{
              padding: '0.5rem 1.1rem', background: 'var(--accent)',
              border: '1px solid var(--accent)', color: 'var(--on-accent)',
              cursor: busy ? 'wait' : 'pointer', fontWeight: 700,
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >{busy ? 'Saving…' : editing ? 'Save changes' : 'Create agent'}</button>
        </div>
      </form>
    </div>
  );
}

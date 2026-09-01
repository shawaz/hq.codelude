'use client';

/**
 * Create a task.
 *
 * Used in two places with different shapes — inline in the 280px AI rail, and
 * as a panel on the tasks page — so `compact` switches the layout rather than
 * there being two components that drift apart.
 *
 * `project` is fixed by the caller when the surface already knows which venture
 * it is showing, and offered as a picker when it does not.
 */

import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { VENTURES } from '@/lib/ventures';
import type { Priority } from '@/lib/tasks';

const CATEGORIES = [
  'Engineering', 'Legal', 'Finance', 'Marketing', 'Sales',
  'Product', 'Operations', 'People', 'General',
];

export default function NewTaskForm({
  project,
  accent,
  onClose,
  compact = true,
  allowProjectChange = false,
}: {
  project: string;
  accent: string;
  onClose: () => void;
  compact?: boolean;
  allowProjectChange?: boolean;
}) {
  const create = useMutation(api.tasks.create);

  const [proj, setProj]         = useState(project);
  const [category, setCategory] = useState('Engineering');
  const [priority, setPriority] = useState<Priority>('medium');
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const field: React.CSSProperties = {
    background: 'var(--black)',
    border: '1px solid var(--card-border)',
    color: 'var(--off-white)',
    fontFamily: 'var(--font-mono)',
    fontSize: compact ? '0.62rem' : '0.72rem',
    padding: compact ? '0.35rem 0.5rem' : '0.55rem 0.7rem',
    outline: 'none',
    width: '100%',
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get('title') ?? '').trim();
    if (!title) return;

    setBusy(true);
    setError(null);
    try {
      const startDate = String(new FormData(form).get('startDate') ?? '');
      const dueDate   = String(new FormData(form).get('dueDate') ?? '');
      await create({
        title, project: proj, category, priority,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
      });
      form.reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the task');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        padding: compact ? '0.75rem 1rem' : '1.25rem',
        borderBottom: compact ? '1px solid var(--card-border)' : 'none',
        border: compact ? undefined : '1px solid var(--card-border)',
        borderLeft: compact ? undefined : `2px solid ${accent}`,
        background: 'var(--card-bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        marginBottom: compact ? 0 : '1.5rem',
      }}
    >
      <input
        name="title"
        placeholder={`New ${proj} task…`}
        required
        autoFocus
        style={field}
      />

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {allowProjectChange && (
          <select value={proj} onChange={e => setProj(e.target.value)} style={{ ...field, width: 'auto', flex: 1 }}>
            {VENTURES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        )}
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...field, width: 'auto', flex: 1 }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          style={{ ...field, width: 'auto', flex: 1 }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Dates are optional — most tasks never get one, and forcing a date on
          every capture would make the quick-add slower than writing it down. */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <label style={{ flex: 1, display: 'block' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.2rem',
          }}>Start</span>
          <input name="startDate" type="date" style={field} />
        </label>
        <label style={{ flex: 1, display: 'block' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.2rem',
          }}>Due</span>
          <input name="dueDate" type="date" style={field} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <button
          type="submit"
          disabled={busy}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '0.3rem 0.7rem', cursor: busy ? 'wait' : 'pointer',
            background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--on-accent)', fontWeight: 700,
          }}
        >{busy ? 'Adding…' : 'Add task'}</button>
        <button
          type="button"
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '0.3rem 0.7rem', cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)',
          }}
        >Cancel</button>
      </div>

      {error && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--st-red)' }}>{error}</div>
      )}
    </form>
  );
}

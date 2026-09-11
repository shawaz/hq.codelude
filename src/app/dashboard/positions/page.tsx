'use client';

import { useState, type FormEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { VENTURES } from '@/lib/ventures';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  open:      { color: '#eeeeee',      label: 'Open'    },
  hiring:    { color: '#dbdbdb',      label: 'Hiring'  },
  filled:    { color: 'var(--muted)', label: 'Filled'  },
  'on-hold': { color: '#b5b5b5',      label: 'On Hold' },
  closed:    { color: 'var(--muted)', label: 'Closed'  },
};
const PRIORITY_COLOR: Record<string, string> = { critical: '#9d9d9d', high: '#b5b5b5', medium: 'var(--muted)' };
const TYPES = ['Full-time', 'Contract', 'Part-time', 'Advisory'] as const;

// `filled` and `closed` are archive states — the page is a hiring worklist, so
// they are hidden until you ask for them.
const ACTIVE = new Set(['open', 'hiring', 'on-hold']);
const FILTERS = [
  { key: 'active',   label: 'Active'   },
  { key: 'open',     label: 'Open'     },
  { key: 'hiring',   label: 'Hiring'   },
  { key: 'on-hold',  label: 'On Hold'  },
  { key: 'filled',   label: 'Filled'   },
  { key: 'closed',   label: 'Closed'   },
  { key: 'all',      label: 'All'      },
] as const;

const field: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)',
  color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
  padding: '0.5rem 0.65rem', outline: 'none', width: '100%',
};
const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem',
};
const chip: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '0.15rem 0.5rem',
};

export default function PositionsPage() {
  const positions = useQuery(api.positions.list);
  const create    = useMutation(api.positions.create);
  const setStatus = useMutation(api.positions.setStatus);
  const remove    = useMutation(api.positions.remove);

  const [filter, setFilter] = useState<typeof FILTERS[number]['key']>('active');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);
  // Which role is being marked filled — the hire's name is asked for inline.
  const [filling, setFilling] = useState<string | null>(null);

  const all  = positions ?? [];
  const rows = all.filter(p =>
    filter === 'all' ? true : filter === 'active' ? ACTIVE.has(p.status) : p.status === filter,
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get('title') ?? '').trim();
    if (!title) return;

    setBusy(true); setError(null);
    try {
      await create({
        title,
        department:  String(fd.get('department') ?? '').trim() || undefined,
        venture:     String(fd.get('venture') ?? 'Codelude'),
        type:        String(fd.get('type') ?? 'Full-time') as typeof TYPES[number],
        priority:    String(fd.get('priority') ?? 'medium') as 'critical' | 'high' | 'medium',
        targetStart: String(fd.get('targetStart') ?? '').trim() || undefined,
        location:    String(fd.get('location') ?? '').trim() || undefined,
        keySkills:   String(fd.get('keySkills') ?? '').split(',').map(s => s.trim()).filter(Boolean),
        notes:       String(fd.get('notes') ?? '').trim() || undefined,
      });
      form.reset();
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the position');
    } finally { setBusy(false); }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Positions</h1>
          <p className="page-sub">Open roles and headcount plan across all ventures.</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} style={{
            flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.45rem 1rem',
            cursor: 'pointer', background: 'var(--accent)', border: '1px solid var(--accent)',
            color: 'var(--on-accent)', fontWeight: 700,
          }}>+ New position</button>
        )}
      </div>

      {adding && (
        <form onSubmit={submit} style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderLeft: '2px solid var(--accent)', padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
            <div><label style={label}>Title</label><input name="title" style={field} required autoFocus /></div>
            <div><label style={label}>Department</label><input name="department" style={field} /></div>
            <div>
              <label style={label}>Venture</label>
              <select name="venture" style={field} defaultValue="Codelude">
                <option value="Codelude">Codelude</option>
                {VENTURES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Type</label>
              <select name="type" style={field} defaultValue="Full-time">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Priority</label>
              <select name="priority" style={field} defaultValue="medium">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
            <div><label style={label}>Target start</label><input name="targetStart" placeholder="Q3 2026" style={field} /></div>
            <div><label style={label}>Location</label><input name="location" style={field} /></div>
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Key skills (comma separated)</label>
            <input name="keySkills" style={field} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Notes</label>
            <textarea name="notes" rows={2} style={{ ...field, resize: 'vertical' }} />
          </div>
          {error && <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--st-red)' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.1rem' }}>
            <button type="submit" disabled={busy} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: busy ? 'wait' : 'pointer',
              background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--on-accent)', fontWeight: 700,
            }}>{busy ? 'Saving…' : 'Open position'}</button>
            <button type="button" onClick={() => { setAdding(false); setError(null); }} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)',
            }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{all.filter(p => ACTIVE.has(p.status)).length}</div>
          <div className="tasks-count-label">Active roles</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: sc('#9d9d9d') }}>{all.filter(p => p.priority === 'critical' && ACTIVE.has(p.status)).length}</div>
          <div className="tasks-count-label">Critical & unfilled</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--muted)' }}>{all.filter(p => p.status === 'filled').length}</div>
          <div className="tasks-count-label">Filled</div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {FILTERS.map(f => {
          const n = f.key === 'all' ? all.length
            : f.key === 'active' ? all.filter(p => ACTIVE.has(p.status)).length
            : all.filter(p => p.status === f.key).length;
          return (
            <button key={f.key} className={`filter-pill${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}>{f.label} {n}</button>
          );
        })}
      </div>

      {positions === undefined ? (
        <div className="empty-note">Loading positions…</div>
      ) : rows.length === 0 ? (
        <div className="empty-note">
          {filter === 'active' ? 'No active roles. Everything is filled or on hold.' : `No ${filter} positions.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {rows.map(p => {
            const ss = STATUS_STYLES[p.status] ?? STATUS_STYLES.open;
            const archived = !ACTIVE.has(p.status);
            return (
              <div key={p._id} style={{
                background: 'var(--card-bg)', padding: '1.25rem 1.5rem',
                opacity: archived ? 0.65 : 1,
                borderLeft: p.priority === 'critical' && !archived ? '2px solid #9d9d9d'
                          : p.priority === 'high' && !archived ? '2px solid #b5b5b5'
                          : '2px solid transparent',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      {p.title}
                      {p.hiredName && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                          — hired {p.hiredName}
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
                      {[p.department, p.location, p.targetStart].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'flex-start' }}>
                    <span style={{ ...chip, border: `1px solid ${scBorder(PRIORITY_COLOR[p.priority])}`, color: sc(PRIORITY_COLOR[p.priority]) }}>{p.priority}</span>
                    <span style={{ ...chip, border: '1px solid var(--card-border)', color: 'var(--muted)' }}>{p.venture}</span>
                    <select
                      value={p.status}
                      onChange={e => {
                        const next = e.target.value;
                        // Filling asks who — everything else applies immediately.
                        if (next === 'filled') { setFilling(p._id); return; }
                        void setStatus({ id: p._id, status: next as 'open' });
                      }}
                      style={{ ...chip, cursor: 'pointer', background: 'transparent', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color) }}
                    >
                      <option value="open">Open</option>
                      <option value="hiring">Hiring</option>
                      <option value="on-hold">On Hold</option>
                      <option value="filled">Filled</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => { void remove({ id: p._id }); }}
                      title="Delete this position outright — use Filled or Closed to archive it instead"
                      style={{ ...chip, cursor: 'pointer', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
                    >Delete</button>
                  </div>
                </div>

                {filling === p._id && (
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <input
                      id={`hire-${p._id}`}
                      placeholder="Who did you hire?"
                      style={{ ...field, width: 'auto', flex: 1, fontSize: '0.65rem', padding: '0.35rem 0.5rem' }}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById(`hire-${p._id}`) as HTMLInputElement | null;
                        void setStatus({ id: p._id, status: 'filled', hiredName: el?.value.trim() || undefined });
                        setFilling(null);
                      }}
                      style={{ ...chip, cursor: 'pointer', background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--on-accent)', fontWeight: 700 }}
                    >Mark filled</button>
                    <button onClick={() => setFilling(null)} style={{ ...chip, cursor: 'pointer', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>Cancel</button>
                  </div>
                )}

                {p.keySkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
                    {p.keySkills.map((s, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.15rem 0.55rem', border: '1px solid var(--card-border)' }}>{s}</span>
                    ))}
                  </div>
                )}
                {p.notes && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{p.notes}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, type FormEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { sc, scBorder } from '@/lib/status-colors';

const TYPE_COLORS: Record<string, string> = {
  Registered: '#eeeeee', Engineering: '#dbdbdb', Remote: '#a5a5a5', Server: '#c8c8c8',
};
const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  active:  { color: '#dbdbdb',      label: 'Active'  },
  planned: { color: '#b5b5b5',      label: 'Planned' },
  virtual: { color: 'var(--muted)', label: 'Virtual' },
};
const TYPES = ['Registered', 'Engineering', 'Remote', 'Server'] as const;
const STATUSES = ['active', 'planned', 'virtual'] as const;

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
  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '0.15rem 0.5rem', alignSelf: 'flex-start',
};

/** Roles still being recruited for. Filled and closed are archive states. */
const HIRING = new Set(['open', 'hiring', 'on-hold']);

export default function OfficePage() {
  const offices   = useQuery(api.offices.list);
  const positions = useQuery(api.positions.list);
  const create    = useMutation(api.offices.create);
  const remove    = useMutation(api.offices.remove);

  const [adding, setAdding] = useState(false);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);

  /**
   * Open roles for an office, matched on city. Derived rather than stored, so a
   * position opened on the Positions page appears here with nothing to keep in
   * sync — the trade is that it depends on the location text lining up.
   */
  function openRolesFor(city: string) {
    const needle = city.trim().toLowerCase();
    if (!needle) return [];
    return (positions ?? []).filter(
      p => HIRING.has(p.status) && (p.location ?? '').toLowerCase().includes(needle),
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const city = String(fd.get('city') ?? '').trim();
    if (!name || !city) return;

    setBusy(true); setError(null);
    try {
      const head = String(fd.get('headcount') ?? '').trim();
      await create({
        name,
        city,
        country:   String(fd.get('country') ?? '').trim() || undefined,
        type:      String(fd.get('type') ?? 'Remote') as typeof TYPES[number],
        status:    String(fd.get('status') ?? 'planned') as typeof STATUSES[number],
        purpose:   String(fd.get('purpose') ?? '').trim() || undefined,
        notes:     String(fd.get('notes') ?? '').trim() || undefined,
        headcount: head ? Number(head) : undefined,
      });
      form.reset();
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the office');
    } finally { setBusy(false); }
  }

  const rows = offices ?? [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Office</h1>
          <p className="page-sub">Locations, team size, and the roles open at each.</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} style={{
            flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.45rem 1rem',
            cursor: 'pointer', background: 'var(--accent)', border: '1px solid var(--accent)',
            color: 'var(--on-accent)', fontWeight: 700,
          }}>+ New office</button>
        )}
      </div>

      {adding && (
        <form onSubmit={submit} style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderLeft: '2px solid var(--accent)', padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div><label style={label}>Name</label><input name="name" style={field} required autoFocus /></div>
            <div><label style={label}>City</label><input name="city" style={field} required placeholder="Mangaluru" /></div>
            <div><label style={label}>Country</label><input name="country" style={field} defaultValue="India" /></div>
            <div>
              <label style={label}>Type</label>
              <select name="type" style={field} defaultValue="Engineering">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Status</label>
              <select name="status" style={field} defaultValue="planned">
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_STYLES[s].label}</option>)}
              </select>
            </div>
            <div><label style={label}>Team size</label><input name="headcount" type="number" min="0" style={field} /></div>
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Purpose</label><input name="purpose" style={field} />
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Notes</label><textarea name="notes" rows={2} style={{ ...field, resize: 'vertical' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.75rem', lineHeight: 1.7 }}>
            Open roles are matched against the city, so a position whose location
            mentions it appears here automatically.
          </p>
          {error && <div style={{ marginTop: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--st-red)' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.1rem' }}>
            <button type="submit" disabled={busy} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: busy ? 'wait' : 'pointer',
              background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--on-accent)', fontWeight: 700,
            }}>{busy ? 'Saving…' : 'Add office'}</button>
            <button type="button" onClick={() => { setAdding(false); setError(null); }} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)',
            }}>Cancel</button>
          </div>
        </form>
      )}

      {offices === undefined ? (
        <div className="empty-note">Loading offices…</div>
      ) : rows.length === 0 ? (
        <div className="empty-note">No offices yet. Add one to start tracking locations and their open roles.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {rows.map(o => {
            const ss = STATUS_STYLES[o.status] ?? STATUS_STYLES.planned;
            const roles = openRolesFor(o.city);
            return (
              <div key={o._id} style={{
                background: 'var(--card-bg)', padding: '1.4rem 1.5rem',
                display: 'grid', gridTemplateColumns: '220px 100px 110px 1fr auto', gap: '1.25rem',
                alignItems: 'start', borderLeft: `2px solid ${TYPE_COLORS[o.type]}`,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{o.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{o.city}, {o.country}</div>
                </div>

                <span style={{ ...chip, border: `1px solid ${scBorder(TYPE_COLORS[o.type])}`, color: sc(TYPE_COLORS[o.type]) }}>{o.type}</span>
                <span style={{ ...chip, border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color) }}>{ss.label}</span>

                <div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.6rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Team size</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--off-white)' }}>{o.headcount ?? '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Open roles</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--off-white)' }}>{roles.length}</div>
                    </div>
                  </div>

                  {roles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      {roles.map(r => (
                        <span key={r._id} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', padding: '0.15rem 0.5rem', border: '1px solid var(--card-border)' }}>
                          {r.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {o.purpose && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', marginBottom: '0.35rem', fontWeight: 300 }}>{o.purpose}</div>}
                  {o.notes && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{o.notes}</div>}
                </div>

                <button
                  onClick={() => { void remove({ id: o._id }); }}
                  style={{ ...chip, cursor: 'pointer', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
                >Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

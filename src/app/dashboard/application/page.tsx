'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { VENTURES } from '@/lib/ventures';
import { sc, scBorder } from '@/lib/status-colors';

const STAGES = [
  { key: 'new',       label: 'New',       color: '#a5a5a5' },
  { key: 'screening', label: 'Screening', color: '#b5b5b5' },
  { key: 'interview', label: 'Interview', color: '#eeeeee' },
  { key: 'offer',     label: 'Offer',     color: '#c8c8c8' },
  { key: 'hired',     label: 'Hired',     color: '#dbdbdb' },
  { key: 'rejected',  label: 'Rejected',  color: '#9d9d9d' },
] as const;

type Stage = typeof STAGES[number]['key'];

const SOURCES = ['LinkedIn', 'Referral', 'Direct', 'Job board', 'Camp / event', 'Other'];

const field: React.CSSProperties = {
  background: 'var(--black)',
  border: '1px solid var(--card-border)',
  color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  padding: '0.5rem 0.65rem',
  outline: 'none',
  width: '100%',
};

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.55rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '0.3rem',
};

export default function ApplicationPage() {
  const applications = useQuery(api.applications.list);
  const createApp    = useMutation(api.applications.create);
  const updateApp    = useMutation(api.applications.update);
  const removeApp    = useMutation(api.applications.remove);
  const getUploadUrl = useMutation(api.applications.generateUploadUrl);
  // Read from Convex, not the static seed — a position opened on the Positions
  // page has to appear here immediately or the two screens disagree.
  const positions    = useQuery(api.positions.list);

  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<Stage | 'all'>('all');
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /**
   * Convex uploads are a three-step handshake — get a URL, POST the bytes
   * straight to it, then store the returned id. The file never passes through
   * a mutation, which is what keeps a large resume from blowing the arg limit.
   */
  async function uploadResume(file: File): Promise<{ id: Id<'_storage'>; name: string }> {
    const url = await getUploadUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const { storageId } = await res.json();
    return { id: storageId as Id<'_storage'>, name: file.name };
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    if (!name) return;

    setBusy(true);
    setError(null);
    try {
      const file = fileRef.current?.files?.[0];
      const resume = file ? await uploadResume(file) : null;

      await createApp({
        name,
        email:    String(fd.get('email') ?? '').trim() || undefined,
        phone:    String(fd.get('phone') ?? '').trim() || undefined,
        position: String(fd.get('position') ?? '').trim() || 'Unspecified',
        venture:  String(fd.get('venture') ?? '') || undefined,
        source:   String(fd.get('source') ?? 'LinkedIn'),
        notes:    String(fd.get('notes') ?? '').trim() || undefined,
        resumeId:   resume?.id,
        resumeName: resume?.name,
      });
      form.reset();
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the candidate');
    } finally {
      setBusy(false);
    }
  }

  const rows = (applications ?? []).filter(a => filter === 'all' || a.status === filter);
  const countFor = (k: Stage) => (applications ?? []).filter(a => a.status === k).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Application</h1>
          <p className="page-sub">Candidate pipeline — resumes, stages, and notes across all open positions.</p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            style={{
              flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.45rem 1rem',
              cursor: 'pointer', background: 'var(--accent)', border: '1px solid var(--accent)',
              color: 'var(--on-accent)', fontWeight: 700,
            }}
          >+ Add candidate</button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={submit}
          style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderLeft: '2px solid var(--accent)', padding: '1.5rem', marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
            <div><label style={label}>Name</label><input name="name" style={field} required autoFocus /></div>
            <div><label style={label}>Email</label><input name="email" type="email" style={field} /></div>
            <div><label style={label}>Phone</label><input name="phone" style={field} /></div>
            <div>
              <label style={label}>Position</label>
              <select name="position" style={field} defaultValue="">
                <option value="">Unspecified</option>
                {(positions ?? []).map(p => <option key={p._id} value={p.title}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Venture</label>
              <select name="venture" style={field} defaultValue="">
                <option value="">—</option>
                {VENTURES.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Source</label>
              <select name="source" style={field} defaultValue="LinkedIn">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Resume (PDF or DOC)</label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ ...field, padding: '0.4rem' }} />
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label style={label}>Notes</label>
            <textarea name="notes" rows={2} style={{ ...field, resize: 'vertical' }} />
          </div>

          {error && (
            <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--st-red)' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.1rem' }}>
            <button type="submit" disabled={busy} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: busy ? 'wait' : 'pointer',
              background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--on-accent)', fontWeight: 700,
            }}>{busy ? 'Uploading…' : 'Save candidate'}</button>
            <button type="button" onClick={() => { setAdding(false); setError(null); }} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 1.1rem', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)',
            }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Stage filter */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
          All {(applications ?? []).length}
        </button>
        {STAGES.map(s => (
          <button
            key={s.key}
            className={`filter-pill${filter === s.key ? ' active' : ''}`}
            style={filter === s.key ? { borderColor: sc(s.color), color: sc(s.color) } : {}}
            onClick={() => setFilter(s.key)}
          >{s.label} {countFor(s.key)}</button>
        ))}
      </div>

      {applications === undefined ? (
        <div className="empty-note">Loading candidates…</div>
      ) : rows.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {filter === 'all' ? 'No candidates yet' : `No candidates at ${filter}`}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            {filter === 'all'
              ? 'Add a candidate and attach their resume. Files are stored on Convex, so they survive a deploy.'
              : 'Nothing at this stage yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {rows.map(a => {
            const stage = STAGES.find(s => s.key === a.status) ?? STAGES[0];
            return (
              <div key={a._id} style={{
                background: 'var(--card-bg)', padding: '1.1rem 1.5rem',
                display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr auto auto', gap: '1rem', alignItems: 'start',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{a.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {[a.email, a.phone].filter(Boolean).join(' · ') || '—'}
                  </div>
                  {a.notes && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.75, marginTop: '0.3rem', lineHeight: 1.6 }}>{a.notes}</div>
                  )}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>
                  {a.position}
                  {a.venture && <div style={{ fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{a.venture}</div>}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
                  <div>via {a.source}</div>
                  {a.resumeUrl ? (
                    <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--accent-text)', textDecoration: 'none', fontSize: '0.6rem', display: 'inline-block', marginTop: '0.25rem' }}>
                      ↓ {a.resumeName ?? 'Resume'}
                    </a>
                  ) : (
                    <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '0.25rem' }}>No resume</div>
                  )}
                </div>

                <select
                  value={a.status}
                  onChange={e => { void updateApp({ id: a._id, status: e.target.value as Stage }); }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '0.2rem 0.45rem', cursor: 'pointer',
                    background: 'transparent', border: `1px solid ${scBorder(stage.color)}`,
                    color: sc(stage.color), alignSelf: 'flex-start',
                  }}
                >
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>

                <button
                  onClick={() => { void removeApp({ id: a._id }); }}
                  title="Remove candidate and delete their resume"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '0.2rem 0.45rem', cursor: 'pointer',
                    background: 'transparent', border: '1px solid var(--card-border)',
                    color: 'var(--muted)', alignSelf: 'flex-start',
                  }}
                >Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

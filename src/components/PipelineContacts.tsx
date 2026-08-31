'use client';

/**
 * The people at one pipeline org.
 *
 * The funnel is company-first — a prospect is the company, a lead is the set of
 * people you have found there, and a client has one of them promoted to primary.
 * So this renders collapsed as a summary (primary + "n more") and expands into
 * an editor.
 */

import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Stage } from '@/lib/pipeline-config';

export interface Contact {
  _id: Id<'pipeline_contacts'>;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  notes?: string;
  isPrimary: boolean;
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  color: 'var(--muted)',
};

const miniInput: React.CSSProperties = {
  background: 'var(--black)',
  border: '1px solid var(--card-border)',
  color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6rem',
  padding: '0.3rem 0.45rem',
  outline: 'none',
  width: '100%',
};

function miniBtn(active = false): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.52rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0.15rem 0.4rem',
    background: 'transparent',
    border: `1px solid ${active ? 'var(--accent-text)' : 'var(--card-border)'}`,
    color: active ? 'var(--accent-text)' : 'var(--muted)',
    cursor: 'pointer',
  };
}

export default function PipelineContacts({
  orgId,
  contacts,
  stage,
  accent,
}: {
  orgId: Id<'pipeline_orgs'>;
  contacts: Contact[];
  stage: Stage;
  accent: string;
}) {
  const addContact = useMutation(api.contacts.add);
  const removeContact = useMutation(api.contacts.remove);
  const setPrimary = useMutation(api.contacts.setPrimary);

  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primary = contacts.find(c => c.isPrimary);
  const others = contacts.filter(c => !c.isPrimary);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      await addContact({
        orgId,
        name,
        role: String(fd.get('role') ?? '').trim() || undefined,
        email: String(fd.get('email') ?? '').trim() || undefined,
        phone: String(fd.get('phone') ?? '').trim() || undefined,
      });
      e.currentTarget.reset();
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add contact');
    } finally {
      setBusy(false);
    }
  }

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  // Collapsed: a prospect has no people yet by definition, so nudge toward
  // adding one rather than showing an em dash.
  if (!open) {
    return (
      <div style={{ minWidth: 0 }}>
        {primary ? (
          <>
            <div style={{ ...mono, color: 'var(--off-white)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {primary.name}
              </span>
              {stage === 'client' && (
                <span style={{ fontSize: '0.5rem', color: accent, letterSpacing: '0.1em' }}>PRIMARY</span>
              )}
            </div>
            {primary.role && <div style={{ ...mono, fontSize: '0.56rem', opacity: 0.8 }}>{primary.role}</div>}
            {primary.email && (
              <div style={{ ...mono, overflow: 'hidden', textOverflow: 'ellipsis' }}>{primary.email}</div>
            )}
          </>
        ) : (
          <div style={mono}>{stage === 'prospect' ? 'No contacts yet' : '—'}</div>
        )}
        <button
          onClick={() => setOpen(true)}
          style={{ ...miniBtn(), marginTop: '0.3rem' }}
        >
          {contacts.length === 0
            ? '+ Add contact'
            : others.length > 0
              ? `${contacts.length} contacts`
              : 'Edit contact'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Contacts ({contacts.length})
        </span>
        <button onClick={() => { setOpen(false); setAdding(false); }} style={miniBtn()}>Close</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {contacts.map(c => (
          <div
            key={c._id}
            style={{
              border: '1px solid var(--card-border)',
              borderLeft: `2px solid ${c.isPrimary ? accent : 'var(--card-border)'}`,
              padding: '0.35rem 0.5rem',
            }}
          >
            <div style={{ ...mono, color: 'var(--off-white)', fontSize: '0.64rem' }}>
              {c.name}
              {c.role && <span style={{ color: 'var(--muted)' }}> · {c.role}</span>}
            </div>
            {(c.email || c.phone) && (
              <div style={{ ...mono, fontSize: '0.56rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {[c.email, c.phone].filter(Boolean).join(' · ')}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
              <button
                disabled={busy || c.isPrimary}
                onClick={() => void run(() => setPrimary({ contactId: c._id }))}
                style={miniBtn(c.isPrimary)}
                title={c.isPrimary ? 'Main point of contact' : 'Make main point of contact'}
              >
                {c.isPrimary ? 'Primary' : 'Make primary'}
              </button>
              <button
                disabled={busy}
                onClick={() => void run(() => removeContact({ contactId: c._id }))}
                style={miniBtn()}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem' }}>
          <input name="name" placeholder="Name" required style={miniInput} />
          <input name="role" placeholder="Role at company" style={miniInput} />
          <input name="email" type="email" placeholder="Email" style={miniInput} />
          <input name="phone" placeholder="Phone" style={miniInput} />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button type="submit" disabled={busy} style={miniBtn(true)}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setAdding(false)} style={miniBtn()}>Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} style={{ ...miniBtn(), marginTop: '0.4rem' }}>
          + Add contact
        </button>
      )}

      {error && (
        <div style={{ ...mono, fontSize: '0.56rem', color: '#ff8080', marginTop: '0.3rem' }}>{error}</div>
      )}
    </div>
  );
}

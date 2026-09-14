'use client';

/**
 * Create an organization.
 *
 * A modal rather than an inline panel: the sidebar rail is 220px and this needs
 * two fields plus a paragraph of honesty about what a new organization actually
 * contains on day one. Follows the scrim pattern used by ConvertToProjectButton.
 */

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block',
  marginBottom: '0.35rem',
};

const field: React.CSSProperties = {
  width: '100%', background: 'var(--black)', border: '1px solid var(--card-border)',
  color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  padding: '0.6rem 0.75rem', outline: 'none',
};

export default function NewOrgForm({ onClose }: { onClose: () => void }) {
  const create = useMutation(api.organizations.create);
  const setActive = useMutation(api.team.setActiveVenture);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const sector = String(fd.get('sector') ?? '').trim();
    if (!name || !sector) return;

    setBusy(true);
    setError(null);
    try {
      await create({ name, sector });
      await setActive({ venture: name });
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the organization.');
      setBusy(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          maxWidth: 460, width: '100%', padding: '2rem',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)',
          letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.4rem',
        }}>New organization</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Add an organization
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="org-name" style={label}>Name</label>
          <input id="org-name" name="name" style={field} required autoFocus maxLength={40} />
          {/* The name is the key, not an id — say so before it is chosen, not after. */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)',
            lineHeight: 1.6, marginTop: '0.4rem',
          }}>
            Written onto every task, position and record. Renaming later is a
            migration, so it is worth getting right now.
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="org-sector" style={label}>Sector</label>
          <input id="org-sector" name="sector" style={field} required maxLength={60}
                 placeholder="e.g. AI Career Assistant" />
        </div>

        <div style={{
          background: 'var(--black)', border: '1px solid var(--card-border)',
          borderLeft: '2px solid var(--accent)', padding: '0.9rem 1rem', marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.75,
        }}>
          It starts empty. Tasks, Positions, Applications, Pipeline, the AI
          assistant and Site projects work straight away. Pages built on static
          content — Activity, Partners, Financial Model, Handbook — will show
          empty states until that content is written.
        </div>

        {error && (
          <div role="alert" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--st-red)',
            marginBottom: '1rem', lineHeight: 1.6,
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{
            background: 'transparent', color: 'var(--muted)', border: '1px solid var(--card-border)',
            padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          }}>Cancel</button>
          <button type="submit" disabled={busy} style={{
            background: busy ? 'var(--card-border)' : 'var(--accent)',
            color: busy ? 'var(--muted)' : 'var(--on-accent)',
            border: 'none', padding: '0.75rem 1.5rem', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600,
          }}>{busy ? 'Creating…' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}

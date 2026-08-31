'use client';

/**
 * Add / edit a team member. Wraps AccessMatrix with the identity fields and
 * submits to team.inviteMember (new person) or team.updateMember (existing).
 *
 * Admin-only — the Team page hides the entry points, and both mutations call
 * requireAdmin server-side regardless.
 */

import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import AccessMatrix from '@/components/AccessMatrix';
import { ALL_SCOPES, presetVentureLead, type Grant } from '@/lib/nav';

export interface MemberDraft {
  userId?: string;
  pending?: boolean;
  name: string;
  email: string;
  title?: string;
  role: 'admin' | 'member';
  access?: Grant[];
  ventureRoles: { venture: string; role: string }[];
}

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

export default function MemberForm({
  initial,
  defaultVenture,
  onClose,
}: {
  initial?: MemberDraft;
  /** Pre-seeds the venture-role row and the matrix when adding from a venture tab. */
  defaultVenture?: string;
  onClose: () => void;
}) {
  const inviteMember = useMutation(api.team.inviteMember);
  const updateMember = useMutation(api.team.updateMember);

  const editing = Boolean(initial?.userId);

  const [name, setName]   = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [role, setRole]   = useState<'admin' | 'member'>(initial?.role ?? 'member');
  const [access, setAccess] = useState<Grant[]>(
    initial?.access ?? (defaultVenture ? presetVentureLead(defaultVenture) : []),
  );
  const [ventureRoles, setVentureRoles] = useState<{ venture: string; role: string }[]>(
    initial?.ventureRoles?.length
      ? initial.ventureRoles
      : defaultVenture
        ? [{ venture: defaultVenture, role: '' }]
        : [],
  );
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setVentureRole(venture: string, value: string) {
    setVentureRoles((prev) => {
      const rest = prev.filter((r) => r.venture !== venture);
      return value.trim() ? [...rest, { venture, role: value }] : rest;
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (editing && initial?.userId) {
        await updateMember({
          userId: initial.userId as Id<'users'>,
          title: title.trim() || undefined,
          role,
          access,
          ventureRoles,
        });
      } else {
        await inviteMember({
          email: email.trim(),
          name: name.trim() || undefined,
          title: title.trim() || undefined,
          role,
          access,
          ventureRoles,
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  // Only ventures the member actually has grants on need a role label.
  const grantedVentures = ALL_SCOPES.filter((s) =>
    access.some((g) => g.venture === s.name && g.pages.length > 0),
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3rem 1rem',
        overflowY: 'auto',
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: 'var(--black)',
          border: '1px solid var(--card-border)',
          padding: '1.5rem',
          width: '100%',
          maxWidth: 720,
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {editing ? `Edit ${initial?.name || initial?.email}` : 'Add team member'}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--muted)',
              lineHeight: 1.7,
              margin: '0.4rem 0 0',
            }}
          >
            {editing
              ? 'Changes apply immediately, including on their next page load.'
              : 'They sign in with their @codelude.com Google account. Access applies on first sign-in — you can add them before the account exists.'}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <label style={labelStyle}>Name</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              disabled={editing}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@codelude.com"
              required={!editing}
              disabled={editing}
            />
          </div>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Co-founder"
            />
          </div>
          <div>
            <label style={labelStyle}>Company role</label>
            <select
              style={inputStyle}
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            >
              <option value="member">Member — scoped by the matrix</option>
              <option value="admin">Admin — full access, bypasses the matrix</option>
            </select>
          </div>
        </div>

        {role === 'admin' ? (
          <div
            style={{
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}
          >
            Admins see every venture and every page. The grant matrix does not
            apply to them — switch to Member to scope access.
          </div>
        ) : (
          <>
            <label style={labelStyle}>Page access</label>
            <AccessMatrix access={access} onChange={setAccess} />

            {grantedVentures.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Role per venture (label only)</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.4rem',
                  }}
                >
                  {grantedVentures.map((s) => (
                    <div
                      key={s.name}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <span style={{ width: 6, height: 6, background: s.color, flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          width: 78,
                          flexShrink: 0,
                        }}
                      >
                        {s.name}
                      </span>
                      <input
                        style={{ ...inputStyle, padding: '0.3rem 0.45rem', fontSize: '0.62rem' }}
                        value={ventureRoles.find((r) => r.venture === s.name)?.role ?? ''}
                        onChange={(e) => setVentureRole(s.name, e.target.value)}
                        placeholder="e.g. Co-founder"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div
            style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#ff8080',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.1rem',
              background: 'transparent',
              border: '1px solid var(--card-border)',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: '0.5rem 1.1rem',
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              color: 'var(--black)',
              cursor: busy ? 'wait' : 'pointer',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
          </button>
        </div>
      </form>
    </div>
  );
}

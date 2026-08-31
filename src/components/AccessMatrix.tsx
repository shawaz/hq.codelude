'use client';

/**
 * The (venture × page) grant editor.
 *
 * Six scopes × 54 pages is 324 toggles, so it collapses into a nested accordion:
 * venture → section → page, with a master checkbox and a granted/total count at
 * every level. Presets exist because configuring a member one page at a time is
 * not a thing anyone will do twice.
 *
 * This edits `access` only. Nothing here enforces anything — the matrix it
 * produces is checked server-side by assertAccess() in the Convex functions.
 */

import { useMemo, useState } from 'react';
import {
  ALL_SCOPES,
  NAV,
  TOTAL_PAGES,
  grantCount,
  presetFullAccess,
  presetOperating,
  presetVentureLead,
  type Grant,
} from '@/lib/nav';

// ─── GRANT HELPERS ────────────────────────────────────────────────────────────
// `access` is stored as an array of grants; a Set-of-slugs map is far easier to
// edit against, so we convert at the boundaries.

type Matrix = Record<string, Set<string>>;

function toMatrix(access: Grant[]): Matrix {
  const m: Matrix = {};
  for (const g of access) m[g.venture] = new Set(g.pages);
  return m;
}

function fromMatrix(m: Matrix): Grant[] {
  return ALL_SCOPES
    .filter((s) => (m[s.name]?.size ?? 0) > 0)
    .map((s) => ({ venture: s.name, pages: [...m[s.name]] }));
}

function countFor(m: Matrix, venture: string): number {
  return m[venture]?.size ?? 0;
}

function sectionCount(m: Matrix, venture: string, slugs: string[]): number {
  const held = m[venture];
  if (!held) return 0;
  return slugs.filter((s) => held.has(s)).length;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const countStyle: React.CSSProperties = {
  ...mono,
  fontSize: '0.55rem',
  color: 'var(--muted)',
  letterSpacing: '0.06em',
  textTransform: 'none',
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    ...mono,
    fontSize: '0.55rem',
    padding: '0.2rem 0.55rem',
    cursor: 'pointer',
    background: 'transparent',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--card-border)'}`,
    color: active ? 'var(--accent)' : 'var(--muted)',
  };
}

// ─── TRI-STATE CHECKBOX ───────────────────────────────────────────────────────

function Check({
  state,
  onChange,
  label,
}: {
  state: 'none' | 'some' | 'all';
  onChange: () => void;
  label?: string;
}) {
  const mark = state === 'all' ? '✓' : state === 'some' ? '–' : '';
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      aria-label={label}
      style={{
        width: 15,
        height: 15,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '0.6rem',
        lineHeight: 1,
        fontWeight: 700,
        background: state === 'none' ? 'transparent' : 'var(--accent)',
        color: state === 'none' ? 'transparent' : 'var(--black)',
        border: `1px solid ${state === 'none' ? 'var(--card-border)' : 'var(--accent)'}`,
      }}
    >
      {mark}
    </button>
  );
}

// ─── MATRIX ───────────────────────────────────────────────────────────────────

export default function AccessMatrix({
  access,
  onChange,
  disabled = false,
}: {
  access: Grant[];
  onChange: (next: Grant[]) => void;
  disabled?: boolean;
}) {
  const matrix = useMemo(() => toMatrix(access), [access]);
  const [openVenture, setOpenVenture] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const total = grantCount(access);

  function apply(mutate: (m: Matrix) => void) {
    if (disabled) return;
    const next = toMatrix(access);
    mutate(next);
    onChange(fromMatrix(next));
  }

  function togglePage(venture: string, slug: string) {
    apply((m) => {
      const held = m[venture] ?? new Set<string>();
      if (held.has(slug)) held.delete(slug);
      else held.add(slug);
      m[venture] = held;
    });
  }

  function toggleSection(venture: string, slugs: string[]) {
    apply((m) => {
      const held = m[venture] ?? new Set<string>();
      const all = slugs.every((s) => held.has(s));
      for (const s of slugs) {
        if (all) held.delete(s);
        else held.add(s);
      }
      m[venture] = held;
    });
  }

  function toggleVenture(venture: string) {
    apply((m) => {
      const held = m[venture];
      if (held && held.size === TOTAL_PAGES) m[venture] = new Set();
      else m[venture] = new Set(NAV.flatMap((s) => s.pages.map((p) => p.slug)));
    });
  }

  return (
    <div>
      {/* Presets — nobody is clicking 324 checkboxes by hand */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span style={{ ...countStyle, marginRight: '0.25rem' }}>
          {total} of {ALL_SCOPES.length * TOTAL_PAGES} granted
        </span>
        <button
          type="button"
          disabled={disabled}
          style={pillStyle(false)}
          onClick={() => onChange(presetFullAccess())}
        >
          Full access
        </button>
        <button
          type="button"
          disabled={disabled}
          style={pillStyle(false)}
          onClick={() => onChange([])}
        >
          Clear all
        </button>
      </div>

      <div
        style={{
          border: '1px solid var(--card-border)',
          background: 'var(--card-bg)',
          maxHeight: 420,
          overflowY: 'auto',
        }}
      >
        {ALL_SCOPES.map((scope) => {
          const granted = countFor(matrix, scope.name);
          const isOpen = openVenture === scope.name;
          const state = granted === 0 ? 'none' : granted === TOTAL_PAGES ? 'all' : 'some';

          return (
            <div
              key={scope.name}
              style={{ borderBottom: '1px solid var(--card-border)' }}
            >
              {/* Venture row */}
              <div
                onClick={() => setOpenVenture(isOpen ? null : scope.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  cursor: 'pointer',
                  background: isOpen ? 'var(--hover-wash)' : 'transparent',
                }}
              >
                <span style={{ ...mono, fontSize: '0.5rem', color: 'var(--muted)', width: 8 }}>
                  {isOpen ? '▾' : '▸'}
                </span>
                <Check
                  state={state}
                  label={`Toggle all pages for ${scope.name}`}
                  onChange={() => toggleVenture(scope.name)}
                />
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: scope.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}>
                  {scope.name}
                  {scope.holdco && (
                    <span style={{ ...countStyle, marginLeft: '0.4rem' }}>HoldCo</span>
                  )}
                </span>
                <span style={countStyle}>
                  {granted} / {TOTAL_PAGES}
                </span>
              </div>

              {/* Sections */}
              {isOpen && (
                <div style={{ padding: '0 0.75rem 0.5rem 1.6rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.35rem',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      style={pillStyle(false)}
                      onClick={() =>
                        apply((m) => {
                          const preset = presetVentureLead(scope.name)[0];
                          m[scope.name] = new Set(preset?.pages ?? []);
                        })
                      }
                    >
                      Venture lead
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      style={pillStyle(false)}
                      onClick={() =>
                        apply((m) => {
                          const preset = presetOperating(scope.name)[0];
                          m[scope.name] = new Set(preset?.pages ?? []);
                        })
                      }
                    >
                      Operating
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      style={pillStyle(false)}
                      onClick={() => apply((m) => { m[scope.name] = new Set(); })}
                    >
                      None
                    </button>
                  </div>

                  {NAV.map((section) => {
                    const slugs = section.pages.map((p) => p.slug);
                    const n = sectionCount(matrix, scope.name, slugs);
                    const key = `${scope.name}:${section.title}`;
                    const secOpen = openSections[key] ?? n > 0;
                    const secState =
                      n === 0 ? 'none' : n === slugs.length ? 'all' : 'some';

                    return (
                      <div key={key} style={{ marginBottom: '0.15rem' }}>
                        <div
                          onClick={() =>
                            setOpenSections((prev) => ({ ...prev, [key]: !secOpen }))
                          }
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.3rem 0',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{ ...mono, fontSize: '0.5rem', color: 'var(--muted)', width: 8 }}
                          >
                            {secOpen ? '▾' : '▸'}
                          </span>
                          <Check
                            state={secState}
                            label={`Toggle ${section.title} for ${scope.name}`}
                            onChange={() => toggleSection(scope.name, slugs)}
                          />
                          <span style={{ ...mono, fontSize: '0.58rem', flex: 1 }}>
                            {section.title}
                          </span>
                          <span style={countStyle}>
                            {n} / {slugs.length}
                          </span>
                        </div>

                        {secOpen && (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                              gap: '0.1rem 0.5rem',
                              padding: '0.2rem 0 0.4rem 1.6rem',
                            }}
                          >
                            {section.pages.map((p) => {
                              const on = matrix[scope.name]?.has(p.slug) ?? false;
                              return (
                                <label
                                  key={p.slug}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    padding: '0.12rem 0',
                                  }}
                                >
                                  <Check
                                    state={on ? 'all' : 'none'}
                                    label={`${p.label} for ${scope.name}`}
                                    onChange={() => togglePage(scope.name, p.slug)}
                                  />
                                  <span
                                    style={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.62rem',
                                      color: on ? 'var(--off-white)' : 'var(--muted)',
                                    }}
                                  >
                                    {p.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

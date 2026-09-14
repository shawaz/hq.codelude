'use client';

/**
 * Which organization the dashboard is pointed at.
 *
 * Replaced the per-page venture tab strips — one control instead of fourteen,
 * filtered once, in the layout.
 *
 * Expands in place rather than overlaying. .sidebar-nav is overflow-y:auto, so
 * an absolutely-positioned panel rendered inside it would be clipped, and an
 * overlay would be the first thing in this codebase to need click-outside and
 * Escape handling — for a list of six. The section accordion directly below it
 * already solves exactly this shape, so it uses that.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Scope } from '@/lib/nav';
import NewOrgForm from '@/components/NewOrgForm';

export interface OrgSwitcherProps {
  /** Already filtered to what this user may see — the sidebar decides nothing. */
  orgs: Scope[];
  active: string;
  canCreate: boolean;
}

export default function OrgSwitcher({ orgs, active, canCreate }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const setActive = useMutation(api.team.setActiveVenture);
  const router = useRouter();

  const current = orgs.find((o) => o.name === active) ?? orgs[0];
  if (!current) return null;

  async function choose(name: string) {
    setOpen(false);
    if (name === current?.name) return;
    await setActive({ venture: name });
    // Client pages repaint from Convex reactivity on their own; this is for the
    // server components that read the active organization at render time.
    router.refresh();
  }

  return (
    <div className="sidebar-org">
      <button
        className="sidebar-org-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={`${current.name} — switch organization`}
      >
        <span className="sidebar-org-mark" style={{ background: current.color }}>
          {current.name[0].toUpperCase()}
        </span>
        <span className="sidebar-org-meta">
          <span className="sidebar-org-name">{current.name}</span>
          <span className="sidebar-org-sector">{current.sector}</span>
        </span>
        <span className={`sidebar-org-caret${open ? ' open' : ''}`}>▼</span>
      </button>

      <div className={`sidebar-org-list${open ? ' open' : ''}`}>
        {orgs.map((o) => (
          <button
            key={o.name}
            onClick={() => void choose(o.name)}
            // The HoldCo is a different kind of thing from a venture, so it is
            // separated rather than sorted in among them.
            className={`sidebar-org-item${o.name === current.name ? ' active' : ''}${o.holdco ? ' holdco' : ''}`}
          >
            <span className="sidebar-org-mark" style={{ background: o.color, width: 18, height: 18, fontSize: '0.55rem' }}>
              {o.name[0].toUpperCase()}
            </span>
            {o.name}
          </button>
        ))}

        {canCreate && (
          <button className="sidebar-org-item sidebar-org-add" onClick={() => { setOpen(false); setAdding(true); }}>
            + Add new organization
          </button>
        )}
      </div>

      {adding && <NewOrgForm onClose={() => setAdding(false)} />}
    </div>
  );
}

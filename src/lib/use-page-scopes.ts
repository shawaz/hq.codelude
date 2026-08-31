'use client';

/**
 * Which ventures may the signed-in user see on a given page?
 *
 * Every venture selector in the dashboard renders from this instead of a local
 * literal, so a scoped member never sees a tab for a venture they cannot open.
 * This only shapes the UI — the data behind each tab is separately gated by
 * assertAccess() in the Convex functions.
 */
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ALL_SCOPES, venturesForPage, type Scope } from '@/lib/nav';
import { scopeByName } from '@/lib/ventures';

export interface PageScopes {
  /** Scope objects (name, colour, sector) the user may see here, in registry order. */
  scopes: Scope[];
  /** Just the names — convenient for the many pages whose strip is a string list. */
  names: string[];
  /** True until getCurrentUser resolves. Render nothing venture-shaped until then. */
  loading: boolean;
}

export function usePageScopes(pageSlug: string): PageScopes {
  const user = useQuery(api.team.getCurrentUser);
  if (user === undefined) return { scopes: [], names: [], loading: true };

  const names = venturesForPage(user, pageSlug);
  return {
    scopes: names.map(scopeByName).filter((s): s is Scope => Boolean(s)),
    names,
    loading: false,
  };
}

/**
 * Clamp a selected-index into range. The venture strips hold `useState(0)` and
 * index straight into the list, so a list that shrinks after a permission change
 * would otherwise read past the end and render undefined.
 */
export function clampIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export { ALL_SCOPES };

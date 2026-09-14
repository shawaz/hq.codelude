'use client';

/**
 * Which organizations may the signed-in user see on a given page?
 *
 * Most pages now render one organization, chosen in the sidebar — see
 * useActiveScope. This survives for the surfaces that genuinely need the whole
 * list: an "All ventures" filter, a form dropdown choosing which organization a
 * new record belongs to, and the grant matrix.
 *
 * Sourced from the live registry rather than the compiled-in one, so an
 * organization created at runtime appears in those lists too. It only shapes
 * the UI — the data behind it is separately gated by assertAccess() in the
 * Convex functions.
 */
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ALL_SCOPES, venturesForPage, type Scope } from '@/lib/nav';
import { useScopeRegistry } from '@/lib/use-active-scope';

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
  const { scopes: registry, loading: registryLoading } = useScopeRegistry();
  if (user === undefined || registryLoading) {
    return { scopes: [], names: [], loading: true };
  }

  const names = venturesForPage(user, pageSlug, registry.map((s) => s.name));
  return {
    // Resolved against the live registry, so a runtime-created organization
    // is not silently dropped the way scopeByName would have dropped it.
    scopes: names
      .map((n) => registry.find((s) => s.name === n))
      .filter((s): s is Scope => Boolean(s)),
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

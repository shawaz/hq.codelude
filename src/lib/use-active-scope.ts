'use client';

/**
 * The one organization a page renders, and the live registry behind it.
 *
 * This replaced fourteen near-identical venture tab strips. Each held its own
 * `useState(0)`, indexed into its own filtered list, and forgot the choice the
 * moment you navigated — so picking a venture happened over and over, and two
 * of the strips disagreed about whether to filter by permission at all
 * (VentureTabs did not; VenturePageLayout did).
 *
 * The selection now lives on the user document and arrives through
 * getCurrentUser, which usePageScopes already subscribes to. Convex dedupes
 * useQuery by (query, args), so every page sharing these hooks shares one
 * subscription rather than opening its own.
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { venturesForPage, type Scope } from '@/lib/nav';
import { ALL_SCOPES } from '@/lib/ventures';

export interface ScopeRegistry {
  /** Every live organization, in registry order. */
  scopes: Scope[];
  loading: boolean;
}

/**
 * The live registry on its own — for the switcher, the grant matrix, and
 * anywhere that lists organizations rather than rendering one.
 *
 * Returns the compiled-in registry while the query is in flight so the grant
 * matrix never flashes empty.
 */
export function useScopeRegistry(): ScopeRegistry {
  const rows = useQuery(api.organizations.list);
  if (rows === undefined) return { scopes: [...ALL_SCOPES], loading: true };
  return {
    scopes: rows.map((r) => ({
      id: r.name.toLowerCase(),
      name: r.name,
      color: r.color,
      sector: r.sector,
      ...(r.holdco ? { holdco: true } : {}),
    })),
    loading: false,
  };
}

export type ActiveReason = 'ok' | 'fallback' | 'no-access';

export interface ActiveScope {
  /** The organization to render. Null only when the user holds no grant here. */
  scope: Scope | null;
  /** Every organization the user may see on this page. */
  allowed: Scope[];
  /** The full live registry. */
  registry: Scope[];
  loading: boolean;
  /**
   * 'ok'        — rendering the user's chosen organization
   * 'fallback'  — their choice is not granted on this page; showing the first that is
   * 'no-access' — they hold no grant on this page at all
   */
  reason: ActiveReason;
}

/**
 * Resolve the organization this page should show.
 *
 * Falls back rather than blocking: an organization the user has selected but
 * cannot see on this particular page yields the first one they can, so no page
 * can break because of a selection made somewhere else.
 */
export function useActiveScope(pageSlug: string): ActiveScope {
  const user = useQuery(api.team.getCurrentUser);
  const { scopes: registry, loading: registryLoading } = useScopeRegistry();

  if (user === undefined || registryLoading) {
    return { scope: null, allowed: [], registry, loading: true, reason: 'ok' };
  }

  const names = venturesForPage(user, pageSlug, registry.map((s) => s.name));
  const allowed = names
    .map((n) => registry.find((s) => s.name === n))
    .filter((s): s is Scope => Boolean(s));

  if (allowed.length === 0) {
    return { scope: null, allowed, registry, loading: false, reason: 'no-access' };
  }

  const chosen = allowed.find((s) => s.name === user?.activeVenture);
  return {
    scope: chosen ?? allowed[0],
    allowed,
    registry,
    loading: false,
    reason: chosen ? 'ok' : 'fallback',
  };
}

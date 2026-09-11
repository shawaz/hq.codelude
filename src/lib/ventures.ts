/**
 * Canonical venture registry for the Next app.
 *
 * The data lives in src/convex/access.ts so the Convex backend can import it
 * too (the Convex tsconfig has no "@/*" alias). This module is the app-facing
 * name for it — import ventures from here, not from a local literal.
 */
export {
  HOLDCO,
  VENTURES,
  ALL_SCOPES,
  ALL_SCOPE_NAMES,
  scopeByName,
} from '@/convex/access';
export type { Scope } from '@/convex/access';

import { ALL_SCOPES as _ALL_SCOPES } from '@/convex/access';


/**
 * Colour for any scope name — ventures plus the Codelude HoldCo.
 *
 * This replaced sixteen identical `VENTURE_COLORS` literals, one per dashboard
 * page, each restating the registry's colours. That duplication is how the
 * palette drifted the last time a venture changed, so the map is derived here
 * once and the pages call this instead.
 *
 * Unknown names return a neutral grey rather than undefined: rows belonging to
 * an archived venture are kept rather than deleted, so a stale name can
 * still reach a colour lookup from the file-backed stores.
 */
const SCOPE_COLORS: Record<string, string> = Object.fromEntries(
  _ALL_SCOPES.map((s) => [s.name, s.color]),
);

export function scopeColor(name: string | undefined | null): string {
  return (name && SCOPE_COLORS[name]) || 'var(--muted)';
}

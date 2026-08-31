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

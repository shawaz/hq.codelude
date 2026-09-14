/**
 * The live organization registry, read from the database.
 *
 * Sits in its own module rather than in team.ts or organizations.ts because
 * both of those need it: team.ts's guards call it on every access check, and
 * organizations.ts needs team.ts's requireAdmin. Importing only access.ts keeps
 * this free of cycles.
 */

import type { QueryCtx, MutationCtx } from "./_generated/server";
import { ALL_SCOPE_NAMES, type LiveScopes } from "./access";

type AnyCtx = QueryCtx | MutationCtx;

/**
 * Live, non-archived organization names in registry order.
 *
 * Falls back to the compiled-in registry when the table is empty. That is the
 * deploy window: `convex deploy` creates the table before anyone can run the
 * seed, and without this fallback every access check would fail closed and the
 * whole dashboard would 403 until the seed ran.
 */
export async function liveScopeNames(ctx: AnyCtx): Promise<LiveScopes> {
  const rows = await ctx.db.query("organizations").withIndex("by_order").collect();
  const live = rows.filter((r) => !r.archived).map((r) => r.name);
  return live.length > 0 ? live : ALL_SCOPE_NAMES;
}

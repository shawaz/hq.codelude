/**
 * One-shot data migrations, run by hand from the Convex CLI.
 *
 * These are internalMutations with no HTTP surface — they cannot be called from
 * the app. Keep them idempotent: a partial run that hits Convex's transaction
 * limits will be retried.
 */

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { retagScope } from "./renameScope";

/**
 * Retag every row carrying an organization name.
 *
 *   npx convex run migrations:renameScope '{"from":"LLIFE","to":"Codelude"}'
 *
 * Kept as an alias of rename:venture because it is the name already used in
 * the deploy notes. Both now share one walk — see renameScope.ts.
 */
export const renameScope = internalMutation({
  args: { from: v.string(), to: v.string(), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { from, to, dryRun }) =>
    await retagScope(ctx, from, to, { dryRun }),
});

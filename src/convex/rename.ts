/**
 * Rename an organization across every table that stores its name.
 *
 *   npx convex run rename:venture '{"from":"Old","to":"New","dryRun":true}'
 *   npx convex run --prod rename:venture '{"from":"Old","to":"New"}'
 *
 * The walk itself lives in renameScope.ts, shared with migrations:renameScope
 * and organizations:rename. It used to be duplicated here, and the copies had
 * drifted — see that file.
 */

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { retagScope } from "./renameScope";

export const venture = internalMutation({
  args: { from: v.string(), to: v.string(), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { from, to, dryRun }) =>
    await retagScope(ctx, from, to, { dryRun }),
});

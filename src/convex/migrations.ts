/**
 * One-shot data migrations, run by hand from the Convex dashboard or CLI.
 *
 * These are internalMutations with no HTTP surface — they cannot be called from
 * the app. Run one with:
 *
 *   npx convex run migrations:renameScope '{"from":"LLIFE","to":"Codelude"}'
 *
 * Keep them idempotent: re-running must be a no-op, because a partial run that
 * hits Convex's transaction limits will be retried.
 */
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Retag every row carrying a scope name, after a venture or the HoldCo is
 * renamed in access.ts.
 *
 * A scope name is a plain string on the row, not a reference, so a rename in
 * the registry orphans the data: isActiveScope() rejects the old name and the
 * rows stop matching any tab. This walks every table that stores one.
 *
 * Table list is exhaustive as of the schema at the time of writing — if you add
 * a venture-keyed table, add it here too.
 */
export const renameScope = internalMutation({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const counts: Record<string, number> = {};
    const bump = (k: string) => { counts[k] = (counts[k] ?? 0) + 1; };

    // Tables with a plain `venture: string`.
    for (const table of ["leads", "pipeline_orgs", "positions", "pipeline_stats"] as const) {
      for (const row of await ctx.db.query(table).collect()) {
        if (row.venture === from) { await ctx.db.patch(row._id, { venture: to }); bump(table); }
      }
    }

    // Same field, but optional.
    for (const row of await ctx.db.query("applications").collect()) {
      if (row.venture === from) { await ctx.db.patch(row._id, { venture: to }); bump("applications"); }
    }

    // Private per-user chat, keyed by venture.
    for (const table of ["ai_messages", "ai_day_summaries"] as const) {
      for (const row of await ctx.db.query(table).collect()) {
        if (row.venture === from) { await ctx.db.patch(row._id, { venture: to }); bump(table); }
      }
    }

    // Tasks call it `project`, and site_projects calls it `ventureId`.
    for (const row of await ctx.db.query("tasks").collect()) {
      if (row.project === from) { await ctx.db.patch(row._id, { project: to }); bump("tasks"); }
    }
    for (const row of await ctx.db.query("site_projects").collect()) {
      if (row.ventureId === from) { await ctx.db.patch(row._id, { ventureId: to }); bump("site_projects"); }
    }

    // Permission grants and display roles, on both users and pending invites.
    for (const table of ["users", "invites"] as const) {
      for (const row of await ctx.db.query(table).collect()) {
        const access = row.access?.map((g: { venture: string; pages: string[] }) =>
          g.venture === from ? { ...g, venture: to } : g);
        const ventureRoles = row.ventureRoles?.map((r: { venture: string; role: string }) =>
          r.venture === from ? { ...r, venture: to } : r);
        const changed =
          JSON.stringify(access) !== JSON.stringify(row.access) ||
          JSON.stringify(ventureRoles) !== JSON.stringify(row.ventureRoles);
        if (changed) { await ctx.db.patch(row._id, { access, ventureRoles }); bump(table); }
      }
    }

    return { from, to, counts };
  },
});

/**
 * Rename a venture across every table that stores its name.
 *
 * The venture name is a load-bearing string, not an id — it is written into
 * pipeline records, tasks, positions, applications, chat history, site projects
 * and, most importantly, into users.access grants. Renaming it in code alone
 * orphans all of that: records vanish from the UI because their venture is no
 * longer in the registry, and anyone granted the old name silently loses access.
 *
 * Idempotent: rows already carrying the new name are skipped, so a partial run
 * can simply be repeated. Counts are reported per table so a run that misses
 * something is visible rather than silent.
 *
 *   npx convex run --prod rename:venture '{"from":"OldName","to":"NewName"}'
 */

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const venture = internalMutation({
  args: { from: v.string(), to: v.string(), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { from, to, dryRun }) => {
    if (!from || !to || from === to) throw new Error("from and to must differ and be non-empty");
    const counts: Record<string, number> = {};
    const bump = (k: string) => { counts[k] = (counts[k] ?? 0) + 1; };
    const write = !dryRun;

    // ── Tables with a plain `venture` field ──────────────────────────────
    for (const row of await ctx.db.query("pipeline_orgs").collect()) {
      if (row.venture !== from) continue;
      bump("pipeline_orgs");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("pipeline_stats").collect()) {
      if (row.venture !== from) continue;
      bump("pipeline_stats");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("positions").collect()) {
      if (row.venture !== from) continue;
      bump("positions");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("applications").collect()) {
      if (row.venture !== from) continue;
      bump("applications");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("ai_messages").collect()) {
      if (row.venture !== from) continue;
      bump("ai_messages");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("ai_day_summaries").collect()) {
      if (row.venture !== from) continue;
      bump("ai_day_summaries");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }
    for (const row of await ctx.db.query("leads").collect()) {
      if (row.venture !== from) continue;
      bump("leads");
      if (write) await ctx.db.patch(row._id, { venture: to });
    }

    // ── Differently-named fields holding the same string ─────────────────
    for (const row of await ctx.db.query("tasks").collect()) {
      if (row.project !== from) continue;
      bump("tasks");
      if (write) await ctx.db.patch(row._id, { project: to });
    }
    for (const row of await ctx.db.query("site_projects").collect()) {
      if (row.ventureId !== from) continue;
      bump("site_projects");
      if (write) await ctx.db.patch(row._id, { ventureId: to });
    }

    // ── Access grants: the one that silently breaks people ───────────────
    // A grant naming the old venture stops matching the registry, so the person
    // loses the venture without any error being raised anywhere.
    for (const user of await ctx.db.query("users").collect()) {
      const access = user.access;
      const roles = user.ventureRoles;
      const patch: Record<string, unknown> = {};

      if (access?.some((g) => g.venture === from)) {
        bump("users.access");
        patch.access = access.map((g) => (g.venture === from ? { ...g, venture: to } : g));
      }
      if (roles?.some((r) => r.venture === from)) {
        bump("users.ventureRoles");
        patch.ventureRoles = roles.map((r) => (r.venture === from ? { ...r, venture: to } : r));
      }
      if (write && Object.keys(patch).length > 0) await ctx.db.patch(user._id, patch);
    }

    // Pending invites carry grants too, and would otherwise apply a dead
    // venture on the invitee's first sign-in.
    for (const inv of await ctx.db.query("invites").collect()) {
      if (!inv.access?.some((g) => g.venture === from)) continue;
      bump("invites.access");
      if (write) {
        await ctx.db.patch(inv._id, {
          access: inv.access.map((g) => (g.venture === from ? { ...g, venture: to } : g)),
        });
      }
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { from, to, dryRun: Boolean(dryRun), total, counts };
  },
});

/**
 * The one walk that retags every row carrying an organization name.
 *
 * There used to be two near-identical copies of this — rename:venture and
 * migrations:renameScope — and they had already drifted: both were written
 * before plan_documents existed and neither covered it, so a rename silently
 * orphaned every uploaded raise plan. One walk, imported by both, is the fix.
 *
 * The name is a load-bearing string rather than an id. It is written into
 * pipeline records, tasks, positions, applications, chat history, plan
 * documents, site projects and — most consequentially — into users.access
 * grants. Renaming the registry alone orphans all of it: rows vanish because
 * their organization is no longer live, and anyone holding the old name
 * silently loses access.
 *
 * Idempotent: rows already carrying the new name are skipped, so a partial run
 * can simply be repeated. Counts are per table, so a run that misses something
 * is visible rather than silent.
 *
 * IF YOU ADD A TABLE THAT STORES AN ORGANIZATION NAME, ADD IT HERE.
 *
 * KNOWN GAP: plan_documents.venture is not covered, because that table only
 * exists on the unmerged feature/planning-plan-documents branch. Add it here
 * the moment that lands — its omission from the two older copies of this walk
 * is precisely the drift this file exists to stop.
 */

import type { MutationCtx } from "./_generated/server";

export interface RetagResult {
  from: string;
  to: string;
  dryRun: boolean;
  total: number;
  counts: Record<string, number>;
}

export async function retagScope(
  ctx: MutationCtx,
  from: string,
  to: string,
  opts: { dryRun?: boolean } = {},
): Promise<RetagResult> {
  if (!from || !to || from === to) {
    throw new Error("from and to must differ and be non-empty");
  }
  const write = !opts.dryRun;
  const counts: Record<string, number> = {};
  const bump = (k: string) => { counts[k] = (counts[k] ?? 0) + 1; };

  // Tables with a plain `venture: string`. Written out rather than looped over
  // a name array so each patch keeps its own row type — a generic loop needs a
  // cast, and a cast here would defeat the point of the exercise.
  for (const row of await ctx.db.query("leads").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("leads");
  }
  for (const row of await ctx.db.query("pipeline_orgs").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("pipeline_orgs");
  }
  for (const row of await ctx.db.query("positions").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("positions");
  }
  for (const row of await ctx.db.query("pipeline_stats").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("pipeline_stats");
  }
  for (const row of await ctx.db.query("ai_messages").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("ai_messages");
  }
  for (const row of await ctx.db.query("ai_day_summaries").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("ai_day_summaries");
  }

  // Same field, but optional.
  for (const row of await ctx.db.query("applications").collect()) {
    if (row.venture !== from) continue;
    if (write) await ctx.db.patch(row._id, { venture: to });
    bump("applications");
  }

  // Two tables name the field differently for historical reasons.
  for (const row of await ctx.db.query("tasks").collect()) {
    if (row.project !== from) continue;
    if (write) await ctx.db.patch(row._id, { project: to });
    bump("tasks");
  }
  for (const row of await ctx.db.query("site_projects").collect()) {
    if (row.ventureId !== from) continue;
    if (write) await ctx.db.patch(row._id, { ventureId: to });
    bump("site_projects");
  }

  // Permission grants and display roles, on users and on pending invites.
  // These matter most: miss them and the rename revokes access.
  for (const table of ["users", "invites"] as const) {
    for (const row of await ctx.db.query(table).collect()) {
      const access = row.access?.map((g) =>
        g.venture === from ? { ...g, venture: to } : g);
      const ventureRoles = row.ventureRoles?.map((r) =>
        r.venture === from ? { ...r, venture: to } : r);
      if (JSON.stringify(access) !== JSON.stringify(row.access)) {
        if (write) await ctx.db.patch(row._id, { access });
        bump(`${table}.access`);
      }
      if (JSON.stringify(ventureRoles) !== JSON.stringify(row.ventureRoles)) {
        if (write) await ctx.db.patch(row._id, { ventureRoles });
        bump(`${table}.ventureRoles`);
      }
    }
  }

  // The switcher's remembered selection, so a rename does not strand anyone
  // on an organization that no longer exists under that name.
  for (const row of await ctx.db.query("users").collect()) {
    if (row.activeVenture !== from) continue;
    if (write) await ctx.db.patch(row._id, { activeVenture: to });
    bump("users.activeVenture");
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { from, to, dryRun: !write, total, counts };
}

/**
 * Open roles and headcount plan.
 *
 * Migrated out of src/lib/people.ts, which held nine hardcoded literals with no
 * way to open a role, move it through hiring, or close it once someone was
 * hired. That file is now a seed source read once by seedFromStatic.
 *
 * Closing is a status change rather than a delete: a filled role records what
 * you hired for and when, which is the useful part of a headcount plan. `remove`
 * exists separately for a role raised in error.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUser } from "./team";

const type = v.union(
  v.literal("Full-time"),
  v.literal("Contract"),
  v.literal("Part-time"),
  v.literal("Advisory"),
);

const status = v.union(
  v.literal("open"),
  v.literal("hiring"),
  v.literal("filled"),
  v.literal("on-hold"),
  v.literal("closed"),
);

const priority = v.union(v.literal("critical"), v.literal("high"), v.literal("medium"));

/** Roles still being worked. `filled` and `closed` are archive states. */
const ACTIVE = new Set(["open", "hiring", "on-hold"]);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const rows = await ctx.db.query("positions").collect();
    // Active roles first, then by priority — the page is a hiring worklist,
    // so what still needs doing belongs at the top.
    const rank = { critical: 0, high: 1, medium: 2 } as const;
    return rows.sort((a, b) => {
      const activeDiff = Number(ACTIVE.has(b.status)) - Number(ACTIVE.has(a.status));
      if (activeDiff !== 0) return activeDiff;
      return rank[a.priority] - rank[b.priority] || a.createdAt - b.createdAt;
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    department: v.optional(v.string()),
    venture: v.string(),
    type: v.optional(type),
    priority: v.optional(priority),
    targetStart: v.optional(v.string()),
    location: v.optional(v.string()),
    keySkills: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const title = args.title.trim();
    if (!title) throw new Error("Title is required");

    return await ctx.db.insert("positions", {
      title: title.slice(0, 200),
      department: args.department?.trim() || args.venture,
      venture: args.venture,
      type: args.type ?? "Full-time",
      status: "open",
      priority: args.priority ?? "medium",
      targetStart: args.targetStart?.trim() || undefined,
      location: args.location?.trim() || undefined,
      keySkills: (args.keySkills ?? []).map((s) => s.trim()).filter(Boolean),
      notes: args.notes?.trim() || undefined,
      createdAt: Date.now(),
    });
  },
});

/**
 * Move a role through the pipeline. Passing `filled` stamps who was hired and
 * when, so the archive answers "what did we hire for last year" rather than
 * just showing a greyed-out row.
 */
export const setStatus = mutation({
  args: { id: v.id("positions"), status, hiredName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const filling = args.status === "filled";
    await ctx.db.patch(args.id, {
      status: args.status,
      hiredName: filling ? args.hiredName?.trim() || undefined : undefined,
      filledAt: filling ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("positions"),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    venture: v.optional(v.string()),
    type: v.optional(type),
    priority: v.optional(priority),
    targetStart: v.optional(v.string()),
    location: v.optional(v.string()),
    keySkills: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(fields)) {
      if (val === undefined) continue;
      if (k === "title") {
        const t = String(val).trim();
        if (!t) throw new Error("Title cannot be empty");
        patch.title = t.slice(0, 200);
      } else {
        patch[k] = val;
      }
    }
    await ctx.db.patch(id, patch);
  },
});

/** Delete outright. For a role raised in error — closing a filled one is setStatus. */
export const remove = mutation({
  args: { id: v.id("positions") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.delete(args.id);
  },
});

/** One-time seed from src/lib/people.ts. Idempotent on seedId. */
export const seedFromStatic = internalMutation({
  args: {
    rows: v.array(
      v.object({
        seedId: v.string(),
        title: v.string(),
        department: v.string(),
        venture: v.string(),
        type,
        status,
        priority,
        targetStart: v.optional(v.string()),
        location: v.optional(v.string()),
        keySkills: v.array(v.string()),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let created = 0;
    let skipped = 0;
    for (const r of args.rows) {
      const existing = await ctx.db
        .query("positions")
        .withIndex("by_seedId", (q) => q.eq("seedId", r.seedId))
        .unique();
      if (existing) {
        skipped++;
        continue;
      }
      await ctx.db.insert("positions", { ...r, createdAt: Date.now() });
      created++;
    }
    return { created, skipped };
  },
});

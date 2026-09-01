/**
 * Tasks, and the Today list.
 *
 * Tasks used to be 87 hardcoded literals in src/lib/tasks.ts with no way to
 * create, edit or complete anything. They now live in the `tasks` table; that
 * file is a seed source read once by seedFromStatic().
 *
 * Tasks carry no date field, so "today" is not derivable from them. You pick
 * what you are working on by clicking, and that choice lives in task_today.
 *
 * The list clears itself. Rows are keyed by an IST calendar date, so tomorrow's
 * query does not match today's rows — no cleanup job to run or forget. IST
 * rather than UTC because a UTC boundary rolls the day at 05:30 local and would
 * split a Mangaluru morning in two; see istDay() in aichat.ts.
 *
 * Private per user, like ai_messages. There is no way to read someone else's
 * day, admin or not.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUser } from "./team";
import { istDay } from "./aichat";

// ─── TASKS ────────────────────────────────────────────────────────────────────

const priority = v.union(v.literal("high"), v.literal("medium"), v.literal("low"));
const status = v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done"));

/** Every task, newest first within a project. Filtering happens client-side. */
export const list = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const rows = args.project
      ? await ctx.db
          .query("tasks")
          .withIndex("by_project", (q) => q.eq("project", args.project!))
          .collect()
      : await ctx.db.query("tasks").collect();

    // in-progress, then todo, then done — the order every task surface uses.
    const rank = { "in-progress": 0, todo: 1, done: 2 } as const;
    return rows.sort(
      (a, b) => rank[a.status] - rank[b.status] || a.createdAt - b.createdAt,
    );
  },
});

/**
 * One task by Convex id, or by its original seedId ('r01', 'h07', …).
 *
 * Accepting both keeps links minted before the migration working — the task
 * detail route and anything bookmarked still resolve.
 */
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const bySeed = await ctx.db
      .query("tasks")
      .withIndex("by_seedId", (q) => q.eq("seedId", args.key))
      .unique();
    if (bySeed) return bySeed;

    // Not a seedId — try it as a document id. normalizeId returns null rather
    // than throwing on a malformed string, so a bad URL 404s instead of erroring.
    const id = ctx.db.normalizeId("tasks", args.key);
    return id ? await ctx.db.get(id) : null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    project: v.string(),
    category: v.optional(v.string()),
    priority: v.optional(priority),
    status: v.optional(status),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const title = args.title.trim();
    if (!title) throw new Error("Title is required");

    return await ctx.db.insert("tasks", {
      title: title.slice(0, 500),
      project: args.project,
      category: args.category?.trim() || "General",
      priority: args.priority ?? "medium",
      status: args.status ?? "todo",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    project: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(priority),
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
        patch.title = t.slice(0, 500);
      } else {
        patch[k] = val;
      }
    }
    await ctx.db.patch(id, patch);
  },
});

/** Separate from update because this is the one that gets called constantly. */
export const setStatus = mutation({
  args: { id: v.id("tasks"), status },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
      // Kept so "done today" is answerable later without a separate log.
      completedAt: args.status === "done" ? Date.now() : undefined,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const task = await ctx.db.get(args.id);
    if (!task) return;

    // Cascade: a deleted task must not linger on anyone's Today list.
    const todayRows = await ctx.db
      .query("task_today")
      .filter((q) => q.eq(q.field("taskId"), args.id as string))
      .collect();
    for (const r of todayRows) await ctx.db.delete(r._id);

    await ctx.db.delete(args.id);
  },
});

/**
 * One-time seed from the 87 literals in src/lib/tasks.ts.
 *
 * Idempotent: a task whose seedId is already present is skipped, so re-running
 * after a partial batch is safe. Run from the CLI with the rows passed in,
 * since Convex functions cannot import from src/lib.
 */
export const seedFromStatic = internalMutation({
  args: {
    rows: v.array(
      v.object({
        seedId: v.string(),
        title: v.string(),
        project: v.string(),
        category: v.string(),
        priority,
        status,
      }),
    ),
  },
  handler: async (ctx, args) => {
    let created = 0;
    let skipped = 0;
    for (const r of args.rows) {
      const existing = await ctx.db
        .query("tasks")
        .withIndex("by_seedId", (q) => q.eq("seedId", r.seedId))
        .unique();
      if (existing) {
        skipped++;
        continue;
      }
      await ctx.db.insert("tasks", { ...r, createdAt: Date.now() });
      created++;
    }
    return { created, skipped };
  },
});

// ─── TODAY LIST ───────────────────────────────────────────────────────────────

/** Task ids the caller has put on today. Order is not meaningful. */
export const today = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const rows = await ctx.db
      .query("task_today")
      .withIndex("by_user_day", (q) =>
        q.eq("userId", userId).eq("day", istDay(Date.now())),
      )
      .collect();
    return rows.map((r) => r.taskId);
  },
});

/**
 * Put a task on today, or take it off. Returns the resulting state so the UI
 * can confirm rather than assume.
 */
export const toggle = mutation({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const day = istDay(Date.now());

    const existing = await ctx.db
      .query("task_today")
      .withIndex("by_user_day_task", (q) =>
        q.eq("userId", user._id).eq("day", day).eq("taskId", args.taskId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { onToday: false };
    }

    await ctx.db.insert("task_today", {
      userId: user._id,
      taskId: args.taskId,
      day,
      createdAt: Date.now(),
    });
    return { onToday: true };
  },
});

/** Empty today and start over. Leaves other days alone — not that they are read. */
export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await ctx.db
      .query("task_today")
      .withIndex("by_user_day", (q) =>
        q.eq("userId", user._id).eq("day", istDay(Date.now())),
      )
      .collect();
    for (const r of rows) await ctx.db.delete(r._id);
    return rows.length;
  },
});

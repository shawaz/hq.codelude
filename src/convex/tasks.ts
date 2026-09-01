/**
 * The Today list.
 *
 * The 87 tasks in src/lib/tasks.ts are static seed data with no date field, so
 * "today's tasks" cannot be derived from them. Instead you pick what you are
 * working on by clicking, and that choice lives here.
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
import { mutation, query } from "./_generated/server";
import { requireUser } from "./team";
import { istDay } from "./aichat";

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

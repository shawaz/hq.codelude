/**
 * Conversation history for the dashboard AI assistant.
 *
 * One day of live conversation per (user, venture); when the day rolls over,
 * it is summarised and the summary becomes the default view, with the full
 * transcript one click away.
 *
 * Private by design. A person's chat with the assistant is their working notes,
 * so every function here is scoped to the caller's own userId — there is no
 * way to read someone else's, admin or not. Venture access is still checked on
 * top of that, so a member who loses access to a venture also loses its history.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { requireUser } from "./team";
import { venturesForUser } from "./access";

type AnyCtx = QueryCtx | MutationCtx;

/**
 * The IST calendar date for an instant.
 *
 * Deliberately not UTC: the founder works in Mangaluru, and a UTC day boundary
 * would end the day at 05:30 local — cutting a morning's conversation in two
 * and summarising half of it.
 */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function istDay(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

async function requireVenture(ctx: AnyCtx, venture: string): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (!venturesForUser(user).includes(venture)) {
    throw new Error(`No access to ${venture}`);
  }
  return user;
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/** Today's conversation, oldest first. This is what the chat panel renders. */
export const today = query({
  args: { venture: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get(userId);
    if (!user || !venturesForUser(user).includes(args.venture)) return [];

    const day = istDay(Date.now());
    const rows = await ctx.db
      .query("ai_messages")
      .withIndex("by_user_venture_day", (q) =>
        q.eq("userId", userId).eq("venture", args.venture).eq("day", day),
      )
      .collect();
    return rows
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt }));
  },
});

/**
 * Past days, newest first: the summary if one exists, otherwise the day is
 * listed as pending so the UI can show it is still being rolled up.
 */
export const history = query({
  args: { venture: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get(userId);
    if (!user || !venturesForUser(user).includes(args.venture)) return [];

    const todayKey = istDay(Date.now());

    const summaries = await ctx.db
      .query("ai_day_summaries")
      .withIndex("by_user_venture", (q) =>
        q.eq("userId", userId).eq("venture", args.venture),
      )
      .collect();
    const byDay = new Map(summaries.map((s) => [s.day, s]));

    // Days that have messages tell us what exists; summaries fill in the text.
    const messages = await ctx.db
      .query("ai_messages")
      .withIndex("by_user_venture", (q) =>
        q.eq("userId", userId).eq("venture", args.venture),
      )
      .collect();

    const counts = new Map<string, number>();
    for (const m of messages) {
      if (m.day === todayKey) continue; // today is live, not history
      counts.set(m.day, (counts.get(m.day) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, args.limit ?? 30)
      .map(([day, messageCount]) => ({
        day,
        messageCount,
        summary: byDay.get(day)?.summary ?? null,
      }));
  },
});

/** Full transcript for one past day — the expand action in the history rail. */
export const dayMessages = query({
  args: { venture: v.string(), day: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get(userId);
    if (!user || !venturesForUser(user).includes(args.venture)) return [];

    const rows = await ctx.db
      .query("ai_messages")
      .withIndex("by_user_venture_day", (q) =>
        q.eq("userId", userId).eq("venture", args.venture).eq("day", args.day),
      )
      .collect();
    return rows
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt }));
  },
});

/**
 * The oldest past day that has messages but no summary yet, or null.
 *
 * The client calls this on load and, if it gets a day back, asks the summarise
 * endpoint to roll it up. Doing it lazily on next visit rather than on a cron
 * means no scheduled job to operate, and the summary is ready by the time
 * anyone looks at the history rail.
 */
export const pendingSummary = query({
  args: { venture: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user || !venturesForUser(user).includes(args.venture)) return null;

    const todayKey = istDay(Date.now());

    const summarised = new Set(
      (
        await ctx.db
          .query("ai_day_summaries")
          .withIndex("by_user_venture", (q) =>
            q.eq("userId", userId).eq("venture", args.venture),
          )
          .collect()
      ).map((s) => s.day),
    );

    const messages = await ctx.db
      .query("ai_messages")
      .withIndex("by_user_venture", (q) =>
        q.eq("userId", userId).eq("venture", args.venture),
      )
      .collect();

    const days = [
      ...new Set(messages.map((m) => m.day).filter((d) => d !== todayKey)),
    ]
      .filter((d) => !summarised.has(d))
      .sort();

    return days[0] ?? null;
  },
});

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

/** Append one message. Called for the user's turn and again for the reply. */
export const append = mutation({
  args: {
    venture: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireVenture(ctx, args.venture);
    const content = args.content.trim();
    if (!content) return null;

    const now = Date.now();
    return await ctx.db.insert("ai_messages", {
      userId: user._id,
      venture: args.venture,
      day: istDay(now),
      role: args.role,
      content: content.slice(0, 100_000),
      createdAt: now,
    });
  },
});

/**
 * Store a day's summary. Upserts, so a re-run after a failed summarisation
 * replaces rather than duplicating.
 */
export const saveSummary = mutation({
  args: {
    venture: v.string(),
    day: v.string(),
    summary: v.string(),
    messageCount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireVenture(ctx, args.venture);

    const existing = await ctx.db
      .query("ai_day_summaries")
      .withIndex("by_user_venture_day", (q) =>
        q.eq("userId", user._id).eq("venture", args.venture).eq("day", args.day),
      )
      .unique();

    const record = {
      userId: user._id,
      venture: args.venture,
      day: args.day,
      summary: args.summary.trim().slice(0, 20_000),
      messageCount: args.messageCount,
      createdAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
      return existing._id;
    }
    return await ctx.db.insert("ai_day_summaries", record);
  },
});

/** Wipe today's conversation and start fresh. Does not touch past days. */
export const clearToday = mutation({
  args: { venture: v.string() },
  handler: async (ctx, args) => {
    const user = await requireVenture(ctx, args.venture);
    const day = istDay(Date.now());
    const rows = await ctx.db
      .query("ai_messages")
      .withIndex("by_user_venture_day", (q) =>
        q.eq("userId", user._id).eq("venture", args.venture).eq("day", day),
      )
      .collect();
    for (const r of rows) await ctx.db.delete(r._id);
    return rows.length;
  },
});

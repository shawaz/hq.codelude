import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { can, isActiveScope } from "./access";
import { liveScopeNames } from "./scopes";
import { assertAccess, requireUser } from "./team";

const platform = v.union(v.literal("Instagram"), v.literal("X"), v.literal("LinkedIn"));
const type = v.union(
  v.literal("Post"),
  v.literal("Thread"),
  v.literal("Carousel"),
  v.literal("Reel"),
  v.literal("Article"),
);
const status = v.union(
  v.literal("idea"),
  v.literal("draft"),
  v.literal("review"),
  v.literal("approved"),
  v.literal("scheduled"),
  v.literal("publishing"),
  v.literal("published"),
  v.literal("failed"),
  v.literal("archived"),
);

export const list = query({
  args: { venture: v.string() },
  handler: async (ctx, { venture }) => {
    const user = await requireUser(ctx).catch(() => null);
    const live = await liveScopeNames(ctx);
    if (!user || !isActiveScope(venture, live) || !can(user, venture, "content", live)) return [];
    const rows = await ctx.db.query("content_items").withIndex("by_venture", (q) => q.eq("venture", venture)).collect();
    return rows.sort((a, b) => (a.scheduledAt ?? Number.MAX_SAFE_INTEGER) - (b.scheduledAt ?? Number.MAX_SAFE_INTEGER) || b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    venture: v.string(), account: v.string(), platform, type, status: v.optional(status),
    title: v.string(), body: v.string(), mediaUrl: v.optional(v.string()),
    scheduledAt: v.optional(v.number()), owner: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await assertAccess(ctx, args.venture, "content");
    const title = args.title.trim();
    const body = args.body.trim();
    if (!title) throw new Error("Title is required");
    if (!body) throw new Error("Content body is required");
    if (args.status === "scheduled" && !args.scheduledAt) throw new Error("Scheduled content needs a date and time");
    const now = Date.now();
    return await ctx.db.insert("content_items", {
      ...args,
      status: args.status ?? "draft",
      title: title.slice(0, 300),
      body: body.slice(0, 20_000),
      account: args.account.trim().slice(0, 200),
      owner: args.owner.trim().slice(0, 100),
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("content_items"), account: v.optional(v.string()), platform: v.optional(platform),
    type: v.optional(type), title: v.optional(v.string()), body: v.optional(v.string()),
    mediaUrl: v.optional(v.string()), scheduledAt: v.optional(v.number()), owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Content item not found");
    await assertAccess(ctx, row.venture, "content");
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(args)) {
      if (key === "id" || value === undefined) continue;
      if ((key === "title" || key === "body") && !String(value).trim()) throw new Error(`${key} cannot be empty`);
      patch[key] = key === "title" ? String(value).trim().slice(0, 300) : key === "body" ? String(value).trim().slice(0, 20_000) : value;
    }
    await ctx.db.patch(args.id, patch);
  },
});

export const setStatus = mutation({
  args: { id: v.id("content_items"), status, scheduledAt: v.optional(v.number()) },
  handler: async (ctx, { id, status: nextStatus, scheduledAt }) => {
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Content item not found");
    const user = await assertAccess(ctx, row.venture, "content");
    if (nextStatus === "approved" || nextStatus === "scheduled") {
      if (nextStatus === "scheduled" && !(scheduledAt ?? row.scheduledAt)) throw new Error("Scheduled content needs a date and time");
      await ctx.db.patch(id, { status: nextStatus, scheduledAt: scheduledAt ?? row.scheduledAt, approvedBy: user._id, approvedAt: Date.now(), updatedAt: Date.now() });
      return;
    }
    await ctx.db.patch(id, { status: nextStatus, updatedAt: Date.now(), ...(nextStatus === "published" ? { publishedAt: Date.now() } : {}) });
  },
});

export const recordPublishResult = mutation({
  args: { id: v.id("content_items"), success: v.boolean(), publishedUrl: v.optional(v.string()), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Content item not found");
    await assertAccess(ctx, row.venture, "content");
    await ctx.db.patch(args.id, args.success
      ? { status: "published", publishedAt: Date.now(), publishedUrl: args.publishedUrl, publishError: undefined, updatedAt: Date.now() }
      : { status: "failed", publishError: args.error?.slice(0, 2_000) || "Publishing failed", updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("content_items") },
  handler: async (ctx, { id }) => {
    const row = await ctx.db.get(id);
    if (!row) return;
    await assertAccess(ctx, row.venture, "content");
    await ctx.db.delete(id);
  },
});

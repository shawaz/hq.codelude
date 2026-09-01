/**
 * Office locations.
 *
 * Migrated out of src/lib/ops.ts for the same reason tasks and positions were:
 * hardcoded literals with no way to add a location.
 *
 * Open roles are deliberately not stored here. They are derived on the page by
 * matching a position's location against the office city, so a role opened on
 * the Positions page appears against its office without anything being kept in
 * sync by hand.
 *
 * Headcount is a stored number rather than a derived one. The users table
 * carries no location field, so team size per office cannot be counted the way
 * open roles can — see the note on the schema.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUser } from "./team";

const type = v.union(
  v.literal("Registered"),
  v.literal("Engineering"),
  v.literal("Remote"),
  v.literal("Server"),
);

const status = v.union(v.literal("active"), v.literal("planned"), v.literal("virtual"));

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db.query("offices").collect();
    // Active first — a planned office is a note, an active one is a place.
    const rank = { active: 0, planned: 1, virtual: 2 } as const;
    return rows.sort((a, b) => rank[a.status] - rank[b.status] || a.createdAt - b.createdAt);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.optional(type),
    city: v.string(),
    country: v.optional(v.string()),
    status: v.optional(status),
    purpose: v.optional(v.string()),
    notes: v.optional(v.string()),
    headcount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const name = args.name.trim();
    const city = args.city.trim();
    if (!name) throw new Error("Office name is required");
    if (!city) throw new Error("City is required — open roles are matched against it");

    return await ctx.db.insert("offices", {
      name: name.slice(0, 200),
      type: args.type ?? "Remote",
      city,
      country: args.country?.trim() || "India",
      status: args.status ?? "planned",
      purpose: args.purpose?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      headcount: args.headcount,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("offices"),
    name: v.optional(v.string()),
    type: v.optional(type),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    status: v.optional(status),
    purpose: v.optional(v.string()),
    notes: v.optional(v.string()),
    headcount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(fields)) {
      if (val === undefined) continue;
      if (k === "name" || k === "city") {
        const t = String(val).trim();
        if (!t) throw new Error(`${k} cannot be empty`);
        patch[k] = t;
      } else {
        patch[k] = val;
      }
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("offices") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.delete(args.id);
  },
});

/** One-time seed from src/lib/ops.ts. Idempotent on seedId. */
export const seedFromStatic = internalMutation({
  args: {
    rows: v.array(
      v.object({
        seedId: v.string(),
        name: v.string(),
        type,
        city: v.string(),
        country: v.string(),
        status,
        purpose: v.optional(v.string()),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let created = 0;
    let skipped = 0;
    for (const r of args.rows) {
      const existing = await ctx.db
        .query("offices")
        .withIndex("by_seedId", (q) => q.eq("seedId", r.seedId))
        .unique();
      if (existing) {
        skipped++;
        continue;
      }
      await ctx.db.insert("offices", { ...r, createdAt: Date.now() });
      created++;
    }
    return { created, skipped };
  },
});

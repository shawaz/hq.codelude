/**
 * The organization registry — what used to be the VENTURES literal in access.ts.
 *
 * This table decides which organization names are live. It is NOT a foreign-key
 * target: every other table stores the name as a plain string, and pipeline_orgs
 * embeds it in four indexes plus a search filter, so the name stays the key and
 * this list says which names still mean something.
 *
 * The static ALL_SCOPES in access.ts remains the fallback until seedFromRegistry
 * has run — see scopes.ts for why that matters on first deploy.
 */

import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  ALL_SCOPES,
  SCOPE_PALETTE,
  presetVentureLead,
  isUnrestricted,
} from "./access";
import { liveScopeNames } from "./scopes";
import { requireAdmin, requireUser } from "./team";
import { retagScope } from "./renameScope";

const MAX_NAME = 40;
const MAX_SECTOR = 60;

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/**
 * Every live organization, in registry order.
 *
 * Returns the static registry when the table is empty so the app keeps working
 * between deploy and seed. Not filtered by the caller's grants — the client
 * filters for display, and the Convex functions guard the data itself.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx).catch(() => null);
    if (!user) return [];

    const rows = await ctx.db.query("organizations").withIndex("by_order").collect();
    if (rows.length === 0) {
      return ALL_SCOPES.map((s, i) => ({
        name: s.name,
        color: s.color,
        sector: s.sector,
        holdco: s.holdco ?? false,
        order: i,
        archived: false,
      }));
    }
    return rows
      .filter((r) => !r.archived)
      .map((r) => ({
        name: r.name,
        color: r.color,
        sector: r.sector,
        holdco: r.holdco ?? false,
        order: r.order,
        archived: false,
      }));
  },
});

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

/**
 * Add an organization.
 *
 * Admin-only: a new organization widens the permission vocabulary, and every
 * grant made against it afterwards depends on the name being right.
 */
export const create = mutation({
  args: { name: v.string(), sector: v.string() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    const name = args.name.trim().slice(0, MAX_NAME);
    const sector = args.sector.trim().slice(0, MAX_SECTOR);
    if (!name) throw new Error("Name is required");
    if (!sector) throw new Error("Sector is required");

    // Case-insensitive, and against archived rows too: an archived name is
    // still carried by existing rows, so reusing it would silently adopt them.
    const existing = await ctx.db.query("organizations").collect();
    if (existing.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`An organization named "${name}" already exists`);
    }

    const order = existing.reduce((max, r) => Math.max(max, r.order), -1) + 1;

    // Allocate the first unused step on the ramp; wrap once exhausted rather
    // than inventing a hex that status-colors.ts cannot map to a theme token.
    const taken = new Set(existing.map((r) => r.color));
    const color =
      SCOPE_PALETTE.find((c) => !taken.has(c)) ??
      SCOPE_PALETTE[order % SCOPE_PALETTE.length];

    const id = await ctx.db.insert("organizations", {
      name, color, sector, order, createdAt: Date.now(),
    });

    // Access is assigned at user creation (see auth.ts), so an existing admin
    // holds nothing for a name that did not exist then. Unrestricted users need
    // no patch; everyone else would otherwise create an org they cannot open.
    if (!isUnrestricted(admin)) {
      const live = await liveScopeNames(ctx);
      const granted = presetVentureLead(name, live);
      await ctx.db.patch(admin._id, { access: [...(admin.access ?? []), ...granted] });
    }

    return id;
  },
});

/**
 * Rename, carrying every row that references the old name with it.
 *
 * internalMutation, not a UI button, on purpose. The walk collects
 * pipeline_orgs, which the schema warns is sized for bulk datasets and must
 * never be collected wholesale from a user-facing path. Run it from the CLI:
 *
 *   npx convex run organizations:rename '{"id":"...","name":"New","dryRun":true}'
 */
export const rename = internalMutation({
  args: { id: v.id("organizations"), name: v.string(), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) throw new Error("Organization not found");

    const name = args.name.trim().slice(0, MAX_NAME);
    if (!name) throw new Error("Name is required");
    if (name === org.name) return { renamed: 0 };

    const existing = await ctx.db.query("organizations").collect();
    if (existing.some((r) => r._id !== args.id && r.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`An organization named "${name}" already exists`);
    }

    // Renaming the registry row alone would orphan every row keyed by the old
    // name, so the data walk is part of the rename rather than a follow-up.
    if (!args.dryRun) await ctx.db.patch(args.id, { name });
    return await retagScope(ctx, org.name, name, { dryRun: args.dryRun });
  },
});

/**
 * Archive, rather than delete.
 *
 * Rows elsewhere still carry the name; absence from the live list is what makes
 * them invisible, and that is reversible.
 */
export const archive = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const org = await ctx.db.get(id);
    if (!org) throw new Error("Organization not found");
    if (org.holdco) throw new Error("The HoldCo cannot be archived");

    const live = await liveScopeNames(ctx);
    if (live.length <= 1) throw new Error("Cannot archive the last organization");

    await ctx.db.patch(id, { archived: true });
  },
});

export const unarchive = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { archived: false });
  },
});

// ─── SEED ─────────────────────────────────────────────────────────────────────

/**
 * Load the static registry into the table. Run once per deployment:
 *
 *   npx convex run organizations:seedFromRegistry
 *   npx convex run --prod organizations:seedFromRegistry
 *
 * Convex can import access.ts directly (same directory), so unlike the seeds in
 * scripts/ this needs no regex-parsing of a TypeScript literal. Idempotent —
 * existing names are left alone, including their colour and order.
 */
export const seedFromRegistry = internalMutation({
  args: {},
  handler: async (ctx) => {
    let created = 0;
    let skipped = 0;
    for (const [i, scope] of ALL_SCOPES.entries()) {
      const existing = await ctx.db
        .query("organizations")
        .withIndex("by_name", (q) => q.eq("name", scope.name))
        .unique();
      if (existing) { skipped++; continue; }
      await ctx.db.insert("organizations", {
        name: scope.name,
        color: scope.color,
        sector: scope.sector,
        holdco: scope.holdco,
        order: i,
        createdAt: Date.now(),
      });
      created++;
    }
    return { created, skipped };
  },
});

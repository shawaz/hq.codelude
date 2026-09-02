/**
 * People at a pipeline org.
 *
 * The funnel is company-first:
 *   prospect  the company itself, no contacts needed yet
 *   lead      the set of people you have found there
 *   deal      the negotiation, run through those people
 *   client    one of them promoted to primary — the main point of contact
 *
 * Access is always resolved from the org, never from a client-supplied venture:
 * a contact inherits whatever (venture, page) grant its org sits behind, so a
 * member who cannot open Nanotrade leads cannot read Nanotrade lead contacts either.
 */

import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { assertAccess, requireUser } from "./team";

/** Each pipeline stage renders its own dashboard page — that is the permission key. */
const STAGE_PAGE: Record<string, string> = {
  prospect: "prospects",
  lead: "leads",
  deal: "deals",
  client: "clients",
};

type AnyCtx = QueryCtx | MutationCtx;

/**
 * Load an org and check the caller may touch it. Returns the org so callers do
 * not fetch it twice.
 */
async function orgFor(
  ctx: AnyCtx,
  orgId: Id<"pipeline_orgs">,
): Promise<Doc<"pipeline_orgs">> {
  const org = await ctx.db.get(orgId);
  if (!org) throw new Error("Org not found");
  const page = STAGE_PAGE[org.stage];
  if (!page) throw new Error(`Unknown stage: ${org.stage}`);
  await assertAccess(ctx, org.venture, page);
  return org;
}

/** Primary first, then oldest first — a stable order for the UI. */
function ordered(rows: Doc<"pipeline_contacts">[]): Doc<"pipeline_contacts">[] {
  return [...rows].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.createdAt - b.createdAt;
  });
}

async function contactsOf(ctx: AnyCtx, orgId: Id<"pipeline_orgs">) {
  return await ctx.db
    .query("pipeline_contacts")
    .withIndex("by_org", (q) => q.eq("orgId", orgId))
    .collect();
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export const listForOrg = query({
  args: { orgId: v.id("pipeline_orgs") },
  handler: async (ctx, args) => {
    await orgFor(ctx, args.orgId);
    return ordered(await contactsOf(ctx, args.orgId));
  },
});

/**
 * Contacts for a page of orgs, keyed by org id. The board renders 50 rows at a
 * time; querying per row would be 50 round trips.
 */
export const listForOrgs = query({
  args: { orgIds: v.array(v.id("pipeline_orgs")) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (args.orgIds.length === 0) return {};

    const out: Record<string, Doc<"pipeline_contacts">[]> = {};
    for (const orgId of args.orgIds) {
      const org = await ctx.db.get(orgId);
      if (!org) continue;
      // Skip rather than throw: one stale id in the page should not blank the
      // whole board. Access is still checked per org.
      const page = STAGE_PAGE[org.stage];
      if (!page) continue;
      const allowed =
        user.role === "admin" ||
        user.access === undefined ||
        (user.access ?? []).some(
          (g) => g.venture === org.venture && g.pages.includes(page),
        );
      if (!allowed) continue;
      out[orgId] = ordered(await contactsOf(ctx, orgId));
    }
    return out;
  },
});

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

export const add = mutation({
  args: {
    orgId: v.id("pipeline_orgs"),
    name: v.string(),
    role: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    makePrimary: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await orgFor(ctx, args.orgId);

    const name = args.name.trim();
    if (!name) throw new Error("Contact name is required");

    const existing = await contactsOf(ctx, args.orgId);
    // First contact at an org is automatically the primary — otherwise a
    // one-contact client would have no main point of contact at all.
    const isPrimary = args.makePrimary === true || existing.length === 0;

    if (isPrimary) {
      for (const c of existing) {
        if (c.isPrimary) await ctx.db.patch(c._id, { isPrimary: false });
      }
    }

    return await ctx.db.insert("pipeline_contacts", {
      orgId: args.orgId,
      name,
      role: args.role?.trim() || undefined,
      email: args.email?.trim() || undefined,
      phone: args.phone?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      isPrimary,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    contactId: v.id("pipeline_contacts"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");
    await orgFor(ctx, contact.orgId);

    const { contactId, ...fields } = args;
    const patch: Record<string, string | number | undefined> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined) continue;
      const trimmed = value.trim();
      if (key === "name") {
        if (!trimmed) throw new Error("Contact name cannot be empty");
        patch.name = trimmed;
      } else {
        patch[key] = trimmed || undefined;
      }
    }
    await ctx.db.patch(contactId, patch);
  },
});

/**
 * Promote one contact to primary. This is what "client" means in the funnel —
 * the deal closed and this is who you deal with now.
 */
export const setPrimary = mutation({
  args: { contactId: v.id("pipeline_contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");
    await orgFor(ctx, contact.orgId);

    for (const c of await contactsOf(ctx, contact.orgId)) {
      if (c._id === args.contactId) continue;
      if (c.isPrimary) await ctx.db.patch(c._id, { isPrimary: false });
    }
    await ctx.db.patch(args.contactId, { isPrimary: true, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { contactId: v.id("pipeline_contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");
    await orgFor(ctx, contact.orgId);

    await ctx.db.delete(args.contactId);

    // Never leave an org with contacts but no primary.
    if (contact.isPrimary) {
      const rest = ordered(await contactsOf(ctx, contact.orgId));
      if (rest.length > 0) {
        await ctx.db.patch(rest[0]._id, { isPrimary: true, updatedAt: Date.now() });
      }
    }
  },
});

// ─── MIGRATION ────────────────────────────────────────────────────────────────

/**
 * Fold the legacy single-contact fields on pipeline_orgs into contact records.
 *
 * Idempotent: an org that already has contacts is skipped, so re-running after
 * a partial batch is safe. Internal — run from the CLI:
 *   npx convex run contacts:migrateLegacyContacts '{}'
 *
 * Returns a cursor when there is more to do; pass it back to continue. Batched
 * because a single mutation cannot walk an unbounded table.
 */
export const migrateLegacyContacts = internalMutation({
  args: { cursor: v.optional(v.string()), batchSize: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 200;
    const page = await ctx.db
      .query("pipeline_orgs")
      .paginate({ numItems: batchSize, cursor: args.cursor ?? null });

    let created = 0;
    let skipped = 0;

    for (const org of page.page) {
      const hasLegacy = Boolean(org.contactName || org.email || org.phone);
      if (!hasLegacy) {
        skipped++;
        continue;
      }
      const existing = await contactsOf(ctx, org._id);
      if (existing.length > 0) {
        skipped++;
        continue;
      }
      await ctx.db.insert("pipeline_contacts", {
        orgId: org._id,
        // Some rows carry an email but no name; the address is a better label
        // than an empty string.
        name: org.contactName?.trim() || org.email?.trim() || "Unnamed contact",
        email: org.email?.trim() || undefined,
        phone: org.phone?.trim() || undefined,
        isPrimary: true,
        createdAt: org.createdAt ?? Date.now(),
      });
      created++;
    }

    return {
      created,
      skipped,
      isDone: page.isDone,
      cursor: page.isDone ? null : page.continueCursor,
    };
  },
});

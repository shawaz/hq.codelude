/**
 * Raise plan documents, one set per venture, for Finance → Planning.
 *
 * The Planning page's structured sections (round structure, use of funds,
 * investor targets) are Roborns-only static data in the page file. Rather than
 * re-author all five sections in the UI for every venture, a venture's plan can
 * be attached here as the deck, model or memo it already exists as.
 *
 * Upload is the same three-step handshake applications.ts uses — the client
 * gets a URL, POSTs the bytes straight to it, then calls create() with the
 * returned id. The file never passes through a mutation, which is what keeps a
 * 20MB model from blowing the argument limit.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { can } from "./access";
import { assertAccess, requireUser } from "./team";

/** The page these documents hang off. Every check here uses it. */
const PAGE = "fundraise";

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/**
 * One venture's documents, newest first, each with a signed download URL.
 *
 * storage.getUrl is server-only and the URL is regenerated on every read, so a
 * link copied out of the page cannot outlive the record it points at.
 *
 * Returns [] rather than throwing when the caller lacks the grant: this drives
 * a tab that renders for every venture, and an empty list is the honest answer
 * for a venture they cannot see.
 */
export const list = query({
  args: { venture: v.string() },
  handler: async (ctx, { venture }) => {
    const user = await requireUser(ctx).catch(() => null);
    if (!user || !can(user, venture, PAGE)) return [];

    const rows = await ctx.db
      .query("plan_documents")
      .withIndex("by_venture", (q) => q.eq("venture", venture))
      .collect();
    rows.sort((a, b) => b.uploadedAt - a.uploadedAt);

    return await Promise.all(
      rows.map(async (r) => {
        const uploader = await ctx.db.get(r.uploadedBy);
        return {
          ...r,
          url: await ctx.storage.getUrl(r.storageId),
          uploaderName: uploader?.name ?? uploader?.email ?? "Unknown",
        };
      }),
    );
  },
});

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

/** Step 1 of the upload handshake. Short-lived, single-use. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Step 3 — record the uploaded file against a venture. */
export const create = mutation({
  args: {
    venture: v.string(),
    name: v.string(),
    storageId: v.id("_storage"),
    size: v.number(),
    contentType: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Asserted, not filtered: a write to a venture the caller cannot see is a
    // bug or an attack, and either way should fail loudly.
    const user = await assertAccess(ctx, args.venture, PAGE);
    return await ctx.db.insert("plan_documents", {
      ...args,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("plan_documents") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return;
    await assertAccess(ctx, doc.venture, PAGE);
    // Drop the bytes too — an orphaned file in storage is both a cost and a
    // copy of a raise plan nobody is tracking any more.
    await ctx.storage.delete(doc.storageId);
    await ctx.db.delete(id);
  },
});

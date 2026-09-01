/**
 * Candidate applications, with resume files.
 *
 * This is the first real file upload in the app. The existing task-file upload
 * writes to /home/centos/codelude/data/ via fs, which cannot work on Vercel —
 * this uses Convex storage instead so uploads survive a deploy.
 *
 * Upload is a three-step handshake, which is how Convex avoids proxying file
 * bytes through a mutation:
 *   1. client calls generateUploadUrl()
 *   2. client POSTs the file straight to that URL, getting back a storageId
 *   3. client calls create() / attachResume() with the storageId
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./team";

const status = v.union(
  v.literal("new"),
  v.literal("screening"),
  v.literal("interview"),
  v.literal("offer"),
  v.literal("hired"),
  v.literal("rejected"),
);

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/**
 * Every application, newest first, each with a signed URL for its resume.
 *
 * The URL is resolved here rather than client-side because storage.getUrl is
 * server-only — and it is regenerated on every read, so a stale link cannot
 * leak a resume after the record is deleted.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const rows = await ctx.db.query("applications").collect();
    rows.sort((a, b) => b.createdAt - a.createdAt);

    return await Promise.all(
      rows.map(async (r) => ({
        ...r,
        resumeUrl: r.resumeId ? await ctx.storage.getUrl(r.resumeId) : null,
      })),
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

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.string(),
    venture: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.optional(status),
    notes: v.optional(v.string()),
    resumeId: v.optional(v.id("_storage")),
    resumeName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const name = args.name.trim();
    if (!name) throw new Error("Candidate name is required");

    return await ctx.db.insert("applications", {
      name: name.slice(0, 200),
      email: args.email?.trim() || undefined,
      phone: args.phone?.trim() || undefined,
      position: args.position.trim() || "Unspecified",
      venture: args.venture,
      // LinkedIn is where the current backlog came from, so it is the default.
      source: args.source?.trim() || "LinkedIn",
      status: args.status ?? "new",
      notes: args.notes?.trim() || undefined,
      resumeId: args.resumeId,
      resumeName: args.resumeName,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("applications"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.optional(v.string()),
    venture: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.optional(status),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(fields)) {
      if (val === undefined) continue;
      if (k === "name") {
        const t = String(val).trim();
        if (!t) throw new Error("Candidate name cannot be empty");
        patch.name = t.slice(0, 200);
      } else {
        patch[k] = typeof val === "string" ? val.trim() || undefined : val;
      }
    }
    await ctx.db.patch(id, patch);
  },
});

/** Attach or replace a resume. Deletes the previous file rather than orphaning it. */
export const attachResume = mutation({
  args: {
    id: v.id("applications"),
    resumeId: v.id("_storage"),
    resumeName: v.string(),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");

    if (app.resumeId) await ctx.storage.delete(app.resumeId);
    await ctx.db.patch(args.id, {
      resumeId: args.resumeId,
      resumeName: args.resumeName,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const app = await ctx.db.get(args.id);
    if (!app) return;
    // Delete the file too — an orphaned resume in storage is both a cost and a
    // record of someone who asked to be removed.
    if (app.resumeId) await ctx.storage.delete(app.resumeId);
    await ctx.db.delete(args.id);
  },
});

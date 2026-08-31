import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
  ALL_SCOPE_NAMES,
  can,
  normalizeAccess,
  venturesForPage,
  venturesForUser,
  type Grant,
} from "./access";

// ─── SHARED GUARDS ────────────────────────────────────────────────────────────
// Imported by pipeline.ts. These are the checks that make the matrix real —
// the sidebar and venture strips only hide things.

type AnyCtx = QueryCtx | MutationCtx;

export async function requireUser(ctx: AnyCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireAdmin(ctx: AnyCtx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "admin") throw new Error("Admin access required");
  return user;
}

/**
 * Throw unless the caller holds a grant on (venture, page). Call this in every
 * Convex function that reads or writes venture-scoped data.
 */
export async function assertAccess(
  ctx: AnyCtx,
  venture: string,
  pageSlug: string,
): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (!can(user, venture, pageSlug)) {
    throw new Error(`No access to ${venture} · ${pageSlug}`);
  }
  return user;
}

/** Ventures the caller may see on a page — for functions that filter instead of assert. */
export async function scopesForPage(
  ctx: AnyCtx,
  pageSlug: string,
): Promise<string[]> {
  const user = await requireUser(ctx);
  return venturesForPage(user, pageSlug);
}

// ─── VALIDATORS ───────────────────────────────────────────────────────────────

const accessValidator = v.array(
  v.object({ venture: v.string(), pages: v.array(v.string()) }),
);

const ventureRolesValidator = v.array(
  v.object({ venture: v.string(), role: v.string() }),
);

/** Drop venture roles naming a scope that does not exist. */
function cleanVentureRoles(
  roles: { venture: string; role: string }[] | undefined,
): { venture: string; role: string }[] | undefined {
  if (!roles) return undefined;
  const cleaned = roles.filter(
    (r) => ALL_SCOPE_NAMES.includes(r.venture) && r.role.trim().length > 0,
  );
  return cleaned.length > 0 ? cleaned : undefined;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Admins are unrestricted by definition, so we store `undefined` rather than a
 * full matrix — otherwise their access would silently narrow the next time a
 * page is added to the registry.
 */
function accessForRole(role: "admin" | "member", access: Grant[]) {
  return role === "admin" ? undefined : normalizeAccess(access);
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? undefined,
      role: user.role ?? "member",
      title: user.title ?? undefined,
      // undefined here means unrestricted — do not coerce it to [], that would
      // lock every admin out of everything.
      access: user.access,
      ventureRoles: user.ventureRoles ?? [],
    };
  },
});

/**
 * Everyone on the team, plus not-yet-signed-in invites tagged `pending` so the
 * Team page can show someone the moment they are added.
 */
export const getTeam = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const viewer = await ctx.db.get(userId);
    if (!viewer) return [];

    const isAdmin = viewer.role === "admin";
    const myVentures = new Set(venturesForUser(viewer));

    /** Does this person share a venture with the viewer? */
    const shares = (access: Grant[] | undefined, role?: string) => {
      if (isAdmin) return true;
      if (role === "admin" || access === undefined) return true; // admins are visible to all
      return access.some(
        (g) => g.pages.length > 0 && myVentures.has(g.venture),
      );
    };

    const users = await ctx.db.query("users").collect();
    const members = users
      .filter((u) => u._id === userId || shares(u.access, u.role))
      .map((u) => ({
        _id: u._id as string,
        pending: false,
        name: u.name ?? "",
        email: u.email ?? "",
        image: u.image ?? undefined,
        role: u.role ?? "member",
        title: u.title ?? undefined,
        // Only admins (who can edit it) see anyone's full grant matrix. A
        // member gets just enough to render the roster for their own ventures.
        access: isAdmin || u._id === userId ? u.access : visibleGrants(u.access, myVentures),
        ventureRoles: u.ventureRoles ?? [],
      }));

    // Pending invites are an admin concern — they expose an address for an
    // account that does not exist yet.
    if (!isAdmin) return members;

    const invites = await ctx.db.query("invites").collect();
    const pending = invites.map((i) => ({
      _id: i._id as string,
      pending: true,
      name: i.name ?? "",
      email: i.email,
      image: undefined,
      role: i.role,
      title: i.title ?? undefined,
      access: i.access as Grant[] | undefined,
      ventureRoles: i.ventureRoles ?? [],
    }));

    return [...members, ...pending];
  },
});

/** Trim someone else's matrix to the ventures the viewer already knows about. */
function visibleGrants(
  access: Grant[] | undefined,
  myVentures: Set<string>,
): Grant[] | undefined {
  if (access === undefined) return undefined;
  return access.filter((g) => myVentures.has(g.venture));
}

// ─── MUTATIONS ────────────────────────────────────────────────────────────────

/**
 * Add a team member. Handles both paths in one call: if someone with that email
 * has already signed in, patch their user doc directly; otherwise stash an
 * invite for auth.ts to apply on their first sign-in.
 */
export const inviteMember = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    access: accessValidator,
    ventureRoles: v.optional(ventureRolesValidator),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);

    const email = normalizeEmail(args.email);
    if (!email.endsWith("@codelude.com")) {
      // Sign-in is domain-locked, so an invite to any other domain could never
      // be redeemed. Reject it here rather than leaving a dead row behind.
      throw new Error("Team members need a @codelude.com address");
    }

    const access = accessForRole(args.role, args.access);
    const ventureRoles = cleanVentureRoles(args.ventureRoles);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        role: args.role,
        title: args.title,
        access,
        ventureRoles,
      });
      return { status: "updated" as const, userId: existingUser._id };
    }

    const existingInvite = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const record = {
      email,
      name: args.name,
      title: args.title,
      role: args.role,
      access: normalizeAccess(args.access),
      ventureRoles,
      invitedBy: actor._id,
      createdAt: Date.now(),
    };

    if (existingInvite) {
      await ctx.db.patch(existingInvite._id, record);
      return { status: "invite-updated" as const, inviteId: existingInvite._id };
    }

    const inviteId = await ctx.db.insert("invites", record);
    return { status: "invited" as const, inviteId };
  },
});

/** Edit an existing member's title, role, access matrix or venture roles. */
export const updateMember = mutation({
  args: {
    userId: v.id("users"),
    title: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
    access: v.optional(accessValidator),
    ventureRoles: v.optional(ventureRolesValidator),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);

    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("No such member");

    const nextRole = args.role ?? target.role ?? "member";

    // Guard against an admin demoting themselves out of the last admin seat and
    // leaving nobody able to grant access to anyone.
    if (
      actor._id === args.userId &&
      target.role === "admin" &&
      nextRole !== "admin"
    ) {
      const admins = (await ctx.db.query("users").collect()).filter(
        (u) => u.role === "admin",
      );
      if (admins.length <= 1) {
        throw new Error("You are the only admin — promote someone else first");
      }
    }

    await ctx.db.patch(args.userId, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.role !== undefined ? { role: args.role } : {}),
      ...(args.access !== undefined
        ? { access: accessForRole(nextRole, args.access) }
        : {}),
      ...(args.ventureRoles !== undefined
        ? { ventureRoles: cleanVentureRoles(args.ventureRoles) }
        : {}),
    });
  },
});

/** Revoke a pending invite that has not been redeemed yet. */
export const revokeInvite = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.inviteId);
  },
});

/**
 * Strip a member of all access. Deliberately not a delete: removing the user
 * doc would orphan their Convex Auth session and account rows, and we want the
 * record of who had access to survive.
 */
export const removeMember = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    if (actor._id === args.userId) {
      throw new Error("You cannot remove your own access");
    }
    await ctx.db.patch(args.userId, {
      role: "member",
      access: [],
      ventureRoles: undefined,
    });
  },
});

/** Self-service display title. Unchanged — grants nothing. */
export const setTitle = mutation({
  args: { title: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.patch(user._id, { title: args.title });
  },
});

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, {
      role: args.role,
      // Promoting to admin must clear the matrix, or `access: []` would keep
      // them locked out despite the role.
      ...(args.role === "admin" ? { access: undefined } : {}),
    });
  },
});

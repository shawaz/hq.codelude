"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { api, internal } from "./_generated/api";

/**
 * Franchiseen, read and operated from hq.
 *
 * Franchiseen is a separate product on a separate Convex deployment with its own
 * Better Auth instance. Reaching it from the browser would mean a second sign-in
 * and a second trusted origin, so hq's server calls its bridge instead and the
 * UI only ever talks to hq.
 *
 * Nothing is copied into hq's tables. These are live reads — the cost is that
 * they are actions rather than queries, so a page loads them once rather than
 * subscribing. For an approvals queue a refresh is honest; a stale copy pretending
 * to be live would not be.
 */

const BRIDGE = process.env.FRANCHISEEN_API_URL;
const SECRET = process.env.HQ_SERVICE_SECRET;

/**
 * The acting team member travels with every call.
 *
 * Franchiseen attributes each approval to a person in its own audit log, and
 * refuses callers it cannot match to an operations profile. The shared secret
 * proves the request came from hq; it is not a licence to act as anyone.
 */
async function callBridge(
  ctx: ActionCtx,
  path: string,
  init?: { method: "POST"; body: unknown },
): Promise<unknown> {
  if (!BRIDGE || !SECRET) {
    throw new Error(
      "FRANCHISEEN_API_URL and HQ_SERVICE_SECRET must be set on this deployment",
    );
  }

  const me = await ctx.runQuery(api.team.getCurrentUser, {});
  if (me === null || me.email.length === 0) {
    throw new Error("Sign in to hq before using Franchiseen operations");
  }

  const response = await fetch(`${BRIDGE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "X-HQ-Actor": me.email,
      ...(init === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(init === undefined ? {} : { body: JSON.stringify(init.body) }),
  });

  const text = await response.text();
  if (!response.ok) {
    // Surface Franchiseen's own message. "shawaz@x is not a Franchiseen
    // operations user" tells you exactly what to fix; "request failed" does not.
    let detail = text.slice(0, 300);
    try {
      detail = (JSON.parse(text) as { error?: string }).error ?? detail;
    } catch {
      // Not JSON — the raw body is still the most useful thing to show.
    }
    throw new Error(`Franchiseen (${response.status}): ${detail}`);
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Franchiseen returned a response that was not JSON");
  }
}

/** Everything in Franchiseen waiting on a person: listings, identity, money. */
export const queue = action({
  args: {},
  handler: async (ctx): Promise<unknown> => await callBridge(ctx, "/api/hq/queue"),
});

/** Publish or turn back a listed brand, attributed to the hq user who did it. */
export const reviewBrand = action({
  args: {
    brandId: v.string(),
    approve: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<unknown> =>
    await callBridge(ctx, "/api/hq/review/brand", {
      method: "POST",
      body: { brandId: args.brandId, approve: args.approve, reason: args.reason },
    }),
});

type QueueBrand = {
  _id: string;
  name: string;
  category?: string | null;
  website?: string | null;
  ownerEmail?: string | null;
  description?: string | null;
  franchiseType?: string | null;
  isNationwide?: boolean;
  cities?: string[];
  minInvestment?: { amountMinor: number; currency: string } | null;
};

/**
 * Pull brands registering in the app into the Sales funnel as leads.
 *
 * A pull rather than a push: Franchiseen would otherwise need hq's address and
 * a credential, and a brand registration would depend on a second system being
 * reachable to succeed. Here the worst case is a stale list, fixed by running
 * it again.
 *
 * Re-running is safe — the upsert keys on the Franchiseen brand id — so this can
 * be a button now and a cron later without changing anything.
 */
export const syncLeads = action({
  args: {},
  handler: async (ctx): Promise<{ created: number; updated: number }> => {
    const queue = (await callBridge(ctx, "/api/hq/queue")) as { brands?: QueueBrand[] };
    const brands = queue.brands ?? [];

    let created = 0;
    let updated = 0;
    for (const b of brands) {
      const result = await ctx.runMutation(internal.pipeline.upsertFranchiseenBrand, {
        brandId: b._id,
        name: b.name,
        category: b.category ?? undefined,
        website: b.website ?? undefined,
        ownerEmail: b.ownerEmail ?? undefined,
        // Coverage, not an address: a nationwide brand has no one city, and
        // claiming the first of an empty list would invent one.
        city: b.isNationwide === false ? b.cities?.[0] : undefined,
        interest:
          [b.franchiseType, b.category].filter(Boolean).join(" · ") || undefined,
        value:
          b.minInvestment == null
            ? undefined
            : `${b.minInvestment.currency === "INR" ? "₹" : "AED "}${(
                b.minInvestment.amountMinor / 100
              ).toLocaleString("en-IN")} min.`,
        message: b.description ?? undefined,
      });
      if (result === "created") created += 1;
      else updated += 1;
    }
    return { created, updated };
  },
});

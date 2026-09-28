/**
 * AI agents, per venture.
 *
 * Migrated out of src/lib/agents.ts for the same reason tasks, positions and
 * offices were: hardcoded literals with no way to add one. The literals only
 * ever had a `Llife` key, so every other venture's Team page read "0 agents"
 * and the AI AGENTS tab was a dead end.
 *
 * Writes are admin-only, unlike positions and offices. An agent record names
 * the tools the runner may call on its behalf, so creating one widens what can
 * touch HQ data — the same reasoning organizations.ts gives for gating
 * organization creation. Reads follow the `users` page, which is where agents
 * are managed.
 *
 * Pausing is a status change, not a delete. `remove` exists for one created in
 * error, and refuses to strand a task that is assigned to it.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAdmin, requireUser } from "./team";

const provider = v.union(
  v.literal("gemini"),
  v.literal("opencode"),
  v.literal("deepseek"),
  v.literal("claude"),
);

const status = v.union(v.literal("active"), v.literal("paused"));

/** Every agent on a venture. Active first — a paused agent is a note. */
export const listByVenture = query({
  args: { venture: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db
      .query("agents")
      .withIndex("by_venture", (q) => q.eq("venture", args.venture))
      .collect();
    return rows.sort(
      (a, b) =>
        (a.status === "active" ? 0 : 1) - (b.status === "active" ? 0 : 1) ||
        a.createdAt - b.createdAt,
    );
  },
});

/**
 * One agent by id.
 *
 * Takes a plain string rather than v.id("agents") because the caller is
 * usually holding `tasks.assigneeId`, which is a string. normalizeId returns
 * null on a malformed value, so a legacy slug resolves to null rather than
 * throwing — see resolveAssignee below for the fallback.
 */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const id = ctx.db.normalizeId("agents", args.id);
    return id ? await ctx.db.get(id) : null;
  },
});

export const create = mutation({
  args: {
    venture: v.string(),
    name: v.string(),
    emoji: v.optional(v.string()),
    color: v.optional(v.string()),
    type: v.optional(v.string()),
    role: v.string(),
    provider: v.optional(provider),
    tools: v.optional(v.array(v.string())),
    tf: v.optional(v.array(v.string())),
    status: v.optional(status),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const name = args.name.trim();
    const role = args.role.trim();
    if (!name) throw new Error("Agent name is required");
    if (!role) throw new Error("A role is required — it becomes the agent's prompt");

    return await ctx.db.insert("agents", {
      venture: args.venture,
      name: name.slice(0, 120),
      emoji: args.emoji?.trim() || "🤖",
      color: args.color?.trim() || "#b5b5b5",
      type: args.type?.trim() || "Claude Agent",
      role: role.slice(0, 4000),
      provider: args.provider ?? "gemini",
      tools: args.tools ?? [],
      tf: args.tf ?? [],
      status: args.status ?? "active",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    emoji: v.optional(v.string()),
    color: v.optional(v.string()),
    type: v.optional(v.string()),
    role: v.optional(v.string()),
    provider: v.optional(provider),
    tools: v.optional(v.array(v.string())),
    tf: v.optional(v.array(v.string())),
    status: v.optional(status),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(fields)) {
      if (val === undefined) continue;
      if (k === "name" || k === "role") {
        const t = String(val).trim();
        if (!t) throw new Error(`${k} cannot be empty`);
        patch[k] = t;
      } else {
        patch[k] = val;
      }
    }
    await ctx.db.patch(id, patch);

    // A rename has to reach the tasks that denormalized the old one, or the
    // tasks table keeps showing a name that no longer exists anywhere.
    if (typeof patch.name === "string") {
      const assigned = await ctx.db
        .query("tasks")
        .withIndex("by_assignee", (q) => q.eq("assigneeId", id as string))
        .collect();
      for (const t of assigned) {
        await ctx.db.patch(t._id, { assigneeName: patch.name as string });
      }
    }
  },
});

export const setStatus = mutation({
  args: { id: v.id("agents"), status },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Deleting an agent that holds work would leave tasks pointing at nothing.
    // Pausing is the usual answer, so say that rather than cascading silently.
    const assigned = await ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q) => q.eq("assigneeId", args.id as string))
      .collect();
    if (assigned.length > 0) {
      throw new Error(
        `${assigned.length} task${assigned.length === 1 ? " is" : "s are"} assigned to this agent — reassign them, or pause it instead`,
      );
    }
    await ctx.db.delete(args.id);
  },
});

// ─── RUNS ─────────────────────────────────────────────────────────────────────

/**
 * Open a run record before the model is called.
 *
 * Written up front rather than on completion so a run that times out or throws
 * still leaves a row saying it started. `finish` closes it.
 */
export const startRun = mutation({
  args: {
    agentId: v.string(),
    agentName: v.string(),
    taskId: v.string(),
    taskTitle: v.string(),
    venture: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    return await ctx.db.insert("agent_runs", {
      ...args,
      userId: user._id,
      status: "running",
      toolCalls: [],
      startedAt: Date.now(),
    });
  },
});

export const finishRun = mutation({
  args: {
    id: v.id("agent_runs"),
    status: v.union(v.literal("done"), v.literal("error")),
    output: v.optional(v.string()),
    toolCalls: v.optional(v.array(v.string())),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      toolCalls: fields.toolCalls ?? [],
      finishedAt: Date.now(),
    });
  },
});

/** Runs against one task, newest first. Drives the "last run" line on the task. */
export const runsForTask = query({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db
      .query("agent_runs")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    return rows.sort((a, b) => b.startedAt - a.startedAt);
  },
});

// ─── MIGRATION ────────────────────────────────────────────────────────────────

/**
 * One-time seed from the literals in src/lib/agents.ts.
 *
 * Idempotent on seedId, like every other seed in this codebase, so a partial
 * batch is safe to re-run. Run from the CLI with the rows passed in, since
 * Convex functions cannot import from src/lib.
 */
export const seedFromStatic = internalMutation({
  args: {
    rows: v.array(
      v.object({
        seedId: v.string(),
        venture: v.string(),
        name: v.string(),
        emoji: v.string(),
        color: v.string(),
        type: v.string(),
        role: v.string(),
        provider,
        tools: v.array(v.string()),
        tf: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let created = 0;
    let skipped = 0;
    for (const r of args.rows) {
      const existing = await ctx.db
        .query("agents")
        .withIndex("by_seedId", (q) => q.eq("seedId", r.seedId))
        .unique();
      if (existing) {
        skipped++;
        continue;
      }
      await ctx.db.insert("agents", {
        ...r,
        status: "active",
        createdAt: Date.now(),
      });
      created++;
    }
    return { created, skipped };
  },
});

/**
 * Point tasks assigned to an agent at its document id.
 *
 * Assignment shipped storing a name slug, because agents were declared in code
 * and a slug was the only identity they had. Now that they are rows, the id is.
 * Matches on the stored assigneeName, which is the only thing the two forms
 * share. Reports what it could not match rather than failing.
 */
export const relinkAssignments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    const byName = new Map(agents.map((a) => [a.name.toLowerCase(), a]));

    let relinked = 0;
    const unmatched: string[] = [];
    for (const task of await ctx.db.query("tasks").collect()) {
      if (task.assigneeType !== "agent" || !task.assigneeId) continue;
      // Already a document id — nothing to do.
      if (ctx.db.normalizeId("agents", task.assigneeId)) continue;

      const agent = byName.get((task.assigneeName ?? "").toLowerCase());
      if (!agent) {
        unmatched.push(`${task.title} → ${task.assigneeName ?? task.assigneeId}`);
        continue;
      }
      await ctx.db.patch(task._id, {
        assigneeId: agent._id as string,
        assigneeName: agent.name,
        updatedAt: Date.now(),
      });
      relinked++;
    }
    return { relinked, unmatched };
  },
});

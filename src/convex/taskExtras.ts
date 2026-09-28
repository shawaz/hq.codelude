/**
 * Notes attached to a task.
 *
 * These used to live in a JSON file on local disk (src/lib/task-data.ts), read
 * and written through /api/tasks/[id]/notes. That cannot work on Vercel: the
 * filesystem is ephemeral, so every note written in production was lost on the
 * next deploy or cold start. The schema comment on `applications` already
 * called this out as the mistake not to repeat.
 *
 * The `task_extras` table had been declared for exactly this and then left
 * unused. This is the module that finally reads it.
 *
 * Files are still on the old route. Moving uploads needs Convex file storage
 * the way `applications.resumeId` does, which is its own piece of work — the
 * row keeps its `files` array so nothing has to change here when that lands.
 *
 * taskId is a plain string: it can be a Convex document id or one of the
 * original seed ids ('r01', 'h07'), the same as task_today.
 */

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { requireUser } from "./team";

/** The row for a task, or null if nothing has ever been attached to it. */
async function rowFor(ctx: QueryCtx, taskId: string) {
  return await ctx.db
    .query("task_extras")
    .withIndex("by_taskId", (q) => q.eq("taskId", taskId))
    .unique();
}

/** Notes on a task, newest first. */
export const notes = query({
  args: { taskId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const row = await rowFor(ctx, args.taskId);
    return row?.notes ?? [];
  },
});

export const addNote = mutation({
  args: { taskId: v.string(), text: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const text = args.text.trim();
    if (!text) throw new Error("Note text is required");

    const note = {
      // Convex ids are assigned per document, not per array element, so notes
      // carry their own id for deletion. Same shape the file-backed store used,
      // so anything reading a note does not have to change.
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      text: text.slice(0, 20_000),
      createdAt: new Date().toISOString(),
    };

    const row = await rowFor(ctx, args.taskId);
    if (row) {
      await ctx.db.patch(row._id, { notes: [note, ...row.notes] });
    } else {
      await ctx.db.insert("task_extras", {
        taskId: args.taskId,
        notes: [note],
        files: [],
      });
    }
    return note;
  },
});

export const deleteNote = mutation({
  args: { taskId: v.string(), noteId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const row = await rowFor(ctx, args.taskId);
    if (!row) return;
    await ctx.db.patch(row._id, {
      notes: row.notes.filter((n) => n.id !== args.noteId),
    });
  },
});

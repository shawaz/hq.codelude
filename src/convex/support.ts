import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { assertAccess, requireUser } from "./team";
import { scopesForPage } from "./team";

const statuses = ["new", "open", "waiting_on_user", "waiting_internal", "resolved", "closed"] as const;
const priorities = ["urgent", "high", "normal", "low"] as const;
const categories = ["account_security", "brand_listing", "property", "deal", "payment_documents", "technical_issue", "other"] as const;
const contextTypes = ["brand", "property", "deal", "account"] as const;
const articleCategories = ["Getting started", "Accounts & security", "Brands & listings", "Properties", "Deals", "Payments & documents", "Troubleshooting"] as const;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const now = () => Date.now();

function validTransition(from: typeof statuses[number], to: typeof statuses[number]) {
  if (from === to) return true;
  const allowed: Record<typeof statuses[number], readonly typeof statuses[number][]> = {
    new: ["open", "waiting_on_user", "waiting_internal", "resolved", "closed"],
    open: ["waiting_on_user", "waiting_internal", "resolved", "closed"],
    waiting_on_user: ["open", "waiting_internal", "resolved", "closed"],
    waiting_internal: ["open", "waiting_on_user", "resolved", "closed"],
    resolved: ["open", "closed"],
    closed: ["open"],
  };
  return allowed[from].includes(to);
}

async function assertTicketAccess(ctx: Parameters<typeof assertAccess>[0], venture: string) {
  return await assertAccess(ctx, venture, "tickets");
}

/** Live support queue. The venture is explicit so HQ grants remain scoped. */
export const listTickets = query({
  args: {
    venture: v.string(),
    status: v.optional(v.union(...statuses.map((x) => v.literal(x)) as [any, ...any[]])),
    priority: v.optional(v.union(...priorities.map((x) => v.literal(x)) as [any, ...any[]])),
    category: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await assertTicketAccess(ctx, args.venture);
    const all = await ctx.db.query("supportTickets").withIndex("by_venture_activity", (q) => q.eq("venture", args.venture)).order("desc").paginate(args.paginationOpts);
    const needle = args.search?.trim().toLowerCase();
    const page = all.page.filter((ticket) =>
      (!args.status || ticket.status === args.status) &&
      (!args.priority || ticket.priority === args.priority) &&
      (!args.category || ticket.category === args.category) &&
      (!args.assigneeId || ticket.assigneeId === args.assigneeId) &&
      (!needle || `${ticket.ticketNumber} ${ticket.subject} ${ticket.requesterEmail} ${ticket.requesterName ?? ""}`.toLowerCase().includes(needle)),
    );
    return { ...all, page };
  },
});

export const ticketSummary = query({
  args: { venture: v.string() },
  handler: async (ctx, { venture }) => {
    await assertTicketAccess(ctx, venture);
    const rows = await ctx.db.query("supportTickets").withIndex("by_venture_activity", (q) => q.eq("venture", venture)).take(1000);
    return {
      total: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      unassigned: rows.filter((r) => !r.assigneeId && r.status !== "closed" && r.status !== "resolved").length,
      urgent: rows.filter((r) => r.priority === "urgent" && r.status !== "closed" && r.status !== "resolved").length,
      open: rows.filter((r) => r.status !== "closed" && r.status !== "resolved").length,
    };
  },
});

export const ticketDetail = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, { ticketId }) => {
    const user = await requireUser(ctx);
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) return null;
    await assertTicketAccess(ctx, ticket.venture);
    const [messages, events, attachments, assignee] = await Promise.all([
      ctx.db.query("supportMessages").withIndex("by_ticket_time", (q) => q.eq("ticketId", ticketId)).collect(),
      ctx.db.query("supportEvents").withIndex("by_ticket_time", (q) => q.eq("ticketId", ticketId)).collect(),
      ctx.db.query("supportAttachments").withIndex("by_ticket", (q) => q.eq("ticketId", ticketId)).collect(),
      ticket.assigneeId ? ctx.db.get(ticket.assigneeId) : Promise.resolve(null),
    ]);
    return {
      ticket,
      messages,
      events,
      attachments: attachments.map(({ storageId: _storageId, ...attachment }) => attachment),
      assignee: assignee ? { name: assignee.name ?? assignee.email ?? "Team member", email: assignee.email ?? "" } : null,
      viewer: { email: user.email ?? "", isAdmin: user.role === "admin" },
    };
  },
});

export const setTicketState = mutation({
  args: { ticketId: v.id("supportTickets"), status: v.union(...statuses.map((x) => v.literal(x)) as [any, ...any[]]), expectedVersion: v.number(), resolutionSummary: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    const user = await assertTicketAccess(ctx, ticket.venture);
    if (ticket.version !== args.expectedVersion) throw new Error("This ticket changed. Refresh and try again.");
    if (!validTransition(ticket.status, args.status)) throw new Error(`Cannot move a ticket from ${ticket.status} to ${args.status}.`);
    const at = now();
    await ctx.db.patch(ticket._id, { status: args.status, resolutionSummary: args.resolutionSummary?.trim() || undefined, version: ticket.version + 1, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "agent", actorEmail: normalizeEmail(user.email ?? ""), kind: "status_changed", fromValue: ticket.status, toValue: args.status, detail: args.resolutionSummary, createdAt: at });
  },
});

export const setTicketPriority = mutation({
  args: { ticketId: v.id("supportTickets"), priority: v.union(...priorities.map((x) => v.literal(x)) as [any, ...any[]]), expectedVersion: v.number() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    const user = await assertTicketAccess(ctx, ticket.venture);
    if (ticket.version !== args.expectedVersion) throw new Error("This ticket changed. Refresh and try again.");
    const at = now();
    await ctx.db.patch(ticket._id, { priority: args.priority, version: ticket.version + 1, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "agent", actorEmail: normalizeEmail(user.email ?? ""), kind: "priority_changed", fromValue: ticket.priority, toValue: args.priority, createdAt: at });
  },
});

export const assignTicket = mutation({
  args: { ticketId: v.id("supportTickets"), assigneeId: v.optional(v.id("users")), expectedVersion: v.number() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    const user = await assertTicketAccess(ctx, ticket.venture);
    if (ticket.version !== args.expectedVersion) throw new Error("This ticket changed. Refresh and try again.");
    if (args.assigneeId) {
      const assignee = await ctx.db.get(args.assigneeId);
      if (!assignee) throw new Error("Assignee not found");
    }
    const at = now();
    await ctx.db.patch(ticket._id, { assigneeId: args.assigneeId, version: ticket.version + 1, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "agent", actorEmail: normalizeEmail(user.email ?? ""), kind: "assignment_changed", fromValue: ticket.assigneeId, toValue: args.assigneeId, createdAt: at });
  },
});

export const addAgentMessage = mutation({
  args: { ticketId: v.id("supportTickets"), body: v.string(), visibility: v.union(v.literal("requester"), v.literal("internal")), expectedVersion: v.number() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    const user = await assertTicketAccess(ctx, ticket.venture);
    const body = args.body.trim();
    if (!body || body.length > 10000) throw new Error("Message must contain 1–10,000 characters.");
    if (ticket.version !== args.expectedVersion) throw new Error("This ticket changed. Refresh and try again.");
    const at = now();
    await ctx.db.insert("supportMessages", { ticketId: ticket._id, authorType: "agent", authorEmail: normalizeEmail(user.email ?? ""), authorName: user.name, body, visibility: args.visibility, createdAt: at });
    await ctx.db.patch(ticket._id, { version: ticket.version + 1, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "agent", actorEmail: normalizeEmail(user.email ?? ""), kind: args.visibility === "internal" ? "internal_note_added" : "reply_sent", createdAt: at });
  },
});

export const listArticles = query({
  args: { venture: v.optional(v.string()), search: v.optional(v.string()), category: v.optional(v.string()), includeDrafts: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx).catch(() => null);
    const scopes = await scopesForPage(ctx, "helpdesk").catch(() => []);
    const allowed = !!user && args.includeDrafts === true && scopes.includes("Codelude");
    if (allowed) await assertAccessCompat(ctx, "Codelude");
    const rows = await ctx.db.query("supportArticles").collect();
    const needle = args.search?.trim().toLowerCase();
    return rows.filter((a) => (allowed || a.published) && (!args.category || a.category === args.category) && (!needle || `${a.title} ${a.body} ${a.category}`.toLowerCase().includes(needle)));
  },
});

// Keep article authorization explicit and attached to the page used in NAV.
async function assertAccessCompat(ctx: Parameters<typeof assertAccess>[0], venture: string) {
  await assertAccess(ctx, venture, "helpdesk");
}

export const saveArticle = mutation({
  args: { id: v.optional(v.id("supportArticles")), expectedRevision: v.optional(v.number()), title: v.string(), slug: v.string(), category: v.union(...articleCategories.map((x) => v.literal(x)) as [any, ...any[]]), audience: v.array(v.string()), language: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await assertAccess(ctx, "Codelude", "helpdesk");
    const title = args.title.trim();
    const slug = args.slug.trim().toLowerCase();
    const body = args.body.trim();
    if (title.length < 3 || title.length > 140 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || body.length < 20 || body.length > 30000 || !args.audience.length || !args.language.trim()) throw new Error("Complete the article title, slug, audience, language and body.");
    const duplicate = await ctx.db.query("supportArticles").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
    if (duplicate && duplicate._id !== args.id) throw new Error("That article URL is already in use.");
    const at = now();
    if (args.id) {
      const previous = await ctx.db.get(args.id);
      if (!previous) throw new Error("Article not found");
      if (previous.revision !== args.expectedRevision) throw new Error("This article changed. Refresh before saving.");
      await ctx.db.patch(previous._id, { title, slug, category: args.category, audience: args.audience, language: args.language.trim(), body, revision: previous.revision + 1, updatedAt: at });
      return previous._id;
    }
    return await ctx.db.insert("supportArticles", { title, slug, category: args.category, audience: args.audience, language: args.language.trim(), body, published: false, revision: 1, authorId: user._id, createdAt: at, updatedAt: at });
  },
});

export const setArticlePublished = mutation({
  args: { id: v.id("supportArticles"), published: v.boolean(), expectedRevision: v.number() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await assertAccess(ctx, "Codelude", "helpdesk");
    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article not found");
    if (article.revision !== args.expectedRevision) throw new Error("This article changed. Refresh before updating it.");
    const at = now();
    await ctx.db.patch(article._id, { published: args.published, revision: article.revision + 1, updatedAt: at });
    // Publishing is audited independently from edits.
    await ctx.db.insert("supportEvents", { articleId: article._id, actorType: "agent", actorEmail: normalizeEmail(user.email ?? ""), kind: args.published ? "article_published" : "article_unpublished", toValue: article.slug, createdAt: at });
  },
});

/** HQ staff directory limited to people who can sign in; used by assignment UI. */
export const listAssignees = query({
  args: { venture: v.string() },
  handler: async (ctx, { venture }) => {
    await assertTicketAccess(ctx, venture);
    return (await ctx.db.query("users").collect()).map((u) => ({ _id: u._id, name: u.name ?? u.email ?? "Team member", email: u.email ?? "" }));
  },
});

// Service-only operations are called by signed HTTP actions; no requester
// email arguments are exposed as public Convex functions.
export const createFromService = internalMutation({
  args: {
    requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen"), requesterSubject: v.optional(v.string()), requesterName: v.optional(v.string()),
    subject: v.string(), category: v.union(...categories.map((x) => v.literal(x)) as [any, ...any[]]), description: v.string(),
    contextType: v.optional(v.union(...contextTypes.map((x) => v.literal(x)) as [any, ...any[]])), contextId: v.optional(v.string()), contextLabel: v.optional(v.string()), requestId: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    if (!email || args.subject.trim().length < 2 || args.subject.length > 120 || args.description.trim().length < 10 || args.description.length > 10000) throw new Error("Invalid ticket request");
    const duplicate = await ctx.db.query("supportTickets").withIndex("by_idempotency", (q) => q.eq("requesterIssuer", args.requesterIssuer).eq("idempotencyKey", args.requestId)).first();
    if (duplicate) return { id: duplicate._id, ticketNumber: duplicate.ticketNumber, duplicate: true };
    const at = now();
    const ticketNumber = `FR-${new Date(at).toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const id = await ctx.db.insert("supportTickets", { venture: "Franchiseen", channel: "mobile", ticketNumber, requesterEmail: email, requesterIssuer: args.requesterIssuer, requesterSubject: args.requesterSubject, requesterName: args.requesterName, subject: args.subject.trim(), category: args.category, description: args.description.trim(), status: "new", priority: "normal", contextType: args.contextType, contextId: args.contextId, contextLabel: args.contextLabel, idempotencyKey: args.requestId, version: 1, createdAt: at, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: id, actorType: "requester", actorEmail: email, kind: "ticket_created", toValue: "new", createdAt: at, requestId: args.requestId });
    await ctx.db.insert("supportRequestIds", { requestId: args.requestId, operation: "create_ticket", resultId: String(id), createdAt: at });
    return { id, ticketNumber, duplicate: false };
  },
});

export const listMineFromService = internalQuery({
  args: { requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen") },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    const tickets = await ctx.db.query("supportTickets").withIndex("by_requester", (q) => q.eq("requesterIssuer", args.requesterIssuer).eq("requesterEmail", email)).collect();
    return tickets.sort((a, b) => b.lastActivityAt - a.lastActivityAt).map(({ requesterSubject: _subject, idempotencyKey: _key, ...ticket }) => ticket);
  },
});

export const detailMineFromService = internalQuery({
  args: { ticketId: v.id("supportTickets"), requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.requesterIssuer !== args.requesterIssuer || ticket.requesterEmail !== normalizeEmail(args.requesterEmail)) return null;
    const [messages, attachments] = await Promise.all([
      ctx.db.query("supportMessages").withIndex("by_ticket_time", (q) => q.eq("ticketId", ticket._id)).collect(),
      ctx.db.query("supportAttachments").withIndex("by_ticket", (q) => q.eq("ticketId", ticket._id)).collect(),
    ]);
    return {
      ticket: { ticketNumber: ticket.ticketNumber, subject: ticket.subject, category: ticket.category, status: ticket.status, priority: ticket.priority, description: ticket.description, createdAt: ticket.createdAt, updatedAt: ticket.updatedAt, contextType: ticket.contextType, contextId: ticket.contextId, contextLabel: ticket.contextLabel },
      messages: messages.filter((m) => m.visibility === "requester").map(({ attachmentIds: _ids, ...m }) => m),
      attachments: attachments.map(({ storageId: _storageId, ...a }) => a),
    };
  },
});

export const replyFromService = internalMutation({
  args: { ticketId: v.id("supportTickets"), requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen"), body: v.string(), requestId: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.requesterIssuer !== args.requesterIssuer || ticket.requesterEmail !== email) throw new Error("Ticket not found");
    if (await ctx.db.query("supportMessages").withIndex("by_request_id", (q) => q.eq("requestId", args.requestId)).first()) return { duplicate: true };
    const body = args.body.trim();
    if (!body || body.length > 10000) throw new Error("Reply must contain 1–10,000 characters.");
    const at = now();
    await ctx.db.insert("supportMessages", { ticketId: ticket._id, authorType: "requester", authorEmail: email, body, visibility: "requester", createdAt: at, requestId: args.requestId });
    const status = ticket.status === "resolved" || ticket.status === "closed" || ticket.status === "waiting_on_user" ? "open" : ticket.status;
    await ctx.db.patch(ticket._id, { status, version: ticket.version + 1, updatedAt: at, lastActivityAt: at });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "requester", actorEmail: email, kind: "requester_reply", fromValue: ticket.status, toValue: status, createdAt: at, requestId: args.requestId });
    return { duplicate: false };
  },
});

export const publishedArticlesFromService = internalQuery({
  args: { search: v.optional(v.string()), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("supportArticles").withIndex("by_published_category", (q) => q.eq("published", true)).collect();
    const needle = args.search?.trim().toLowerCase();
    return rows.filter((a) => (!args.category || args.category === a.category) && (!needle || `${a.title} ${a.body} ${a.category}`.toLowerCase().includes(needle))).map(({ authorId: _author, ...article }) => article);
  },
});

const allowedUploadTypes = ["image/jpeg", "image/png", "application/pdf"] as const;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const createUploadGrantFromService = internalMutation({
  args: {
    ticketId: v.id("supportTickets"), requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen"),
    tokenHash: v.string(), name: v.string(), size: v.number(), contentType: v.string(),
    requestId: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.requesterIssuer !== args.requesterIssuer || ticket.requesterEmail !== email) throw new Error("Ticket not found");
    if (!args.name.trim() || args.name.length > 180 || args.size <= 0 || args.size > MAX_UPLOAD_BYTES || !allowedUploadTypes.includes(args.contentType as typeof allowedUploadTypes[number])) throw new Error("Choose a JPEG, PNG or PDF file under 10 MB.");
    const attached = await ctx.db.query("supportAttachments").withIndex("by_ticket", (q) => q.eq("ticketId", ticket._id)).take(4);
    if (attached.length >= 3) throw new Error("A ticket can have up to three attachments.");
    if (await ctx.db.query("supportRequestIds").withIndex("by_request_id", (q) => q.eq("requestId", args.requestId)).first()) throw new Error("This upload request was already used. Select the file again.");
    const at = now();
    await ctx.db.insert("supportUploadGrants", { tokenHash: args.tokenHash, requesterEmail: email, requesterIssuer: args.requesterIssuer, name: args.name.trim(), size: args.size, contentType: args.contentType, expiresAt: at + 15 * 60 * 1000, used: false, createdAt: at });
    await ctx.db.insert("supportRequestIds", { requestId: args.requestId, operation: "upload_grant", createdAt: at });
    return { uploadUrl: await ctx.storage.generateUploadUrl(), expiresInSeconds: 900 };
  },
});

export const registerUploadFromService = internalMutation({
  args: { ticketId: v.id("supportTickets"), requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen"), tokenHash: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    const grant = await ctx.db.query("supportUploadGrants").withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash)).unique();
    const ticket = await ctx.db.get(args.ticketId);
    if (!grant || grant.used || grant.expiresAt < now() || grant.requesterEmail !== email || grant.requesterIssuer !== args.requesterIssuer || !ticket || ticket.requesterEmail !== email || ticket.requesterIssuer !== args.requesterIssuer) throw new Error("This upload has expired. Please select the file again.");
    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata || metadata.size !== grant.size || metadata.contentType !== grant.contentType) throw new Error("The uploaded file did not match its upload grant.");
    const attached = await ctx.db.query("supportAttachments").withIndex("by_ticket", (q) => q.eq("ticketId", ticket._id)).take(4);
    if (attached.length >= 3) throw new Error("A ticket can have up to three attachments.");
    const at = now();
    const attachmentId = await ctx.db.insert("supportAttachments", { ticketId: ticket._id, storageId: args.storageId, name: grant.name, size: grant.size, contentType: grant.contentType, requesterEmail: email, requesterIssuer: args.requesterIssuer, uploadedAt: at });
    await ctx.db.patch(grant._id, { used: true });
    await ctx.db.insert("supportEvents", { ticketId: ticket._id, actorType: "requester", actorEmail: email, kind: "attachment_added", toValue: grant.name, createdAt: at });
    return { attachmentId };
  },
});

export const storageForRequester = internalQuery({
  args: { attachmentId: v.id("supportAttachments"), requesterEmail: v.string(), requesterIssuer: v.literal("franchiseen") },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.requesterEmail);
    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment || attachment.requesterEmail !== email || attachment.requesterIssuer !== args.requesterIssuer) return null;
    const ticket = await ctx.db.get(attachment.ticketId);
    if (!ticket || ticket.requesterEmail !== email || ticket.requesterIssuer !== args.requesterIssuer) return null;
    return { storageId: attachment.storageId, name: attachment.name, contentType: attachment.contentType };
  },
});


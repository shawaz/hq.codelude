import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const MAX_BODY_BYTES = 64 * 1024;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

type ServiceIdentity = { requesterEmail: string; requesterIssuer: "franchiseen" };

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function readSignedRequest(request: Request) {
  const secret = process.env.FRANCHISEEN_SUPPORT_SHARED_SECRET;
  if (!secret || secret.length < 32) throw new Error("Support service is not configured");
  const timestamp = request.headers.get("X-Franchiseen-Timestamp") ?? "";
  const requestId = request.headers.get("X-Franchiseen-Request-Id") ?? "";
  const signature = request.headers.get("X-Franchiseen-Signature") ?? "";
  const parsedTime = Number(timestamp);
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(requestId) || !Number.isFinite(parsedTime) || Math.abs(Date.now() - parsedTime) > CLOCK_SKEW_MS) throw new Error("Invalid or expired service request");
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error("Request is too large");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) throw new Error("Request is too large");
  const expected = await sign(secret, `${timestamp}.${requestId}.${raw}`);
  if (!safeEqual(signature.toLowerCase(), expected)) throw new Error("Invalid service signature");
  const body = raw ? JSON.parse(raw) : {};
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request body");
  return { requestId, body: body as Record<string, unknown> };
}

function identity(body: Record<string, unknown>): ServiceIdentity {
  const requesterEmail = typeof body.requesterEmail === "string" ? body.requesterEmail.trim().toLowerCase() : "";
  if (!requesterEmail || !requesterEmail.includes("@") || body.requesterIssuer !== "franchiseen") throw new Error("Invalid requester identity");
  return { requesterEmail, requesterIssuer: "franchiseen" };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export const service = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let signed: Awaited<ReturnType<typeof readSignedRequest>>;
  try { signed = await readSignedRequest(request); } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid service request";
    return json({ error: message }, message === "Support service is not configured" ? 503 : 401);
  }
  const { body, requestId } = signed;
  const op = body.operation;
  try {
    if (op === "articles.list") {
      return json(await ctx.runQuery(internal.support.publishedArticlesFromService, {
        search: typeof body.search === "string" ? body.search.slice(0, 120) : undefined,
        category: typeof body.category === "string" ? body.category : undefined,
      }));
    }
    const owner = identity(body);
    if (op === "tickets.create") {
      return json(await ctx.runMutation(internal.support.createFromService, {
        ...owner,
        requesterSubject: typeof body.requesterSubject === "string" ? body.requesterSubject.slice(0, 200) : undefined,
        requesterName: typeof body.requesterName === "string" ? body.requesterName.slice(0, 120) : undefined,
        subject: typeof body.subject === "string" ? body.subject : "",
        category: body.category as any,
        description: typeof body.description === "string" ? body.description : "",
        contextType: body.contextType as any,
        contextId: typeof body.contextId === "string" ? body.contextId.slice(0, 160) : undefined,
        contextLabel: typeof body.contextLabel === "string" ? body.contextLabel.slice(0, 200) : undefined,
        requestId,
      }));
    }
    if (op === "tickets.mine") return json(await ctx.runQuery(internal.support.listMineFromService, owner));
    if (op === "tickets.detail") {
      if (typeof body.ticketId !== "string") return json({ error: "Ticket not found" }, 404);
      return json(await ctx.runQuery(internal.support.detailMineFromService, { ...owner, ticketId: body.ticketId as Id<"supportTickets"> }));
    }
    if (op === "tickets.reply") {
      if (typeof body.ticketId !== "string" || typeof body.body !== "string") return json({ error: "Invalid reply" }, 400);
      return json(await ctx.runMutation(internal.support.replyFromService, { ...owner, ticketId: body.ticketId as Id<"supportTickets">, body: body.body, requestId }));
    }
    if (op === "tickets.uploadGrant") {
      if (typeof body.ticketId !== "string" || typeof body.name !== "string" || typeof body.size !== "number" || typeof body.contentType !== "string") return json({ error: "Invalid upload request" }, 400);
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
      const tokenHash = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
      const grant = await ctx.runMutation(internal.support.createUploadGrantFromService, {
        ...owner, ticketId: body.ticketId as Id<"supportTickets">, tokenHash,
        name: body.name, size: body.size, contentType: body.contentType, requestId,
      });
      return json({ ...grant, token });
    }
    if (op === "tickets.registerUpload") {
      if (typeof body.ticketId !== "string" || typeof body.token !== "string" || typeof body.storageId !== "string") return json({ error: "Invalid upload registration" }, 400);
      const tokenHash = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body.token)));
      return json(await ctx.runMutation(internal.support.registerUploadFromService, {
        ...owner, ticketId: body.ticketId as Id<"supportTickets">, tokenHash, storageId: body.storageId as Id<"_storage">,
      }));
    }
    if (op === "attachments.download") {
      if (typeof body.attachmentId !== "string") return json({ error: "File not found" }, 404);
      const file = await ctx.runQuery(internal.support.storageForRequester, { ...owner, attachmentId: body.attachmentId as Id<"supportAttachments"> });
      if (!file) return json({ error: "File not found" }, 404);
      const blob = await ctx.storage.get(file.storageId);
      if (!blob) return json({ error: "File not found" }, 404);
      const filename = file.name.replace(/[\r\n"\\]/g, "_").slice(0, 180);
      return new Response(blob, { status: 200, headers: { "content-type": file.contentType, "content-length": String(blob.size), "content-disposition": `attachment; filename="${filename}"`, "cache-control": "no-store", "x-content-type-options": "nosniff" } });
    }
    return json({ error: "Unknown support operation" }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Support request failed";
    return json({ error: message }, 400);
  }
});


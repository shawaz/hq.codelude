import { getAuthUserId } from "@convex-dev/auth/server";
import { assertAccess, requireUser, scopesForPage } from "./team";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";

// ─── Stages ───────────────────────────────────────────────────────────────────

export const STAGES = ["prospect", "lead", "deal", "client"] as const;

/** The stage a record moves to on "convert". `client` is terminal. */
const NEXT_STAGE: Record<string, string | null> = {
  prospect: "lead",
  lead: "deal",
  deal: "client",
  client: null,
};

/** Default status when a record lands in a stage. */
const ENTRY_STATUS: Record<string, string> = {
  prospect: "identified",
  lead: "new",
  deal: "discovery",
  client: "active",
};

const TOTAL = "*"; // sentinel status holding the per-segment grand total

/**
 * The pipeline pages this data belongs to. Access is checked per (venture,
 * page), so a member granted Dextrip on `deals` but not `leads` can read one
 * and not the other.
 */
const STAGE_PAGE: Record<string, string> = {
  prospect: "prospects",
  lead: "leads",
  deal: "deals",
  client: "clients",
};

function pageForStage(stage: string): string {
  const page = STAGE_PAGE[stage];
  if (!page) throw new Error(`Unknown stage: ${stage}`);
  return page;
}


/** Adjust a counter row by `delta`, creating it on first write. */
async function bump(
  ctx: MutationCtx,
  stage: string,
  venture: string,
  segment: string,
  status: string,
  delta: number,
) {
  const row = await ctx.db
    .query("pipeline_stats")
    .withIndex("by_key", (q) =>
      q
        .eq("stage", stage)
        .eq("venture", venture)
        .eq("segment", segment)
        .eq("status", status),
    )
    .unique();
  if (row) {
    // Clamp: a counter must never go negative even if rows are deleted twice.
    await ctx.db.patch(row._id, { count: Math.max(0, row.count + delta) });
  } else if (delta > 0) {
    await ctx.db.insert("pipeline_stats", {
      stage,
      venture,
      segment,
      status,
      count: delta,
    });
  }
}

/** Both counters for one record, in one call. */
async function bumpBoth(
  ctx: MutationCtx,
  rec: { stage: string; venture: string; segment: string; status: string },
  delta: number,
) {
  await bump(ctx, rec.stage, rec.venture, rec.segment, rec.status, delta);
  await bump(ctx, rec.stage, rec.venture, rec.segment, TOTAL, delta);
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Server-paginated list for one stage+venture+segment. Uses the search index
 * when `search` is present, otherwise the narrowest matching range index.
 * Never loads the full table.
 */
export const list = query({
  args: {
    stage: v.string(),
    venture: v.string(),
    segment: v.string(),
    status: v.optional(v.string()),
    state: v.optional(v.string()),
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await assertAccess(ctx, args.venture, pageForStage(args.stage));

    const term = args.search?.trim();
    if (term) {
      return await ctx.db
        .query("pipeline_orgs")
        .withSearchIndex("search_name", (q) => {
          let s = q
            .search("name", term)
            .eq("stage", args.stage)
            .eq("venture", args.venture)
            .eq("segment", args.segment);
          if (args.status) s = s.eq("status", args.status);
          if (args.state) s = s.eq("state", args.state);
          return s;
        })
        .paginate(args.paginationOpts);
    }

    if (args.status) {
      return await ctx.db
        .query("pipeline_orgs")
        .withIndex("by_stage_venture_segment_status", (q) =>
          q
            .eq("stage", args.stage)
            .eq("venture", args.venture)
            .eq("segment", args.segment)
            .eq("status", args.status!),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    if (args.state) {
      return await ctx.db
        .query("pipeline_orgs")
        .withIndex("by_stage_venture_segment_state", (q) =>
          q
            .eq("stage", args.stage)
            .eq("venture", args.venture)
            .eq("segment", args.segment)
            .eq("state", args.state!),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("pipeline_orgs")
      .withIndex("by_stage_venture_segment", (q) =>
        q
          .eq("stage", args.stage)
          .eq("venture", args.venture)
          .eq("segment", args.segment),
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** Counter rows for one stage+venture — drives the segment tab badges. */
export const stats = query({
  args: { stage: v.string(), venture: v.string() },
  handler: async (ctx, args) => {
    await assertAccess(ctx, args.venture, pageForStage(args.stage));
    const rows = await ctx.db
      .query("pipeline_stats")
      .withIndex("by_key", (q) =>
        q.eq("stage", args.stage).eq("venture", args.venture),
      )
      .collect();
    return rows.map((r) => ({
      segment: r.segment,
      status: r.status,
      count: r.count,
    }));
  },
});

/** Upcoming scheduled calls/appointments across all ventures, soonest first. */
export const upcomingMeetings = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    // Spans every venture, so there is nothing to assert against — filter the
    // results down to the ventures this user may see on the deals page instead.
    const allowed = new Set(await scopesForPage(ctx, "deals"));
    if (allowed.size === 0) return [];

    const limit = args.limit ?? 10;
    const rows = await ctx.db
      .query("pipeline_orgs")
      .withIndex("by_stage_meetingAt", (q) =>
        q.eq("stage", "deal").gt("meetingAt", Date.now()),
      )
      .order("asc")
      // Over-fetch so filtering does not leave the caller short of `limit`.
      .take(limit * 4);
    return rows.filter((r) => allowed.has(r.venture)).slice(0, limit);
  },
});

/**
 * Compact per-venture snapshot for the AI assistant's system prompt.
 *
 * Deliberately bounded: counts come from the pre-aggregated stats table, and
 * only a handful of sample records per stage are returned. This must stay
 * cheap and small — it is injected into every chat request, and the pipeline
 * table is sized for millions of rows.
 */
export const ventureBriefing = query({
  args: { venture: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    // Injected into the AI assistant's system prompt — without this check a
    // scoped member could ask the chat about a venture they cannot open.
    const allowed = await scopesForPage(ctx, "prospects");
    if (!allowed.includes(args.venture)) return null;

    const SAMPLE = 12;
    const stages = [];

    for (const stage of STAGES) {
      // Counters: (stage, venture) is a prefix of the by_key index.
      const statRows = await ctx.db
        .query("pipeline_stats")
        .withIndex("by_key", (q) => q.eq("stage", stage).eq("venture", args.venture))
        .collect();

      const total = statRows
        .filter((r) => r.status === TOTAL)
        .reduce((a, r) => a + r.count, 0);
      if (total === 0) continue;

      const bySegment = statRows
        .filter((r) => r.status === TOTAL && r.count > 0)
        .map((r) => ({ segment: r.segment, count: r.count }))
        .sort((a, b) => b.count - a.count);

      // (stage, venture) is also a prefix of by_stage_venture_segment.
      const recent = await ctx.db
        .query("pipeline_orgs")
        .withIndex("by_stage_venture_segment", (q) =>
          q.eq("stage", stage).eq("venture", args.venture),
        )
        .order("desc")
        .take(SAMPLE);

      stages.push({
        stage,
        total,
        bySegment,
        sample: recent.map((r) => ({
          name: r.name,
          segment: r.segment,
          status: r.status,
          priority: r.priority,
          category: r.category,
          city: r.city,
          state: r.state,
          email: r.email,
          phone: r.phone,
          value: r.value,
          interest: r.interest,
          source: r.source,
          meetingAt: r.meetingAt,
          notes: r.notes,
        })),
        truncated: total > recent.length,
      });
    }

    return { venture: args.venture, stages };
  },
});

/**
 * Records with coordinates, for the map. Spans every stage, so it filters to
 * what the caller may see rather than asserting on one page — same shape as
 * upcomingMeetings.
 *
 * Only rows with a `center` are returned. Most records arrive with city/state
 * text and no coordinates; scripts/geocode-pipeline.mjs backfills them.
 */
export const mapPoints = query({
  args: { venture: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const allowed = new Map<string, Set<string>>();
    for (const [stage, page] of Object.entries(STAGE_PAGE)) {
      allowed.set(stage, new Set(await scopesForPage(ctx, page)));
    }

    // Bounded: a map cannot usefully draw more than this, and the table is
    // sized for millions of rows.
    const rows = await ctx.db.query("pipeline_orgs").take(4000);

    return rows
      .filter((r) => Array.isArray(r.center) && r.center.length === 2)
      .filter((r) => allowed.get(r.stage)?.has(r.venture))
      .filter((r) => !args.venture || r.venture === args.venture)
      .map((r) => ({
        _id: r._id,
        name: r.name,
        stage: r.stage,
        venture: r.venture,
        segment: r.segment,
        status: r.status,
        city: r.city,
        state: r.state,
        value: r.value,
        center: r.center as number[],
      }));
  },
});

/** Rows still lacking coordinates but carrying enough text to geocode. */
export const needsGeocode = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("pipeline_orgs").take(2000);
    return rows
      .filter((r) => !r.center && (r.city || r.district || r.state))
      .slice(0, args.limit ?? 100)
      .map((r) => ({
        _id: r._id,
        name: r.name,
        query: [r.city, r.district, r.state, "India"].filter(Boolean).join(", "),
      }));
  },
});

/**
 * Write a geocoded position back. Internal — this is only ever called by the
 * backfill script, which owns the rate limiting Nominatim requires.
 */
export const setCenter = internalMutation({
  args: { id: v.id("pipeline_orgs"), center: v.array(v.number()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { center: args.center, updatedAt: Date.now() });
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

const recordFields = {
  venture: v.string(),
  segment: v.string(),
  name: v.string(),
  code: v.optional(v.string()),
  category: v.optional(v.string()),
  state: v.optional(v.string()),
  district: v.optional(v.string()),
  city: v.optional(v.string()),
  contactName: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  website: v.optional(v.string()),
  size: v.optional(v.number()),
  status: v.optional(v.string()),
  priority: v.optional(v.string()),
  source: v.optional(v.string()),
  notes: v.optional(v.string()),
  interest: v.optional(v.string()),
  message: v.optional(v.string()),
  value: v.optional(v.string()),
  meetingAt: v.optional(v.number()),
  meetingNote: v.optional(v.string()),
  closeDate: v.optional(v.string()),
  since: v.optional(v.string()),
  config: v.optional(v.string()),
  boundary: v.optional(v.any()),
  center: v.optional(v.array(v.number())),
  areaHectares: v.optional(v.number()),
};

export const add = mutation({
  args: { stage: v.string(), ...recordFields },
  handler: async (ctx, args) => {
    await assertAccess(ctx, args.venture, pageForStage(args.stage));
    const { stage, contactName, email, phone, ...rest } = args;
    const status = rest.status ?? ENTRY_STATUS[stage] ?? "identified";
    const id = await ctx.db.insert("pipeline_orgs", {
      ...rest,
      stage,
      status,
      source: rest.source ?? "manual",
      createdAt: Date.now(),
    });
    await bumpBoth(ctx, { stage, venture: rest.venture, segment: rest.segment, status }, 1);

    // A prospect is the company; people live in pipeline_contacts. If the form
    // supplied someone, they become the org's first (and so primary) contact.
    if (contactName?.trim() || email?.trim() || phone?.trim()) {
      await ctx.db.insert("pipeline_contacts", {
        orgId: id,
        name: contactName?.trim() || email?.trim() || "Unnamed contact",
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        isPrimary: true,
        createdAt: Date.now(),
      });
    }
    return id;
  },
});

export const setStatus = mutation({
  args: { id: v.id("pipeline_orgs"), status: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const rec = await ctx.db.get(args.id);
    if (!rec) throw new Error("Record not found");
    // Checked against the record's own venture/stage, not a client-supplied one.
    await assertAccess(ctx, rec.venture, pageForStage(rec.stage));
    if (rec.status === args.status) return;
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
    await bump(ctx, rec.stage, rec.venture, rec.segment, rec.status, -1);
    await bump(ctx, rec.stage, rec.venture, rec.segment, args.status, 1);
  },
});

/** Schedule (or clear) a call/appointment on a deal. */
export const setMeeting = mutation({
  args: {
    id: v.id("pipeline_orgs"),
    meetingAt: v.optional(v.number()),
    meetingNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const rec = await ctx.db.get(args.id);
    if (!rec) throw new Error("Record not found");
    await assertAccess(ctx, rec.venture, pageForStage(rec.stage));
    await ctx.db.patch(args.id, {
      meetingAt: args.meetingAt,
      meetingNote: args.meetingNote,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Move a record to the next stage. The row itself travels — notes, contact
 * details and registry code go with it — so nothing is duplicated across
 * stages and the counters for both stages stay correct.
 */
export const convert = mutation({
  args: { id: v.id("pipeline_orgs"), to: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const rec = await ctx.db.get(args.id);
    if (!rec) throw new Error("Record not found");

    const to = args.to ?? NEXT_STAGE[rec.stage];
    if (!to) throw new Error(`${rec.stage} is the final stage`);
    if (to === rec.stage) return;

    // Converting spans two pages — require access to both ends, or a member
    // granted only `leads` could push records into deals they cannot see.
    await assertAccess(ctx, rec.venture, pageForStage(rec.stage));
    await assertAccess(ctx, rec.venture, pageForStage(to));

    const status = ENTRY_STATUS[to] ?? "identified";
    await bumpBoth(ctx, rec, -1);
    await ctx.db.patch(args.id, {
      stage: to,
      status,
      updatedAt: Date.now(),
      ...(to === "client" && !rec.since
        ? { since: new Date().toISOString().slice(0, 10) }
        : {}),
    });
    await bumpBoth(
      ctx,
      { stage: to, venture: rec.venture, segment: rec.segment, status },
      1,
    );
    return to;
  },
});

/**
 * Bulk import entrypoint for in-app use. Call in batches (a few hundred rows
 * per call) — a single mutation cannot ingest millions of rows. Rows carrying
 * a `code` already present are skipped, so re-running an import is safe.
 */
export const importRecords = mutation({
  args: { stage: v.string(), rows: v.array(v.object(recordFields)) },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const page = pageForStage(args.stage);
    for (const venture of new Set(args.rows.map((r) => r.venture))) {
      await assertAccess(ctx, venture, page);
    }
    return await insertMany(ctx, args.stage, args.rows);
  },
});

/**
 * Same as `importRecords` but callable without a user session, for CLI/script
 * bulk loads. Internal functions are not reachable from the browser, so
 * skipping the auth check here does not widen the public surface.
 */
export const bulkImport = internalMutation({
  args: { stage: v.string(), rows: v.array(v.object(recordFields)) },
  handler: async (ctx, args) => {
    return await insertMany(ctx, args.stage, args.rows);
  },
});

async function insertMany(
  ctx: MutationCtx,
  stage: string,
  rows: Array<Record<string, unknown> & { venture: string; segment: string; name: string; code?: string; status?: string; source?: string }>,
) {
  let inserted = 0;
  let skipped = 0;
  for (const row of rows) {
    if (row.code) {
      const existing = await ctx.db
        .query("pipeline_orgs")
        .withIndex("by_code", (q) => q.eq("code", row.code))
        .first();
      if (existing) {
        skipped++;
        continue;
      }
    }
    const status = row.status ?? ENTRY_STATUS[stage] ?? "identified";
    await ctx.db.insert("pipeline_orgs", {
      ...(row as object),
      stage,
      status,
      source: row.source ?? "import",
      createdAt: Date.now(),
    } as never);
    await bumpBoth(ctx, { stage, venture: row.venture, segment: row.segment, status }, 1);
    inserted++;
  }
  return { inserted, skipped };
}

/**
 * Public intake for website / social lead forms. No auth — it is called by
 * anonymous visitors — so it accepts only the narrow set of fields a form can
 * supply and always lands the record in the `lead` stage.
 */
export const submitLead = mutation({
  args: {
    venture: v.string(),
    segment: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    interest: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.optional(v.string()),
    config: v.optional(v.string()),
    boundary: v.optional(v.any()),
    center: v.optional(v.array(v.number())),
    areaHectares: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const person = args.name.trim().slice(0, 200);
    if (!person) throw new Error("Name is required");

    // The funnel is company-first: the org row is the company, the human who
    // filled in the form becomes its contact. Sole traders and individuals
    // submit no company, so fall back to their own name as the org.
    const company = args.company?.trim().slice(0, 200);
    const id = await ctx.db.insert("pipeline_orgs", {
      stage: "lead",
      venture: args.venture,
      segment: args.segment,
      name: company || person,
      city: args.city?.trim().slice(0, 100) || undefined,
      state: args.state?.trim().slice(0, 100) || undefined,
      interest: args.interest?.trim().slice(0, 200) || undefined,
      message: args.message?.trim().slice(0, 5000) || undefined,
      status: "new",
      priority: "medium",
      source: args.source?.trim().slice(0, 60) || "web-form",
      config: args.config,
      boundary: args.boundary,
      center: args.center,
      areaHectares: args.areaHectares,
      createdAt: Date.now(),
    });
    await ctx.db.insert("pipeline_contacts", {
      orgId: id,
      name: person,
      email: args.email?.trim().slice(0, 320) || undefined,
      phone: args.phone?.trim().slice(0, 40) || undefined,
      isPrimary: true,
      createdAt: Date.now(),
    });

    await bumpBoth(
      ctx,
      { stage: "lead", venture: args.venture, segment: args.segment, status: "new" },
      1,
    );
    return id;
  },
});

/**
 * Delete every row from one `source` and decrement its counters.
 * Use "sample" to drop seed data, or "import" to undo a bad bulk load.
 * Deletes up to `limit` rows per call (default 2000) to stay inside Convex's
 * per-transaction limits — re-run until it reports 0.
 */
export const clearBySource = internalMutation({
  args: { source: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("pipeline_orgs")
      .filter((q) => q.eq(q.field("source"), args.source))
      .take(args.limit ?? 2000);
    let contactsDeleted = 0;
    for (const row of rows) {
      // Cascade: contacts hang off the org and would otherwise be orphaned
      // rows pointing at a dead id.
      const contacts = await ctx.db
        .query("pipeline_contacts")
        .withIndex("by_org", (q) => q.eq("orgId", row._id))
        .collect();
      for (const c of contacts) {
        await ctx.db.delete(c._id);
        contactsDeleted++;
      }
      await ctx.db.delete(row._id);
      await bumpBoth(ctx, row, -1);
    }
    return { deleted: rows.length, contactsDeleted };
  },
});

// ─── Seeding ──────────────────────────────────────────────────────────────────

/**
 * Sample rows so every stage/tab is populated before real data lands.
 * Organisation names are public record; contact details and registry codes are
 * deliberately left blank rather than invented, so nothing here can be mistaken
 * for verified outreach data. Every row is tagged source:"sample" —
 * `npx convex run pipeline:clearBySource '{"source":"sample"}'` removes them.
 */
export const seedSamples = internalMutation({
  args: {},
  handler: async (ctx) => {
    type Row = {
      stage: string; venture: string; segment: string; name: string;
      category?: string; state?: string; district?: string; city?: string;
      status?: string; priority?: string; value?: string; interest?: string;
      source?: string; since?: string; closeDate?: string;
    };

    const rows: Row[] = [
      // ── Roborns prospects: investors / infrastructure / compute / minerals / water
      { stage: "prospect", venture: "Roborns", segment: "investor", name: "Blume Ventures", category: "VC", state: "Karnataka", city: "Bengaluru", priority: "high", status: "researching" },
      { stage: "prospect", venture: "Roborns", segment: "investor", name: "Green Climate Fund", category: "Climate Finance", city: "Songdo", priority: "high", status: "identified" },
      { stage: "prospect", venture: "Roborns", segment: "infrastructure", name: "New Mangalore Port Authority", category: "Port Authority", state: "Karnataka", city: "Mangaluru", priority: "high", status: "contacted" },
      { stage: "prospect", venture: "Roborns", segment: "infrastructure", name: "Karnataka Industrial Areas Development Board", category: "State Authority", state: "Karnataka", city: "Bengaluru", priority: "high", status: "identified" },
      { stage: "prospect", venture: "Roborns", segment: "compute", name: "Yotta Data Services", category: "GPU Cloud", state: "Maharashtra", city: "Mumbai", priority: "high", status: "researching" },
      { stage: "prospect", venture: "Roborns", segment: "compute", name: "E2E Networks", category: "GPU Cloud", state: "Delhi", city: "New Delhi", status: "identified" },
      { stage: "prospect", venture: "Roborns", segment: "minerals", name: "Tata Chemicals", category: "Soda Ash / Salt", state: "Gujarat", city: "Mithapur", priority: "high", status: "identified" },
      { stage: "prospect", venture: "Roborns", segment: "minerals", name: "Archean Chemical Industries", category: "Bromine / Salt", state: "Tamil Nadu", city: "Chennai", status: "identified" },
      { stage: "prospect", venture: "Roborns", segment: "water", name: "Mangaluru City Corporation", category: "Municipal", state: "Karnataka", city: "Mangaluru", priority: "high", status: "contacted" },
      { stage: "prospect", venture: "Roborns", segment: "water", name: "Karnataka Urban Water Supply Board", category: "State Utility", state: "Karnataka", city: "Bengaluru", status: "identified" },

      // ── HubCV prospects
      { stage: "prospect", venture: "HubCV", segment: "school", name: "Kendriya Vidyalaya, Mangaluru", category: "Government", state: "Karnataka", district: "Dakshina Kannada", city: "Mangaluru", priority: "high", status: "contacted" },
      { stage: "prospect", venture: "HubCV", segment: "school", name: "St. Aloysius High School", category: "Aided", state: "Karnataka", district: "Dakshina Kannada", city: "Mangaluru", priority: "high", status: "responded" },
      { stage: "prospect", venture: "HubCV", segment: "school", name: "Delhi Public School, Bengaluru North", category: "Private", state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", status: "identified" },
      { stage: "prospect", venture: "HubCV", segment: "college", name: "National Institute of Technology Karnataka", category: "Engineering", state: "Karnataka", district: "Dakshina Kannada", city: "Surathkal", priority: "high", status: "contacted" },
      { stage: "prospect", venture: "HubCV", segment: "college", name: "Manipal Institute of Technology", category: "Engineering", state: "Karnataka", district: "Udupi", city: "Manipal", priority: "high", status: "shortlisted" },
      { stage: "prospect", venture: "HubCV", segment: "college", name: "Sahyadri College of Engineering & Management", category: "Engineering", state: "Karnataka", district: "Dakshina Kannada", city: "Mangaluru", status: "identified" },
      { stage: "prospect", venture: "HubCV", segment: "business", name: "Robosoft Technologies", category: "IT Services", state: "Karnataka", district: "Udupi", city: "Udupi", priority: "high", status: "contacted" },
      { stage: "prospect", venture: "HubCV", segment: "business", name: "Infosys", category: "IT Services", state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", status: "researching" },

      // ── Other ventures, prospects
      { stage: "prospect", venture: "Franchiseen", segment: "brand", name: "Wow! Momo", category: "F&B", state: "West Bengal", city: "Kolkata", status: "identified" },
      { stage: "prospect", venture: "Llife", segment: "education", name: "HubCV (internal API)", category: "Ecosystem", state: "Karnataka", city: "Mangaluru", priority: "high", status: "shortlisted" },
      { stage: "prospect", venture: "Llife", segment: "earnings", name: "Dextrip (internal API)", category: "Ecosystem", state: "Karnataka", city: "Mangaluru", priority: "high", status: "shortlisted" },
      { stage: "prospect", venture: "Llife", segment: "earnings", name: "Franchiseen (internal API)", category: "Ecosystem", state: "Karnataka", city: "Mangaluru", priority: "high", status: "shortlisted" },
      { stage: "prospect", venture: "Llife", segment: "finances", name: "Sahamati (Account Aggregator)", category: "Financial rails", state: "Karnataka", city: "Bengaluru", priority: "high", status: "researching" },
      { stage: "prospect", venture: "Llife", segment: "body", name: "Apple HealthKit / Google Health Connect", category: "Health data", city: "—", status: "identified" },
      { stage: "lead", venture: "Llife", segment: "education", name: "HubCV student beta enquiry", category: "Student", city: "Mangaluru", interest: "Daily tracker beta", source: "web-form", status: "new", priority: "high" },
      { stage: "prospect", venture: "Dextrip", segment: "exchange", name: "CoinDCX", category: "Exchange", state: "Maharashtra", city: "Mumbai", status: "identified" },

      // ── Leads (inbound: forms + social)
      { stage: "lead", venture: "Roborns", segment: "compute", name: "Anonymous GPU enquiry", category: "AI startup", city: "Bengaluru", interest: "2 MW inference colocation", source: "web-form", status: "new", priority: "high" },
      { stage: "lead", venture: "Roborns", segment: "water", name: "Coastal resort enquiry", category: "Hospitality", city: "Udupi", interest: "Industrial water offtake", source: "linkedin", status: "qualified" },
      { stage: "lead", venture: "HubCV", segment: "college", name: "Placement cell enquiry", category: "Private college", city: "Hubballi", interest: "Placement analytics pilot", source: "instagram", status: "new" },
      { stage: "lead", venture: "HubCV", segment: "school", name: "CBSE school enquiry", category: "Private school", city: "Mysuru", interest: "Career guidance for class 11–12", source: "web-form", status: "new" },
      { stage: "lead", venture: "Dextrip", segment: "creator", name: "Strategy creator applicant", category: "Individual", city: "Pune", interest: "Creator programme", source: "twitter", status: "qualified" },

      // ── Deals (calls & appointments in progress)
      { stage: "deal", venture: "Roborns", segment: "investor", name: "Roborns seed infrastructure round", category: "Strategic investors", value: "₹18 Cr ($2.1M)", closeDate: "Q4 2026", status: "discovery", priority: "high" },
      { stage: "deal", venture: "Franchiseen", segment: "brand", name: "Pilot franchise partner", category: "Regional F&B brand", value: "₹1–5 Cr AUM", closeDate: "Q3 2026", status: "discovery", priority: "high" },
      { stage: "deal", venture: "HubCV", segment: "business", name: "Recruiter design partner ×5", category: "Recruitment agencies", value: "$0 (design partner)", closeDate: "Q4 2026", status: "proposal" },

      // ── Clients (converted)
      { stage: "client", venture: "Dextrip", segment: "creator", name: "Dextrip Beta Subscriber #1", category: "Individual trader", value: "$99/month", since: "2026-05-01", status: "active" },
      { stage: "client", venture: "Dextrip", segment: "creator", name: "Dextrip Beta Subscriber #2", category: "Individual trader", value: "$99/month", since: "2026-05-01", status: "active" },
      { stage: "client", venture: "Dextrip", segment: "creator", name: "Dextrip Beta Subscriber #3", category: "Individual trader", value: "$29/month", since: "2026-05-01", status: "at-risk" },
    ];

    let inserted = 0;
    for (const row of rows) {
      const existing = await ctx.db
        .query("pipeline_orgs")
        .withIndex("by_stage_venture_segment", (q) =>
          q.eq("stage", row.stage).eq("venture", row.venture).eq("segment", row.segment),
        )
        .filter((q) => q.eq(q.field("name"), row.name))
        .first();
      if (existing) continue;

      const status = row.status ?? ENTRY_STATUS[row.stage];
      await ctx.db.insert("pipeline_orgs", {
        ...row,
        status,
        priority: row.priority ?? "medium",
        source: row.source ?? "sample",
        createdAt: Date.now(),
      });
      await bumpBoth(ctx, { ...row, status }, 1);
      inserted++;
    }
    return { inserted, skipped: rows.length - inserted };
  },
});

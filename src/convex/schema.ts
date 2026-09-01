import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
    title: v.optional(v.string()),

    // Per-(venture, page) permission matrix. See src/convex/access.ts.
    //   undefined ⇒ unrestricted (admins, and pre-existing docs)
    //   []        ⇒ signed in, granted nothing
    // The model fails closed: new members default to [].
    access: v.optional(
      v.array(
        v.object({
          venture: v.string(),        // scope name, must match ALL_SCOPE_NAMES
          pages: v.array(v.string()), // page slugs, must match ALL_PAGE_SLUGS
        }),
      ),
    ),
    // Display-only label per venture, e.g. { venture: "Dextrip", role: "Co-founder" }.
    // Carries no permissions — `access` is the only thing that grants anything.
    ventureRoles: v.optional(
      v.array(v.object({ venture: v.string(), role: v.string() })),
    ),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  // Pending team members. A person cannot exist in `users` until they have
  // signed in with Google, so an admin configures them here first; auth.ts
  // applies and deletes the invite on their first sign-in.
  invites: defineTable({
    email: v.string(),   // lowercased on write — the join key against users.email
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    access: v.array(
      v.object({ venture: v.string(), pages: v.array(v.string()) }),
    ),
    ventureRoles: v.optional(
      v.array(v.object({ venture: v.string(), role: v.string() })),
    ),
    invitedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // ─── Writable app data ──────────────────────────────────────────────

  site_projects: defineTable({
    id: v.string(),
    ventureId: v.string(),
    name: v.string(),
    location: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
    ),
    source: v.union(v.literal("lead"), v.literal("manual")),
    leadId: v.optional(v.string()),
    config: v.optional(v.string()),
    boundary: v.optional(v.any()),
    center: v.optional(v.array(v.number())),
    areaHectares: v.optional(v.number()),
    budget: v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        category: v.string(),
        amount: v.number(),
        currency: v.string(),
        notes: v.optional(v.string()),
      }),
    ),
    team: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        role: v.string(),
        contact: v.optional(v.string()),
      }),
    ),
    tasks: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        status: v.string(),
        assignee: v.optional(v.string()),
        dueDate: v.optional(v.string()),
      }),
    ),
    activities: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        notes: v.optional(v.string()),
        date: v.string(),
        status: v.union(v.literal("planned"), v.literal("in-progress"), v.literal("done")),
      }),
    ),
    createdAt: v.string(),
  }),

  task_extras: defineTable({
    taskId: v.string(),
    notes: v.array(
      v.object({ id: v.string(), text: v.string(), createdAt: v.string() }),
    ),
    files: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        url: v.string(),
        size: v.number(),
        type: v.string(),
        uploadedAt: v.string(),
      }),
    ),
  }).index("by_taskId", ["taskId"]),

  leads: defineTable({
    id: v.string(),
    name: v.string(),
    company: v.string(),
    type: v.string(),
    venture: v.string(),
    status: v.string(),
    source: v.string(),
    value: v.string(),
    nextStep: v.string(),
    notes: v.optional(v.string()),
    config: v.optional(v.string()),
    boundary: v.optional(v.any()),
    center: v.optional(v.array(v.number())),
    areaHectares: v.optional(v.number()),
  }),

  // ─── QR appointment booking ─────────────────────────────────────────

  qr_codes: defineTable({
    label: v.string(),
    url: v.string(),
    scans: v.number(),
    bookings: v.number(),
    createdAt: v.number(),
  }),

  appointments: defineTable({
    qrCodeId: v.id("qr_codes"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
    ),
    createdAt: v.number(),
  }).index("by_qrCodeId", ["qrCodeId"]),

  // ─── Sales pipeline ─────────────────────────────────────────────────
  // One table, four stages: prospect → lead → deal → client. Converting a
  // record patches `stage` rather than copying it between tables, so history,
  // contact details and notes travel with it down the funnel.
  //
  // Sized for bulk datasets (UDISE+ schools, AISHE colleges, MCA registries).
  // Never collect() this table — always paginate or use an index.

  pipeline_orgs: defineTable({
    stage: v.string(),          // "prospect" | "lead" | "deal" | "client"
    venture: v.string(),        // "HubCV", "Roborns", ...
    segment: v.string(),        // "school" | "compute" | "investor" | ...
    name: v.string(),
    // Official registry code (UDISE / AISHE / CIN). Used to dedupe on import.
    code: v.optional(v.string()),
    category: v.optional(v.string()),
    state: v.optional(v.string()),
    district: v.optional(v.string()),
    city: v.optional(v.string()),
    // Superseded by the pipeline_contacts table. Kept so existing rows stay
    // valid; nothing reads them after the contacts migration has run. New
    // writes go to pipeline_contacts.
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    size: v.optional(v.number()),      // students / headcount
    status: v.string(),                // stage-specific, see STAGES in pipeline.ts
    priority: v.optional(v.string()),  // "high" | "medium" | "low"
    source: v.optional(v.string()),    // "manual" | "import" | "sample" | form/social channel
    notes: v.optional(v.string()),

    // ── Lead stage ──
    interest: v.optional(v.string()),  // what the inbound enquiry asked about
    message: v.optional(v.string()),   // raw form/DM body

    // ── Deal stage (calls & appointments) ──
    value: v.optional(v.string()),     // "₹18 Cr", "$99/month"
    meetingAt: v.optional(v.number()),  // scheduled call/appointment (epoch ms)
    meetingNote: v.optional(v.string()),
    closeDate: v.optional(v.string()),  // target close, e.g. "Q4 2026"

    // ── Client stage ──
    since: v.optional(v.string()),      // ISO date they converted

    // ── Roborns site leads ──
    // Carried from the site enquiry form so a lead can still be converted into
    // a SiteProject with its drawn boundary intact.
    config: v.optional(v.string()),
    boundary: v.optional(v.any()),
    center: v.optional(v.array(v.number())),
    areaHectares: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_stage_venture_segment", ["stage", "venture", "segment"])
    .index("by_stage_venture_segment_status", ["stage", "venture", "segment", "status"])
    .index("by_stage_venture_segment_state", ["stage", "venture", "segment", "state"])
    .index("by_stage_meetingAt", ["stage", "meetingAt"])
    .index("by_code", ["code"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["stage", "venture", "segment", "status", "state"],
    }),

  // People at a pipeline org. The funnel is company-first: a `prospect` is the
  // company itself, a `lead` is the set of people you have found there, and a
  // `client` has one of them promoted to primary — the main point of contact
  // once the deal closed.
  //
  // Separate table rather than an array on the org because contacts are edited
  // individually and a single org can accumulate a lot of them.
  pipeline_contacts: defineTable({
    orgId: v.id("pipeline_orgs"),
    name: v.string(),
    role: v.optional(v.string()),    // their job title at the company
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    // At most one per org. Enforced in the mutations, not the schema.
    isPrimary: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .index("by_org_primary", ["orgId", "isPrimary"]),

  // ─── Tasks ──────────────────────────────────────────────────────────
  // Migrated out of src/lib/tasks.ts, which was 87 hardcoded literals with no
  // way to create, edit or complete anything. That file is now a seed source
  // (SEED_TASKS) read once by the migration; this table is the source of truth.
  //
  // `seedId` carries the original 'r01' / 'h07' identifier so the migration can
  // be re-run without duplicating, and so task_today rows written before the
  // migration still resolve.
  tasks: defineTable({
    seedId: v.optional(v.string()),
    title: v.string(),
    project: v.string(),        // venture name — 'Roborns', 'HubCV', …
    category: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index("by_project", ["project"])
    .index("by_seedId", ["seedId"])
    .index("by_project_status", ["project", "status"]),

  // ─── Offices ────────────────────────────────────────────────────────
  // Locations, with headcount recorded on the row. Open roles are NOT stored
  // here — they are derived by matching a position's location against the
  // office city, so a role opened on the Positions page shows up without
  // anything being kept in sync by hand.
  offices: defineTable({
    seedId: v.optional(v.string()),
    name: v.string(),
    type: v.union(
      v.literal("Registered"),
      v.literal("Engineering"),
      v.literal("Remote"),
      v.literal("Server"),
    ),
    city: v.string(),
    country: v.string(),
    status: v.union(v.literal("active"), v.literal("planned"), v.literal("virtual")),
    purpose: v.optional(v.string()),
    notes: v.optional(v.string()),
    // Manual: the users table carries no location, so headcount per office
    // cannot be derived from the team the way open roles can.
    headcount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_seedId", ["seedId"]),

  // ─── Positions ──────────────────────────────────────────────────────
  // Migrated out of src/lib/people.ts for the same reason tasks were: nine
  // hardcoded literals with no way to open a role, move it through hiring, or
  // close it once someone is hired. `seedId` ('P01'…) keeps the migration
  // idempotent and lets Applications keep referencing a role by title.
  //
  // Closing is a status change, not a delete — a filled role is a record of
  // what you hired for. `remove` exists separately for one raised in error.
  positions: defineTable({
    seedId: v.optional(v.string()),
    title: v.string(),
    department: v.string(),
    venture: v.string(),
    type: v.union(
      v.literal("Full-time"),
      v.literal("Contract"),
      v.literal("Part-time"),
      v.literal("Advisory"),
    ),
    status: v.union(
      v.literal("open"),
      v.literal("hiring"),
      v.literal("filled"),
      v.literal("on-hold"),
      v.literal("closed"),
    ),
    priority: v.union(v.literal("critical"), v.literal("high"), v.literal("medium")),
    targetStart: v.optional(v.string()),
    location: v.optional(v.string()),
    keySkills: v.array(v.string()),
    notes: v.optional(v.string()),
    // Who was hired, once the role is filled.
    hiredName: v.optional(v.string()),
    filledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_venture", ["venture"])
    .index("by_seedId", ["seedId"]),

  // ─── Applications ───────────────────────────────────────────────────
  // Candidate pipeline. `resumeId` is a Convex storage id — the first real
  // file upload in the app. The existing task-file upload writes to the local
  // filesystem, which cannot work on Vercel; this does not repeat that.
  applications: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.string(),       // free text, or a Position id from src/lib/people.ts
    venture: v.optional(v.string()),
    source: v.string(),         // 'LinkedIn', 'Referral', 'Direct', …
    status: v.union(
      v.literal("new"),
      v.literal("screening"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("hired"),
      v.literal("rejected"),
    ),
    notes: v.optional(v.string()),
    resumeId: v.optional(v.id("_storage")),
    resumeName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_position", ["position"]),

  // ─── Today list ─────────────────────────────────────────────────────
  // The 87 tasks in src/lib/tasks.ts carry no dates, so "today" cannot be
  // derived from them. Instead you pick what you are working on by clicking,
  // and the choice is stored here.
  //
  // Rows are keyed by an IST calendar date, which is what makes the list clear
  // itself: tomorrow's query simply does not match today's rows, so there is no
  // cleanup job to run or forget. Same day key as ai_messages — see istDay().
  //
  // Private per user. Your day is yours.
  task_today: defineTable({
    userId: v.id("users"),
    taskId: v.string(),   // matches Task.id in src/lib/tasks.ts — 'r01', 'h07', …
    day: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_day", ["userId", "day"])
    .index("by_user_day_task", ["userId", "day", "taskId"]),

  // ─── AI assistant history ───────────────────────────────────────────
  // The dashboard assistant keeps one day of conversation, then rolls it up
  // into a summary. Private per (user, venture) — this is someone's working
  // notes, not a team record.
  //
  // `day` is an IST calendar date (YYYY-MM-DD), not UTC: the founder works in
  // Mangaluru, and a UTC boundary would cut the day at 5:30am local.

  ai_messages: defineTable({
    userId: v.id("users"),
    venture: v.string(),
    day: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_venture_day", ["userId", "venture", "day"])
    .index("by_user_venture", ["userId", "venture"]),

  ai_day_summaries: defineTable({
    userId: v.id("users"),
    venture: v.string(),
    day: v.string(),
    summary: v.string(),
    messageCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_user_venture_day", ["userId", "venture", "day"])
    .index("by_user_venture", ["userId", "venture"]),

  // Incrementally maintained counters. Convex has no cheap COUNT(*), and
  // counting millions of docs per page render would blow the read limit, so
  // every write to pipeline_orgs bumps the matching counter row here.
  pipeline_stats: defineTable({
    stage: v.string(),
    venture: v.string(),
    segment: v.string(),
    status: v.string(),   // "*" holds the segment total across all statuses
    count: v.number(),
  }).index("by_key", ["stage", "venture", "segment", "status"]),
});

export default schema;

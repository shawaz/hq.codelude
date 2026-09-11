import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";
import type { GenericDatabaseWriter } from "convex/server";
import { normalizeAccess, isAllowedEmail, ALLOWED_EMAIL_DOMAINS } from "./access";

/**
 * The auth callbacks hand us a ctx typed against a generic data model, so
 * ctx.db knows nothing about our tables or indexes. Cast it back to ours.
 */
type Db = GenericDatabaseWriter<DataModel>;

// `hd` takes a single Workspace domain, so it cannot express the period where
// both codelude.com and the older llife.app accounts are valid. Dropping it
// means the consent screen no longer pre-filters; beforeSessionCreation below
// is the real boundary and rejects anything outside ALLOWED_EMAIL_DOMAINS.
const google = Google({
  authorization: {
    params: { prompt: "select_account" },
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [google],
  callbacks: {
    // Hard enforcement: only ALLOWED_EMAIL_DOMAINS may sign in. This is the
    // outer security boundary; the access matrix scopes what they see once in.
    async beforeSessionCreation(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!isAllowedEmail(user?.email)) {
        const allowed = ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(" or ");
        throw new Error(`Access restricted to ${allowed} accounts`);
      }
    },

    // Runs once per user, on creation. Three cases:
    //   1. An admin pre-configured them via the Team page → apply that invite.
    //   2. They are the very first user ever → admin, unrestricted.
    //   3. Anyone else → member with NO grants. Failing closed matters here:
    //      an allowed domain gets you in the door, not into the data.
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      if (existingUserId) return;

      const db = ctx.db as unknown as Db;
      const user = await db.get(userId);
      const email = user?.email?.toLowerCase();

      if (email) {
        const invite = await db
          .query("invites")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique();

        if (invite) {
          await db.patch(userId, {
            role: invite.role,
            title: invite.title,
            // Re-normalize rather than trusting the stored shape: the page
            // registry may have changed between invite and first sign-in.
            access:
              invite.role === "admin"
                ? undefined
                : normalizeAccess(invite.access),
            ventureRoles: invite.ventureRoles,
          });
          await db.delete(invite._id);
          return;
        }
      }

      const count = (await db.query("users").collect()).length;
      const isFirstUser = count <= 1;
      await db.patch(userId, {
        role: isFirstUser ? "admin" : "member",
        access: isFirstUser ? undefined : [],
      });
    },
  },
});

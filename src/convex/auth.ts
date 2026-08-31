import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";
import type { GenericDatabaseWriter } from "convex/server";
import { normalizeAccess } from "./access";

/**
 * The auth callbacks hand us a ctx typed against a generic data model, so
 * ctx.db knows nothing about our tables or indexes. Cast it back to ours.
 */
type Db = GenericDatabaseWriter<DataModel>;

const google = Google({
  // Restrict the Google consent screen to the codelude.com Workspace domain.
  authorization: {
    params: { hd: "codelude.com", prompt: "select_account" },
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [google],
  callbacks: {
    // Hard enforcement: only @codelude.com accounts may sign in. This is the
    // outer security boundary; the access matrix scopes what they see once in.
    async beforeSessionCreation(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      const email = user?.email?.toLowerCase();
      if (!email || !email.endsWith("@codelude.com")) {
        throw new Error("Access restricted to @codelude.com accounts");
      }
    },

    // Runs once per user, on creation. Three cases:
    //   1. An admin pre-configured them via the Team page → apply that invite.
    //   2. They are the very first user ever → admin, unrestricted.
    //   3. Anyone else → member with NO grants. Failing closed matters here:
    //      a @codelude.com address gets you in the door, not into the data.
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

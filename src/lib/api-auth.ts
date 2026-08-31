/**
 * Auth + access helpers for route handlers under src/app/api.
 *
 * These handlers previously relied entirely on the middleware matcher in
 * src/proxy.ts for authentication and did no check of their own. That is one
 * config edit away from being wrong, and it says nothing about *which* venture
 * the caller may touch — so anything venture-scoped calls requireApiAccess.
 */
import { NextResponse } from 'next/server';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { can, canSeePage } from '@/lib/nav';
import { getProject, type SiteProject } from '@/lib/site-projects';

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

async function getCurrentUser() {
  const token = await convexAuthNextjsToken();
  return await fetchQuery(api.team.getCurrentUser, {}, { token });
}

/**
 * Returns the signed-in user, or a 401 response to return as-is:
 *
 *   const auth = await requireApiUser();
 *   if (auth instanceof NextResponse) return auth;
 */
export async function requireApiUser(): Promise<
  NonNullable<CurrentUser> | NextResponse
> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return user;
}

/** As above, but also requires a grant on (venture, page). */
export async function requireApiAccess(
  venture: string,
  pageSlug: string,
): Promise<NonNullable<CurrentUser> | NextResponse> {
  const user = await requireApiUser();
  if (user instanceof NextResponse) return user;
  if (!can(user, venture, pageSlug)) {
    return NextResponse.json(
      { error: `No access to ${venture} · ${pageSlug}` },
      { status: 403 },
    );
  }
  return user;
}

/** Requires at least one venture grant on a page — for routes with no venture in scope. */
export async function requireApiPage(
  pageSlug: string,
): Promise<NonNullable<CurrentUser> | NextResponse> {
  const user = await requireApiUser();
  if (user instanceof NextResponse) return user;
  if (!canSeePage(user, pageSlug)) {
    return NextResponse.json(
      { error: `No access to ${pageSlug}` },
      { status: 403 },
    );
  }
  return user;
}

/**
 * Resolves a site project and checks access against its own ventureId, so the
 * caller cannot name the venture themselves.
 * Returns a 404/403 response, or the project.
 */
export async function requireApiProject(
  projectId: string,
): Promise<SiteProject | NextResponse> {
  const project = getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const auth = await requireApiAccess(project.ventureId, 'projects');
  if (auth instanceof NextResponse) return auth;
  return project;
}

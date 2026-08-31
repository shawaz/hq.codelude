/**
 * Server-component counterpart to usePageScopes. Same rule, fetched with the
 * request's Convex token so server-rendered venture strips are filtered too.
 */
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { venturesForPage, venturesForUser, type Scope } from '@/lib/nav';
import { scopeByName } from '@/lib/ventures';

async function currentUser() {
  const token = await convexAuthNextjsToken();
  return await fetchQuery(api.team.getCurrentUser, {}, { token });
}

/** Venture names visible on `pageSlug`, in registry order. */
export async function getPageScopeNames(pageSlug: string): Promise<string[]> {
  return venturesForPage(await currentUser(), pageSlug);
}

/** As above, as Scope objects. */
export async function getPageScopes(pageSlug: string): Promise<Scope[]> {
  const names = await getPageScopeNames(pageSlug);
  return names.map(scopeByName).filter((s): s is Scope => Boolean(s));
}

/** Every venture the user holds any grant on — for pages with no single slug. */
export async function getUserScopeNames(): Promise<string[]> {
  return venturesForUser(await currentUser());
}

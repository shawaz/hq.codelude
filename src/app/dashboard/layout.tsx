import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from '@/convex/_generated/api';
import Sidebar from '@/components/Sidebar';
import { canSeePage, isUnrestricted, pageForPath, venturesForUser, visibleNav, type Scope } from '@/lib/nav';
import { PATHNAME_HEADER } from '@/proxy';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await convexAuthNextjsToken();
  // One round trip for both: the registry decides which organization names are
  // live, and every access check below is resolved against it rather than the
  // compiled-in list.
  const [user, orgRows] = await Promise.all([
    fetchQuery(api.team.getCurrentUser, {}, { token }),
    fetchQuery(api.organizations.list, {}, { token }),
  ]);

  if (!user) {
    redirect('/login');
  }

  const registry: Scope[] = orgRows.map((r) => ({
    id: r.name.toLowerCase(),
    name: r.name,
    color: r.color,
    sector: r.sector,
    ...(r.holdco ? { holdco: true } : {}),
  }));
  const liveNames = registry.map((s) => s.name);

  // Pre-filtered here, exactly as `nav` is — the sidebar makes no access
  // decision of its own.
  const myOrgNames = venturesForUser(user, liveNames);
  const myOrgs = registry.filter((s) => myOrgNames.includes(s.name));
  const activeOrg =
    (user.activeVenture && myOrgNames.includes(user.activeVenture)
      ? user.activeVenture
      : myOrgs[0]?.name) ?? '';

  // Route guard. The sidebar hides links the user cannot use, but the URL is
  // still typeable — this is what actually stops them, alongside the Convex
  // assertAccess checks that guard the data itself.
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? '';
  const page = pageForPath(pathname);

  if (page) {
    if (!canSeePage(user, page.slug, liveNames)) redirect('/dashboard/tasks');
  } else if (pathname.startsWith('/dashboard/') && !isUnrestricted(user)) {
    // An unregistered dashboard route (e.g. /dashboard/ventures, which is not
    // in the nav) has no grant to check, so it cannot be scoped. Fail closed
    // and leave it to admins. /dashboard itself stays open to everyone.
    redirect('/dashboard/tasks');
  }

  return (
    <div className="hq-layout">
      <Sidebar
        user={{ name: user.name || 'Team', role: user.role }}
        nav={visibleNav(user, liveNames)}
        orgs={myOrgs}
        activeOrg={activeOrg}
        canCreateOrg={user.role === 'admin'}
      />
      <div className="hq-main">
        <div className="hq-content">{children}</div>
      </div>
    </div>
  );
}

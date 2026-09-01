import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from '@/convex/_generated/api';
import Sidebar from '@/components/Sidebar';
import { canSeePage, isUnrestricted, pageForPath, visibleNav } from '@/lib/nav';
import { PATHNAME_HEADER } from '@/proxy';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await convexAuthNextjsToken();
  const user = await fetchQuery(api.team.getCurrentUser, {}, { token });

  if (!user) {
    redirect('/login');
  }

  // Route guard. The sidebar hides links the user cannot use, but the URL is
  // still typeable — this is what actually stops them, alongside the Convex
  // assertAccess checks that guard the data itself.
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? '';
  const page = pageForPath(pathname);

  if (page) {
    if (!canSeePage(user, page.slug)) redirect('/dashboard/tasks');
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
        nav={visibleNav(user)}
      />
      <div className="hq-main">
        <div className="hq-content">{children}</div>
      </div>
    </div>
  );
}

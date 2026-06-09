import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionData, sessionOptions } from '@/lib/session';
import Sidebar from '@/components/Sidebar';
import { VentureProvider } from '@/contexts/venture-context';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="hq-layout">
      <VentureProvider>
        <Sidebar user={{ name: session.name!, role: session.role! }} />
        <div className="hq-main">
          <div className="hq-content">{children}</div>
        </div>
      </VentureProvider>
    </div>
  );
}

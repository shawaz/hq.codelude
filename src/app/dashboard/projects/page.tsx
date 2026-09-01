import Link from 'next/link';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { PROJECT_COLORS, type Project } from '@/lib/tasks';
import { getAllProjects } from '@/lib/site-projects';
import SiteProjectsBoard from './site-projects-board';

const PROJECTS: { name: Project; sector: string }[] = [
  { name: 'Roborns',     sector: 'Coastal AI Infrastructure' },
  { name: 'Franchiseen', sector: 'AI Business Assistant' },
  { name: 'HubCV',       sector: 'AI Career Assistant' },
  { name: 'Dextrip',     sector: 'AI Trading Assistant' },
  { name: 'Llife',       sector: 'AI Life Assistant' },
];

export default async function ProjectsPage() {
  const siteProjects = getAllProjects();
  // Server component, so this fetches rather than subscribes.
  const token = await convexAuthNextjsToken();
  const TASKS = await fetchQuery(api.tasks.list, {}, { token });

  return (
    <div>
      <h1 className="page-title">Projects</h1>
      <p className="page-sub">Task progress across all five ventures.</p>

      <div className="projects-grid">
        {PROJECTS.map(({ name, sector }) => {
          const all        = TASKS.filter(t => t.project === name);
          const done       = all.filter(t => t.status === 'done').length;
          const inProgress = all.filter(t => t.status === 'in-progress').length;
          const todo       = all.filter(t => t.status === 'todo').length;
          const pct        = all.length ? Math.round((done / all.length) * 100) : 0;
          const color      = PROJECT_COLORS[name];

          return (
            <div key={name} className="project-card" style={{ borderTop: `2px solid ${color}` }}>
              <div className="project-card-top">
                <div>
                  <div className="project-card-name">{name}</div>
                  <div className="project-card-sector">{sector}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800,
                  color, letterSpacing: '-0.02em',
                }}>{pct}%</span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>

              <div className="project-task-counts">
                <div className="ptc">
                  <span className="ptc-num" style={{ color }}>{done}</span>
                  <span className="ptc-label">Done</span>
                </div>
                <div className="ptc">
                  <span className="ptc-num" style={{ color: 'var(--accent-text)' }}>{inProgress}</span>
                  <span className="ptc-label">In Progress</span>
                </div>
                <div className="ptc">
                  <span className="ptc-num" style={{ color: 'var(--muted)' }}>{todo}</span>
                  <span className="ptc-label">Todo</span>
                </div>
                <div className="ptc">
                  <span className="ptc-num">{all.length}</span>
                  <span className="ptc-label">Total</span>
                </div>
              </div>

              <Link href="/dashboard/tasks" className="proj-link">
                View tasks →
              </Link>
            </div>
          );
        })}
      </div>

      <SiteProjectsBoard projects={siteProjects} />
    </div>
  );
}

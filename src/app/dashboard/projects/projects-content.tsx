'use client';

import Link from 'next/link';
import { TASKS, PROJECT_COLORS, type Project } from '@/lib/tasks';
import { useVenture } from '@/contexts/venture-context';
import { VENTURES } from '@/lib/ventures';
import SiteProjectsBoard from './site-projects-board';
import VentureTabs from '@/components/VentureTabs';
import type { SiteProject } from '@/lib/site-projects';

const VENTURE_SECTORS: Record<string, string> = {
  Roborns:     'Coastal AI Infrastructure',
  Franchiseen: 'Franchise Finance OS',
  HubCV:       'AI Career Intelligence',
  Cuestay:     'Home AI Automation',
  Dextrip:     'Decentralised Trading Automation',
};

export default function ProjectsContent({ siteProjects }: { siteProjects: SiteProject[] }) {
  const { vi } = useVenture();
  const ventureName = VENTURES[vi].name as Project;
  const color = PROJECT_COLORS[ventureName];
  const sector = VENTURE_SECTORS[ventureName];
  const all = TASKS.filter(t => t.project === ventureName);
  const done = all.filter(t => t.status === 'done').length;
  const inProgress = all.filter(t => t.status === 'in-progress').length;
  const todo = all.filter(t => t.status === 'todo').length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const ventureProjects = siteProjects.filter(p => p.ventureId === ventureName);

  return (
    <div>
      <h1 className="page-title">Projects</h1>
      <p className="page-sub">Task progress across all five ventures.</p>
      <VentureTabs />

      <div className="projects-grid">
        <div className="project-card" style={{ borderTop: `2px solid ${color}` }}>
          <div className="project-card-top">
            <div>
              <div className="project-card-name">{ventureName}</div>
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
              <span className="ptc-num" style={{ color: 'var(--accent)' }}>{inProgress}</span>
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
      </div>

      <SiteProjectsBoard key={ventureName} projects={ventureProjects} initialVenture={ventureName} />
    </div>
  );
}

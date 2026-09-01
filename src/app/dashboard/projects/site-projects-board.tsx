'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PROJECT_COLORS, type Project } from '@/lib/tasks';
import type { SiteProject, SiteProjectStatus } from '@/lib/site-projects';
import SiteBoundaryMap, { type BoundaryResult } from '@/components/site-boundary-map';
import { usePageScopes } from '@/lib/use-page-scopes';
import { sc, scBorder } from '@/lib/status-colors';


const STATUS_STYLES: Record<SiteProjectStatus, { color: string; label: string }> = {
  planning:  { color: '#b5b5b5', label: 'Planning'  },
  active:    { color: '#dbdbdb', label: 'Active'    },
  paused:    { color: 'var(--muted)', label: 'Paused'    },
  completed: { color: '#a5a5a5', label: 'Completed' },
};

const inputStyle: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.75rem 1rem', outline: 'none', width: '100%',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase',
};

export default function SiteProjectsBoard({ projects }: { projects: SiteProject[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  // Only offer ventures this user can actually create a project under — the
  // POST /api/projects handler rejects the rest anyway.
  const { names: allowed } = usePageScopes('projects');
  const VENTURES = allowed as Project[];
  const [ventureId, setVentureId] = useState<Project>('Roborns');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<SiteProjectStatus>('planning');
  const [boundary, setBoundary] = useState<BoundaryResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    setName(''); setVentureId('Roborns'); setLocation(''); setStatus('planning');
    setBoundary(null);
    setSaving(false); setError('');
    setOpen(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, ventureId, location, status, source: 'manual',
          boundary: boundary?.polygon ?? null,
          center: boundary?.center ?? null,
          areaHectares: boundary?.areaHectares ?? null,
        }),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      router.refresh();
    } catch {
      setError('Failed to create project. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Site Projects</h2>
        <button onClick={openModal} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.55rem 1.1rem', border: '1px solid var(--accent)', color: 'var(--accent-text)',
          background: 'transparent', cursor: 'pointer',
        }}>
          + New Project
        </button>
      </div>
      <p className="page-sub" style={{ marginBottom: '1.5rem' }}>
        Individual location-based deployments — each plannable with its own budget, team, tasks and activities.
      </p>

      {projects.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          No site projects yet. Create one manually, or convert a qualified lead from the Leads page.
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => {
            const color = PROJECT_COLORS[p.ventureId];
            const ss = STATUS_STYLES[p.status];
            const done = p.tasks.filter(t => t.status === 'done').length;
            const total = p.tasks.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="project-card" style={{ borderTop: `2px solid ${color}`, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="project-card-top">
                  <div>
                    <div className="project-card-name">{p.name}</div>
                    <div className="project-card-sector">{p.location}</div>
                  </div>
                  <span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                </div>

                <div className="project-task-counts">
                  <div className="ptc">
                    <span className="ptc-num" style={{ color }}>{p.ventureId}</span>
                    <span className="ptc-label">Venture</span>
                  </div>
                  <div className="ptc">
                    <span className="ptc-num" style={{ color: 'var(--accent-text)' }}>{p.budget.length}</span>
                    <span className="ptc-label">Budget lines</span>
                  </div>
                  <div className="ptc">
                    <span className="ptc-num" style={{ color: 'var(--muted)' }}>{p.team.length}</span>
                    <span className="ptc-label">Team</span>
                  </div>
                  <div className="ptc">
                    <span className="ptc-num">{done}/{total}</span>
                    <span className="ptc-label">Tasks done</span>
                  </div>
                </div>

                <span className="proj-link">Plan project →</span>
              </Link>
            );
          })}
        </div>
      )}

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setOpen(false)}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxWidth: 640, width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>New site project</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>Plan a new location-based project</div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={labelStyle}>Project name</label>
                <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Roborns Coastal Site — Visakhapatnam" required autoFocus />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={labelStyle}>Venture</label>
                  <select style={inputStyle} value={ventureId} onChange={e => setVentureId(e.target.value as Project)}>
                    {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as SiteProjectStatus)}>
                    {(Object.keys(STATUS_STYLES) as SiteProjectStatus[]).map(s => <option key={s} value={s}>{STATUS_STYLES[s].label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Uchila Thalapady, Mangaluru" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={labelStyle}>Site boundary (optional)</label>
                <SiteBoundaryMap editable height={320} onChange={setBoundary} />
              </div>
              {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: sc('#9d9d9d') }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={saving} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'var(--accent)', color: 'var(--on-accent)', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  {saving ? 'Creating...' : 'Create project →'}
                </button>
                <button type="button" onClick={() => setOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--card-border)', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

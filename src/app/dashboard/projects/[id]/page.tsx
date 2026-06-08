'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PROJECT_COLORS, type Status } from '@/lib/tasks';
import type { SiteProject, BudgetLine, TeamMember, ProjectTask, Activity, SiteProjectStatus, ActivityStatus } from '@/lib/site-projects';

type Tab = 'overview' | 'budget' | 'team' | 'tasks' | 'activities';

const STATUS_STYLES: Record<SiteProjectStatus, { color: string; label: string }> = {
  planning:  { color: '#FAC775', label: 'Planning'  },
  active:    { color: '#5DCAA5', label: 'Active'    },
  paused:    { color: '#7a7870', label: 'Paused'    },
  completed: { color: '#85B7EB', label: 'Completed' },
};

const ACTIVITY_STYLES: Record<ActivityStatus, { color: string; label: string }> = {
  planned:      { color: 'var(--muted)', label: 'Planned'     },
  'in-progress':{ color: '#FAC775',      label: 'In Progress' },
  done:         { color: '#5DCAA5',      label: 'Done'        },
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<SiteProject | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('overview');

  async function load() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) { setProject(null); return; }
      setProject(await res.json());
    } catch { setProject(null); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [projectId]);

  if (project === undefined) {
    return (
      <div>
        <Link href="/dashboard/projects" className="task-back">← Back to projects</Link>
        <div className="empty-note">Loading project…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Link href="/dashboard/projects" className="task-back">← Back to projects</Link>
        <h1 className="page-title">Project not found</h1>
        <p className="page-sub">No site project with id &ldquo;{projectId}&rdquo; exists.</p>
      </div>
    );
  }

  const color = PROJECT_COLORS[project.ventureId];
  const ss = STATUS_STYLES[project.status];

  return (
    <div style={{ maxWidth: 880 }}>
      <Link href="/dashboard/projects" className="task-back">← Back to projects</Link>

      <div className="task-detail-head">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
          <div className="task-detail-meta">
            <span className="project-label">
              <span className="task-dot" style={{ background: color }} />
              {project.ventureId}
            </span>
            <span className="category-label">· {project.location}</span>
            <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span>
            {project.source === 'lead' && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Converted from lead
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-tabs">
        <button className={`task-tab${tab === 'overview' ? ' active' : ''}`}   onClick={() => setTab('overview')}>Overview</button>
        <button className={`task-tab${tab === 'budget' ? ' active' : ''}`}     onClick={() => setTab('budget')}>Budget</button>
        <button className={`task-tab${tab === 'team' ? ' active' : ''}`}       onClick={() => setTab('team')}>Team</button>
        <button className={`task-tab${tab === 'tasks' ? ' active' : ''}`}      onClick={() => setTab('tasks')}>Tasks</button>
        <button className={`task-tab${tab === 'activities' ? ' active' : ''}`} onClick={() => setTab('activities')}>Activities</button>
      </div>

      {tab === 'overview'   && <OverviewPanel project={project} color={color} onStatusChange={load} />}
      {tab === 'budget'     && <BudgetPanel projectId={project.id} budget={project.budget} onChange={load} />}
      {tab === 'team'       && <TeamPanel projectId={project.id} team={project.team} onChange={load} />}
      {tab === 'tasks'      && <TasksPanel projectId={project.id} tasks={project.tasks} onChange={load} />}
      {tab === 'activities' && <ActivitiesPanel projectId={project.id} activities={project.activities} onChange={load} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Overview
// ─────────────────────────────────────────────────────────────────────
function OverviewPanel({ project, color, onStatusChange }: { project: SiteProject; color: string; onStatusChange: () => void }) {
  const [saving, setSaving] = useState(false);

  async function setStatus(status: SiteProjectStatus) {
    if (status === project.status || saving) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      onStatusChange();
    } finally { setSaving(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>Site details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          <div><span style={{ color: 'var(--muted)' }}>Venture: </span><span style={{ color }}>{project.ventureId}</span></div>
          <div><span style={{ color: 'var(--muted)' }}>Location: </span><span style={{ color: 'var(--off-white)' }}>{project.location}</span></div>
          <div><span style={{ color: 'var(--muted)' }}>Source: </span><span style={{ color: 'var(--off-white)' }}>{project.source === 'lead' ? `Converted from lead${project.leadId ? ` (${project.leadId})` : ''}` : 'Manually created'}</span></div>
          <div><span style={{ color: 'var(--muted)' }}>Created: </span><span style={{ color: 'var(--off-white)' }}>{fmtDate(project.createdAt)}</span></div>
        </div>
        {project.config && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>
            {project.config}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>Status</div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(Object.keys(STATUS_STYLES) as SiteProjectStatus[]).map(s => {
            const st = STATUS_STYLES[s];
            const active = project.status === s;
            return (
              <button key={s} onClick={() => setStatus(s)} disabled={saving} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.5rem 1rem', cursor: saving ? 'default' : 'pointer',
                border: `1px solid ${active ? st.color : 'var(--card-border)'}`,
                color: active ? st.color : 'var(--muted)',
                background: active ? `${st.color}14` : 'transparent',
              }}>
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Budget
// ─────────────────────────────────────────────────────────────────────
function BudgetPanel({ projectId, budget, onChange }: { projectId: string; budget: BudgetLine[]; onChange: () => void }) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!label.trim() || !category.trim() || !amount.trim() || saving) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/budget`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.trim(), category: category.trim(), amount: parseFloat(amount), currency: currency.trim() || 'INR' }),
      });
      setLabel(''); setCategory(''); setAmount('');
      onChange();
    } finally { setSaving(false); }
  }

  async function remove(lineId: string) {
    await fetch(`/api/projects/${projectId}/budget?lineId=${encodeURIComponent(lineId)}`, { method: 'DELETE' });
    onChange();
  }

  const totals = budget.reduce<Record<string, number>>((acc, b) => {
    acc[b.currency] = (acc[b.currency] ?? 0) + b.amount;
    return acc;
  }, {});

  return (
    <div>
      <div className="note-form" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr auto', display: 'grid', gap: '0.6rem', alignItems: 'end' }}>
        <Field label="Label">      <input className="form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Coastal land lease" /></Field>
        <Field label="Category">   <input className="form-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Land, Engineering" /></Field>
        <Field label="Amount">     <input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" /></Field>
        <Field label="Currency">   <input className="form-input" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="INR" /></Field>
        <button className="btn-primary" onClick={add} disabled={saving} style={{ height: 'fit-content' }}>{saving ? 'Adding…' : 'Add line'}</button>
      </div>

      {Object.keys(totals).length > 0 && (
        <div style={{ display: 'flex', gap: '1.5rem', margin: '1.25rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
          {Object.entries(totals).map(([cur, total]) => (
            <div key={cur}><span style={{ color: 'var(--muted)' }}>Total {cur}: </span><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{total.toLocaleString()}</span></div>
          ))}
        </div>
      )}

      {budget.length === 0 ? (
        <div className="empty-note">No budget lines yet — add the first one above.</div>
      ) : (
        <div className="note-list">
          {budget.map(b => (
            <div key={b.id} className="note-item">
              <div className="note-item-top">
                <span className="note-date">{b.category}{b.notes ? ` · ${b.notes}` : ''}</span>
                <button className="icon-btn" onClick={() => remove(b.id)}>Delete</button>
              </div>
              <div className="note-text" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{b.label}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{b.amount.toLocaleString()} {b.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Team
// ─────────────────────────────────────────────────────────────────────
function TeamPanel({ projectId, team, onChange }: { projectId: string; team: TeamMember[]; onChange: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!name.trim() || !role.trim() || saving) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/team`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), role: role.trim(), contact: contact.trim() || undefined }),
      });
      setName(''); setRole(''); setContact('');
      onChange();
    } finally { setSaving(false); }
  }

  async function remove(memberId: string) {
    await fetch(`/api/projects/${projectId}/team?memberId=${encodeURIComponent(memberId)}`, { method: 'DELETE' });
    onChange();
  }

  return (
    <div>
      <div className="note-form" style={{ gridTemplateColumns: '1.2fr 1fr 1fr auto', display: 'grid', gap: '0.6rem', alignItems: 'end' }}>
        <Field label="Name">    <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Anita Rao" /></Field>
        <Field label="Role">    <input className="form-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Site engineer" /></Field>
        <Field label="Contact"> <input className="form-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="email / phone" /></Field>
        <button className="btn-primary" onClick={add} disabled={saving} style={{ height: 'fit-content' }}>{saving ? 'Adding…' : 'Add member'}</button>
      </div>

      {team.length === 0 ? (
        <div className="empty-note" style={{ marginTop: '1.25rem' }}>No team members assigned yet.</div>
      ) : (
        <div className="note-list" style={{ marginTop: '1.25rem' }}>
          {team.map(m => (
            <div key={m.id} className="note-item">
              <div className="note-item-top">
                <span className="note-date">{m.role}{m.contact ? ` · ${m.contact}` : ''}</span>
                <button className="icon-btn" onClick={() => remove(m.id)}>Remove</button>
              </div>
              <div className="note-text">{m.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────────────
const TASK_STATUS_CYCLE: Record<Status, Status> = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };

function TasksPanel({ projectId, tasks, onChange }: { projectId: string; tasks: ProjectTask[]; onChange: () => void }) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      setTitle('');
      onChange();
    } finally { setSaving(false); }
  }

  async function cycleStatus(task: ProjectTask) {
    await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, status: TASK_STATUS_CYCLE[task.status] }),
    });
    onChange();
  }

  async function remove(taskId: string) {
    await fetch(`/api/projects/${projectId}/tasks?taskId=${encodeURIComponent(taskId)}`, { method: 'DELETE' });
    onChange();
  }

  return (
    <div>
      <div className="note-form">
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add(); }}
          placeholder="e.g. Sign coastal land lease — site survey scheduled" />
        <button className="btn-primary" onClick={add} disabled={!title.trim() || saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Adding…' : 'Add task'}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-note">No tasks planned for this site yet — add the first one above.</div>
      ) : (
        <div className="note-list">
          {tasks.map(t => (
            <div key={t.id} className="note-item">
              <div className="note-item-top">
                <button className={`status-badge ${t.status}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => cycleStatus(t)} title="Click to advance status">
                  {t.status === 'in-progress' ? 'In Progress' : t.status === 'done' ? 'Done' : 'Todo'}
                </button>
                <button className="icon-btn" onClick={() => remove(t.id)}>Delete</button>
              </div>
              <div className="note-text">{t.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Activities
// ─────────────────────────────────────────────────────────────────────
const ACTIVITY_STATUS_CYCLE: Record<ActivityStatus, ActivityStatus> = { planned: 'in-progress', 'in-progress': 'done', done: 'planned' };

function ActivitiesPanel({ projectId, activities, onChange }: { projectId: string; activities: Activity[]; onChange: () => void }) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/activities`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), status: 'planned' }),
      });
      setTitle('');
      onChange();
    } finally { setSaving(false); }
  }

  async function cycleStatus(activity: Activity) {
    await fetch(`/api/projects/${projectId}/activities`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: activity.id, status: ACTIVITY_STATUS_CYCLE[activity.status] }),
    });
    onChange();
  }

  async function remove(activityId: string) {
    await fetch(`/api/projects/${projectId}/activities?activityId=${encodeURIComponent(activityId)}`, { method: 'DELETE' });
    onChange();
  }

  return (
    <div>
      <div className="note-form">
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add(); }}
          placeholder="e.g. Submit environmental clearance application" />
        <button className="btn-primary" onClick={add} disabled={!title.trim() || saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Adding…' : 'Log activity'}
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="empty-note">No activities logged yet — add the first one above.</div>
      ) : (
        <div className="note-list">
          {activities.map(a => {
            const as = ACTIVITY_STYLES[a.status];
            return (
              <div key={a.id} className="note-item">
                <div className="note-item-top">
                  <span className="note-date">{fmtDate(a.date)}</span>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <button onClick={() => cycleStatus(a)} title="Click to advance status" style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: as.color, border: `1px solid ${as.color}40`, background: 'transparent', borderRadius: '2px',
                      padding: '0.2rem 0.6rem', cursor: 'pointer',
                    }}>{as.label}</button>
                    <button className="icon-btn" onClick={() => remove(a.id)}>Delete</button>
                  </div>
                </div>
                <div className="note-text">{a.title}{a.notes ? ` — ${a.notes}` : ''}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

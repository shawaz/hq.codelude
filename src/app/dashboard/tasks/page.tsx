'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS, PROJECT_COLORS, type Project, type Status, type Priority } from '@/lib/tasks';

const PROJECTS: Project[] = ['Roborns', 'Franchiseen', 'HubCV', 'Llife', 'Dextrip'];
const STATUSES: { key: Status | 'all'; label: string }[] = [
  { key: 'all',         label: 'All' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'todo',        label: 'Todo' },
  { key: 'done',        label: 'Done' },
];

export default function TasksPage() {
  const router = useRouter();
  const [project, setProject]   = useState<Project | 'all'>('all');
  const [status,  setStatus]    = useState<Status | 'all'>('all');

  const filtered = TASKS.filter(t =>
    (project === 'all' || t.project === project) &&
    (status  === 'all' || t.status  === status)
  );

  const total      = filtered.length;
  const done       = filtered.filter(t => t.status === 'done').length;
  const inProgress = filtered.filter(t => t.status === 'in-progress').length;
  const todo       = filtered.filter(t => t.status === 'todo').length;

  return (
    <div>
      <h1 className="page-title">Tasks</h1>
      <p className="page-sub">All tasks across the five ventures — filtered by project and status.</p>

      <div className="tasks-count-row">
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{total}</div>
          <div className="tasks-count-label">Total</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--accent-text)' }}>{inProgress}</div>
          <div className="tasks-count-label">In Progress</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--muted)' }}>{todo}</div>
          <div className="tasks-count-label">Todo</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{done}</div>
          <div className="tasks-count-label">Done</div>
        </div>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-pill${project === 'all' ? ' active' : ''}`}
          onClick={() => setProject('all')}
        >All projects</button>
        {PROJECTS.map(p => (
          <button
            key={p}
            className={`filter-pill${project === p ? ' active' : ''}`}
            style={project === p ? { borderColor: PROJECT_COLORS[p], color: PROJECT_COLORS[p] } : {}}
            onClick={() => setProject(p)}
          >
            {p}
          </button>
        ))}
        <div className="filter-divider" />
        {STATUSES.map(s => (
          <button
            key={s.key}
            className={`filter-pill${status === s.key ? ' active' : ''}`}
            onClick={() => setStatus(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Task</th>
            <th>Project</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(task => (
            <tr
              key={task.id}
              onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td className="task-title">{task.title}</td>
              <td>
                <span className="project-label">
                  <span
                    className="task-dot"
                    style={{ background: PROJECT_COLORS[task.project] }}
                  />
                  {task.project}
                </span>
              </td>
              <td><span className="category-label">{task.category}</span></td>
              <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
              <td>
                <span className={`status-badge ${task.status}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'Todo'}
                </span>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                No tasks match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

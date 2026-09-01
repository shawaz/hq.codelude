'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PROJECT_COLORS, type Project, type Status } from '@/lib/tasks';
import { sc, scBorder } from '@/lib/status-colors';
import VenturePageLayout, { NoRows, type VentureTab } from '@/components/VenturePageLayout';
import NewTaskForm from '@/components/NewTaskForm';

// Status becomes the tab row, matching how every other venture-tabbed page in
// the app works. The venture strip replaces the old "All projects" pill list.
const TABS: VentureTab[] = [
  { key: 'all',         label: 'All'         },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'todo',        label: 'Todo'        },
  { key: 'done',        label: 'Done'        },
];

const STATUS_LABEL: Record<string, string> = {
  'in-progress': 'In Progress',
  done: 'Done',
  todo: 'Todo',
};

export default function TasksPage() {
  const router = useRouter();
  const allTasks = useQuery(api.tasks.list, {});
  const setStatus = useMutation(api.tasks.setStatus);
  const [adding, setAdding] = useState(false);

  return (
    <VenturePageLayout
      title="Tasks"
      subtitle="All tasks across the five ventures — filtered by venture and status."
      pageSlug="tasks"
      eyebrow={() => 'tasks'}
      heading={v => `${v.name} Tasks`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        const forVenture = (allTasks ?? []).filter(t => t.project === venture.name);
        const rows = tab === 'all' ? forVenture : forVenture.filter(t => t.status === tab);

        const done       = forVenture.filter(t => t.status === 'done').length;
        const inProgress = forVenture.filter(t => t.status === 'in-progress').length;
        const todo       = forVenture.filter(t => t.status === 'todo').length;

        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              {!adding && (
                <button
                  onClick={() => setAdding(true)}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '0.45rem 1rem', cursor: 'pointer',
                    background: venture.color, border: `1px solid ${venture.color}`,
                    color: 'var(--on-brand)', fontWeight: 700,
                  }}
                >+ New task</button>
              )}
            </div>

            {adding && (
              <NewTaskForm
                project={venture.name}
                accent={venture.color}
                compact={false}
                onClose={() => setAdding(false)}
              />
            )}

            <div className="tasks-count-row">
              <div className="tasks-count-cell">
                <div className="tasks-count-num">{forVenture.length}</div>
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
                <div className="tasks-count-num" style={{ color: sc('#dbdbdb') }}>{done}</div>
                <div className="tasks-count-label">Done</div>
              </div>
            </div>

            {allTasks === undefined ? (
              <NoRows>Loading tasks…</NoRows>
            ) : rows.length === 0 ? (
              <NoRows>
                {tab === 'all'
                  ? `No tasks for ${venture.name} yet. Use New task to add one.`
                  : `No ${STATUS_LABEL[tab]?.toLowerCase() ?? tab} tasks for ${venture.name}.`}
              </NoRows>
            ) : (
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Task</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(task => (
                    <tr key={task._id} style={{ cursor: 'pointer' }}>
                      <td
                        className="task-title"
                        onClick={() => router.push(`/dashboard/tasks/${task._id}`)}
                      >{task.title}</td>
                      <td onClick={() => router.push(`/dashboard/tasks/${task._id}`)}>
                        <span className="category-label">{task.category}</span>
                      </td>
                      <td onClick={() => router.push(`/dashboard/tasks/${task._id}`)}>
                        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                      </td>
                      <td>
                        {/* Status is editable here — the whole point of the migration.
                            Stops propagation so changing it does not also navigate. */}
                        <select
                          value={task.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                            void setStatus({ id: task._id, status: e.target.value as Status });
                          }}
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            padding: '0.15rem 0.4rem', cursor: 'pointer',
                            background: 'transparent',
                            border: `1px solid ${scBorder(PROJECT_COLORS[venture.name as Project])}`,
                            color: 'var(--muted)',
                          }}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}

import { TRAINING } from '@/lib/people';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  completed:   { color: '#5DCAA5', label: 'Done'        },
  'in-progress':{ color: '#c8f53a', label: 'In Progress' },
  planned:     { color: 'var(--muted)', label: 'Planned'     },
};

const CAT_COLORS: Record<string, string> = {
  Legal: '#F0997B', Engineering: '#85B7EB', Business: '#FAC775', Technical: '#85B7EB',
};

export default function TrainingPage() {
  return (
    <div>
      <h1 className="page-title">Training</h1>
      <p className="page-sub">Learning resources and skill development tracking for the team.</p>
      <table className="tasks-table">
        <thead><tr><th style={{ width: '35%' }}>Topic</th><th>Category</th><th>Assignee</th><th>Resource</th><th>Status</th></tr></thead>
        <tbody>
          {TRAINING.map((t, i) => {
            const ss = STATUS_STYLES[t.status];
            return (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{t.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{t.notes}</div>
                </td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: CAT_COLORS[t.category] || 'var(--muted)' }}>{t.category}</span></td>
                <td><span className="category-label">{t.assignee}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.6rem' }}>{t.resource}</span></td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

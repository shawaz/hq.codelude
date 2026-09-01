import { TRAINING } from '@/lib/people';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  completed:   { color: '#dbdbdb', label: 'Done'        },
  'in-progress':{ color: '#eeeeee', label: 'In Progress' },
  planned:     { color: 'var(--muted)', label: 'Planned'     },
};

const CAT_COLORS: Record<string, string> = {
  Legal: '#adadad', Engineering: '#a5a5a5', Business: '#b5b5b5', Technical: '#a5a5a5',
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
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

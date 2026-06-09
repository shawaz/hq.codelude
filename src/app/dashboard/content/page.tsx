'use client';
import { useState } from 'react';
import { CONTENT, type ContentStatus } from '@/lib/mktg';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<ContentStatus, { color: string; label: string }> = {
  published:   { color: '#5DCAA5', label: 'Published'   },
  'in-progress':{ color: '#c8f53a', label: 'In Progress' },
  planned:     { color: '#FAC775', label: 'Planned'     },
  idea:        { color: '#7a7870', label: 'Idea'        },
};
const TYPE_COLORS: Record<string, string> = { Article: '#7F77DD', 'Social Post': '#c8f53a', Video: '#F0997B', 'Case Study': '#5DCAA5', 'Press Release': '#85B7EB', Newsletter: '#FAC775' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B' };

export default function ContentPage() {
  const [status, setStatus] = useState<ContentStatus | 'all'>('all');
  const filtered = CONTENT.filter(c => status === 'all' || c.status === status);
  return (
    <div>
      <h1 className="page-title">Content</h1>
      <p className="page-sub">Content calendar — articles, social posts, case studies, and press releases across all ventures.</p>
      <VentureTabs />
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${status === 'all' ? ' active' : ''}`} onClick={() => setStatus('all')}>All</button>
        {(Object.entries(STATUS_STYLES) as [ContentStatus, typeof STATUS_STYLES[ContentStatus]][]).map(([key, s]) => (
          <button key={key} className={`filter-pill${status === key ? ' active' : ''}`} style={status === key ? { borderColor: s.color, color: s.color } : {}} onClick={() => setStatus(key)}>{s.label}</button>
        ))}
      </div>
      <table className="tasks-table">
        <thead><tr><th style={{ width: '35%' }}>Title</th><th>Venture</th><th>Type</th><th>Channel</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>
          {filtered.map((c, i) => {
            const ss = STATUS_STYLES[c.status];
            return (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{c.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{c.notes}</div>
                </td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[c.venture] }}>{c.venture}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[c.type]}40`, color: TYPE_COLORS[c.type] }}>{c.type}</span></td>
                <td><span className="category-label">{c.channel}</span></td>
                <td><span className="category-label">{c.dueDate}</span></td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

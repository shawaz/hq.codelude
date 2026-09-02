'use client';
import { useState } from 'react';
import { CONTENT, type ContentStatus } from '@/lib/mktg';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<ContentStatus, { color: string; label: string }> = {
  published:   { color: '#dbdbdb', label: 'Published'   },
  'in-progress':{ color: '#eeeeee', label: 'In Progress' },
  planned:     { color: '#b5b5b5', label: 'Planned'     },
  idea:        { color: 'var(--muted)', label: 'Idea'        },
};
const TYPE_COLORS: Record<string, string> = { Article: '#c8c8c8', 'Social Post': '#eeeeee', Video: '#adadad', 'Case Study': '#dbdbdb', 'Press Release': '#a5a5a5', Newsletter: '#b5b5b5' };
const VENTURE_COLORS: Record<string, string> = { Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8', HubCV: '#b5b5b5', Llife: '#a5a5a5', Nanotrade: '#adadad' };

export default function ContentPage() {
  const [status, setStatus] = useState<ContentStatus | 'all'>('all');
  const filtered = CONTENT.filter(c => status === 'all' || c.status === status);
  return (
    <div>
      <h1 className="page-title">Content</h1>
      <p className="page-sub">Content calendar — articles, social posts, case studies, and press releases across all ventures.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${status === 'all' ? ' active' : ''}`} onClick={() => setStatus('all')}>All</button>
        {(Object.entries(STATUS_STYLES) as [ContentStatus, typeof STATUS_STYLES[ContentStatus]][]).map(([key, s]) => (
          <button key={key} className={`filter-pill${status === key ? ' active' : ''}`} style={status === key ? { borderColor: s.color, color: sc(s.color) } : {}} onClick={() => setStatus(key)}>{s.label}</button>
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
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: sc(VENTURE_COLORS[c.venture]) }}>{c.venture}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[c.type])}`, color: sc(TYPE_COLORS[c.type]) }}>{c.type}</span></td>
                <td><span className="category-label">{c.channel}</span></td>
                <td><span className="category-label">{c.dueDate}</span></td>
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

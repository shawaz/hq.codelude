'use client';

import { useState } from 'react';
import { FILES, type FileCategory, type FileStatus } from '@/lib/workspace';

const CATEGORIES: (FileCategory | 'all')[] = ['all', 'Financial Model', 'Pitch Deck', 'Legal', 'Brand', 'Technical', 'Research', 'Internal'];
const VENTURES = ['All', 'Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const CAT_COLORS: Record<FileCategory, string> = {
  'Financial Model': '#5DCAA5',
  'Pitch Deck':      '#7F77DD',
  'Legal':           '#F0997B',
  'Brand':           '#c8f53a',
  'Technical':       '#85B7EB',
  'Research':        '#FAC775',
  'Internal':        '#7a7870',
};

const STATUS_STYLES: Record<FileStatus, { color: string; label: string }> = {
  final:    { color: '#5DCAA5', label: 'Final'    },
  draft:    { color: '#FAC775', label: 'Draft'    },
  review:   { color: '#c8f53a', label: 'Review'   },
  archived: { color: '#7a7870', label: 'Archived' },
};

const FORMAT_COLORS: Record<string, string> = {
  HTML: '#F0997B', PDF: '#ff8080', XLSX: '#5DCAA5', PPTX: '#7F77DD',
  DOCX: '#85B7EB', Figma: '#c8f53a', MD: '#FAC775', 'PNG/SVG': '#7a7870',
};

export default function FilesPage() {
  const [category, setCategory] = useState<FileCategory | 'all'>('all');
  const [venture,  setVenture]  = useState('All');

  const filtered = FILES.filter(f =>
    (category === 'all' || f.category === category) &&
    (venture  === 'All' || f.venture  === venture)
  );

  return (
    <div>
      <h1 className="page-title">Files</h1>
      <p className="page-sub">Shared documents, decks, models, and assets — with storage locations and version tracking.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',   val: FILES.length,                                        color: 'var(--off-white)' },
          { label: 'Final',   val: FILES.filter(f => f.status === 'final').length,      color: '#5DCAA5' },
          { label: 'Draft',   val: FILES.filter(f => f.status === 'draft').length,      color: '#FAC775' },
          { label: 'Review',  val: FILES.filter(f => f.status === 'review').length,     color: '#c8f53a' },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: VENTURE_COLORS[v] } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${category === c ? ' active' : ''}`}
            style={category === c && c !== 'all' ? { borderColor: CAT_COLORS[c as FileCategory], color: CAT_COLORS[c as FileCategory] } : {}}
            onClick={() => setCategory(c)}>{c === 'all' ? 'All types' : c}</button>
        ))}
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th style={{ width: '28%' }}>File</th>
            <th>Venture</th>
            <th>Category</th>
            <th>Format</th>
            <th>Version</th>
            <th>Date</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(f => {
            const ss = STATUS_STYLES[f.status];
            return (
              <tr key={f.id}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{f.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', lineHeight: 1.5 }}>{f.notes}</div>
                </td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[f.venture] }}>{f.venture}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: CAT_COLORS[f.category] }}>{f.category}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${FORMAT_COLORS[f.format] || 'var(--card-border)'}40`, color: FORMAT_COLORS[f.format] || 'var(--muted)' }}>{f.format}</span></td>
                <td><span className="category-label">{f.version}</span></td>
                <td><span className="category-label">{f.date}</span></td>
                <td><span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40` }}>{ss.label}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', wordBreak: 'break-all' }}>{f.location}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

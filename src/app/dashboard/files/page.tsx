'use client';

import { useState } from 'react';
import { FILES, type FileCategory, type FileStatus } from '@/lib/workspace';
import { usePageScopes } from '@/lib/use-page-scopes';
import { sc, scBorder } from '@/lib/status-colors';

const CATEGORIES: (FileCategory | 'all')[] = ['all', 'Financial Model', 'Pitch Deck', 'Legal', 'Brand', 'Technical', 'Research', 'Internal'];

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8',
  HubCV: '#b5b5b5', Llife: '#a5a5a5', Dextrip: '#adadad',
};

const CAT_COLORS: Record<FileCategory, string> = {
  'Financial Model': '#dbdbdb',
  'Pitch Deck':      '#c8c8c8',
  'Legal':           '#adadad',
  'Brand':           '#eeeeee',
  'Technical':       '#a5a5a5',
  'Research':        '#b5b5b5',
  'Internal':        'var(--muted)',
};

const STATUS_STYLES: Record<FileStatus, { color: string; label: string }> = {
  final:    { color: '#dbdbdb', label: 'Final'    },
  draft:    { color: '#b5b5b5', label: 'Draft'    },
  review:   { color: '#eeeeee', label: 'Review'   },
  archived: { color: 'var(--muted)', label: 'Archived' },
};

const FORMAT_COLORS: Record<string, string> = {
  HTML: '#adadad', PDF: '#9d9d9d', XLSX: '#dbdbdb', PPTX: '#c8c8c8',
  DOCX: '#a5a5a5', Figma: '#eeeeee', MD: '#b5b5b5', 'PNG/SVG': 'var(--muted)',
};

export default function FilesPage() {
  const { names: allowed } = usePageScopes('files');
  const VENTURES = ['All', ...allowed];
  const [category, setCategory] = useState<FileCategory | 'all'>('all');
  const [venture,  setVenture]  = useState('All');

  const filtered = FILES.filter(f =>
    allowed.includes(f.venture) &&
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
          { label: 'Final',   val: FILES.filter(f => f.status === 'final').length,      color: '#dbdbdb' },
          { label: 'Draft',   val: FILES.filter(f => f.status === 'draft').length,      color: '#b5b5b5' },
          { label: 'Review',  val: FILES.filter(f => f.status === 'review').length,     color: '#eeeeee' },
        ].map(c => (
          <div key={c.label} className="tasks-count-cell">
            <div className="tasks-count-num" style={{ color: sc(c.color) }}>{c.val}</div>
            <div className="tasks-count-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {VENTURES.map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: sc(VENTURE_COLORS[v]) } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-pill${category === c ? ' active' : ''}`}
            style={category === c && c !== 'all' ? { borderColor: CAT_COLORS[c as FileCategory], color: sc(CAT_COLORS[c as FileCategory]) } : {}}
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
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: sc(VENTURE_COLORS[f.venture]) }}>{f.venture}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: sc(CAT_COLORS[f.category]) }}>{f.category}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '0.1rem 0.4rem', border: `1px solid ${scBorder(FORMAT_COLORS[f.format] || 'var(--card-border)')}`, color: FORMAT_COLORS[f.format] || 'var(--muted)' }}>{f.format}</span></td>
                <td><span className="category-label">{f.version}</span></td>
                <td><span className="category-label">{f.date}</span></td>
                <td><span className="status-badge" style={{ color: sc(ss.color), borderColor: `${scBorder(ss.color)}` }}>{ss.label}</span></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', wordBreak: 'break-all' }}>{f.location}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
